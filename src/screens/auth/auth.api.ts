import { API_URL } from '../../core/utils/config';
import type { SignUpRequest, SignUpResponse } from './auth.types';

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

export const signUp = async (request: SignUpRequest): Promise<SignUpResponse> => {
    const baseUrl = API_URL;
    if (!baseUrl) {
        throw new Error('The API URL is not configured. Set EXPO_PUBLIC_API_URL and try again.');
    }

    const response = await fetch(`${baseUrl}/api/v1/auth/sign-up`, {
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
        throw new Error(message ?? `Sign up failed with status ${response.status}. Please try again.`);
    }
    if (!message) {
        throw new Error('The server did not confirm that a verification code was sent. Please try again.');
    }

    return { message };
};
