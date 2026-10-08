// =====================================================================
// NEW FILE: src/components/NotificationPermissionBanner.tsx
//
// Reusable banner, used in:
//   1. HomeScreen          -> shown right after login
//   2. Notifications screen -> shown permanently until fixed
//
// Three looks:
//   state='default' -> blue  "Enable notifications" card
//                      (+ optional "Not now" dismiss button)
//   state='denied'  -> amber "Notifications are off" card with
//                      per-device steps + "Check again" button
//   iOS not ready   -> amber "install app / update iOS" card
//                      (reuses your canReceivePushNotifications())
// =====================================================================

import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { RH, RS } from '@/core/utils/responsive';
import {
    canReceivePushNotifications,
    getIOSVersion,
    isIOS,
    isStandalone,
} from '@/core/utils/webPush';
import AppText from './AppText';
import Container from './Container';

type Props = {
    /** 'default' = never asked, 'denied' = user blocked */
    state: 'default' | 'denied';
    busy?: boolean;
    onEnable: () => void | Promise<void>;
    onVerify: () => void | Promise<void>;
    /** Optional "Not now" for the soft ask (HomeScreen). */
    onDismiss?: () => void;
};

export const NotificationPermissionBanner = ({
    state,
    busy = false,
    onEnable,
    onVerify,
    onDismiss,
}: Props) => {
    const ios = isIOS();
    const iosVersion = getIOSVersion();
    const standalone = isStandalone();
    const iosCheck = canReceivePushNotifications();
    const iosBlocked = ios && !iosCheck.ok;

    // ---------- iOS setup required (install / update) ----------
    if (iosBlocked) {
        return (
            <Container
                style={[styles.card, styles.iosCard]}
            >
                <AppText style={styles.title}>
                    🍎 {iosVersion && iosVersion < 16.4
                        ? 'iOS 16.4+ required for notifications'
                        : 'For Receiving Notification Install the app first'}
                </AppText>

                <AppText style={styles.body}>
                    {iosCheck.reason}
                </AppText>

                {iosVersion &&
                    iosVersion >= 16.4 &&
                    !standalone ? (
                    <Container style={styles.stepsBox}>
                        <AppText style={styles.stepTitle}>
                            How to install:
                        </AppText>
                        <AppText style={styles.step}>
                            1️⃣ Tap the Share button ⬆️ in Safari
                        </AppText>
                        <AppText style={styles.step}>
                            2️⃣ Choose &quot;Add to Home Screen&quot;
                        </AppText>
                        <AppText style={styles.step}>
                            3️⃣ Tap &quot;Add&quot;
                        </AppText>
                        <AppText style={styles.step}>
                            4️⃣ Close Safari and open the app
                            from your Home Screen
                        </AppText>
                        <AppText style={styles.step}>
                            5️⃣ Then come back and enable
                            notifications
                        </AppText>
                    </Container>
                ) : null}
            </Container>
        );
    }

    const asking = state === 'default';

    const steps = asking
        ? []
        : ios
            ? [
                '1️⃣ Open the Settings app',
                '2️⃣ Go to Privacy → tap this site ' +
                'in the list (aA icon)',
                '3️⃣ Turn ON "Notifications"',
                '4️⃣ Come back here and tap ' +
                '"Check again"',
            ]
            : [
                '1️⃣ Open this site in Chrome ' +
                '(the browser, not the app icon)',
                '2️⃣ Tap the ⓘ icon next to the ' +
                'address bar',
                '3️⃣ Site settings → Notifications ' +
                '→ Allow',
                '4️⃣ Come back here and tap ' +
                '"Check again"',
            ];

    return (
        <Container
            style={[
                styles.card,
                asking ? styles.askCard : styles.deniedCard,
            ]}
        >
            {asking ? (
                <>
                    <AppText style={styles.title}>
                        🔔 Enable notifications
                    </AppText>

                    <AppText style={styles.body}>
                        Get reminders for classes, schedule
                        changes and membership updates directly
                        on this device.
                    </AppText>

                    <Container style={styles.row}>
                        {onDismiss ? (
                            <TouchableOpacity
                                onPress={onDismiss}
                                style={styles.dismissBtn}
                                hitSlop={{
                                    top: 8,
                                    bottom: 8,
                                    left: 8,
                                    right: 8,
                                }}
                            >
                                <AppText
                                    style={
                                        styles.dismissText
                                    }
                                >
                                    Not now
                                </AppText>
                            </TouchableOpacity>
                        ) : null}

                        <TouchableOpacity
                            onPress={onEnable}
                            disabled={busy}
                            style={[
                                styles.primaryBtn,
                                busy && styles.disabled,
                            ]}
                        >
                            <AppText style={styles.btnText}>
                                {busy
                                    ? 'Please wait…'
                                    : 'Enable Notifications'}
                            </AppText>
                        </TouchableOpacity>
                    </Container>
                </>
            ) : (
                <>
                    <AppText style={styles.title}>
                        ⚠️ Notifications are off
                    </AppText>

                    <AppText style={styles.body}>
                        Notifications are blocked for this site.
                        You can turn them back on at any time:
                    </AppText>

                    <Container style={styles.stepsBox}>
                        {steps.map((step, index) => (
                            <AppText
                                key={index}
                                style={styles.step}
                            >
                                {step}
                            </AppText>
                        ))}
                    </Container>

                    <TouchableOpacity
                        onPress={onVerify}
                        disabled={busy}
                        style={[
                            styles.primaryBtn,
                            busy && styles.disabled,
                        ]}
                    >
                        <AppText style={styles.btnText}>
                            {busy
                                ? 'Checking…'
                                : 'I turned it on — Check again'}
                        </AppText>
                    </TouchableOpacity>
                </>
            )}
        </Container>
    );
};

const styles = StyleSheet.create({
    card: {
        marginHorizontal: RS(16),
        marginTop: RH(12),
        padding: RS(16),
        borderRadius: RS(14),
        marginBottom: RH(10)
    },
    askCard: {
        backgroundColor: '#eff6ff',
        borderWidth: 1,
        borderColor: '#bfdbfe',
    },
    deniedCard: {
        backgroundColor: '#fffbeb',
        borderWidth: 1,
        borderColor: '#fcd34d',
    },
    iosCard: {
        backgroundColor: '#fef3c7',
        borderWidth: 1,
        borderColor: '#f59e0b',
    },
    title: {
        fontSize: RS(15),
        fontWeight: '700',
        color: '#111827',
        marginBottom: RH(6),
    },
    body: {
        fontSize: RS(13),
        color: '#374151',
        lineHeight: RH(20),
        marginBottom: RH(12),
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    dismissBtn: {
        marginRight: RS(12),
        padding: RS(8),
    },
    dismissText: {
        fontSize: RS(13),
        color: '#6b7280',
        fontWeight: '600',
    },
    primaryBtn: {
        backgroundColor: '#f97316', // swap for your brand color
        paddingVertical: RS(12),
        paddingHorizontal: RS(20),
        borderRadius: RS(10),
    },
    disabled: {
        opacity: 0.6,
    },
    btnText: {
        color: '#fff',
        fontSize: RS(14),
        fontWeight: '700',
        textAlign: 'center',
    },
    stepsBox: {
        backgroundColor: '#fff',
        borderRadius: RS(10),
        padding: RS(12),
        marginBottom: RH(12),
    },
    stepTitle: {
        fontSize: RS(13),
        fontWeight: '700',
        color: '#111827',
        marginBottom: RH(6),
    },
    step: {
        fontSize: RS(12),
        color: '#374151',
        marginBottom: RH(4),
        lineHeight: RH(18),
    },
});
