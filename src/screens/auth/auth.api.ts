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

type AuthApiResponse = AuthActionResponse & {
    token?: string;
    accessToken?: string;
    data?: Record<string, unknown>;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null;

const getResponseMessage = (body: unknown): string | undefined => {
    if (!isRecord(body)) {
        return undefined;
    }

    const message = body.message ?? body.error;

    if (typeof message === 'string') {
        return message.trim() || undefined;
    }

    if (Array.isArray(message)) {
        const messages = message.filter(
            (item): item is string => typeof item === 'string' && item.trim().length > 0,
        );

        return messages.length > 0 ? messages.join('\n') : undefined;
    }

    return undefined;
};

const isSignInUser = (value: unknown): value is SignInUser => {
    if (!isRecord(value)) {
        return false;
    }

    return typeof value.id === 'string'
        && typeof value.email === 'string'
        && typeof value.role === 'string'
        && typeof value.isEmailVerified === 'boolean'
        && typeof value.fullName === 'string'
        && (typeof value.address === 'string' || value.address === null)
        && (typeof value.postcode === 'string' || value.postcode === null)
        && (typeof value.photoUrl === 'string' || value.photoUrl === null)
        && (typeof value.householdNotes === 'string' || value.householdNotes === null)
        && typeof value.createdAt === 'string'
        && typeof value.updatedAt === 'string';
};

const getAuthBaseUrl = (): string => {
    const baseUrl = API_URL?.trim().replace(/\/+$/, '');

    if (!baseUrl) {
        throw new Error('The API URL is not configured. Set EXPO_PUBLIC_API_URL and try again.');
    }

    return baseUrl;
};

const parseResponseBody = (responseText: string, responseOk: boolean): unknown => {
    if (!responseText) {
        return undefined;
    }

    try {
        return JSON.parse(responseText);
    } catch {
        if (responseOk) {
            throw new Error('The server returned an invalid response. Please try again.');
        }

        return undefined;
    }
};

const getOptionalString = (value: unknown): string | undefined => {
    if (typeof value !== 'string') {
        return undefined;
    }

    return value.trim() || undefined;
};

const postAuthRequest = async (
    endpoint: string,
    request: object,
    fallbackMessage: string,
    requireMessage = false,
): Promise<AuthApiResponse> => {
    const response = await fetch(`${getAuthBaseUrl()}/api/v1/auth/${endpoint}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    const responseText = await response.text();
    const body = parseResponseBody(responseText, response.ok);
    const message = getResponseMessage(body);

    if (!response.ok) {
        throw new Error(
            message ?? `The request failed with status ${response.status}. Please try again.`,
        );
    }

    if (requireMessage && !message) {
        throw new Error(
            'The server did not confirm that a verification code was sent. Please try again.',
        );
    }

    const responseBody = isRecord(body) ? body : undefined;

    return {
        message: message ?? fallbackMessage,
        token: getOptionalString(responseBody?.token),
        accessToken: getOptionalString(responseBody?.accessToken),
        data: responseBody,
    };
};

export const signUp = async (request: SignUpRequest): Promise<SignUpResponse> => {
    const response = await postAuthRequest(
        'sign-up',
        request,
        'The server did not confirm that a verification code was sent.',
        true,
    );

    const isEmailVerified = response.data?.isEmailVerified;

    return {
        message: response.message,
        ...(typeof isEmailVerified === 'boolean' ? { isEmailVerified } : {}),
    };
};

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
        // Temporary until the backend includes an access token in the signup verification response.
        const token = response.token
            ?? `temporary-${Date.now()}-${Math.random().toString(36).slice(2)}`;

        return { message: response.message, token };
    }

    const resetToken = getOptionalString(response.data?.resetToken);

    if (!resetToken) {
        throw new Error(
            'The server did not return a password reset token. Please request a new code.',
        );
    }

    return { message: response.message, resetToken };
}

export const resendOtp = async (
    request: ResendOtpRequest,
): Promise<AuthActionResponse> => {
    return postAuthRequest('resend-otp', request, 'A new verification code has been sent.');
};

export const forgotPassword = async (
    request: ForgotPasswordRequest,
): Promise<AuthActionResponse> => {
    return postAuthRequest(
        'forgot-password',
        request,
        'A verification code has been sent to your email.',
    );
};

export const resetPassword = async (
    request: ResetPasswordRequest,
): Promise<AuthActionResponse> => {
    return postAuthRequest(
        'reset-password',
        request,
        'Your password has been changed successfully.',
    );
};

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
