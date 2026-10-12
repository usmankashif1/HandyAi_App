import * as Location from 'expo-location';
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import type { PropsWithChildren } from 'react';
import { Alert, Linking } from 'react-native';
import { showErrorToast } from '../utils/toast';

type LocationPermissionState = 'requesting' | 'granted' | 'denied' | 'unavailable';

type LocationContextValue = {
    permissionState: LocationPermissionState;
    currentLocation: string | null;
    requestLocationPermission: () => Promise<void>;
};

const LocationContext = createContext<LocationContextValue | null>(null);

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
    const [permissionState, setPermissionState] = useState<LocationPermissionState>('requesting');
    const [currentLocation, setCurrentLocation] = useState<string | null>(null);
    const subscription = useRef<Location.LocationSubscription | null>(null);
    const mounted = useRef(true);
    const requestInProgress = useRef(false);

    const publishLocation = useCallback(async (coords: Location.LocationObjectCoords) => {
        try {
            const label = await getLocationLabel(coords.latitude, coords.longitude);
            if (mounted.current) {
                setCurrentLocation(label);
            }
        } catch (error) {
            console.warn('Unable to resolve the current location name:', error);
            if (mounted.current) {
                setCurrentLocation(`${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`);
            }
        }
    }, []);

    const startLocationUpdates = useCallback(async () => {
        try {
            const lastKnownPosition = await Location.getLastKnownPositionAsync();
            if (lastKnownPosition) {
                await publishLocation(lastKnownPosition.coords);
            }

            const position = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });
            await publishLocation(position.coords);

            subscription.current?.remove();
            subscription.current = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.Balanced,
                    distanceInterval: 100,
                },
                (update) => {
                    void publishLocation(update.coords);
                },
            );
        } catch (error) {
            console.error('Unable to fetch the current location:', error);
            if (mounted.current) {
                setPermissionState('unavailable');
            }
        }
    }, [publishLocation]);

    const requestLocationPermission = useCallback(async () => {
        if (requestInProgress.current) {
            return;
        }

        requestInProgress.current = true;
        setPermissionState('requesting');
        try {
            const permission = await Location.requestForegroundPermissionsAsync();
            if (!mounted.current) {
                return;
            }

            if (permission.granted) {
                setPermissionState('granted');
                await startLocationUpdates();
                return;
            }

            setPermissionState('denied');
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
        } catch (error) {
            console.error('Unable to request location permission:', error);
            if (mounted.current) {
                setPermissionState('unavailable');
            }
        } finally {
            requestInProgress.current = false;
        }
    }, [startLocationUpdates]);

    useEffect(() => {
        mounted.current = true;
        const requestTimeout = setTimeout(() => {
            void requestLocationPermission();
        }, 0);

        return () => {
            clearTimeout(requestTimeout);
            mounted.current = false;
            subscription.current?.remove();
            subscription.current = null;
        };
    }, [requestLocationPermission]);

    const value = useMemo(
        () => ({ permissionState, currentLocation, requestLocationPermission }),
        [permissionState, currentLocation, requestLocationPermission],
    );

    return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
};

export const useCurrentLocation = (): LocationContextValue => {
    const context = useContext(LocationContext);
    if (!context) {
        throw new Error('useCurrentLocation must be used inside LocationPermissionProvider.');
    }
    return context;
};
