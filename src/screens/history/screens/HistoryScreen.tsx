import { FontSize } from '../../../core/theme/designTokens';
import { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppText from '../../../components/AppText';
import Container from '../../../components/Container';
import { RS } from '../../../core/utils/responsive';
import HistoryBookingCard from '../components/HistoryBookingCard';
import type { HistoryBooking } from '../history.types';
import { Colors } from '@/core/theme/colors';



const historyBookings: HistoryBooking[] = [
    {
        id: 'deep-clean',
        service: 'Deep Clean',
        date: 'Nov 9, 2023',
        provider: 'BrightHome Cleaning',
        price: '$125.00',
        status: 'Completed',
        image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=240&h=280&q=80',
    },
    {
        id: 'leaking-tap',
        service: 'Fix a Leaking Tap',
        date: 'Oct 29, 2022',
        provider: 'Alou Dnara Plumbing',
        price: '$120.00',
        status: 'Completed',
        image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=240&h=280&q=80',
    },
    {
        id: 'mount-tv',
        service: 'Mount TV',
        date: 'Oct 3, 2022',
        provider: 'HandyFix Services',
        price: '$50.00',
        status: 'Completed',
        image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=240&h=280&q=80',
    },
    {
        id: 'light-fixture',
        service: 'Light Fixture Install',
        date: 'May 21, 2024',
        provider: 'Taylor Clayvie',
        price: '$115.00',
        status: 'Completed',
        image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=240&h=280&q=80',
    },
];

const HistoryScreen = () => {
    const compact = useWindowDimensions().width < 375;
    const [trustedProviderIds, setTrustedProviderIds] = useState<string[]>([]);

    const toggleTrustedProvider = (bookingId: string) => {
        setTrustedProviderIds((ids) => (
            ids.includes(bookingId)
                ? ids.filter((id) => id !== bookingId)
                : [...ids, bookingId]
        ));
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor="#F7F5F1" />
            <Container style={styles.header}>
                <AppText style={styles.title}>Booking History</AppText>
            </Container>
            <ScrollView
                contentContainerStyle={[styles.content, compact && styles.compactContent]}
                showsVerticalScrollIndicator={false}
            >
                {historyBookings.map((booking) => (
                    <HistoryBookingCard
                        key={booking.id}
                        booking={booking}
                        compact={compact}
                        isTrusted={trustedProviderIds.includes(booking.id)}
                        onToggleTrusted={() => toggleTrustedProvider(booking.id)}
                    />
                ))}
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
        gap: RS(12),
        paddingHorizontal: RS(20),
        paddingBottom: RS(24),
    },
    compactContent: {
        gap: RS(12),
        paddingHorizontal: RS(20),
    },
});
