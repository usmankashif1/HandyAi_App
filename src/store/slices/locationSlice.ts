import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type LocationPermissionState = 'requesting' | 'granted' | 'denied' | 'unavailable';

type LocationState = {
    permissionState: LocationPermissionState;
    currentLocation: string | null;
    requestId: number;
};

const initialState: LocationState = {
    permissionState: 'requesting',
    currentLocation: null,
    requestId: 0,
};

const locationSlice = createSlice({
    name: 'location',
    initialState,
    reducers: {
        requestLocation: (state) => {
            state.requestId += 1;
            state.permissionState = 'requesting';
        },
        setPermissionState: (state, action: PayloadAction<LocationPermissionState>) => {
            state.permissionState = action.payload;
        },
        setCurrentLocation: (state, action: PayloadAction<string>) => {
            state.currentLocation = action.payload;
        },
    },
});

export const { requestLocation, setCurrentLocation, setPermissionState } = locationSlice.actions;
export default locationSlice.reducer;
