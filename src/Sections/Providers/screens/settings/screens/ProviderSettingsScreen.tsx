import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Svg, { Path } from 'react-native-svg';
import AppText from '../../../../../components/AppText';
import { Colors } from '../../../../../core/theme/colors';
import { showErrorToast, showInfoToast } from '../../../../../core/utils/toast';
import { RF, RS } from '../../../../../core/utils/responsive';
import { useAppDispatch, useAppSelector } from '../../../../../store/hooks';
import { signOut } from '../../../../../store/slices/authSlice';
import { setProviderProfile } from '../../../../../store/slices/providerProfileSlice';
import type { ProviderProfileStackParamList } from '../../profile/profile.types';
import { fetchProviderProfile, type ProviderProfile } from '../../profile/providerProfile.api';
import ProviderSettingRow, { type ProviderSettingIcon } from '../components/ProviderSettingRow';

type Props = NativeStackScreenProps<ProviderProfileStackParamList, 'ProviderSettings'>;

const SETTINGS: {
    icon: ProviderSettingIcon;
    title: string;
    detail: string;
}[] = [
        { icon: 'personal', title: 'Personal Information', detail: 'View your personal details' },
        { icon: 'areas', title: 'Service Areas', detail: 'View your covered postcodes' },
        { icon: 'availability', title: 'Availability', detail: 'View your working days and hours' },
        { icon: 'documents', title: 'Documents', detail: 'View your submitted documents' },
        { icon: 'payment', title: 'Payment Details', detail: 'View your Stripe account status' },
    ];

const ProviderSettingsScreen = ({ navigation, route }: Props) => {
    const dispatch = useAppDispatch();
    const routeProfile = route.params?.profile;
    const { token } = useAppSelector((state) => state.auth);
    const cachedProfile = useAppSelector((state) => state.providerProfile.profile);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [loadedProfile, setLoadedProfile] = useState<ProviderProfile>();
    const profile = cachedProfile ?? routeProfile ?? loadedProfile;
    const [profileError, setProfileError] = useState<string>();
    const [isProfileLoading, setIsProfileLoading] = useState(!routeProfile);

    useEffect(() => {
        if (routeProfile) {
            return undefined;
        }

        const controller = new AbortController();
        void fetchProviderProfile(token ?? '', controller.signal)
            .then((loadedProfile) => {
                setLoadedProfile(loadedProfile);
                dispatch(setProviderProfile(loadedProfile));
                setProfileError(undefined);
            })
            .catch((error: unknown) => {
                if (!controller.signal.aborted) {
                    setProfileError(
                        error instanceof Error
                            ? error.message
                            : 'Could not load provider profile. Please try again.',
                    );
                }
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setIsProfileLoading(false);
                }
            });

        return () => controller.abort();
    }, [dispatch, routeProfile, token]);

    const openSetting = (title: string) => {
        if (isProfileLoading) {
            showInfoToast(title, 'Loading provider profile...');
            return;
        }
        if (profileError) {
            showInfoToast(title, profileError);
            return;
        }
        if (!profile) {
            showInfoToast(title, 'Provider profile data is unavailable.');
            return;
        }

        switch (title) {
            case 'Personal Information':
                navigation.navigate('ProviderPersonalInformation', { profile });
                break;
            case 'Service Areas':
                navigation.navigate('ProviderServiceAreas', { profile });
                break;
            case 'Availability':
                navigation.navigate('ProviderAvailability', { profile });
                break;
            case 'Documents':
                navigation.navigate('ProviderDocuments', { profile });
                break;
            case 'Payment Details':
                navigation.navigate('ProviderPaymentDetails', { profile });
                break;
            default:
                break;
        }
    };

    const confirmLogout = () => {
        if (isLoggingOut) {
            return;
        }

        Alert.alert('Log out', 'Are you sure you want to log out?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Log Out',
                style: 'destructive',
                onPress: () => {
                    setIsLoggingOut(true);
                    void dispatch(signOut())
                        .unwrap()
                        .catch((error: unknown) => {
                            console.error('Unable to log out:', error);
                            showErrorToast(
                                'Could not log out',
                                error instanceof Error
                                    ? error.message
                                    : 'An unexpected error occurred. Please try again.',
                            );
                            setIsLoggingOut(false);
                        });
                },
            },
        ]);
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
            <View style={styles.header}>
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Back to provider profile"
                    onPress={() => navigation.goBack()}
                    style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
                >
                    <Svg width={RS(30)} height={RS(30)} viewBox="0 0 24 24">
                        <Path
                            d="m15 18-6-6 6-6"
                            fill="none"
                            stroke={NAVY}
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </Svg>
                </Pressable>
                <AppText pointerEvents="none" style={styles.heading}>Settings</AppText>
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.settingsList}>
                    {SETTINGS.map((item) => (
                        <ProviderSettingRow
                            key={item.title}
                            {...item}
                            onPress={() => openSetting(item.title)}
                        />
                    ))}
                </View>

                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Log out"
                    disabled={isLoggingOut}
                    onPress={confirmLogout}
                    style={({ pressed }) => [
                        styles.logoutCard,
                        isLoggingOut && styles.logoutDisabled,
                        pressed && styles.pressed,
                    ]}
                >
                    {isLoggingOut ? (
                        <ActivityIndicator color={Colors.failed} />
                    ) : (
                        <>
                            <Svg width={RS(29)} height={RS(29)} viewBox="0 0 24 24">
                                <Path
                                    d="M10 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5m5-4 4-4-4-4m4 4H9"
                                    fill="none"
                                    stroke={Colors.failed}
                                    strokeWidth="1.9"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </Svg>
                            <AppText style={styles.logoutText}>Log Out</AppText>
                        </>
                    )}
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ProviderSettingsScreen;

const NAVY = '#172B4D';

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        minHeight: RS(70),
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: RS(23),
    },
    backButton: {
        zIndex: 1,
        width: RS(42),
        height: RS(44),
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    heading: {
        position: 'absolute',
        left: 0,
        right: 0,
        color: '#111827',
        fontSize: RF(25),
        lineHeight: RS(32),
        fontWeight: '700',
        textAlign: 'center',
    },
    content: {
        flexGrow: 1,
        paddingHorizontal: RS(20),
        paddingTop: RS(8),
        paddingBottom: RS(20),
    },
    settingsList: {
        gap: RS(13),
    },
    logoutCard: {
        minHeight: RS(76),
        flexDirection: 'row',
        alignItems: 'center',
        gap: RS(20),
        borderWidth: 1,
        borderColor: '#C9D9EA',
        borderRadius: RS(38),
        backgroundColor: Colors.white,
        marginTop: RS(18),
        paddingHorizontal: RS(22),
    },
    logoutText: {
        color: '#E41E35',
        fontSize: RF(18),
        lineHeight: RS(25),
        fontWeight: '600',
    },
    logoutDisabled: {
        opacity: 0.7,
    },
    pressed: {
        opacity: 0.75,
    },
});
