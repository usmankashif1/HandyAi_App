import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    clearAccessToken,
    persistAccessToken,
    readAccessToken,
    readStoredAccountRole,
    type StoredAccountRole,
} from '../../Sections/Customers/screens/auth/accessTokenStorage';

export type AccountIdentity = {
    fullName: string;
    email: string;
};

type AuthState = {
    token: string | null;
    account: AccountIdentity | null;
    role: StoredAccountRole;
    shouldStartSetup: boolean;
    shouldStartProviderSetup: boolean;
    isLoading: boolean;
    initializationError: string | null;
};

const initialState: AuthState = {
    token: null,
    account: null,
    role: 'CUSTOMER',
    shouldStartSetup: false,
    shouldStartProviderSetup: false,
    isLoading: true,
    initializationError: null,
};

export const restoreAccessToken = createAsyncThunk<
    { token: string | null; role: StoredAccountRole },
    void,
    { rejectValue: string }
>('auth/restoreAccessToken', async (_, { rejectWithValue }) => {
    try {
        const [token, role] = await Promise.all([readAccessToken(), readStoredAccountRole()]);
        return { token, role };
    } catch (error) {
        console.error('Unable to restore the saved session:', error);
        return rejectWithValue('We could not read your saved sign-in. Please try again.');
    }
});

export const signInWithAccessToken = createAsyncThunk(
    'auth/signInWithAccessToken',
    async (
        {
            token,
            role,
        }: {
            token: string;
            account: AccountIdentity;
            role: StoredAccountRole;
            startSetup?: boolean;
            startProviderSetup?: boolean;
        },
    ) => persistAccessToken(token, role),
);

export const signOut = createAsyncThunk('auth/signOut', async () => {
    await clearAccessToken();
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(signOut.pending, (state) => {
                state.token = null;
                state.role = 'CUSTOMER';
                state.account = null;
                state.shouldStartSetup = false;
                state.shouldStartProviderSetup = false;
                state.isLoading = false;
                state.initializationError = null;
            })
            .addCase(restoreAccessToken.pending, (state) => {
                state.isLoading = true;
                state.initializationError = null;
            })
            .addCase(restoreAccessToken.fulfilled, (state, action) => {
                state.token = action.payload.token;
                state.role = action.payload.role;
                state.account = null;
                state.shouldStartSetup = false;
                state.shouldStartProviderSetup = false;
                state.isLoading = false;
            })
            .addCase(restoreAccessToken.rejected, (state, action) => {
                state.initializationError = action.payload
                    ?? 'We could not read your saved sign-in. Please try again.';
                state.isLoading = false;
            })
            .addCase(signInWithAccessToken.fulfilled, (state, action) => {
                state.token = action.payload;
                state.account = {
                    fullName: action.meta.arg.account.fullName.trim(),
                    email: action.meta.arg.account.email.trim().toLowerCase(),
                };
                state.role = action.meta.arg.role;
                state.shouldStartSetup = action.meta.arg.startSetup ?? false;
                state.shouldStartProviderSetup = action.meta.arg.startProviderSetup ?? false;
                state.initializationError = null;
            })
            .addCase(signOut.fulfilled, (state) => {
                state.token = null;
                state.role = 'CUSTOMER';
                state.account = null;
                state.shouldStartSetup = false;
                state.shouldStartProviderSetup = false;
            });
    },
});

export default authSlice.reducer;
