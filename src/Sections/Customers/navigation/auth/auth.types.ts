import type { AccountRole } from '../../screens/auth/auth.types';

export type AuthStackParamList = {
    AppTypeSelection: undefined;
    Onboarding: undefined;
    ProviderRegistration: undefined;
    SignUp: { role?: AccountRole } | undefined;
    ForgotPassword: {
        role?: AccountRole;
        continueProviderOnboarding?: boolean;
    } | undefined;
    OtpVerify:
        | { email: string; purpose: 'SIGNUP'; fullName: string; role?: AccountRole }
        | {
            email: string;
            purpose: 'RESET_PASSWORD';
            role?: AccountRole;
            continueProviderOnboarding?: boolean;
        };
    ChangePassword: {
        resetToken: string;
        role?: AccountRole;
        continueProviderOnboarding?: boolean;
    };
    Login: { role?: AccountRole; continueProviderOnboarding?: boolean } | undefined;
};
