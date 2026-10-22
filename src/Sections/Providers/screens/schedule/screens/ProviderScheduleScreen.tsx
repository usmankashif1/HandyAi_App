import { useMemo, useState } from 'react';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppText from '../../../../../components/AppText';
import { Colors } from '../../../../../core/theme/colors';
import { RS } from '../../../../../core/utils/responsive';
import ScheduleAppointmentCard from '../components/ScheduleAppointmentCard';
import ScheduleDateSelector from '../components/ScheduleDateSelector';
import ScheduleEmptyState from '../components/ScheduleEmptyState';
import ScheduleFilterSheet from '../components/ScheduleFilterSheet';
import ScheduleSearchBar from '../components/ScheduleSearchBar';
import type { ScheduleAppointment, ScheduleCategory } from '../schedule.types';

const getDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const getDayOffset = (date: Date, offset: number) => {
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + offset);
    return getDateKey(nextDate);
};

const createSampleAppointments = (today: Date): ScheduleAppointment[] => [
    {
        id: 'schedule-1',
        date: getDateKey(today),
        startTime: '10:00 AM',
        endTime: '12:00 PM',
        service: 'Cleaning',
        customer: 'Sarah Johnson',
        location: 'Bahria Town, Islamabad',
        rating: '4.8',
        accentColor: Colors.primary,
    },
    {
        id: 'schedule-2',
        date: getDateKey(today),
        startTime: '2:00 PM',
        endTime: '3:30 PM',
        service: 'Plumbing',
        customer: 'Mike Ross',
        location: 'DHA Phase 1',
        rating: '5.0',
        accentColor: Colors.amberDark,
    },
    {
        id: 'schedule-3',
        date: getDateKey(today),
        startTime: '4:00 PM',
        endTime: '5:00 PM',
        service: 'Handyman',
        customer: 'Alex Green',
        location: 'E-11 Sector',
        rating: '5.0',
        accentColor: '#B2A15C',
    },
    {
        id: 'schedule-4',
        date: getDateKey(today),
        startTime: '6:00 PM',
        endTime: '7:00 PM',
        service: 'Handyman',
        customer: 'Alex Johnson',
        location: 'Bahria Town, Islamabad',
        rating: '4.9',
        accentColor: '#B2A15C',
    },
    {
        id: 'schedule-5',
        date: getDayOffset(today, 2),
        startTime: '11:00 AM',
        endTime: '12:30 PM',
        service: 'Cleaning',
        customer: 'Jamie Lee',
        location: 'F-10, Islamabad',
        rating: '4.9',
        accentColor: Colors.primary,
    },
];

const ProviderScheduleScreen = () => {
    const [selectedDate, setSelectedDate] = useState(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
    });
    const [query, setQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<ScheduleCategory>('All');
    const [filterVisible, setFilterVisible] = useState(false);
    const [appointments] = useState(() => createSampleAppointments(new Date()));

    const visibleAppointments = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        return appointments.filter((appointment) => {
            const matchesDate = appointment.date === getDateKey(selectedDate);
            const matchesCategory = selectedCategory === 'All' || appointment.service === selectedCategory;
            const matchesSearch = !normalizedQuery || [
                appointment.service,
                appointment.customer,
                appointment.location,
            ].some((value) => value.toLowerCase().includes(normalizedQuery));

            return matchesDate && matchesCategory && matchesSearch;
        });
    }, [appointments, query, selectedCategory, selectedDate]);

    const formattedSelectedDate = selectedDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
    });

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />
            <View style={styles.header}>
                <AppText style={styles.title}>Schedule</AppText>
                <ScheduleSearchBar
                    query={query}
                    onChangeQuery={setQuery}
                    onPressFilter={() => setFilterVisible(true)}
                    activeFilterCount={selectedCategory === 'All' ? 0 : 1}
                />
            </View>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <ScheduleDateSelector
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                />
                <View style={styles.listHeading}>
                    <AppText style={styles.listTitle}>{formattedSelectedDate}</AppText>
                    <AppText style={styles.count}>
                        {visibleAppointments.length} {visibleAppointments.length === 1 ? 'job' : 'jobs'}
                    </AppText>
                </View>
                {visibleAppointments.length > 0 ? (
                    <View style={styles.appointmentList}>
                        {visibleAppointments.map((appointment) => (
                            <ScheduleAppointmentCard
                                key={appointment.id}
                                appointment={appointment}
                            />
                        ))}
                    </View>
                ) : (
                    <ScheduleEmptyState hasSearchOrFilter={Boolean(query.trim()) || selectedCategory !== 'All'} />
                )}
            </ScrollView>
            <ScheduleFilterSheet
                visible={filterVisible}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                onClose={() => setFilterVisible(false)}
                onReset={() => setSelectedCategory('All')}
            />
        </SafeAreaView>
    );
};

export default ProviderScheduleScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        backgroundColor: Colors.primaryDark,
        paddingHorizontal: RS(18),
        paddingTop: RS(8),
        paddingBottom: RS(12),
        gap: RS(8),
    },
    title: {
        color: Colors.white,
        fontSize: RS(27),
        fontWeight: '600',
    },
    scrollView: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: RS(18),
        paddingBottom: RS(20),
    },
    listHeading: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: RS(8),
        marginBottom: RS(10),
    },
    listTitle: {
        color: Colors.primaryDark,
        fontSize: RS(16),
        fontWeight: '600',
    },
    count: {
        color: Colors.textSecondary,
        fontSize: RS(14),
    },
    appointmentList: {
        gap: RS(10),
    },
});
