import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { setToken } from '../../store/slices/authSlice';
import { store } from '../../store/store';
import {
    clearLocalSession,
    createLocalSession,
    createVerifiedSession,
    readLocalSession,
    type LocalAccount,
    type LocalSession,
} from './auth.storage';

type AuthSessionContextValue = {
    token: string | null;
    account: Pick<LocalAccount, 'fullName' | 'email'> | null;
    shouldStartSetup: boolean;
    isLoading: boolean;
    initializationError: string | null;
    signIn: (account: LocalAccount, startSetup?: boolean) => Promise<void>;
    signInWithToken: (
        token: string,
        account: Pick<LocalAccount, 'fullName' | 'email'>,
        startSetup?: boolean,
    ) => Promise<void>;
    signInVerified: (token: string, account: Pick<LocalAccount, 'fullName' | 'email'>) => Promise<void>;
    signOut: () => Promise<void>;
    retrySessionRestore: () => void;
};

const AuthSessionContext = createContext<AuthSessionContextValue | null>(null);

export const AuthSessionProvider = ({ children }: PropsWithChildren) => {
    const [session, setSession] = useState<LocalSession | null>(null);
    const [shouldStartSetup, setShouldStartSetup] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [initializationError, setInitializationError] = useState<string | null>(null);
    const [restoreAttempt, setRestoreAttempt] = useState(0);

    useEffect(() => {
        let active = true;

        const restoreSession = async () => {
            setIsLoading(true);
            setInitializationError(null);
            try {
                const session = await readLocalSession();
                if (active) {
                    setSession(session);
                    store.dispatch(setToken(session?.token ?? null));
                }
            } catch (error) {
                console.error('Unable to restore the saved session:', error);
                if (active) {
                    setInitializationError('We could not read your saved sign-in. Please try again.');
                }
            } finally {
                if (active) {
                    setIsLoading(false);
                }
            }
        };

        void restoreSession();
        return () => {
            active = false;
        };
    }, [restoreAttempt]);

    const signIn = useCallback(async (signedInAccount: LocalAccount, startSetup = false) => {
        const signedInSession = await createLocalSession(signedInAccount);
        setSession(signedInSession);
        store.dispatch(setToken(signedInSession.token));
        setShouldStartSetup(startSetup);
    }, []);

    const signInWithToken = useCallback(async (
        token: string,
        account: Pick<LocalAccount, 'fullName' | 'email'>,
        startSetup = false,
    ) => {
        const verifiedSession = await createVerifiedSession(token, account);
        setSession(verifiedSession);
        store.dispatch(setToken(verifiedSession.token));
        setShouldStartSetup(startSetup);
    }, []);

    const signInVerified = useCallback(async (
        token: string,
        account: Pick<LocalAccount, 'fullName' | 'email'>,
    ) => signInWithToken(token, account, true), [signInWithToken]);

    const signOut = useCallback(async () => {
        await clearLocalSession();
        setSession(null);
        store.dispatch(setToken(null));
        setShouldStartSetup(false);
    }, []);

    const retrySessionRestore = useCallback(() => {
        setRestoreAttempt((attempt) => attempt + 1);
    }, []);

    const value = useMemo(
        () => ({
            token: session?.token ?? null,
            shouldStartSetup,
            account: session
                ? { fullName: session.account.fullName, email: session.account.email }
                : null,
            isLoading,
            initializationError,
            signIn,
            signInWithToken,
            signInVerified,
            signOut,
            retrySessionRestore,
        }),
        [session, shouldStartSetup, isLoading, initializationError, signIn, signInWithToken, signInVerified, signOut, retrySessionRestore],
    );

    return <AuthSessionContext.Provider value={value}>{children}</AuthSessionContext.Provider>;
};

export const useAuthSession = (): AuthSessionContextValue => {
    const context = useContext(AuthSessionContext);
    if (!context) {
        throw new Error('useAuthSession must be used inside AuthSessionProvider.');
    }

    return context;
};
