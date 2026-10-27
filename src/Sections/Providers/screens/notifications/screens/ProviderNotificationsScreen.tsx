import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Rect } from 'react-native-svg';
import AppText from '../../../../../components/AppText';
import { Colors } from '../../../../../core/theme/colors';
import { FontSize, Radii, Spacing, TypeScale } from '../../../../../core/theme/designTokens';
import { RF, RS } from '../../../../../core/utils/responsive';
import type { ProviderJobsStackParamList } from '../../jobs/jobs.types';

type Props = NativeStackScreenProps<ProviderJobsStackParamList, 'Notifications'>;
type NotificationKind = 'job' | 'message' | 'payment';

type ProviderNotification = {
    id: number;
    kind: NotificationKind;
    title: string;
    message: string;
    time: string;
    section: 'Today' | 'Earlier';
    unread: boolean;
};

const initialNotifications: ProviderNotification[] = [
    {
        id: 1,
        kind: 'job',
        title: 'New job request',
        message: 'You have a new cleaning request from Sarah Johnson.',
        time: '10 min ago',
        section: 'Today',
        unread: true,
    },
    {
        id: 2,
        kind: 'message',
        title: 'New message',
        message: 'Michael Davis sent you a message about the appointment.',
        time: '1 hour ago',
        section: 'Today',
        unread: true,
    },
    {
        id: 3,
        kind: 'payment',
        title: 'Payment received',
        message: 'Your payment for the completed plumbing job is on its way.',
        time: '3 hours ago',
        section: 'Today',
        unread: false,
    },
    {
        id: 4,
        kind: 'job',
        title: 'Job confirmed',
        message: 'Your handyman appointment with Emily Wilson is confirmed.',
        time: 'Yesterday',
        section: 'Earlier',
        unread: false,
    },
    {
        id: 5,
        kind: 'payment',
        title: 'Weekly payout sent',
        message: 'Your weekly earnings have been sent to your bank account.',
        time: 'Monday',
        section: 'Earlier',
        unread: false,
    },
];

