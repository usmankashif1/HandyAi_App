import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppText from '../../../components/AppText';
import Container from '../../../components/Container';
import { Colors } from '../../../core/theme/colors';
import { FontSize } from '../../../core/theme/designTokens';
import { RS } from '../../../core/utils/responsive';
import { showErrorToast } from '../../../core/utils/toast';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { signOut } from '../../../store/slices/authSlice';
import { clearProfile, loadUserProfile } from '../../../store/slices/profileSlice';
import ProfileIcon from '../components/ProfileIcon';
import ProfileSettingRow from '../components/ProfileSettingRow';
import type { ProfileStackParamList } from '../profile.types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'ProfileHome'>;

const ProfileScreen = ({ navigation }: Props) => {
    const dispatch = useAppDispatch();
    const { token, account } = useAppSelector((state) => state.auth);
    const { profile, isLoading, error } = useAppSelector((state) => state.profile);
    const { width } = useWindowDimensions();
    const compact = width < 380;
    const avatarSize = width < 350 ? 80 : compact ? 96 : 112;

    useEffect(() => {
        if (!token) {
            dispatch(clearProfile());
            return undefined;
        }

        const request = dispatch(loadUserProfile({ accessToken: token }));
        return () => request.abort();
    }, [dispatch, token]);

    const displayName = profile?.fullName ?? account?.fullName ?? 'Handy AI user';
    const initials = displayName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('');
    const retryProfileLoad = () => {
        if (token) {
            void dispatch(loadUserProfile({ accessToken: token }));
        }
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
            <ScrollView
                contentContainerStyle={[styles.content, compact && styles.compactContent]}
                showsVerticalScrollIndicator={false}
            >
                <AppText style={[styles.headerTitle, compact && styles.compactHeaderTitle]}>
                    Account Settings
                </AppText>

                {error ? (
                    <View style={styles.errorCard} accessibilityRole="alert">
                        <AppText style={styles.errorText}>{error}</AppText>
                        <TouchableOpacity
                            onPress={retryProfileLoad}
                            accessibilityRole="button"
                            accessibilityLabel="Retry loading profile"
                            style={styles.retryButton}
                        >
                            <AppText style={styles.retryText}>Try again</AppText>
                        </TouchableOpacity>
                    </View>
                ) : null}

                <Container style={[styles.profileCard, compact && styles.compactProfileCard]}>
                    {profile?.photoUrl ? (
                        <Image
                            source={{ uri: profile.photoUrl }}
                            style={{ width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }}
                            accessibilityLabel="Profile photo"
                        />
                    ) : (
                        <View
                            style={[
                                styles.avatarPlaceholder,
                                { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 },
                            ]}
                            accessibilityLabel="Profile photo placeholder"
                        >
                            <AppText style={styles.avatarInitials}>{initials}</AppText>
                        </View>
                    )}
                    <Container style={styles.profileInfo}>
                        {isLoading && !profile ? (
                            <View style={styles.loadingState}>
                                <ActivityIndicator color={Colors.primaryDark} />
                                <AppText style={styles.loadingText}>Loading profile…</AppText>
                            </View>
                        ) : (
                            <>
                                <AppText style={[styles.name, compact && styles.compactName]} numberOfLines={1}>
                                    {displayName}
                                </AppText>
                                <AppText style={[styles.email, compact && styles.compactEmail]} numberOfLines={1}>
                                    {profile?.email ?? account?.email ?? ''}
                                </AppText>
                            </>
                        )}
                        <TouchableOpacity
                            style={styles.editProfile}
                            onPress={() => navigation.navigate('UpdateProfile')}
                            accessibilityRole="button"
                            accessibilityLabel="Edit profile"
                        >
                            <ProfileIcon name="edit" size={RS(22)} />
                            <AppText style={[styles.editProfileText, compact && styles.compactEditProfileText]}>
                                Edit Profile
                            </AppText>
                        </TouchableOpacity>
                    </Container>
                </Container>

                {/* <View style={styles.addressCard}>   
                    <AppText style={styles.addressTitle}>Address</AppText>
                    <AppText style={styles.addressValue}>
                        {profile?.address?.trim() || 'No address added'}
                    </AppText>
                    <AppText style={styles.postcodeValue}>
                        {profile?.postcode?.trim() || 'No postcode added'}
                    </AppText>
                </View> */}

                <Container style={styles.settingsCard}>
                    <ProfileSettingRow
                        icon="notes"
                        title="Household Notes"
                        detail={profile?.householdNotes?.trim() || 'No household notes added'}
                        compact={compact}
                    />
                    <Container style={styles.divider} />
                    <ProfileSettingRow
                        icon="payment"
                        title="Saved Payment Methods"
                        detail="Visa •••• 4242"
                        compact={compact}
                    />
                    <Container style={styles.divider} />
                    <ProfileSettingRow
                        icon="support"
                        title="Support"
                        detail={'Email Support Team'}
                        compact={compact}
                    />
                </Container>

                <TouchableOpacity
                    style={[styles.logoutCard, compact && styles.compactLogoutCard]}
                    onPress={() => Alert.alert('Log out', 'Are you sure you want to log out?', [
                        { text: 'Cancel', style: 'cancel' },
                        {
                            text: 'Log Out',
                            style: 'destructive',
                            onPress: () => {
                                void dispatch(signOut()).unwrap().catch((error: unknown) => {
                                    console.error('Unable to log out:', error);
                                    showErrorToast('Could not log out', 'Please try again.');
                                });
                            },
                        },
                    ])}
                    accessibilityRole="button"
                    accessibilityLabel="Log out"
                >
                    <ProfileIcon name="logout" size={RS(30)} />
                    <AppText style={[styles.logoutText, compact && styles.compactLogoutText]}>Log Out</AppText>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        flexGrow: 1,
        gap: RS(24),
        paddingHorizontal: RS(20),
        paddingTop: RS(16),
        paddingBottom: RS(24),
    },
    compactContent: {
        gap: RS(18),
        paddingHorizontal: RS(20),
        paddingTop: RS(12),
    },
    headerTitle: {
        marginBottom: RS(10),
        color: '#171923',
        fontSize: FontSize.heading,
        fontWeight: '700',
        letterSpacing: RS(-0.5),
    },
    compactHeaderTitle: {
        fontSize: FontSize.heading,

    },
    profileCard: {
        minHeight: RS(176),
        flexDirection: 'row',
        alignItems: 'center',
        gap: RS(16),
        padding: RS(18),
        borderRadius: RS(22),
        backgroundColor: Colors.surface,
        shadowColor: '#30343A',
        shadowOpacity: 0.08,
        shadowRadius: RS(16),
        shadowOffset: { width: RS(0), height: RS(7) },
        elevation: 3,
    },
    compactProfileCard: {
        minHeight: RS(146),
        gap: RS(12),
        padding: RS(14),
    },
    avatarPlaceholder: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primaryLight,
    },
    avatarInitials: {
        color: Colors.primaryDark,
        fontSize: FontSize.heading,
        fontWeight: '700',
    },
    profileInfo: {
        flex: 1,
        minWidth: RS(0),
        gap: RS(7),
    },
    loadingState: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: RS(8),
    },
    loadingText: {
        color: Colors.textSecondary,
        fontSize: FontSize.body,
    },
    name: {
        color: '#17191C',
        fontSize: FontSize.subheading,
        fontWeight: '700',
    },
    compactName: {
        fontSize: FontSize.bodyLarge,
    },
    email: {
        color: '#17191C',
        fontSize: FontSize.body,
    },
    compactEmail: {
        fontSize: FontSize.caption,
    },
    editProfile: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: RS(8),
        marginTop: RS(5),
    },
    editProfileText: {
        color: '#17191C',
        fontSize: FontSize.bodyLarge,
        fontWeight: '600',
    },
    compactEditProfileText: {
        fontSize: FontSize.body,
    },
    settingsCard: {
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#CFD2D6',
        borderRadius: RS(20),
        backgroundColor: Colors.surface,
    },
    addressCard: {
        gap: RS(6),
        padding: RS(18),
        borderWidth: 1,
        borderColor: '#CFD2D6',
        borderRadius: RS(20),
        backgroundColor: Colors.surface,
    },
    addressTitle: {
        color: '#17191C',
        fontSize: FontSize.bodyLarge,
        fontWeight: '600',
    },
    addressValue: {
        color: '#17191C',
        fontSize: FontSize.body,
    },
    postcodeValue: {
        color: Colors.textSecondary,
        fontSize: FontSize.bodySmall,
    },
    errorCard: {
        gap: RS(10),
        padding: RS(16),
        borderRadius: RS(16),
        backgroundColor: Colors.failedLight,
    },
    errorText: {
        color: Colors.failed,
        fontSize: FontSize.body,
    },
    retryButton: {
        alignSelf: 'flex-start',
        minHeight: RS(40),
        justifyContent: 'center',
        paddingHorizontal: RS(14),
        borderRadius: RS(12),
        backgroundColor: Colors.surface,
    },
    retryText: {
        color: Colors.primaryDark,
        fontSize: FontSize.body,
        fontWeight: '600',
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#D5D7DA',
    },
    logoutCard: {
        minHeight: RS(82),
        flexDirection: 'row',
        alignItems: 'center',
        gap: RS(18),
        paddingHorizontal: RS(22),
        borderWidth: 1,
        borderColor: '#CFD2D6',
        borderRadius: RS(20),
        backgroundColor: Colors.surface,
    },
    compactLogoutCard: {
        minHeight: RS(70),
        gap: RS(14),
        paddingHorizontal: RS(16),
    },
    logoutText: {
        color: '#17191C',
        fontSize: FontSize.bodyLarge,
        fontWeight: '600',
    },
    compactLogoutText: {
        fontSize: FontSize.body,
    },
});
