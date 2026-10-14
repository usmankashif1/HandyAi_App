import * as Location from 'expo-location';
import { useCallback, useEffect } from 'react';
import type { PropsWithChildren } from 'react';
import { Alert, Linking } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
    requestLocation,
    setCurrentLocation,
    setPermissionState,
} from '../../store/slices/locationSlice';
import { showErrorToast } from '../utils/toast';

const getLocationLabel = async (latitude: number, longitude: number): Promise<string> => {
    if (typeof Location.reverseGeocodeAsync !== 'function') {
        return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    }

    const [place] = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (!place) {
        return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    }

    if (place.formattedAddress?.trim()) {
        return place.formattedAddress.trim();
    }

    const street = [place.streetNumber, place.street].filter(Boolean).join(' ');
    const parts = [
        place.name,
        street,
        place.district,
        place.city,
        place.subregion,
        place.region,
        place.postalCode,
        place.country,
    ]
        .filter((part): part is string => Boolean(part?.trim()))
        .filter((part, index, values) => values.indexOf(part) === index);
    return parts.join(', ') || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
};

export const LocationPermissionProvider = ({ children }: PropsWithChildren) => {
    const dispatch = useAppDispatch();
    const requestId = useAppSelector((state) => state.location.requestId);

    useEffect(() => {
        dispatch(requestLocation());
    }, [dispatch]);

    useEffect(() => {
        if (requestId === 0) {
            return undefined;
        }

        let active = true;
        let subscription: Location.LocationSubscription | null = null;

        const publishLocation = async (coords: Location.LocationObjectCoords) => {
            try {
                const label = await getLocationLabel(coords.latitude, coords.longitude);
                if (active) {
                    dispatch(setCurrentLocation(label));
                }
            } catch (error) {
                console.warn('Unable to resolve the current location name:', error);
                if (active) {
                    dispatch(setCurrentLocation(`${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`));
                }
            }
        };

        const runLocationRequest = async () => {
            try {
                const permission = await Location.requestForegroundPermissionsAsync();
                if (!active) {
                    return;
                }

                if (!permission.granted) {
                    dispatch(setPermissionState('denied'));
                    if (!permission.canAskAgain) {
                        Alert.alert(
                            'Location permission needed',
                            'Turn on location access in your device settings to see your current location.',
                            [
                                { text: 'Not now', style: 'cancel' },
                                {
                                    text: 'Open settings',
                                    onPress: () => {
                                        void Linking.openSettings().catch((error: unknown) => {
                                            console.error('Unable to open device settings:', error);
                                            showErrorToast(
                                                'Unable to open settings',
                                                'Please enable location access in device settings.',
                                            );
                                        });
                                    },
                                },
                            ],
                        );
                    }
                    return;
                }

                dispatch(setPermissionState('granted'));
                const lastKnownPosition = await Location.getLastKnownPositionAsync();
                if (lastKnownPosition) {
                    await publishLocation(lastKnownPosition.coords);
                }

                const position = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Balanced,
                });
                if (!active) {
                    return;
                }
                await publishLocation(position.coords);

                const nextSubscription = await Location.watchPositionAsync(
                    {
                        accuracy: Location.Accuracy.Balanced,
                        distanceInterval: 100,
                    },
                    (update) => {
                        void publishLocation(update.coords);
                    },
                );
                if (active) {
                    subscription = nextSubscription;
                } else {
                    nextSubscription.remove();
                }
            } catch (error) {
                console.error('Unable to fetch the current location:', error);
                if (active) {
                    dispatch(setPermissionState('unavailable'));
                }
            }
        };

        void runLocationRequest();

        return () => {
            active = false;
            subscription?.remove();
        };
    }, [dispatch, requestId]);

    return children;
};

export const useCurrentLocation = () => {
    const dispatch = useAppDispatch();
    const { permissionState, currentLocation } = useAppSelector((state) => state.location);
    const requestLocationPermission = useCallback(() => {
        dispatch(requestLocation());
    }, [dispatch]);

    return {
        permissionState,
        currentLocation,
        requestLocationPermission,
    };
};
