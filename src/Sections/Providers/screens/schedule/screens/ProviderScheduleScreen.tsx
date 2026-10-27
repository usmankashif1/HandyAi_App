import { useMemo, useState } from 'react';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import {
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import AppText from '../../../../../components/AppText';
import { Colors } from '../../../../../core/theme/colors';
import { FontSize, TypeScale } from '../../../../../core/theme/designTokens';
import { RS } from '../../../../../core/utils/responsive';
import type { ProviderTabParamList } from '../../../navigation/provider.types';
import ScheduleAppointmentCard from '../components/ScheduleAppointmentCard';
import ScheduleDateSelector from '../components/ScheduleDateSelector';
import ScheduleEmptyState from '../components/ScheduleEmptyState';
import ScheduleFilterSheet from '../components/ScheduleFilterSheet';
import ScheduleSearchBar from '../components/ScheduleSearchBar';
import type { ScheduleAppointment, ScheduleCategory } from '../schedule.types';

type Props = BottomTabScreenProps<ProviderTabParamList, 'Schedule'>;

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
        accentColor: Colors.amberDark,
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
        accentColor: Colors.amberDark,
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

const ProviderScheduleScreen = ({ navigation }: Props) => {
    const [selectedDate, setSelectedDate] = useState(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
    });
    const [query, setQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<ScheduleCategory>('All');
    const [draftCategory, setDraftCategory] = useState<ScheduleCategory>('All');
    const [filterVisible, setFilterVisible] = useState(false);
    const [appointments] = useState(() => createSampleAppointments(new Date()));

    const openFilters = () => {
        setDraftCategory(selectedCategory);
        setFilterVisible(true);
    };

    const applyFilters = () => {
        setSelectedCategory(draftCategory);
        setFilterVisible(false);
    };

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
            <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
            <View style={styles.header}>
                <View style={styles.titleRow}>
                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Back to jobs"
                        onPress={() => navigation.navigate('Jobs')}
                        hitSlop={8}
                        style={styles.backButton}
                    >
                        <Svg width={RS(30)} height={RS(30)} viewBox="0 0 24 24">
                            <Path
                                d="m15 18-6-6 6-6"
                                fill="none"
                                stroke={Colors.black}
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </Svg>
                    </Pressable>
                    <AppText style={styles.title}>Schedule</AppText>
                </View>
                <ScheduleSearchBar
                    query={query}
                    onChangeQuery={setQuery}
                    onPressFilter={openFilters}
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
                draftCategory={draftCategory}
                onSelectCategory={setDraftCategory}
                onClose={() => setFilterVisible(false)}
                onApply={applyFilters}
                onReset={() => setDraftCategory('All')}
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
        paddingHorizontal: RS(18),
        paddingTop: RS(8),
        paddingBottom: RS(12),
        gap: RS(20),
    },
    titleRow: {
        minHeight: RS(40),
        flexDirection: 'row',
        alignItems: 'center',
        gap: RS(12),
    },
    backButton: {
        width: RS(30),
        height: RS(40),
        justifyContent: 'center',
    },
    title: {
        ...TypeScale.heading,
        color: Colors.textPrimary,
        fontSize: FontSize.heroTitle,
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
        ...TypeScale.body,
        color: Colors.black,
        fontWeight: '600',
    },
    count: {
        ...TypeScale.body,
        color: Colors.textSecondary,
    },
    appointmentList: {
        gap: RS(10),
    },
});
