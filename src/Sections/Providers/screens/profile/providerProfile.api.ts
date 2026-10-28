import { API_URL } from '../../../../core/utils/config';
import { notifySessionExpired } from '../../../../core/api/sessionExpiry';

export type ProviderProfile = {
    id: string;
    userId: string;
    bio: string;
    postcodeCoverage: string[];
    status: string;
    rejectionReason: string | null;
    stripeAccountId: string | null;
    categories: { id: string; name: string; slug: string; sortOrder: number }[];
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
    createdAt: string;
    updatedAt: string;
    user: {
        fullName: string;
        email: string;
        photoUrl: string | null;
        address: string | null;
        postcode: string | null;
    };
};

export type ProviderProfileAvailabilityUpdate = {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
};

export type ProviderProfileUpdate = {
    bio?: string;
    postcodeCoverage?: string[];
    categoryIds?: string[];
    availability?: ProviderProfileAvailabilityUpdate[];
    user?: {
        fullName?: string;
        address?: string;
        postcode?: string;
    };
};

type JsonRecord = Record<string, unknown>;
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

const isRecord = (value: unknown): value is JsonRecord => (
    typeof value === 'object' && value !== null && !Array.isArray(value)
);

const isNullableString = (value: unknown): value is string | null => (
    typeof value === 'string' || value === null
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
        || typeof candidate.userId !== 'string'
        || typeof candidate.bio !== 'string'
        || typeof candidate.status !== 'string'
        || !(typeof candidate.rejectionReason === 'string' || candidate.rejectionReason === null)
        || !(typeof candidate.stripeAccountId === 'string' || candidate.stripeAccountId === null)
        || typeof candidate.createdAt !== 'string'
        || typeof candidate.updatedAt !== 'string'
        || !isRecord(candidate.user)
        || typeof candidate.user.fullName !== 'string'
        || typeof candidate.user.email !== 'string'
        || !isNullableString(candidate.user.photoUrl)
        || !isNullableString(candidate.user.address)
        || !isNullableString(candidate.user.postcode)
        || !Array.isArray(candidate.postcodeCoverage)
        || !candidate.postcodeCoverage.every((postcode) => typeof postcode === 'string')
        || !Array.isArray(candidate.categories)
        || !Array.isArray(candidate.availability)
        || !Array.isArray(candidate.documents)
    ) {
        throw new Error('The provider profile response is incomplete. Please try again.');
    }

    const categories = candidate.categories.flatMap((item): ProviderProfile['categories'] => (
        isRecord(item)
        && typeof item.id === 'string'
        && typeof item.name === 'string'
        && typeof item.slug === 'string'
        && typeof item.sortOrder === 'number'
            ? [{
                id: item.id,
                name: item.name,
                slug: item.slug,
                sortOrder: item.sortOrder,
            }]
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
        userId: candidate.userId,
        bio: candidate.bio,
        postcodeCoverage: candidate.postcodeCoverage,
        status: candidate.status,
        rejectionReason: candidate.rejectionReason,
        stripeAccountId: candidate.stripeAccountId,
        categories,
        availability,
        documents,
        createdAt: candidate.createdAt,
        updatedAt: candidate.updatedAt,
        user: {
            fullName: candidate.user.fullName,
            email: candidate.user.email,
            photoUrl: candidate.user.photoUrl,
            address: candidate.user.address,
            postcode: candidate.user.postcode,
        },
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
    if (response.status === 401) {
        notifySessionExpired(token);
    }
    const body = await readResponse(response);

    if (!response.ok) {
        throw new Error(
            getResponseMessage(body)
                ?? `Could not load provider profile (${response.status}). Please try again.`,
        );
    }

    return profileFromResponse(body);
};

const validateProfileUpdate = (updates: ProviderProfileUpdate): void => {
    if (Object.keys(updates).length === 0) {
        throw new Error('Make at least one profile change before saving.');
    }

    if (updates.bio !== undefined && typeof updates.bio !== 'string') {
        throw new Error('Enter a valid professional bio.');
    }
    if (
        updates.postcodeCoverage !== undefined
        && (!Array.isArray(updates.postcodeCoverage)
            || updates.postcodeCoverage.some((postcode) => typeof postcode !== 'string' || !postcode.trim()))
    ) {
        throw new Error('Enter valid service postcodes.');
    }
    if (
        updates.categoryIds !== undefined
        && (!Array.isArray(updates.categoryIds)
            || updates.categoryIds.some((id) => typeof id !== 'string' || !id.trim()))
    ) {
        throw new Error('Select valid service categories.');
    }
    if (updates.availability !== undefined) {
        const days = new Set<number>();
        for (const item of updates.availability) {
            if (
                !Number.isInteger(item.dayOfWeek)
                || item.dayOfWeek < 0
                || item.dayOfWeek > 6
                || !TIME_PATTERN.test(item.startTime)
                || !TIME_PATTERN.test(item.endTime)
                || item.startTime >= item.endTime
                || days.has(item.dayOfWeek)
            ) {
                throw new Error('Check each availability day and time before saving.');
            }
            days.add(item.dayOfWeek);
        }
    }
    if (updates.user) {
        const { fullName, address, postcode } = updates.user;
        if (
            (fullName !== undefined && !fullName.trim())
            || (address !== undefined && typeof address !== 'string')
            || (postcode !== undefined && typeof postcode !== 'string')
        ) {
            throw new Error('Check your personal information before saving.');
        }
    }
}

export const updateProviderProfile = async (
    accessToken: string,
    updates: ProviderProfileUpdate,
    signal?: AbortSignal,
): Promise<ProviderProfile> => {
    const token = accessToken.trim();
    if (!token) {
        throw new Error('You must be signed in as a provider to update this profile.');
    }
    validateProfileUpdate(updates);

    const response = await fetch(`${getApiBaseUrl()}/api/v1/provider/profile`, {
        method: 'PATCH',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
        signal,
    });
    if (response.status === 401) {
        notifySessionExpired(token);
    }
    const body = await readResponse(response);

    if (!response.ok) {
        throw new Error(
            getResponseMessage(body)
                ?? `Could not update provider profile (${response.status}). Please try again.`,
        );
    }

    return profileFromResponse(body);
};
