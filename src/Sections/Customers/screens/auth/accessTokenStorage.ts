import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCESS_TOKEN_KEY = 'handyai_access_token_v1';
const ACCOUNT_ROLE_KEY = 'handyai_account_role_v1';
const LEGACY_AUTH_KEYS = [
    'handyai_local_accounts_v1',
    'handyai_local_session_v1',
];

export type StoredAccountRole = 'CUSTOMER' | 'PROVIDER';

export const readStoredAccountRole = async (): Promise<StoredAccountRole> => {
    const role = await AsyncStorage.getItem(ACCOUNT_ROLE_KEY);
    return role === 'PROVIDER' ? 'PROVIDER' : 'CUSTOMER';
};

export const readAccessToken = async (): Promise<string | null> => {
    await AsyncStorage.multiRemove(LEGACY_AUTH_KEYS);

    const token = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token || !token.trim()) {
        return null;
    }

    return token.trim();
};

export const persistAccessToken = async (
    token: string,
    role: StoredAccountRole = 'CUSTOMER',
): Promise<string> => {
    const normalizedToken = token.trim();
    if (!normalizedToken) {
        throw new Error('A valid access token is required to start a session.');
    }

    await AsyncStorage.multiSet([
        [ACCESS_TOKEN_KEY, normalizedToken],
        [ACCOUNT_ROLE_KEY, role],
    ]);
    return normalizedToken;
};

export const clearAccessToken = async (): Promise<void> => {
    await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
    await AsyncStorage.multiRemove([...LEGACY_AUTH_KEYS, ACCOUNT_ROLE_KEY]);
};
