import { API_URL } from '../../core/utils/config';
import type { UpdateProfileRequest, UserProfile } from './profile.types';

const isRecord = (value: unknown): value is Record<string, unknown> => (
    typeof value === 'object' && value !== null
);

const getErrorMessage = (body: unknown): string | undefined => {
    if (!isRecord(body)) {
        return undefined;
    }

    const message = body.message ?? body.error;
    if (typeof message === 'string' && message.trim()) {
        return message.trim();
    }
    if (Array.isArray(message)) {
        const messages = message.filter(
            (item): item is string => typeof item === 'string' && item.trim().length > 0,
        );
        return messages.length > 0 ? messages.join('\n') : undefined;
    }

    return undefined;
};

const isNullableString = (value: unknown): value is string | null => (
    typeof value === 'string' || value === null
);

const isUserProfile = (value: unknown): value is UserProfile => (
    isRecord(value)
    && typeof value.id === 'string'
    && typeof value.email === 'string'
    && typeof value.role === 'string'
    && typeof value.isEmailVerified === 'boolean'
    && typeof value.fullName === 'string'
    && isNullableString(value.address)
    && isNullableString(value.postcode)
    && isNullableString(value.photoUrl)
    && isNullableString(value.householdNotes)
    && typeof value.createdAt === 'string'
    && typeof value.updatedAt === 'string'
);

const getApiBaseUrl = (): string => {
    const baseUrl = API_URL?.trim().replace(/\/+$/, '');
    if (!baseUrl) {
        throw new Error('The API URL is not configured. Set EXPO_PUBLIC_API_URL and try again.');
    }
    return baseUrl;
};

const getAuthorizationHeader = (token: string): string => ['Bearer', token].join(' ');

const parseResponseBody = async (response: Response): Promise<unknown> => {
    const responseText = await response.text();
    if (!responseText) {
        return undefined;
    }

    try {
        return JSON.parse(responseText);
    } catch {
        if (response.ok) {
            throw new Error('The server returned an invalid profile response. Please try again.');
        }
        return undefined;
    }
};

export const fetchUserProfile = async (
    accessToken: string,
    signal?: AbortSignal,
): Promise<UserProfile> => {
    const token = accessToken.trim();
    if (!token) {
        throw new Error('You must be signed in to load your profile.');
    }

    const response = await fetch(`${getApiBaseUrl()}/api/v1/user/profile`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: getAuthorizationHeader(token),
        },
        signal,
    });
    const body = await parseResponseBody(response);

    if (!response.ok) {
        throw new Error(
            getErrorMessage(body) ?? `Could not load your profile (${response.status}). Please try again.`,
        );
    }

    if (!isUserProfile(body)) {
        throw new Error('The server returned incomplete profile data. Please try again.');
    }

    return body;
};

export const updateUserProfile = async (
    accessToken: string,
    updates: UpdateProfileRequest,
    signal?: AbortSignal,
): Promise<UserProfile> => {
    const token = accessToken.trim();
    if (!token) {
        throw new Error('You must be signed in to update your profile.');
    }

    const response = await fetch(`${getApiBaseUrl()}/api/v1/user/profile`, {
        method: 'PATCH',
        headers: {
            Accept: 'application/json',
            Authorization: getAuthorizationHeader(token),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
        signal,
    });
    const body = await parseResponseBody(response);

    if (!response.ok) {
        throw new Error(
            getErrorMessage(body) ?? `Could not update your profile (${response.status}). Please try again.`,
        );
    }

    if (!isUserProfile(body)) {
        throw new Error('The server returned incomplete profile data after the update. Please try again.');
    }

    return body;
};
