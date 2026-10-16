import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchUserProfile, updateUserProfile } from '../../Sections/Customers/screens/profile/profile.api';
import type { UpdateProfileRequest, UserProfile } from '../../Sections/Customers/screens/profile/profile.types';
import { signOut } from './authSlice';

type ProfileState = {
    profile: UserProfile | null;
    isLoading: boolean;
    error: string | null;
};

const initialState: ProfileState = {
    profile: null,
    isLoading: false,
    error: null,
};

export const loadUserProfile = createAsyncThunk<
    UserProfile,
    { accessToken: string },
    { rejectValue: string }
>('profile/loadUserProfile', async ({ accessToken }, { signal, rejectWithValue }) => {
    try {
        return await fetchUserProfile(accessToken, signal);
    } catch (error) {
        return rejectWithValue(
            error instanceof Error ? error.message : 'Could not load your profile. Please try again.',
        );
    }
});

export const saveUserProfile = createAsyncThunk<
    UserProfile,
    { accessToken: string; updates: UpdateProfileRequest },
    { rejectValue: string }
>('profile/saveUserProfile', async ({ accessToken, updates }, { signal, rejectWithValue }) => {
    try {
        return await updateUserProfile(accessToken, updates, signal);
    } catch (error) {
        return rejectWithValue(
            error instanceof Error ? error.message : 'Could not update your profile. Please try again.',
        );
    }
});

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        clearProfile: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadUserProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loadUserProfile.fulfilled, (state, action) => {
                state.profile = action.payload;
                state.isLoading = false;
                state.error = null;
            })
            .addCase(loadUserProfile.rejected, (state, action) => {
                state.isLoading = false;
                if (!action.meta.aborted) {
                    state.error = action.payload ?? 'Could not load your profile. Please try again.';
                }
            })
            .addCase(saveUserProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(saveUserProfile.fulfilled, (state, action) => {
                state.profile = action.payload;
                state.isLoading = false;
                state.error = null;
            })
            .addCase(saveUserProfile.rejected, (state, action) => {
                state.isLoading = false;
                if (!action.meta.aborted) {
                    state.error = action.payload ?? 'Could not update your profile. Please try again.';
                }
            })
            .addCase(signOut.fulfilled, () => initialState);
    },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
