export type AccountRole = 'CUSTOMER' | 'PROVIDER';

export type SignUpRequest = {
    fullName: string;
    email: string;
    password: string;
    role: AccountRole;
};

export type SignUpResponse = {
    message: string;
    isEmailVerified?: boolean;
};

export type VerifyOtpRequest = {
    email: string;
    code: string;
    purpose: 'SIGNUP' | 'RESET_PASSWORD';
};

export type ResendOtpRequest = {
    email: string;
    purpose: 'SIGNUP' | 'RESET_PASSWORD';
};

export type AuthActionResponse = {
    message: string;
};

export type VerifyOtpResponse = AuthActionResponse & {
    token?: string;
};

export type ResetPasswordOtpResponse = AuthActionResponse & {
    resetToken: string;
};

export type ForgotPasswordRequest = {
    email: string;
};

export type ResetPasswordRequest = {
    resetToken: string;
    newPassword: string;
};

export type SignInRequest = {
    email: string;
    password: string;
};

export type SignInUser = {
    id: string;
    email: string;
    role: string;
    isEmailVerified: boolean;
    fullName: string;
    address: string | null;
    postcode: string | null;
    photoUrl: string | null;
    householdNotes: string | null;
    createdAt: string;
    updatedAt: string;
};

export type SignInResponse = {
    user: SignInUser;
    accessToken: string;
};
