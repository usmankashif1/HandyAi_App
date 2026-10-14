import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    clearAccessToken,
    persistAccessToken,
    readAccessToken,
} from '../../screens/auth/accessTokenStorage';

export type AccountIdentity = {
    fullName: string;
    email: string;
};

type AuthState = {
    token: string | null;
    account: AccountIdentity | null;
    shouldStartSetup: boolean;
    isLoading: boolean;
    initializationError: string | null;
};

const initialState: AuthState = {
    token: null,
    account: null,
    shouldStartSetup: false,
    isLoading: true,
    initializationError: null,
};

export const restoreAccessToken = createAsyncThunk<
    string | null,
    void,
    { rejectValue: string }
>('auth/restoreAccessToken', async (_, { rejectWithValue }) => {
    try {
        return await readAccessToken();
    } catch (error) {
        console.error('Unable to restore the saved session:', error);
        return rejectWithValue('We could not read your saved sign-in. Please try again.');
    }
});

export const signInWithAccessToken = createAsyncThunk(
    'auth/signInWithAccessToken',
    async (
        { token }: { token: string; account: AccountIdentity; startSetup?: boolean },
    ) => persistAccessToken(token),
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
            .addCase(restoreAccessToken.pending, (state) => {
                state.isLoading = true;
                state.initializationError = null;
            })
            .addCase(restoreAccessToken.fulfilled, (state, action) => {
                state.token = action.payload;
                state.account = null;
                state.shouldStartSetup = false;
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
                state.shouldStartSetup = action.meta.arg.startSetup ?? false;
                state.initializationError = null;
            })
            .addCase(signOut.fulfilled, (state) => {
                state.token = null;
                state.account = null;
                state.shouldStartSetup = false;
            });
    },
});

export default authSlice.reducer;
