import { useState } from 'react';
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
import { RS } from '../../../../../core/utils/responsive';
import { useAppDispatch, useAppSelector } from '../../../../../store/hooks';
import { signOut } from '../../../../../store/slices/authSlice';
import type { ProviderProfileStackParamList } from '../../profile/profile.types';
import ProviderSettingRow, { type ProviderSettingIcon } from '../components/ProviderSettingRow';

type Props = NativeStackScreenProps<ProviderProfileStackParamList, 'ProviderSettings'>;

const SETTINGS: {
    icon: ProviderSettingIcon;
    title: string;
    detail: string;
}[] = [
    { icon: 'personal', title: 'Personal Information', detail: 'Update your details' },
    { icon: 'areas', title: 'Service Areas', detail: 'Manage your coverage radius' },
    { icon: 'availability', title: 'Availability', detail: 'Set your working hours' },
    { icon: 'documents', title: 'Documents', detail: 'View & manage your documents' },
    { icon: 'payment', title: 'Payment Details', detail: 'Stripe Connect' },
    { icon: 'support', title: 'Support', detail: 'Get help or contact support' },
];

const ProviderSettingsScreen = ({ navigation, route }: Props) => {
    const dispatch = useAppDispatch();
    const { profile } = route.params ?? {};
    const { account } = useAppSelector((state) => state.auth);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const availabilitySummary = profile?.availability
        .map((item) => `${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][item.dayOfWeek] ?? 'Day'} ${item.startTime.slice(0, 5)}-${item.endTime.slice(0, 5)}`)
        .join(', ');
    const documentSummary = profile?.documents
        .map((document) => `${document.type.split('_').join(' ')}: ${document.status.toLowerCase()}`)
        .join('\n');
    const settingDetails: Record<string, string> = {
        'Personal Information': account?.email || 'Update your details',
        'Service Areas': profile?.postcodeCoverage.join(', ') || 'Manage your coverage radius',
        Availability: availabilitySummary || 'Set your working hours',
        Documents: profile
            ? `${profile.documents.length} documents · ${profile.status.toLowerCase()} review`
            : 'View & manage your documents',
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
                    <Svg width={RS(27)} height={RS(27)} viewBox="0 0 24 24">
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
                <AppText style={styles.heading}>Settings</AppText>
                <View style={styles.headerSpacer} />
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
                            detail={settingDetails[item.title] ?? item.detail}
                            onPress={() => {
                                if (item.title === 'Documents' && documentSummary) {
                                    showInfoToast('Submitted documents', documentSummary);
                                    return;
                                }
                                showInfoToast(item.title, 'This setting is not available yet.');
                            }}
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
        backgroundColor: '#F2F6FC',
    },
    header: {
        minHeight: RS(70),
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: RS(23),
    },
    backButton: {
        width: RS(42),
        height: RS(44),
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    heading: {
        color: '#111827',
        fontSize: RS(25),
        lineHeight: RS(32),
        fontWeight: '700',
        marginLeft: RS(8),
    },
    headerSpacer: {
        flex: 1,
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
        fontSize: RS(18),
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
