import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
    Image,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import AppText from '../../../../../components/AppText';
import { Colors } from '../../../../../core/theme/colors';
import { FontSize, Radii } from '../../../../../core/theme/designTokens';
import { RF, RS } from '../../../../../core/utils/responsive';
import { showInfoToast } from '../../../../../core/utils/toast';
import type { ProviderTabParamList } from '../../../navigation/provider.types';
import ProviderSkillChip from '../components/ProviderSkillChip';
import type { ProviderProfileStackParamList } from '../profile.types';
import type { ProviderProfile } from '../providerProfile.api';

const PROFILE_NAME = 'Ahmed Khan';
const PROFESSION = 'Professional Handyman';
const SKILLS = ['Handyman', 'Electrical', 'Plumbing', 'Furniture Assembly', 'General Repairs'];
const FALLBACK_AVATAR = require('../../../../../assets/images/handyMan.jpg');
const DUMMY_PROFILE: ProviderProfile = {
    id: 'provider-demo',
    bio: 'Experienced handyman providing reliable home repair and maintenance services.',
    postcodeCoverage: ['SW1A 1AA', 'W1A 1AA'],
    status: 'APPROVED',
    rejectionReason: null,
    categories: SKILLS.map((name, index) => ({ id: `category-${index + 1}`, name })),
    availability: [
        { id: 'availability-1', dayOfWeek: 1, startTime: '09:00', endTime: '17:00' },
        { id: 'availability-2', dayOfWeek: 2, startTime: '09:00', endTime: '17:00' },
        { id: 'availability-3', dayOfWeek: 3, startTime: '09:00', endTime: '17:00' },
        { id: 'availability-4', dayOfWeek: 4, startTime: '09:00', endTime: '17:00' },
        { id: 'availability-5', dayOfWeek: 5, startTime: '09:00', endTime: '17:00' },
    ],
    documents: [],
};

