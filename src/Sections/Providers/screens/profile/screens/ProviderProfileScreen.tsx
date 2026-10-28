import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
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
import Svg, { Path } from 'react-native-svg';
import AppText from '../../../../../components/AppText';
import { Colors } from '../../../../../core/theme/colors';
import { FontSize, Radii } from '../../../../../core/theme/designTokens';
import { RF, RS } from '../../../../../core/utils/responsive';
import { showErrorToast } from '../../../../../core/utils/toast';
import { useAppDispatch, useAppSelector } from '../../../../../store/hooks';
import { setProviderProfile } from '../../../../../store/slices/providerProfileSlice';
import type { ProviderTabParamList } from '../../../navigation/provider.types';
import ProviderSkillChip from '../components/ProviderSkillChip';
import type { ProviderProfileStackParamList } from '../profile.types';
import { fetchProviderProfile, type ProviderProfile } from '../providerProfile.api';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const formatTime = (time: string): string => {
    const [hourText, minuteText] = time.split(':');
    const hour = Number(hourText);
    if (!Number.isFinite(hour) || !minuteText) {
        return time;
    }

    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minuteText} ${period}`;
};

const formatStatus = (status: string): string => (
    status.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
);

const ChevronIcon = () => (
    <Svg width={RS(30)} height={RS(30)} viewBox="0 0 24 24">
        <Path
            d="m15 18-6-6 6-6"
            fill="none"
            stroke="#172B4D"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

const SettingsIcon = () => (
    <Svg width={RS(30)} height={RS(30)} viewBox="0 0 24 24">
        <Path
            d="m19.4 13.5 1.4 1.1-1.4 2.4-1.7-.6a7.8 7.8 0 0 1-1.5.9l-.3 1.8h-2.8l-.3-1.8a7.8 7.8 0 0 1-1.5-.9l-1.7.6-1.4-2.4 1.4-1.1a7 7 0 0 1 0-1.8l-1.4-1.1 1.4-2.4 1.7.6a7.8 7.8 0 0 1 1.5-.9l.3-1.8h2.8l.3 1.8a7.8 7.8 0 0 1 1.5.9l1.7-.6 1.4 2.4-1.4 1.1a7 7 0 0 1 0 1.8ZM14.5 10a2.6 2.6 0 1 0 0 5.2 2.6 2.6 0 0 0 0-5.2Z"
            transform="translate(-2 -2)"
            fill="none"
            stroke="#172B4D"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

const ProfileSection = ({ title, children }: { title: string; children: ReactNode }) => (
    <View style={styles.section}>
        <AppText style={styles.sectionTitle}>{title}</AppText>
        <View style={styles.infoCard}>{children}</View>
    </View>
);

const ProviderProfileScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<ProviderProfileStackParamList>>();
    const dispatch = useAppDispatch();
    const { token } = useAppSelector((state) => state.auth);
    const [loadedProfile, setLoadedProfile] = useState<ProviderProfile | null>(null);
    const cachedProfile = useAppSelector((state) => state.providerProfile.profile);
    const profile = cachedProfile ?? loadedProfile;
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string>();
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        const controller = new AbortController();

        void fetchProviderProfile(token ?? '', controller.signal)
            .then((loaded) => {
                setLoadedProfile(loaded);
                dispatch(setProviderProfile(loaded));
            })
            .catch((error: unknown) => {
                if (!controller.signal.aborted) {
                    setLoadedProfile(null);
                    setLoadError(
                        error instanceof Error
                            ? error.message
                            : 'Could not load your provider profile. Please try again.',
                    );
                }
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            });

        return () => controller.abort();
    }, [dispatch, retryCount, token]);

    const openSettings = () => {
        if (!profile) {
            showErrorToast('Profile unavailable', 'Load your provider profile before opening settings.');
            return;
        }
        navigation.navigate('ProviderSettings', { profile });
    };
    const goToJobs = () => {
        navigation.getParent<BottomTabNavigationProp<ProviderTabParamList>>()?.navigate('Jobs');
    };

    const profilePhoto = profile?.user.photoUrl
        ?? profile?.documents.find((document) => document.type === 'PROFILE_PHOTO')?.fileUrl;

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

            {isLoading ? (
                <View style={styles.stateContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <AppText style={styles.stateText}>Loading provider profile...</AppText>
                </View>
            ) : loadError ? (
                <View style={styles.stateContainer}>
                    <AppText style={styles.errorTitle}>Could not load profile</AppText>
                    <AppText style={styles.stateText}>{loadError}</AppText>
                    <Pressable
                        accessibilityRole="button"
                        onPress={() => {
                            setIsLoading(true);
                            setLoadError(undefined);
                            setRetryCount((current) => current + 1);
                        }}
                        style={({ pressed }) => [styles.retryButton, pressed && styles.pressed]}
                    >
                        <AppText style={styles.retryText}>Try Again</AppText>
                    </Pressable>
                </View>
            ) : profile ? (
                <>
                    <ScrollView
                        contentContainerStyle={styles.content}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.profileSummary}>
                            <View style={styles.avatarFrame}>
                                {profilePhoto ? (
                                    <Image
                                        source={{ uri: profilePhoto }}
                                        style={styles.avatar}
                                        resizeMode="cover"
                                        accessibilityLabel="Provider profile photo"
                                    />
                                ) : (
                                    <View style={styles.avatarPlaceholder}>
                                        <AppText style={styles.avatarInitial}>P</AppText>
                                    </View>
                                )}
                            </View>
                            <View style={styles.statusBadge}>
                                <AppText style={styles.statusText}>{formatStatus(profile.status)}</AppText>
                            </View>
                            <AppText style={styles.name} numberOfLines={2}>
                                {profile.user.fullName}
                            </AppText>
                            <AppText style={styles.email} numberOfLines={1}>
                                {profile.user.email}
                            </AppText>
                        </View>

                        <ProfileSection title="Personal Information">
                            <AppText style={styles.infoLabel}>Full name</AppText>
                            <AppText style={styles.infoValue}>{profile.user.fullName}</AppText>
                            <View style={styles.divider} />
                            <AppText style={styles.infoLabel}>Email</AppText>
                            <AppText style={styles.infoValue}>{profile.user.email}</AppText>
                            <View style={styles.divider} />
                            <AppText style={styles.infoLabel}>Address</AppText>
                            <AppText style={styles.infoValue}>{profile.user.address || 'Not provided'}</AppText>
                            <View style={styles.divider} />
                            <AppText style={styles.infoLabel}>Postcode</AppText>
                            <AppText style={styles.infoValue}>{profile.user.postcode || 'Not provided'}</AppText>
                            <View style={styles.divider} />
                            <AppText style={styles.infoLabel}>About</AppText>
                            <AppText style={styles.infoValue}>{profile.bio}</AppText>
                            <View style={styles.divider} />
                            <AppText style={styles.infoLabel}>Profile status</AppText>
                            <AppText style={styles.infoValue}>{formatStatus(profile.status)}</AppText>
                            <View style={styles.divider} />
                            <AppText style={styles.infoLabel}>User ID</AppText>
                            <AppText style={styles.infoValue}>{profile.userId}</AppText>
                            {profile.rejectionReason ? (
                                <>
                                    <View style={styles.divider} />
                                    <AppText style={styles.infoLabel}>Review message</AppText>
                                    <AppText style={styles.infoValue}>{profile.rejectionReason}</AppText>
                                </>
                            ) : null}
                        </ProfileSection>

                        <ProfileSection title="Services">
                            {profile.categories.length ? (
                                <View style={styles.skills}>
                                    {profile.categories.map(({ id, name }) => (
                                        <ProviderSkillChip key={id} label={name} />
                                    ))}
                                </View>
                            ) : (
                                <AppText style={styles.emptyText}>No service categories added.</AppText>
                            )}
                        </ProfileSection>

                        <ProfileSection title="Service Areas">
                            <AppText style={styles.infoValue}>
                                {profile.postcodeCoverage.length
                                    ? profile.postcodeCoverage.join(', ')
                                    : 'No service areas added.'}
                            </AppText>
                        </ProfileSection>

                        <ProfileSection title="Availability">
                            {profile.availability.length ? profile.availability.map((item) => (
                                <View key={item.id} style={styles.listRow}>
                                    <AppText style={styles.infoValue}>
                                        {DAY_NAMES[item.dayOfWeek] ?? `Day ${item.dayOfWeek}`}
                                    </AppText>
                                    <AppText style={styles.infoValue}>
                                        {formatTime(item.startTime)} - {formatTime(item.endTime)}
                                    </AppText>
                                </View>
                            )) : (
                                <AppText style={styles.emptyText}>No availability set.</AppText>
                            )}
                        </ProfileSection>

                        <ProfileSection title="Documents">
                            {profile.documents.length ? profile.documents.map((document) => (
                                <View key={document.id} style={styles.documentRow}>
                                    <View style={styles.documentText}>
                                        <AppText style={styles.infoValue}>
                                            {formatStatus(document.type)}
                                        </AppText>
                                        <AppText style={styles.infoLabel}>
                                            Submitted {new Date(document.createdAt).toLocaleDateString()}
                                        </AppText>
                                    </View>
                                    <AppText style={styles.documentStatus}>
                                        {formatStatus(document.status)}
                                    </AppText>
                                </View>
                            )) : (
                                <AppText style={styles.emptyText}>No documents submitted.</AppText>
                            )}
                        </ProfileSection>
                    </ScrollView>

                    <View style={styles.footer}>
                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel="Open provider settings"
                            onPress={openSettings}
                            style={({ pressed }) => [styles.editButton, pressed && styles.pressed]}
                        >
                            <AppText style={styles.editText}>Provider Settings</AppText>
                        </Pressable>
                    </View>
                </>
            ) : null}
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
        height: RS(48),
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
        paddingTop: RS(18),
        paddingBottom: RS(24),
    },
    profileSummary: {
        alignItems: 'center',
        paddingBottom: RS(8),
    },
    avatarFrame: {
        width: RS(112),
        height: RS(112),
        overflow: 'hidden',
        borderWidth: RS(3),
        borderColor: '#D2DCEB',
        borderRadius: Radii.pill,
        backgroundColor: Colors.white,
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: Radii.pill,
        backgroundColor: '#E8EEF6',
    },
    avatarPlaceholder: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E8EEF6',
    },
    avatarInitial: {
        color: NAVY,
        fontSize: RF(40),
        fontWeight: '700',
    },
    statusBadge: {
        minHeight: RS(28),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: Radii.pill,
        backgroundColor: '#E7ECF6',
        paddingHorizontal: RS(12),
        marginTop: RS(-12),
        marginLeft: RS(66),
    },
    statusText: {
        color: DEEP_BLUE,
        fontSize: RF(12),
        fontWeight: '600',
    },
    name: {
        maxWidth: '100%',
        color: NAVY,
        fontSize: RF(23),
        lineHeight: RS(31),
        fontWeight: '700',
        textAlign: 'center',
        marginTop: RS(8),
    },
    email: {
        color: Colors.textSecondary,
        fontSize: RF(14),
        lineHeight: RS(21),
        textAlign: 'center',
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
    infoCard: {
        borderWidth: 1,
        borderColor: '#D5DFEC',
        borderRadius: RS(17),
        backgroundColor: Colors.white,
        paddingHorizontal: RS(15),
        paddingVertical: RS(14),
        gap: RS(4),
    },
    infoLabel: {
        color: Colors.textSecondary,
        fontSize: RF(12),
        lineHeight: RS(18),
    },
    infoValue: {
        color: NAVY,
        fontSize: RF(14),
        lineHeight: RS(21),
        fontWeight: '500',
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#D5DFEC',
        marginVertical: RS(7),
    },
    skills: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: RS(7),
    },
    listRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: RS(12),
        paddingVertical: RS(5),
    },
    documentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: RS(10),
        paddingVertical: RS(5),
    },
    documentText: {
        flex: 1,
        gap: RS(2),
    },
    documentStatus: {
        color: DEEP_BLUE,
        fontSize: RF(12),
        lineHeight: RS(18),
        fontWeight: '600',
    },
    emptyText: {
        color: Colors.textSecondary,
        fontSize: RF(14),
        lineHeight: RS(21),
    },
    footer: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#D5DFEC',
        backgroundColor: Colors.background,
        paddingHorizontal: RS(22),
        paddingTop: RS(8),
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
    stateContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: RS(28),
        gap: RS(12),
    },
    stateText: {
        color: Colors.textSecondary,
        fontSize: RF(14),
        lineHeight: RS(21),
        textAlign: 'center',
    },
    errorTitle: {
        color: NAVY,
        fontSize: RF(18),
        lineHeight: RS(24),
        fontWeight: '700',
        textAlign: 'center',
    },
    retryButton: {
        minHeight: RS(44),
        justifyContent: 'center',
        borderRadius: Radii.pill,
        backgroundColor: DEEP_BLUE,
        paddingHorizontal: RS(24),
    },
    retryText: {
        color: Colors.white,
        fontSize: RF(14),
        fontWeight: '600',
    },
    pressed: {
        opacity: 0.78,
    },
});
