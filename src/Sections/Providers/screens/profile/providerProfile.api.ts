import { API_URL } from '../../../../core/utils/config';

export type ProviderProfile = {
    id: string;
    bio: string;
    postcodeCoverage: string[];
    status: string;
    rejectionReason: string | null;
    categories: { id: string; name: string }[];
    availability: {
        id: string;
        dayOfWeek: number;
        startTime: string;
        endTime: string;
    }[];
    documents: {
        id: string;
        type: string;
        fileUrl: string;
        status: string;
        createdAt: string;
    }[];
};

type JsonRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is JsonRecord => (
    typeof value === 'object' && value !== null && !Array.isArray(value)
);

const getApiBaseUrl = (): string => {
    const baseUrl = API_URL?.trim().replace(/\/+$/, '');
    if (!baseUrl) {
        throw new Error('The API URL is not configured. Set EXPO_PUBLIC_API_URL and try again.');
    }
    return baseUrl;
};

const getResponseMessage = (body: unknown): string | undefined => {
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

const readResponse = async (response: Response): Promise<unknown> => {
    const responseText = await response.text();
    if (!responseText) {
        return undefined;
    }

    try {
        return JSON.parse(responseText);
    } catch {
        if (response.ok) {
            throw new Error('The provider profile response is invalid. Please try again.');
        }
        return undefined;
    }
};

const profileFromResponse = (body: unknown): ProviderProfile => {
    let candidate = body;
    if (isRecord(candidate) && isRecord(candidate.data)) {
        candidate = candidate.data;
    }
    if (isRecord(candidate) && isRecord(candidate.provider)) {
        candidate = candidate.provider;
    }
    if (
        !isRecord(candidate)
        || typeof candidate.id !== 'string'
        || typeof candidate.bio !== 'string'
        || typeof candidate.status !== 'string'
        || !Array.isArray(candidate.postcodeCoverage)
        || !candidate.postcodeCoverage.every((postcode) => typeof postcode === 'string')
        || !Array.isArray(candidate.categories)
        || !Array.isArray(candidate.availability)
        || !Array.isArray(candidate.documents)
    ) {
        throw new Error('The provider profile response is incomplete. Please try again.');
    }

    const categories = candidate.categories.flatMap((item): ProviderProfile['categories'] => (
        isRecord(item) && typeof item.id === 'string' && typeof item.name === 'string'
            ? [{ id: item.id, name: item.name }]
            : []
    ));
    const availability = candidate.availability.flatMap((item): ProviderProfile['availability'] => (
        isRecord(item)
        && typeof item.id === 'string'
        && typeof item.dayOfWeek === 'number'
        && typeof item.startTime === 'string'
        && typeof item.endTime === 'string'
            ? [{
                id: item.id,
                dayOfWeek: item.dayOfWeek,
                startTime: item.startTime,
                endTime: item.endTime,
            }]
            : []
    ));
    const documents = candidate.documents.flatMap((item): ProviderProfile['documents'] => (
        isRecord(item)
        && typeof item.id === 'string'
        && typeof item.type === 'string'
        && typeof item.fileUrl === 'string'
        && typeof item.status === 'string'
        && typeof item.createdAt === 'string'
            ? [{
                id: item.id,
                type: item.type,
                fileUrl: item.fileUrl,
                status: item.status,
                createdAt: item.createdAt,
            }]
            : []
    ));

    if (
        categories.length !== candidate.categories.length
        || availability.length !== candidate.availability.length
        || documents.length !== candidate.documents.length
    ) {
        throw new Error('The provider profile contains invalid data. Please try again.');
    }

    return {
        id: candidate.id,
        bio: candidate.bio,
        postcodeCoverage: candidate.postcodeCoverage,
        status: candidate.status,
        rejectionReason: typeof candidate.rejectionReason === 'string'
            ? candidate.rejectionReason
            : null,
        categories,
        availability,
        documents,
    };
};

export const fetchProviderProfile = async (
    accessToken: string,
    signal?: AbortSignal,
): Promise<ProviderProfile> => {
    const token = accessToken.trim();
    if (!token) {
        throw new Error('You must be signed in as a provider to view this profile.');
    }

    const response = await fetch(`${getApiBaseUrl()}/api/v1/provider/profile`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
        },
        signal,
    });
    const body = await readResponse(response);

    if (!response.ok) {
        throw new Error(
            getResponseMessage(body)
                ?? `Could not load provider profile (${response.status}). Please try again.`,
        );
    }

    return profileFromResponse(body);
};
