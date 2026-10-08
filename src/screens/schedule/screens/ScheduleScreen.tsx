import { FontSize } from '../../../core/theme/designTokens';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppText from '../../../components/AppText';
import Container from '../../../components/Container';
import { RS } from '../../../core/utils/responsive';
import ScheduleBookingCard from '../components/ScheduleBookingCard';
import type { ScheduleBookingGroup, ScheduleStackParamList } from '../schedule.types';
import { Colors } from '@/core/theme/colors';



type Props = NativeStackScreenProps<ScheduleStackParamList, 'ScheduleHome'>;

const bookingGroups: ScheduleBookingGroup[] = [
    {
        date: 'Tomorrow',
        bookings: [
            {
                id: 'deep-clean',
                service: 'Deep Clean',
                provider: 'BrightHome Cleaning',
                providerName: 'Mike Rivera',
                time: '9:00 AM - 12:00 PM',
                status: 'Confirmed',
                image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=240&h=280&q=80',
            },
        ],
    },
    {
        date: 'Fri, Nov 17',
        bookings: [
            {
                id: 'handyman',
                service: 'Handyman',
                provider: "Mike's Home Services",
                providerName: 'Mike Rivera',
                time: '2:00 PM - 4:00 PM',
                status: 'Provider on the way',
                image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=240&h=280&q=80',
            },
            {
                id: 'electrical',
                service: 'Electrical',
                provider: 'Taylor Electric',
                providerName: 'Taylor Brooks',
                time: 'Mon, Nov 20 - 10:00 AM',
                status: 'Confirmed',
                image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=240&h=280&q=80',
            },
        ],
    },
];

const ScheduleScreen = ({ navigation }: Props) => (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor="#F7F5ED" />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <AppText style={styles.title}>Your Schedule</AppText>
            {bookingGroups.map((group) => (
                <Container key={group.date} style={styles.bookingGroup}>
                    <AppText style={styles.dateHeading}>{group.date}</AppText>
                    <Container style={styles.bookingList}>
                        {group.bookings.map((booking) => (
                            <ScheduleBookingCard
                                key={booking.id}
                                booking={booking}
                                onMessage={() => navigation.navigate('ProviderChat', {
                                    providerName: booking.providerName,
                                })}
                            />
                        ))}
                    </Container>
                </Container>
            ))}
        </ScrollView>
    </SafeAreaView>
);

export default ScheduleScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
               backgroundColor: Colors.background,
       
    },
    content: {
        paddingHorizontal: RS(20),
        paddingTop: RS(12),
        paddingBottom: RS(24),
    },
    title: {
        marginBottom: RS(24),
        color: '#171923',
        fontSize: FontSize.heading,
        fontWeight: '700',
        letterSpacing: RS(-0.5),
    },
    bookingGroup: {
        marginBottom: RS(22),
    },
    dateHeading: {
        marginBottom: RS(12),
        color: '#171923',
        fontSize: FontSize.subtitle,
        fontWeight: '700',
    },
    bookingList: {
        gap: RS(12),
    },
});
