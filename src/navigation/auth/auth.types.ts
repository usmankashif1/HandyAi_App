export type AuthStackParamList = {
    Onboarding: undefined;
    SignUp: undefined;
    ForgotPassword: undefined;
    OtpVerify:
        | { email: string; purpose: 'SIGNUP'; fullName: string }
        | { email: string; purpose: 'RESET_PASSWORD' };
    ChangePassword: { resetToken: string };
    Login: undefined;
};
