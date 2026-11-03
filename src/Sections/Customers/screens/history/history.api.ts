import { notifySessionExpired } from '../../../../core/api/sessionExpiry';
import { API_URL } from '../../../../core/utils/config';
import type { Booking } from './history.types';

type JsonRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is JsonRecord => (
    typeof value === 'object' && value !== null && !Array.isArray(value)
);

const isNonEmptyString = (value: unknown): value is string => (
    typeof value === 'string' && value.trim().length > 0
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
        return messages.length ? messages.join('\n') : undefined;
    }

    return undefined;
};

const getApiBaseUrl = (): string => {
    const baseUrl = API_URL?.trim().replace(/\/+$/, '');
    if (!baseUrl) {
        throw new Error('The API URL is not configured. Set EXPO_PUBLIC_API_URL and try again.');
    }
    return baseUrl;
};

const isBooking = (value: unknown): value is Booking => {
    if (!isRecord(value) || !isRecord(value.subService)) {
        return false;
    }

    const subService = value.subService;
    return (
        isNonEmptyString(value.id)
        && isNonEmptyString(value.userId)
        && isNonEmptyString(value.providerId)
        && isNonEmptyString(value.subServiceId)
        && isNonEmptyString(subService.id)
        && isNonEmptyString(subService.categoryId)
        && isNonEmptyString(subService.name)
        && isNonEmptyString(subService.slug)
        && typeof subService.basePriceCents === 'number'
        && Number.isSafeInteger(subService.basePriceCents)
        && subService.basePriceCents >= 0
        && typeof subService.baseDurationMinutes === 'number'
        && Number.isSafeInteger(subService.baseDurationMinutes)
        && subService.baseDurationMinutes > 0
        && typeof subService.sortOrder === 'number'
        && Number.isSafeInteger(subService.sortOrder)
        && subService.sortOrder >= 0
        && typeof value.scheduledAt === 'string'
        && !Number.isNaN(Date.parse(value.scheduledAt))
        && typeof value.durationMinutes === 'number'
        && Number.isSafeInteger(value.durationMinutes)
        && value.durationMinutes > 0
        && typeof value.priceCents === 'number'
        && Number.isSafeInteger(value.priceCents)
        && value.priceCents >= 0
        && isNonEmptyString(value.status)
        && (typeof value.notes === 'string' || value.notes === null)
        && isNonEmptyString(value.createdAt)
        && isNonEmptyString(value.updatedAt)
    );
};

const parseResponseBody = async (response: Response): Promise<unknown> => {
    const responseText = await response.text();
    if (!responseText) {
        return undefined;
    }

    try {
        return JSON.parse(responseText);
    } catch {
        if (response.ok) {
            throw new Error('The server returned an invalid bookings response. Please try again.');
        }
        return undefined;
    }
};

export const fetchCustomerBookings = async (
    accessToken: string,
    signal?: AbortSignal,
): Promise<Booking[]> => {
    const token = accessToken.trim();
    if (!token) {
        throw new Error('You must be signed in to load your booking history.');
    }

    const response = await fetch(`${getApiBaseUrl()}/api/v1/bookings`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
        },
        signal,
    });
    if (response.status === 401) {
        notifySessionExpired(token);
    }

    const body = await parseResponseBody(response);
    if (!response.ok) {
        throw new Error(
            getErrorMessage(body)
                ?? `Could not load booking history (${response.status}). Please try again.`,
        );
    }
    if (!Array.isArray(body) || !body.every(isBooking)) {
        throw new Error('The server returned invalid booking history data. Please try again.');
    }

    return body;
};
