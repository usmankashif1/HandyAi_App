import { API_URL } from '../../core/utils/config';
import type {
    AuthActionResponse,
    ForgotPasswordRequest,
    ResendOtpRequest,
    ResetPasswordOtpResponse,
    ResetPasswordRequest,
    SignInRequest,
    SignInResponse,
    SignInUser,
    SignUpRequest,
    SignUpResponse,
    VerifyOtpRequest,
    VerifyOtpResponse,
} from './auth.types';

const getResponseMessage = (body: unknown): string | undefined => {
    if (typeof body !== 'object' || body === null) {
        return undefined;
    }

    const response = body as Record<string, unknown>;
    const message = response.message ?? response.error;

    if (typeof message === 'string' && message.trim()) {
        return message.trim();
    }

    if (Array.isArray(message)) {
        const messages = message.filter(
            (item): item is string => typeof item === 'string' && item.trim().length > 0,
        );
        if (messages.length > 0) {
            return messages.join('\n');
        }
    }

    return undefined;
};

const isSignInUser = (value: unknown): value is SignInUser => {
    if (typeof value !== 'object' || value === null) {
        return false;
    }

    const user = value as Record<string, unknown>;
    return typeof user.id === 'string'
        && typeof user.email === 'string'
        && typeof user.role === 'string'
        && typeof user.isEmailVerified === 'boolean'
        && typeof user.fullName === 'string'
        && (typeof user.address === 'string' || user.address === null)
        && (typeof user.postcode === 'string' || user.postcode === null)
        && (typeof user.photoUrl === 'string' || user.photoUrl === null)
        && (typeof user.householdNotes === 'string' || user.householdNotes === null)
        && typeof user.createdAt === 'string'
        && typeof user.updatedAt === 'string';
};

const postAuthRequest = async (
    endpoint: string,
    request: object,
    fallbackMessage: string,
    requireMessage = false,
): Promise<AuthActionResponse & {
    token?: string;
    accessToken?: string;
    data?: Record<string, unknown>;
}> => {
    const baseUrl = API_URL?.trim().replace(/\/+$/, '');
    if (!baseUrl) {
        throw new Error('The API URL is not configured. Set EXPO_PUBLIC_API_URL and try again.');
    }

    const response = await fetch(`${baseUrl}/api/v1/auth/${endpoint}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    const responseText = await response.text();
    let body: unknown;
    if (responseText) {
        try {
            body = JSON.parse(responseText);
        } catch {
            if (response.ok) {
                throw new Error('The server returned an invalid response. Please try again.');
            }
            body = undefined;
        }
    }

    const message = getResponseMessage(body);
    if (!response.ok) {
        throw new Error(
            message ?? `The request failed with status ${response.status}. Please try again.`,
        );
    }
    if (requireMessage && !message) {
        throw new Error('The server did not confirm that a verification code was sent. Please try again.');
    }

    const responseBody = typeof body === 'object' && body !== null
        ? body as Record<string, unknown>
        : undefined;
    const token = responseBody && typeof responseBody.token === 'string'
        && responseBody.token.trim()
        ? responseBody.token.trim()
        : undefined;
    const accessToken = responseBody && typeof responseBody.accessToken === 'string'
        && responseBody.accessToken.trim()
        ? responseBody.accessToken.trim()
        : undefined;

    return { message: message ?? fallbackMessage, token, accessToken, data: responseBody };
};

export const signUp = async (request: SignUpRequest): Promise<SignUpResponse> =>
    postAuthRequest(
        'sign-up',
        request,
        'The server did not confirm that a verification code was sent.',
        true,
    );

export function verifyOtp(
    request: VerifyOtpRequest & { purpose: 'SIGNUP' },
): Promise<VerifyOtpResponse>;
export function verifyOtp(
    request: VerifyOtpRequest & { purpose: 'RESET_PASSWORD' },
): Promise<ResetPasswordOtpResponse>;
export async function verifyOtp(
    request: VerifyOtpRequest,
): Promise<VerifyOtpResponse | ResetPasswordOtpResponse> {
    const response = await postAuthRequest(
        'verify-otp',
        request,
        'Your verification code has been confirmed.',
    );
    if (request.purpose === 'SIGNUP') {
        if (!response.token) {
            throw new Error('Email verification succeeded, but the server did not return an access token.');
        }
        return { message: response.message, token: response.token };
    }

    const resetToken = response.data?.resetToken;
    if (typeof resetToken !== 'string' || !resetToken.trim()) {
        throw new Error('The server did not return a password reset token. Please request a new code.');
    }

    return { message: response.message, resetToken: resetToken.trim() };
}

export const resendOtp = (request: ResendOtpRequest): Promise<AuthActionResponse> =>
    postAuthRequest('resend-otp', request, 'A new verification code has been sent.');

export const forgotPassword = (request: ForgotPasswordRequest): Promise<AuthActionResponse> =>
    postAuthRequest('forgot-password', request, 'A verification code has been sent to your email.');

export const resetPassword = (request: ResetPasswordRequest): Promise<AuthActionResponse> =>
    postAuthRequest('reset-password', request, 'Your password has been changed successfully.');

export const signIn = async (request: SignInRequest): Promise<SignInResponse> => {
    const response = await postAuthRequest('sign-in', request, 'Sign in successful.');
    const user = response.data?.user;
    if (!response.accessToken || !isSignInUser(user)) {
        throw new Error('The server returned incomplete sign-in information. Please try again.');
    }

    return {
        accessToken: response.accessToken,
        user,
    };
};
