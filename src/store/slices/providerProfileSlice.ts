import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ProviderProfile } from '../../Sections/Providers/screens/profile/providerProfile.api';
import { signOut } from './authSlice';

type ProviderProfileState = {
    profile: ProviderProfile | null;
};

const initialState: ProviderProfileState = {
    profile: null,
};

const providerProfileSlice = createSlice({
    name: 'providerProfile',
    initialState,
    reducers: {
        setProviderProfile: (state, action: PayloadAction<ProviderProfile>) => {
            state.profile = action.payload;
        },
        clearProviderProfile: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(signOut.pending, () => initialState)
            .addCase(signOut.fulfilled, () => initialState);
    },
});

export const { setProviderProfile, clearProviderProfile } = providerProfileSlice.actions;
export default providerProfileSlice.reducer;
