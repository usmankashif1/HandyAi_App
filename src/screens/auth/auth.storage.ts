import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCOUNTS_KEY = 'handyai_local_accounts_v1';
const SESSION_KEY = 'handyai_local_session_v1';

export type LocalAccount = {
    fullName: string;
    email: string;
    password: string;
};

export type LocalSession = {
    token: string;
    account: LocalAccount;
};

const isLocalAccount = (value: unknown): value is LocalAccount => (
    typeof value === 'object'
    && value !== null
    && 'fullName' in value
    && typeof value.fullName === 'string'
    && 'email' in value
    && typeof value.email === 'string'
    && 'password' in value
    && typeof value.password === 'string'
);

const readAccounts = async (): Promise<LocalAccount[]> => {
    const storedAccounts = await AsyncStorage.getItem(ACCOUNTS_KEY);
    if (!storedAccounts) {
        return [];
    }

    const accounts: unknown = JSON.parse(storedAccounts);
    if (!Array.isArray(accounts) || !accounts.every(isLocalAccount)) {
        throw new Error('Stored local accounts are invalid.');
    }

    return accounts;
};

export const createLocalAccount = async (account: LocalAccount): Promise<void> => {
    const accounts = await readAccounts();
    const normalizedEmail = account.email.trim().toLowerCase();

    if (accounts.some((existingAccount) => existingAccount.email.toLowerCase() === normalizedEmail)) {
        throw new Error('An account with this email already exists. Please log in instead.');
    }

    await AsyncStorage.setItem(
        ACCOUNTS_KEY,
        JSON.stringify([...accounts, { ...account, email: normalizedEmail }]),
    );
};

export const authenticateLocalAccount = async (
    email: string,
    password: string,
): Promise<LocalAccount | null> => {
    const normalizedEmail = email.trim().toLowerCase();
    const accounts = await readAccounts();
    return accounts.find(
        (account) => account.email.toLowerCase() === normalizedEmail && account.password === password,
    ) ?? null;
};

export const readLocalSession = async (): Promise<LocalSession | null> => {
    const storedSession = await AsyncStorage.getItem(SESSION_KEY);
    if (!storedSession) {
        return null;
    }

    const session: unknown = JSON.parse(storedSession);
    if (
        typeof session !== 'object'
        || session === null
        || !('token' in session)
        || typeof session.token !== 'string'
        || !('email' in session)
        || typeof session.email !== 'string'
        || !session.token.trim()
    ) {
        throw new Error('Stored local session is invalid.');
    }

    const normalizedEmail = session.email.toLowerCase();
    const accounts = await readAccounts();
    const account = accounts.find((item) => item.email.toLowerCase() === normalizedEmail);
    if (!account) {
        await AsyncStorage.removeItem(SESSION_KEY);
        return null;
    }

    return { token: session.token, account };
};

export const createLocalSession = async (account: LocalAccount): Promise<LocalSession> => {
    const session = {
        token: `local-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        email: account.email,
    };
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return { token: session.token, account };
};

export const clearLocalSession = async (): Promise<void> => {
    await AsyncStorage.removeItem(SESSION_KEY);
};