const ChevronIcon = ({ direction = 'left' }: { direction?: 'left' | 'right' }) => (
    <Svg width={RS(30)} height={RS(30)} viewBox="0 0 24 24">
        <Path
            d={direction === 'left' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'}
            fill="none"
            stroke={NAVY}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

const SettingsIcon = () => (
    <Svg width={RS(40)} height={RS(40)} viewBox="0 0 24 24">
        <Path
            d="m19.4 13.5 1.4 1.1-1.4 2.4-1.7-.6a7.8 7.8 0 0 1-1.5.9l-.3 1.8h-2.8l-.3-1.8a7.8 7.8 0 0 1-1.5-.9l-1.7.6-1.4-2.4 1.4-1.1a7 7 0 0 1 0-1.8l-1.4-1.1 1.4-2.4 1.7.6a7.8 7.8 0 0 1 1.5-.9l.3-1.8h2.8l.3 1.8a7.8 7.8 0 0 1 1.5.9l1.7-.6 1.4 2.4-1.4 1.1a7 7 0 0 1 0 1.8ZM14.5 10a2.6 2.6 0 1 0 0 5.2 2.6 2.6 0 0 0 0-5.2Z"
            transform="translate(-2 -2)"
            fill="none"
            stroke={NAVY}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

const VerifiedMark = () => (
    <Svg width={RS(17)} height={RS(17)} viewBox="0 0 24 24">
        <Circle cx="12" cy="12" r="10" fill="#108A81" />
        <Path
            d="m7 12.5 3.2 3.2L17.5 8"
            fill="none"
            stroke={Colors.white}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

const StarIcon = ({ size = 21 }: { size?: number }) => (
    <Svg width={RS(size)} height={RS(size)} viewBox="0 0 24 24">
        <Path
            d="m12 2 3 6.2 6.8 1-4.9 4.8 1.2 6.8-6.1-3.2-6.1 3.2 1.2-6.8L2.2 9.2l6.8-1L12 2Z"
            fill="#F28C28"
        />
    </Svg>
);

const ProviderProfileScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<ProviderProfileStackParamList>>();
    const profile = DUMMY_PROFILE;

    const openSettings = () => navigation.navigate('ProviderSettings', { profile: profile ?? undefined });
    const goToJobs = () => {
        navigation.getParent<BottomTabNavigationProp<ProviderTabParamList>>()?.navigate('Jobs');
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
            <View style={styles.header}>
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Back to jobs"
                    onPress={goToJobs}
                    style={({ pressed }) => [styles.headerButton, pressed && styles.pressed]}
                >
                    <ChevronIcon />
                </Pressable>
                <AppText style={styles.headerTitle}>Profile</AppText>
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Open settings"
                    onPress={openSettings}
                    style={({ pressed }) => [styles.headerButton, pressed && styles.pressed]}
                >
                    <SettingsIcon />
                </Pressable>
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <>
                        <View style={styles.profileSummary}>
                            <View style={styles.avatarFrame}>
                                <Image
                                    source={FALLBACK_AVATAR}
                                    style={styles.avatar}
                                    resizeMode="cover"
                                    accessibilityLabel={`${PROFILE_NAME} profile photo`}
                                />
                            </View>
                            <View style={styles.verifiedBadge}>
                                <VerifiedMark />
                                <AppText style={styles.verifiedText}>Verified</AppText>
                            </View>
                            <AppText style={styles.name} numberOfLines={1}>{PROFILE_NAME}</AppText>
                            <AppText style={styles.profession} numberOfLines={1}>{PROFESSION}</AppText>
                            <View style={styles.rating}>
                                <StarIcon size={22} />
                                <AppText style={styles.ratingValue}>4.8</AppText>
                                <AppText style={styles.reviewCount}>(124 reviews)</AppText>
                            </View>
                        </View>

                        <View style={styles.statsCard}>
                            <View style={styles.stat}>
                                <AppText style={styles.statValue}>5+</AppText>
                                <AppText style={styles.statLabel}>Years Exp.</AppText>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.stat}>
                                <AppText style={styles.statValue}>120+</AppText>
                                <AppText style={styles.statLabel}>Jobs Done</AppText>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.stat}>
                                <AppText style={styles.statValue}>98%</AppText>
                                <AppText style={styles.statLabel}>On-Time</AppText>
                            </View>
                        </View>

                        <View style={styles.section}>
                            <AppText style={styles.sectionTitle}>Skills &amp; Services</AppText>
                            <View style={styles.skills}>
                                {profile.categories.map(({ id, name }) => (
                                    <ProviderSkillChip key={id} label={name} />
                                ))}
                            </View>
                        </View>

                        <View style={styles.section}>
                            <View style={styles.historyHeading}>
                                <AppText style={styles.sectionTitle}>Service History</AppText>
                                <Pressable
                                    accessibilityRole="button"
                                    onPress={() => showInfoToast('Service History', 'No service history yet.')}
                                    hitSlop={8}
                                >
                                    <AppText style={styles.viewAll}>View All</AppText>
                                </Pressable>
                            </View>
                            <View style={styles.historyCard}>
                                <AppText style={styles.emptyHistoryTitle}>No service history yet</AppText>
                                <AppText style={styles.emptyHistoryMessage}>
                                    Completed jobs will appear here.
                                </AppText>
                            </View>
                        </View>
                </>
            </ScrollView>

            <View style={styles.footer}>
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Edit Profile"
                    onPress={openSettings}
                    style={({ pressed }) => [styles.editButton, pressed && styles.pressed]}
                >
                    <AppText style={styles.editText}>Edit Profile</AppText>
                </Pressable>
            </View>
        </SafeAreaView>
    );
};

export default ProviderProfileScreen;

const NAVY = '#172B4D';
const DEEP_BLUE = '#2D466F';

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        height: RS(40),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: RS(22),
    },
    headerTitle: {
        position: 'absolute',
        left: RS(70),
        right: RS(70),
        color: NAVY,
        fontSize: FontSize.pageTitle,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    headerButton: {
        width: RS(42),
        height: RS(42),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: Radii.pill,
    },
    content: {
        flexGrow: 1,
        paddingHorizontal: RS(22),
        paddingTop: RS(30),
        paddingBottom: RS(12),
    },
    profileSummary: {
        alignItems: 'center',
        paddingTop: RS(1),
        paddingBottom: RS(17),
    },
    avatarFrame: {
        width: RS(120),
        height: RS(120),
        borderWidth: RS(3),
        borderColor: '#D2DCEB',
        borderRadius: Radii.pill,
        padding: RS(3),
        backgroundColor: Colors.white,
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: Radii.pill,
        backgroundColor: '#E8EEF6',
    },
    verifiedBadge: {
        minHeight: RS(28),
        flexDirection: 'row',
        alignItems: 'center',
        gap: RS(4),
        borderRadius: Radii.pill,
        backgroundColor: '#DDF4EF',
        paddingHorizontal: RS(9),
        paddingVertical: RS(4),
        marginTop: RS(-21),
        marginLeft: RS(73),
    },
    verifiedText: {
        color: '#168267',
        fontSize: RF(12),
        fontWeight: '500',
    },
    name: {
        maxWidth: '100%',
        color: NAVY,
        fontSize: RF(23),
        lineHeight: RS(31),
        fontWeight: '700',
        textAlign: 'center',
        marginTop: RS(5),
    },
    profession: {
        color: NAVY,
        fontSize: RF(17),
        lineHeight: RS(24),
        textAlign: 'center',
     },
    rating: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: RS(6),
        marginTop: RS(4),
    },
    ratingValue: {
        color: NAVY,
        fontSize: RF(16),
        lineHeight: RS(22),
        fontWeight: '700',
    },
    reviewCount: {
        color: NAVY,
        fontSize: RF(15),
        lineHeight: RS(22),
    },
    statsCard: {
        minHeight: RS(66),
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#C9D7E8',
        borderRadius: RS(13),
        backgroundColor: '#F0F4FA',
        paddingHorizontal: RS(5),
    },
    stat: {
        flex: 1,
        minWidth: 0,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: RS(3),
        paddingVertical: RS(7),
    },
    statValue: {
        color: NAVY,
        fontSize: RF(19),
        lineHeight: RS(25),
        fontWeight: '700',
    },
    statLabel: {
        color: NAVY,
        fontSize: RF(12),
        lineHeight: RS(17),
        textAlign: 'center',
        marginTop: RS(2),
    },
    statDivider: {
        width: StyleSheet.hairlineWidth,
        height: RS(40),
        backgroundColor: '#C4D0E1',
    },
    section: {
        marginTop: RS(18),
    },
    sectionTitle: {
        color: NAVY,
        fontSize: RF(17),
        lineHeight: RS(24),
        fontWeight: '700',
        marginBottom: RS(9),
    },
    skills: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: RS(7),
        paddingHorizontal: RS(2),
    },
    historyHeading: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    viewAll: {
        color: NAVY,
        fontSize: RF(13),
        lineHeight: RS(20),
        marginBottom: RS(9),
    },
    historyCard: {
        minHeight: RS(115),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#D5DFEC',
        borderRadius: RS(17),
        backgroundColor: Colors.white,
        paddingHorizontal: RS(15),
        paddingVertical: RS(14),
    },
    emptyHistoryTitle: {
        color: NAVY,
        fontSize: RF(15),
        lineHeight: RS(22),
        fontWeight: '600',
        textAlign: 'center',
    },
    emptyHistoryMessage: {
        color: Colors.textSecondary,
        fontSize: RF(13),
        lineHeight: RS(19),
        textAlign: 'center',
        marginTop: RS(3),
    },
    footer: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#D5DFEC',
        backgroundColor: Colors.background,
        paddingHorizontal: RS(22),
        paddingTop: RS(6),
        paddingBottom: RS(8),
    },
    editButton: {
        minHeight: RS(48),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: Radii.pill,
        backgroundColor: DEEP_BLUE,
    },
    editText: {
        color: Colors.white,
        fontSize: RF(16),
        lineHeight: RS(23),
        fontWeight: '600',
    },
    pressed: {
        opacity: 0.78,
    },
});
