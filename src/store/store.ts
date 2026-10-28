import { configureStore } from '@reduxjs/toolkit';
import { registerSessionExpiredHandler } from '../core/api/sessionExpiry';
import authReducer, { signOut } from './slices/authSlice';
import locationReducer from './slices/locationSlice';
import profileReducer from './slices/profileSlice';
import providerProfileReducer from './slices/providerProfileSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        location: locationReducer,
        profile: profileReducer,
        providerProfile: providerProfileReducer,
    },
});

registerSessionExpiredHandler((expiredToken) => {
    if (store.getState().auth.token !== expiredToken) {
        return;
    }

    void store.dispatch(signOut()).unwrap().catch((error: unknown) => {
        console.error('Unable to clear the expired session:', error);
    });
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;