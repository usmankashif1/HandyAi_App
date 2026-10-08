// One hook used by BOTH HomeScreen and your Notifications screen.
//   On mount (i.e. right after login, when HomeScreen opens) it
//    checks Notification.permission:
//      * 'granted'  -> silently makes sure a subscription exists
//                      AND this device is registered with your
//                      backend (no prompt, no UI)
//      * 'default'  -> state stays 'default' -> show the "ask" banner
//      * 'denied'   -> state stays 'denied'  -> show the
//                      "notifications are off" banner
//  - enable()  -> call from a BUTTON TAP. Shows the native prompt,
//                 then registers the device with your backend.
//  - verify()  -> call from the "Check again" button after the user
//                 re-enabled notifications in browser/site settings.

import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import { Alert, Platform } from 'react-native';
import {
    createOrGetPushSubscription,
    getCurrentPushSubscription,
    registerPushDevice,
    requestPermissionAndGetToken,
} from '@/core/utils/webPush';

export type PushPermissionState =
    | 'granted'
    | 'denied'
    | 'default'
    | 'unsupported';

const isWeb = () =>
    Platform.OS === 'web' && typeof window !== 'undefined';

/** Notification.permission, normalized ('prompt' -> 'default'). */
export const readPushPermission = (): PushPermissionState => {
    if (!isWeb() || !('Notification' in window)) {
        return 'unsupported';
    }

    const status =
        (window as any).Notification.permission as string;

    return status === 'prompt'
        ? 'default'
        : (status as PushPermissionState);
};

export const usePushPermission = (
    accessToken: string | null,
) => {
    const [state, setState] = useState<PushPermissionState>(
        readPushPermission(),
    );
    const [busy, setBusy] = useState(false);

    const mounted = useRef(true);

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);


    const setStateSafe = (next: PushPermissionState) => {
        if (mounted.current) {
            setState(next);
        }
    };


    const registerDevice = useCallback(
        async (subscriptionJson: string) => {
            if (!accessToken) {
                return false;
            }
            try {
                return await registerPushDevice(
                    subscriptionJson,
                    accessToken,
                );
            } catch (error) {
                console.error(
                    '❌ Device registration failed:',
                    error,
                );
                return false;
            }
        },
        [accessToken],
    );

    // ============================================
    // AFTER LOGIN: silent check on HomeScreen mount
    // ============================================
    // If permission is already granted (returning user),
    // make sure this device has a subscription and is
    // registered with the backend. No prompt, no UI.
    useEffect(() => {
        if (!accessToken || !isWeb()) {
            return;
        }

        let cancelled = false;

        const ensureRegistered = async () => {
            const status = readPushPermission();
            if (cancelled) return;
            setStateSafe(status);

            if (status !== 'granted') {
                return;
            }

            const existing =
                await getCurrentPushSubscription();

            const subJson =
                existing ??
                (await createOrGetPushSubscription());

            if (subJson && !cancelled) {
                await registerDevice(subJson);
            }
        };

        ensureRegistered();

        return () => {
            cancelled = true;
        };
    }, [accessToken, registerDevice]);

    // ============================================
    // "Enable Notifications" button tap
    // ============================================
    // MUST be called from a user gesture (button tap) —
    // browsers require a gesture to show the prompt.
    const enable =
        useCallback(async (): Promise<PushPermissionState> => {
            if (!isWeb()) {
                return 'unsupported';
            }

            setBusy(true);

            try {
                const subJson =
                    await requestPermissionAndGetToken();

                const status = readPushPermission();
                setStateSafe(status);

                if (subJson) {
                    await registerDevice(subJson);
                }

                return status;
            } finally {
                setBusy(false);
            }
        }, [registerDevice]);

    // ============================================
    // "Check again" button tap (after the user
    // re-enabled notifications in site settings)
    // ============================================
    const verify =
        useCallback(async (): Promise<PushPermissionState> => {
            if (!isWeb()) {
                return 'unsupported';
            }

            setBusy(true);

            try {
                const status = readPushPermission();
                setStateSafe(status);

                if (status === 'granted') {
                    // permission is back — finish the job:
                    // get/create the subscription + register device
                    const existing =
                        await getCurrentPushSubscription();

                    const subJson =
                        existing ??
                        (await createOrGetPushSubscription());

                    if (subJson) {
                        await registerDevice(subJson);
                    }
                } else {
                    Alert.alert(
                        'Still blocked',
                        'Notifications are still turned off. ' +
                        'Follow the steps above, then tap ' +
                        '"Check again".',
                    );
                }

                return status;
            } finally {
                setBusy(false);
            }
        }, [registerDevice]);

    return {
        state,
        busy,
        enable,
        verify,
    };
};
