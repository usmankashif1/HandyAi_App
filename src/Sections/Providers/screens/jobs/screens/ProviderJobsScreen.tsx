import { useState } from 'react';
import {
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import AppText from '../../../../../components/AppText';
import { Colors } from '../../../../../core/theme/colors';
import { Radii, Spacing } from '../../../../../core/theme/designTokens';
import { RF, RS } from '../../../../../core/utils/responsive';
import { PROVIDER_JOBS } from '../jobs.data';
import type { ProviderJob, ProviderJobsStackParamList } from '../jobs.types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type Category = 'All' | 'Cleaning' | 'Handyman' | 'Electrical' | 'Plumbing';
type Props = NativeStackScreenProps<ProviderJobsStackParamList, 'JobList'>;

const CATEGORIES: { name: Category; count: number }[] = [
    { name: 'All', count: 5 },
    { name: 'Cleaning', count: 2 },
    { name: 'Handyman', count: 2 },
    { name: 'Electrical', count: 1 },
    { name: 'Plumbing', count: 0 },
];

const LineIcon = ({ kind, color = '#667487' }: { kind: 'calendar' | 'pin' | 'star' | 'bell'; color?: string }) => (
    <Svg width={RS(28)} height={RS(28)} viewBox="0 0 24 24">
        {kind === 'calendar' && (
            <>
                <Rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke={color} strokeWidth="1.8" />
                <Path d="M16 3v4M8 3v4M3 10h18" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
            </>
        )}
        {kind === 'pin' && (
            <>
                <Path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" fill="none" stroke={color} strokeWidth="1.8" />
                <Circle cx="12" cy="10" r="2.5" fill="none" stroke={color} strokeWidth="1.8" />
            </>
        )}
        {kind === 'star' && (
            <Path d="m12 2.5 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3.1-5.8 3.1 1.1-6.5-4.7-4.6 6.5-.9L12 2.5Z" fill={color} />
        )}
        {kind === 'bell' && (
            <>
                <Path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Zm-8 12a2 2 0 0 0 4 0" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </>
        )}
    </Svg>
);

const JobCard = ({ job, onViewDetails }: { job: ProviderJob; onViewDetails: () => void }) => (
    <View style={styles.jobCard}>
        <View style={styles.jobHeading}>
            {/* <View style={styles.categoryMark}>
                <AppText style={styles.categoryInitial}>{job.category === 'Cleaning' ? '✦' : '⌁'}</AppText>
            </View> */}
            <View style={styles.jobTitleGroup}>
                <AppText style={styles.jobTitle}>{job.category}</AppText>
            </View>
            <View style={styles.rating}>
                <LineIcon kind="star" color="#E79A32" />
                <AppText style={styles.ratingValue}>{job.rating}</AppText>
                <AppText style={styles.reviewCount}>({job.reviews})</AppText>
            </View>
        </View>

        <View style={styles.detailRow}>
            <LineIcon kind="calendar" />
            <AppText style={styles.detailText}>{job.date} · {job.time}</AppText>
        </View>
        <View style={styles.detailRow}>
            <LineIcon kind="pin" />
            <AppText style={styles.detailText}>{job.location} ({job.distance})</AppText>
        </View>
        <View style={styles.metaRow}>
            <View style={styles.metaLeft}>
                <AppText style={styles.currencySign}>$</AppText>
                <AppText style={styles.detailText}>{job.duration} · {job.price}</AppText>
            </View>
            <Pressable accessibilityRole="button" onPress={onViewDetails} style={styles.detailsLink}>
                <AppText style={styles.detailsText}>View Details</AppText>
                <AppText style={styles.chevron}>›</AppText>
            </Pressable>
        </View>

        <View style={styles.jobActions}>
            <Pressable accessibilityRole="button" style={styles.acceptButton}>
                <AppText style={styles.acceptText}>Accept Job</AppText>
            </Pressable>
            <Pressable accessibilityRole="button" style={styles.declineButton}>
                <AppText style={styles.declineText}>Decline</AppText>
            </Pressable>
        </View>
    </View>
);

const ProviderJobsScreen = ({ navigation }: Props) => {
    const [activeCategory, setActiveCategory] = useState<Category>('All');
    const visibleJobs = activeCategory === 'All'
        ? PROVIDER_JOBS
        : PROVIDER_JOBS.filter((job) => job.category === activeCategory);

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
            <View style={styles.header}>
                <View style={styles.brand}>
                    <View style={styles.brandMark}>
                        <Svg width={RS(24)} height={RS(24)} viewBox="0 0 24 24">
                            <Path
                                d="m2.5 10 9.5-7 9.5 7M5 9v12h14V9m-9 12v-7h4v7"
                                fill="none"
                                stroke={NAVY}
                                strokeWidth={1.8}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </Svg>
                    </View>
                    <AppText style={styles.brandText}>Handy AI</AppText>
                </View>
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Notifications, 2 unread"
                    onPress={() => navigation.navigate('Notifications')}
                    style={styles.notificationButton}
                >
                    <LineIcon kind="bell" color={NAVY} />
                    <View style={styles.notificationBadge}>
                        <AppText style={styles.notificationBadgeText}>2</AppText>
                    </View>
                </Pressable>
            </View>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <AppText style={styles.screenTitle}>Job Requests</AppText>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filters}
                >
                    {CATEGORIES.map(({ name, count }) => {
                        const active = activeCategory === name;
                        return (
                            <Pressable
                                key={name}
                                accessibilityRole="button"
                                accessibilityState={{ selected: active }}
                                onPress={() => setActiveCategory(name)}
                                style={[styles.filterChip, active && styles.filterChipActive]}
                            >
                                <AppText style={[styles.filterText, active && styles.filterTextActive]}>
                                    {name} ({count})
                                </AppText>
                            </Pressable>
                        );
                    })}
                </ScrollView>
                <View style={styles.jobList}>
                    {visibleJobs.length > 0 ? (
                        visibleJobs.map((job) => (
                            <JobCard
                                key={job.id}
                                job={job}
                                onViewDetails={() => navigation.navigate('JobDetails', { job })}
                            />
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <AppText style={styles.emptyTitle}>No {activeCategory.toLowerCase()} jobs yet</AppText>
                            <AppText style={styles.emptyText}>New requests will show up here.</AppText>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ProviderJobsScreen;

const NAVY = '#10264D';

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
        paddingHorizontal: RS(22),
    },
    brand: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: RS(8),
    },
    brandMark: {
        width: RS(31),
        height: RS(31),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: NAVY,
        borderRadius: RS(8),
    },
    brandText: {
        color: NAVY,
        fontSize: RF(23),
        fontWeight: '700',
    },
    notificationButton: {
        width: RS(42),
        height: RS(42),
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    notificationBadge: {
        position: 'absolute',
        top: RS(1),
        right: RS(1),
        minWidth: RS(22),
        height: RS(22),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: Colors.background,
        borderRadius: Radii.pill,
        backgroundColor: '#D64545',
        paddingHorizontal: RS(4),
    },
    notificationBadgeText: {
        color: Colors.white,
        fontSize: RF(10),
        lineHeight: RS(14),
        fontWeight: '700',
        textAlign: 'center',
        
    },
    scrollContent: {
        paddingBottom: Spacing.lg,
    },
    screenTitle: {
        color: '#172643',
        fontSize: RF(31),
        lineHeight: RS(40),
        fontWeight: '700',
        paddingHorizontal: RS(22),
        marginTop: RS(12),
        marginBottom: RS(15),
    },
    filters: {
        gap: RS(9),
        paddingHorizontal: RS(22),
        paddingBottom: RS(15),
    },
    filterChip: {
        minHeight: RS(40),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#AEB9C8',
        borderRadius: Radii.pill,
        paddingHorizontal: RS(16),
        backgroundColor: 'transparent',
    },
    filterChipActive: {
        borderColor: NAVY,
        backgroundColor: NAVY,
    },
    filterText: {
        color: '#344155',
        fontSize: RF(14),
        fontWeight: '500',
    },
    filterTextActive: {
        color: Colors.white,
    },
    jobList: {
        gap: RS(14),
        paddingHorizontal: RS(18),
    },
    jobCard: {
        borderWidth: 1,
        borderColor: '#BAC8D7',
        borderRadius: RS(17),
        backgroundColor: Colors.white,
        padding: RS(15),
        gap: RS(10),
    },
    jobHeading: {
        minHeight: RS(42),
        flexDirection: 'row',
        alignItems: 'center',
        gap: RS(8),
    },
    categoryMark: {
        width: RS(42),
        height: RS(42),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: Radii.pill,
        backgroundColor: '#E9F4F2',
    },
    categoryInitial: {
        color: NAVY,
        fontSize: RF(24),
    },
    jobTitleGroup: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: RS(8),
    },
    newBadge: {
        borderRadius: Radii.pill,
        backgroundColor: '#DDF3E8',
        paddingHorizontal: RS(10),
        paddingVertical: RS(4),
    },
    newBadgeText: {
        color: '#26825F',
        fontSize: RF(12),
        fontWeight: '600',
    },
    jobTitle: {
        color: '#192944',
        fontSize: RF(18),
        fontWeight: 'bold',
    },
    rating: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: RS(3),
    },
    ratingValue: {
        color: '#4B351B',
        fontSize: RF(14),
        fontWeight: '700',
    },
    reviewCount: {
        color: '#A9773A',
        fontSize: RF(13),
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: RS(9),
    },
    detailText: {
        flexShrink: 1,
        color: '#252C38',
        fontSize: RF(14),
        lineHeight: RS(21),
    },
    currencySign: {
        width: RS(22),
        color: '#667487',
        fontSize: RF(18),
        lineHeight: RS(22),
        textAlign: 'center',
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: RS(7),
    },
    metaLeft: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: RS(8),
    },
    detailsLink: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: RS(3),
    },
    detailsText: {
        color: '#42749F',
        fontSize: RF(13),
    },
    chevron: {
        color: '#42749F',
        fontSize: RF(22),
        lineHeight: RS(22),
    },
    jobActions: {
        flexDirection: 'row',
        gap: RS(10),
        marginTop: RS(3),
    },
    acceptButton: {
        flex: 1,
        minHeight: RS(46),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: Radii.pill,
        backgroundColor: NAVY,
        paddingHorizontal: RS(8),
    },
    acceptText: {
        color: Colors.white,
        fontSize: RF(14),
        fontWeight: '600',
    },
    declineButton: {
        flex: 1,
        minHeight: RS(46),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: NAVY,
        borderRadius: Radii.pill,
        backgroundColor: Colors.white,
        paddingHorizontal: RS(8),
    },
    declineText: {
        color: NAVY,
        fontSize: RF(14),
        fontWeight: '600',
    },
    emptyState: {
        alignItems: 'center',
        padding: RS(28),
        borderRadius: RS(16),
        backgroundColor: Colors.white,
    },
    emptyTitle: {
        color: NAVY,
        fontSize: RF(17),
        fontWeight: '600',
        marginBottom: RS(5),
    },
    emptyText: {
        color: Colors.textSecondary,
        fontSize: RF(14),
        textAlign: 'center',
    },
});