const NotificationIcon = ({ kind }: { kind: NotificationKind }) => {
    const color = kind === 'payment' ? '#27866D' : Colors.primaryDark;

    return (
        <Svg width={RS(24)} height={RS(24)} viewBox="0 0 24 24">
            {kind === 'job' ? (
                <>
                    <Rect x="3" y="7" width="18" height="14" rx="2" fill="none" stroke={color} strokeWidth="1.8" />
                    <Path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m-13 5h18m-11-1v3h4v-3" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </>
            ) : null}
            {kind === 'message' ? (
                <Path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H6l-3 2v-6.5A7.5 7.5 0 1 1 20 11.5Z" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            ) : null}
            {kind === 'payment' ? (
                <>
                    <Rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke={color} strokeWidth="1.8" />
                    <Path d="M3 10h18m-12 5h3" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
                </>
            ) : null}
        </Svg>
    );
};

const ProviderNotificationsScreen = ({ navigation }: Props) => {
    const [notifications, setNotifications] = useState(initialNotifications);
    const unreadCount = notifications.filter((notification) => notification.unread).length;
    const sections: ProviderNotification['section'][] = ['Today', 'Earlier'];

    const markAllAsRead = () => {
        setNotifications((current) => current.map((notification) => ({ ...notification, unread: false })));
    };

    const markAsRead = (id: number) => {
        setNotifications((current) =>
            current.map((notification) =>
                notification.id === id ? { ...notification, unread: false } : notification,
            ),
        );
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
            <View style={styles.header}>
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Back to job requests"
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Svg width={RS(26)} height={RS(26)} viewBox="0 0 24 24">
                        <Path d="m15 18-6-6 6-6" fill="none" stroke={Colors.black} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                </Pressable>
                <AppText style={styles.headerTitle}>Notifications</AppText>
                {unreadCount > 0 ? (
                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Mark all notifications as read"
                        onPress={markAllAsRead}
                        style={styles.markReadButton}
                    >
                        <AppText style={styles.markReadText}>Mark all read</AppText>
                    </Pressable>
                ) : (
                    <View style={styles.headerSpacer} />
                )}
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {notifications.length > 0 ? sections.map((section) => {
                    const sectionNotifications = notifications.filter((notification) => notification.section === section);
                    if (sectionNotifications.length === 0) {
                        return null;
                    }

                    return (
                        <View key={section} style={styles.section}>
                            <AppText style={styles.sectionTitle}>{section}</AppText>
                            <View style={styles.notificationList}>
                                {sectionNotifications.map((notification) => (
                                    <Pressable
                                        key={notification.id}
                                        accessibilityRole="button"
                                        accessibilityLabel={`${notification.title}. ${notification.message}. ${notification.time}${notification.unread ? ', unread' : ''}`}
                                        accessibilityState={{ selected: notification.unread }}
                                        onPress={() => markAsRead(notification.id)}
                                        style={[styles.notificationCard, notification.unread && styles.unreadCard]}
                                    >
                                        <View style={[styles.iconWrap, notification.kind === 'payment' && styles.paymentIconWrap]}>
                                            <NotificationIcon kind={notification.kind} />
                                        </View>
                                        <View style={styles.notificationText}>
                                            <View style={styles.notificationHeading}>
                                                <AppText style={styles.notificationTitle} numberOfLines={1}>
                                                    {notification.title}
                                                </AppText>
                                                {notification.unread ? <View style={styles.unreadDot} /> : null}
                                            </View>
                                            <AppText style={styles.notificationMessage}>{notification.message}</AppText>
                                            <AppText style={styles.notificationTime}>{notification.time}</AppText>
                                        </View>
                                    </Pressable>
                                ))}
                            </View>
                        </View>
                    );
                }) : (
                    <View style={styles.emptyState}>
                        <View style={styles.emptyIcon}>
                            <NotificationIcon kind="message" />
                        </View>
                        <AppText style={styles.emptyTitle}>You’re all caught up</AppText>
                        <AppText style={styles.emptyMessage}>New updates about your jobs will show up here.</AppText>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default ProviderNotificationsScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        minHeight: RS(58),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: RS(8),
        paddingHorizontal: RS(16),
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#D6DADF',
        backgroundColor: Colors.background,
    },
    backButton: {
        width: RS(42),
        height: RS(42),
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        flex: 1,
        color: Colors.black,
        fontSize: FontSize.subheading,
        fontWeight: '700',
    },
    markReadButton: {
        minHeight: RS(42),
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: RS(4),
    },
    markReadText: {
        color: '#42749F',
        fontSize: RF(13),
        fontWeight: '600',
    },
    headerSpacer: {
        width: RS(42),
    },
    content: {
        gap: Spacing.lg,
        paddingHorizontal: RS(18),
        paddingTop: Spacing.lg,
        paddingBottom: Spacing.xxl,
    },
    section: {
        gap: RS(10),
    },
    sectionTitle: {
        ...TypeScale.body,
        color: '#172643',
        fontSize: RF(17),
        fontWeight: '700',
    },
    notificationList: {
        gap: RS(10),
    },
    notificationCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: RS(12),
        borderWidth: 1,
        borderColor: '#E3E7EB',
        borderRadius: RS(15),
        backgroundColor: Colors.white,
        padding: RS(14),
    },
    unreadCard: {
        borderColor: '#B9C8DE',
        backgroundColor: '#F6F8FC',
    },
    iconWrap: {
        width: RS(44),
        height: RS(44),
        flexShrink: 0,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: Radii.pill,
        backgroundColor: '#E7ECF6',
    },
    paymentIconWrap: {
        backgroundColor: '#E1F2EB',
    },
    notificationText: {
        flex: 1,
        minWidth: 0,
        gap: RS(4),
    },
    notificationHeading: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: RS(8),
    },
    notificationTitle: {
        flex: 1,
        color: '#192944',
        fontSize: RF(15),
        fontWeight: '700',
    },
    unreadDot: {
        width: RS(8),
        height: RS(8),
        borderRadius: Radii.pill,
        backgroundColor: Colors.primary,
    },
    notificationMessage: {
        color: '#4B5666',
        fontSize: RF(13),
        lineHeight: RS(19),
    },
    notificationTime: {
        marginTop: RS(2),
        color: '#7A8491',
        fontSize: RF(12),
    },
    emptyState: {
        alignItems: 'center',
        paddingHorizontal: RS(24),
        paddingVertical: RS(52),
        borderRadius: RS(16),
        backgroundColor: Colors.white,
    },
    emptyIcon: {
        width: RS(56),
        height: RS(56),
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.sm,
        borderRadius: Radii.pill,
        backgroundColor: '#E7ECF6',
    },
    emptyTitle: {
        color: Colors.primaryDark,
        fontSize: RF(17),
        fontWeight: '600',
        marginBottom: RS(5),
    },
    emptyMessage: {
        color: Colors.textSecondary,
        fontSize: RF(14),
        lineHeight: RS(21),
        textAlign: 'center',
    },
});
