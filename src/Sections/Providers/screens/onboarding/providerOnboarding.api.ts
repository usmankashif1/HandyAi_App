import type { DocumentPickerAsset } from 'expo-document-picker';
import { API_URL } from '../../../../core/utils/config';

export type ProviderCategory = {
    id: string;
    name: string;
};

export type ProviderAvailability = {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
};

export type ProviderOnboardingRequest = {
    bio: string;
    postcodeCoverage: string[];
    categoryIds: string[];
    availability: ProviderAvailability[];
};

export type ProviderDocumentKey =
    | 'GOVERNMENT_ID'
    | 'RIGHT_TO_WORK'
    | 'LIABILITY_INSURANCE'
    | 'REFERENCE'
    | 'PROFILE_PHOTO';

export type ProviderDocuments = Record<ProviderDocumentKey, DocumentPickerAsset>;

type ReactNativeFilePart = {
    uri: string;
    name: string;
    type: string;
};

type ReactNativeMultipartFormData = FormData & {
    append(name: string, value: ReactNativeFilePart): void;
};

const getApiBaseUrl = (): string => {
    const baseUrl = API_URL?.trim().replace(/\/+$/, '');
    if (!baseUrl) {
        throw new Error('The API URL is not configured. Set EXPO_PUBLIC_API_URL and try again.');
    }

    return baseUrl;
};

const isRecord = (value: unknown): value is Record<string, unknown> => (
    typeof value === 'object' && value !== null
);

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
            throw new Error('The server returned an invalid response. Please try again.');
        }
        return undefined;
    }
};

const getAuthorizationHeader = (accessToken: string): string => {
    const token = accessToken.trim();
    if (!token) {
        throw new Error('You must be signed in as a provider to submit onboarding information.');
    }
    return `Bearer ${token}`;
};

export const toProviderDocuments = (
    documents: Partial<Record<ProviderDocumentKey, DocumentPickerAsset>>,
): ProviderDocuments | undefined => {
    const governmentId = documents.GOVERNMENT_ID;
    const rightToWork = documents.RIGHT_TO_WORK;
    const liabilityInsurance = documents.LIABILITY_INSURANCE;
    const reference = documents.REFERENCE;
    const profilePhoto = documents.PROFILE_PHOTO;

    if (!governmentId || !rightToWork || !liabilityInsurance || !reference || !profilePhoto) {
        return undefined;
    }

    return {
        GOVERNMENT_ID: governmentId,
        RIGHT_TO_WORK: rightToWork,
        LIABILITY_INSURANCE: liabilityInsurance,
        REFERENCE: reference,
        PROFILE_PHOTO: profilePhoto,
    };
};

const categoryListFromResponse = (body: unknown): unknown[] | undefined => {
    if (Array.isArray(body)) {
        return body;
    }
    if (!isRecord(body)) {
        return undefined;
    }
    if (Array.isArray(body.categories)) {
        return body.categories;
    }
    if (Array.isArray(body.data)) {
        return body.data;
    }
    if (isRecord(body.data) && Array.isArray(body.data.categories)) {
        return body.data.categories;
    }
    return undefined;
};

export const fetchProviderCategories = async (
    accessToken: string,
    signal?: AbortSignal,
): Promise<ProviderCategory[]> => {
    const response = await fetch(`${getApiBaseUrl()}/api/v1/service-categories`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: getAuthorizationHeader(accessToken),
        },
        signal,
    });
    const body = await readResponse(response);

    if (!response.ok) {
        throw new Error(
            getResponseMessage(body)
                ?? `Could not load service categories (${response.status}). Please try again.`,
        );
    }

    const items = categoryListFromResponse(body);
    if (!items) {
        throw new Error('The service categories response is invalid. Please try again.');
    }

    return items.flatMap((item): ProviderCategory[] => {
        if (!isRecord(item)) {
            return [];
        }
        const id = typeof item.id === 'string' ? item.id : item.categoryId;
        const name = item.name ?? item.categoryName ?? item.label;
        return typeof id === 'string' && typeof name === 'string'
            ? [{ id, name }]
            : [];
    });
};

export const submitProviderOnboarding = async (
    accessToken: string,
    onboarding: ProviderOnboardingRequest,
): Promise<void> => {
    const response = await fetch(`${getApiBaseUrl()}/api/v1/provider/onboarding`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            Authorization: getAuthorizationHeader(accessToken),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(onboarding),
    });
    const body = await readResponse(response);

    if (!response.ok) {
        throw new Error(
            getResponseMessage(body)
                ?? `Could not submit provider onboarding (${response.status}). Please try again.`,
        );
    }
};

const getMimeType = (asset: DocumentPickerAsset): string => {
    if (asset.mimeType) {
        return asset.mimeType;
    }

    const extension = asset.name.split('.').pop()?.toLowerCase();
    if (extension === 'pdf') {
        return 'application/pdf';
    }
    if (extension === 'png') {
        return 'image/png';
    }
    if (extension === 'jpg' || extension === 'jpeg') {
        return 'image/jpeg';
    }
    if (extension === 'heic') {
        return 'image/heic';
    }
    return 'application/octet-stream';
};

const uploadFormData = (
    url: string,
    accessToken: string,
    formData: FormData,
): Promise<void> => new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('POST', url);
    request.setRequestHeader('Accept', 'application/json');
    request.setRequestHeader('Authorization', getAuthorizationHeader(accessToken));
    request.onload = () => {
        const isSuccessful = request.status >= 200 && request.status < 300;
        let body: unknown;

        if (request.responseText) {
            try {
                body = JSON.parse(request.responseText);
            } catch {
                if (isSuccessful) {
                    reject(new Error('The server returned an invalid response. Please try again.'));
                    return;
                }
            }
        }

        if (isSuccessful) {
            resolve();
            return;
        }

        reject(new Error(
            getResponseMessage(body)
                ?? `Could not upload provider documents (${request.status}). Please try again.`,
        ));
    };
    request.onerror = () => reject(new Error('Network error while uploading provider documents.'));
    request.onabort = () => reject(new Error('Provider document upload was cancelled.'));

    try {
        request.send(formData);
    } catch (error) {
        reject(error instanceof Error ? error : new Error('Could not start provider document upload.'));
    }
});

export const uploadProviderDocuments = async (
    accessToken: string,
    documents: ProviderDocuments,
): Promise<void> => {
    const formData = new FormData();
    const reactNativeFormData = formData as ReactNativeMultipartFormData;

    (Object.keys(documents) as ProviderDocumentKey[]).forEach((key) => {
        const asset = documents[key];
        if (asset.file) {
            formData.append(key, asset.file, asset.name);
        } else {
            reactNativeFormData.append(key, {
                uri: asset.uri,
                name: asset.name,
                type: getMimeType(asset),
            });
        }
    });

    await uploadFormData(
        `${getApiBaseUrl()}/api/v1/provider/documents`,
        accessToken,
        formData,
    );
};
