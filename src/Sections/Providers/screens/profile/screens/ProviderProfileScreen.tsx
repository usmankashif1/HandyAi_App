import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
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
import { Radii } from '../../../../../core/theme/designTokens';
import { RS } from '../../../../../core/utils/responsive';
import { showInfoToast } from '../../../../../core/utils/toast';
import { useAppSelector } from '../../../../../store/hooks';
import type { ProviderTabParamList } from '../../../navigation/provider.types';
import ProviderSkillChip from '../components/ProviderSkillChip';
import type { ProviderProfileStackParamList } from '../profile.types';
import { fetchProviderProfile, type ProviderProfile } from '../providerProfile.api';

const PROFILE_NAME = 'Ahmed Khan';
const PROFESSION = 'Professional Handyman';
const SKILLS = ['Handyman', 'Electrical', 'Plumbing', 'Furniture Assembly', 'General Repairs'];
const FALLBACK_AVATAR = require('../../../../../assets/images/handyMan.jpg');

const ChevronIcon = ({ direction = 'left' }: { direction?: 'left' | 'right' }) => (
    <Svg width={RS(25)} height={RS(25)} viewBox="0 0 24 24">
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
    <Svg width={RS(27)} height={RS(27)} viewBox="0 0 24 24">
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
    const { token } = useAppSelector((state) => state.auth);
    const [profile, setProfile] = useState<ProviderProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string>();
    const [retryCount, setRetryCount] = useState(0);
    const [hasPhotoError, setHasPhotoError] = useState(false);
    const profilePhotoUrl = profile?.documents.find(
        (document) => document.type === 'PROFILE_PHOTO',
    )?.fileUrl;

    useEffect(() => {
        const controller = new AbortController();
        void fetchProviderProfile(token ?? '', controller.signal)
            .then((result) => {
                setProfile(result);
                setHasPhotoError(false);
            })
            .catch((requestError: unknown) => {
                if (!controller.signal.aborted) {
                    console.error('Unable to load provider profile:', requestError);
                    setError(
                        requestError instanceof Error
                            ? requestError.message
                            : 'Could not load your profile. Please try again.',
                    );
                }
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            });
        return () => controller.abort();
    }, [retryCount, token]);

    const retryProfileLoad = useCallback(() => {
        setIsLoading(true);
        setError(undefined);
        setRetryCount((count) => count + 1);
    }, []);

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
                {isLoading && !profile ? (
                    <View style={styles.stateContainer}>
                        <ActivityIndicator size="large" color={Colors.primaryDark} />
                        <AppText style={styles.stateMessage}>Loading your profile…</AppText>
                    </View>
                ) : error && !profile ? (
                    <View style={styles.stateContainer} accessibilityRole="alert">
                        <AppText style={styles.stateTitle}>Profile unavailable</AppText>
                        <AppText style={styles.stateMessage}>{error}</AppText>
                        <Pressable
                            accessibilityRole="button"
                            onPress={retryProfileLoad}
                            style={({ pressed }) => [styles.retryButton, pressed && styles.pressed]}
                        >
                            <AppText style={styles.retryText}>Try Again</AppText>
                        </Pressable>
                    </View>
                ) : profile ? (
                    <>
                        {error ? (
                            <Pressable
                                accessibilityRole="button"
                                onPress={retryProfileLoad}
                                style={styles.inlineError}
                            >
                                <AppText style={styles.inlineErrorText}>{error}  Tap to retry.</AppText>
                            </Pressable>
                        ) : null}

                        <View style={styles.profileSummary}>
                            <View style={styles.avatarFrame}>
                                <Image
                                    source={
                                        profilePhotoUrl && !hasPhotoError
                                            ? { uri: profilePhotoUrl }
                                            : FALLBACK_AVATAR
                                    }
                                    onError={() => setHasPhotoError(true)}
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
                                {SKILLS.map((skill) => <ProviderSkillChip key={skill} label={skill} />)}
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
                ) : null}
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
        paddingTop: RS(3),
        paddingBottom: RS(12),
    },
    stateContainer: {
        minHeight: RS(400),
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: RS(12),
    },
    stateTitle: {
        color: NAVY,
        fontSize: RS(21),
        fontWeight: '700',
        textAlign: 'center',
    },
    stateMessage: {
        color: Colors.textSecondary,
        fontSize: RS(15),
        textAlign: 'center',
        marginTop: RS(10),
    },
    retryButton: {
        minHeight: RS(46),
        minWidth: RS(130),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: Radii.pill,
        backgroundColor: DEEP_BLUE,
        marginTop: RS(18),
        paddingHorizontal: RS(18),
    },
    retryText: {
        color: Colors.white,
        fontSize: RS(15),
        fontWeight: '600',
    },
    inlineError: {
        borderRadius: RS(12),
        backgroundColor: Colors.failedLight,
        padding: RS(12),
        marginBottom: RS(10),
    },
    inlineErrorText: {
        color: Colors.failed,
        fontSize: RS(13),
    },
    profileSummary: {
        alignItems: 'center',
        paddingTop: RS(1),
        paddingBottom: RS(17),
    },
    avatarFrame: {
        width: RS(90),
        height: RS(90),
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
        fontSize: RS(13),
        fontWeight: '500',
    },
    name: {
        maxWidth: '100%',
        color: NAVY,
        fontSize: RS(23),
        lineHeight: RS(31),
        fontWeight: '700',
        textAlign: 'center',
        marginTop: RS(15),
    },
    profession: {
        color: NAVY,
        fontSize: RS(17),
        lineHeight: RS(24),
        textAlign: 'center',
        marginTop: RS(2),
    },
    rating: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: RS(6),
        marginTop: RS(4),
    },
    ratingValue: {
        color: NAVY,
        fontSize: RS(16),
        lineHeight: RS(22),
        fontWeight: '700',
    },
    reviewCount: {
        color: NAVY,
        fontSize: RS(15),
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
        fontSize: RS(19),
        lineHeight: RS(25),
        fontWeight: '700',
    },
    statLabel: {
        color: NAVY,
        fontSize: RS(12),
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
        fontSize: RS(17),
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
        fontSize: RS(13),
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
        fontSize: RS(15),
        lineHeight: RS(22),
        fontWeight: '600',
        textAlign: 'center',
    },
    emptyHistoryMessage: {
        color: Colors.textSecondary,
        fontSize: RS(13),
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
        fontSize: RS(16),
        lineHeight: RS(23),
        fontWeight: '600',
    },
    pressed: {
        opacity: 0.78,
    },
});
