import { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleSheet,
    useWindowDimensions,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppText from '../../../../../components/AppText';
import Container from '../../../../../components/Container';
import { Colors } from '../../../../../core/theme/colors';
import { FontSize } from '../../../../../core/theme/designTokens';
import { RS } from '../../../../../core/utils/responsive';
import { useAppSelector } from '../../../../../store/hooks';
import HistoryBookingCard from '../components/HistoryBookingCard';
import { fetchCustomerBookings } from '../history.api';
import type { Booking, HistoryBooking } from '../history.types';

const formatBookingDate = (date: string): string => new Date(date).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
});

const formatBookingStatus = (status: string): string => (
    status.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
);

const toHistoryBooking = (booking: Booking): HistoryBooking => ({
    id: booking.id,
    service: booking.subService.name,
    date: formatBookingDate(booking.scheduledAt),
    provider: 'Provider details unavailable',
    price: `$${(booking.priceCents / 100).toFixed(2)}`,
    status: formatBookingStatus(booking.status),
});

const HistoryScreen = () => {
    const compact = useWindowDimensions().width < 375;
    const token = useAppSelector((state) => state.auth.token);
    const [bookings, setBookings] = useState<HistoryBooking[]>([]);
    const [trustedProviderIds, setTrustedProviderIds] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<{ token: string | null; message: string } | null>(null);
    const [bookingsToken, setBookingsToken] = useState<string | null>(null);
    const requestController = useRef<AbortController | null>(null);

    const loadBookings = useCallback(async (isPullToRefresh: boolean) => {
        if (!token) {
            setBookings([]);
            setBookingsToken(null);
            setError({ token: null, message: 'Sign in to view your booking history.' });
            setIsLoading(false);
            setIsRefreshing(false);
            return;
        }

        requestController.current?.abort();
        const controller = new AbortController();
        requestController.current = controller;
        setError(null);
        if (isPullToRefresh) {
            setIsRefreshing(true);
        } else {
            setIsLoading(true);
        }

        try {
            const result = await fetchCustomerBookings(token, controller.signal);
            setBookings(result.map(toHistoryBooking));
            setBookingsToken(token);
        } catch (requestError: unknown) {
            if (!controller.signal.aborted) {
                setError(
                    {
                        token,
                        message: requestError instanceof Error
                            ? requestError.message
                            : 'Could not load booking history. Please try again.',
                    },
                );
            }
        } finally {
            if (!controller.signal.aborted) {
                if (requestController.current === controller) {
                    requestController.current = null;
                }
                setIsLoading(false);
                setIsRefreshing(false);
            }
        }
    }, [token]);

    useEffect(() => {
        if (!token) {
            return undefined;
        }

        requestController.current?.abort();
        const controller = new AbortController();
        requestController.current = controller;

        void fetchCustomerBookings(token, controller.signal)
            .then((result) => {
                if (!controller.signal.aborted) {
                    setBookings(result.map(toHistoryBooking));
                    setBookingsToken(token);
                    setError(null);
                }
            })
            .catch((requestError: unknown) => {
                if (!controller.signal.aborted) {
                    setError({
                        token,
                        message: requestError instanceof Error
                            ? requestError.message
                            : 'Could not load booking history. Please try again.',
                    });
                }
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                    if (requestController.current === controller) {
                        requestController.current = null;
                    }
                }
            });

        return () => {
            controller.abort();
            if (requestController.current === controller) {
                requestController.current = null;
            }
        };
    }, [token]);

    const toggleTrustedProvider = (bookingId: string) => {
        setTrustedProviderIds((ids) => (
            ids.includes(bookingId)
                ? ids.filter((id) => id !== bookingId)
                : [...ids, bookingId]
        ));
    };

    const currentBookings = bookingsToken === token ? bookings : [];
    const currentError = error?.token === token ? error.message : undefined;
    const isInitialLoading = token !== null
        && (isLoading || (bookingsToken !== token && !currentError));
    const isInitialError = currentError && currentBookings.length === 0;
    const isSignedOut = !token;

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
            <Container style={styles.header}>
                <AppText style={styles.title}>Booking History</AppText>
            </Container>
            <ScrollView
                contentContainerStyle={[
                    styles.content,
                    compact && styles.compactContent,
                    !currentBookings.length && styles.emptyContent,
                ]}
                showsVerticalScrollIndicator={false}
                refreshControl={(
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={() => void loadBookings(true)}
                        tintColor={Colors.primary}
                        colors={[Colors.primary]}
                    />
                )}
            >
                {isSignedOut ? (
                    <View style={styles.stateContainer}>
                        <AppText style={styles.errorTitle}>Sign in to view your bookings</AppText>
                    </View>
                ) : isInitialLoading ? (
                    <View style={styles.stateContainer}>
                        <ActivityIndicator size="large" color={Colors.primary} />
                        <AppText style={styles.stateText}>Loading your bookings...</AppText>
                    </View>
                ) : isInitialError ? (
                    <View style={styles.stateContainer}>
                        <AppText style={styles.errorTitle}>Could not load booking history</AppText>
                        <AppText style={styles.stateText}>{currentError}</AppText>
                        <Pressable
                            accessibilityRole="button"
                            onPress={() => void loadBookings(false)}
                            style={({ pressed }) => [styles.retryButton, pressed && styles.pressed]}
                        >
                            <AppText style={styles.retryText}>Try Again</AppText>
                        </Pressable>
                    </View>
                ) : currentBookings.length === 0 ? (
                    <View style={styles.stateContainer}>
                        <AppText style={styles.errorTitle}>No bookings yet</AppText>
                        <AppText style={styles.stateText}>
                            Your bookings will appear here once you make one.
                        </AppText>
                    </View>
                ) : (
                    <>
                        {currentError ? (
                            <View style={styles.refreshError}>
                                <AppText style={styles.refreshErrorText} numberOfLines={3}>
                                    {`Could not refresh bookings. Showing saved results. ${currentError}`}
                                </AppText>
                                <Pressable
                                    accessibilityRole="button"
                                    accessibilityLabel="Retry loading bookings"
                                    onPress={() => void loadBookings(true)}
                                    style={({ pressed }) => [
                                        styles.noticeRetryButton,
                                        pressed && styles.pressed,
                                    ]}
                                >
                                    <AppText style={styles.noticeRetryText}>Retry</AppText>
                                </Pressable>
                            </View>
                        ) : null}
                        {currentBookings.map((booking) => (
                            <HistoryBookingCard
                                key={booking.id}
                                booking={booking}
                                compact={compact}
                                isTrusted={trustedProviderIds.includes(booking.id)}
                                onToggleTrusted={() => toggleTrustedProvider(booking.id)}
                            />
                        ))}
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default HistoryScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        paddingHorizontal: RS(20),
        paddingTop: RS(12),
        paddingBottom: RS(24),
    },
    title: {
        color: '#171411',
        fontSize: FontSize.heading,
        fontWeight: '700',
        letterSpacing: RS(-0.5),
        textAlign: 'left',
    },
    content: {
        flexGrow: 1,
        gap: RS(12),
        paddingHorizontal: RS(20),
        paddingBottom: RS(24),
    },
    compactContent: {
        gap: RS(12),
        paddingHorizontal: RS(20),
    },
    emptyContent: {
        justifyContent: 'center',
    },
    stateContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: RS(12),
        paddingHorizontal: RS(16),
    },
    stateText: {
        color: Colors.textSecondary,
        fontSize: FontSize.body,
        textAlign: 'center',
    },
    errorTitle: {
        color: Colors.textPrimary,
        fontSize: FontSize.subtitle,
        fontWeight: '700',
        textAlign: 'center',
    },
    retryButton: {
        minHeight: RS(46),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: RS(12),
        backgroundColor: Colors.primaryDark,
        paddingHorizontal: RS(24),
    },
    retryText: {
        color: Colors.white,
        fontSize: FontSize.body,
        fontWeight: '600',
    },
    refreshError: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: RS(10),
        borderWidth: 1,
        borderColor: Colors.warningLight,
        borderRadius: RS(12),
        backgroundColor: '#FFFBF2',
        padding: RS(12),
    },
    refreshErrorText: {
        flex: 1,
        color: Colors.textSecondary,
        fontSize: FontSize.bodySmall,
    },
    noticeRetryButton: {
        minHeight: RS(40),
        justifyContent: 'center',
        borderRadius: RS(8),
        backgroundColor: Colors.warningLight,
        paddingHorizontal: RS(12),
    },
    noticeRetryText: {
        color: Colors.warning,
        fontSize: FontSize.bodySmall,
        fontWeight: '700',
    },
    pressed: {
        opacity: 0.78,
    },
});
