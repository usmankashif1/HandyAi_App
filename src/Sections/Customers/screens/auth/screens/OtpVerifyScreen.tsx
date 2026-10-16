import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import AppButton from '../../../../../components/AppButton';
import AppText from '../../../../../components/AppText';
import { Colors } from '../../../../../core/theme/colors';
import { FontSize, Radii, Spacing, TypeScale } from '../../../../../core/theme/designTokens';
import { RF, RS } from '../../../../../core/utils/responsive';
import type { AuthStackParamList } from '../../../navigation/auth/auth.types';
import { resendOtp, verifyOtp } from '../auth.api';
import { showErrorToast, showSuccessToast } from '../../../../../core/utils/toast';
import { useAppDispatch } from '../../../../../store/hooks';
import { signInWithAccessToken } from '../../../../../store/slices/authSlice';

type Props = NativeStackScreenProps<AuthStackParamList, 'OtpVerify'>;

const OTP_LENGTH = 5;
const RESEND_COOLDOWN_SECONDS = 120;

const BackIcon = () => (
    <Svg width={RS(30)} height={RS(30)} viewBox="0 0 24 24" accessibilityElementsHidden>
        <Path
            d="m15 18-6-6 6-6"
            fill="none"
            stroke={Colors.textPrimary}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

const HandyMark = () => (
    <Svg width={RS(88)} height={RS(88)} viewBox="0 0 64 64" accessibilityElementsHidden>
        <Path
            d="M13 53V27L32 10l19 17v26M43 17v-4"
            fill="none"
            stroke={Colors.primaryDark}
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path d="m32 31 2.7 5.3L40 39l-5.3 2.7L32 47l-2.7-5.3L24 39l5.3-2.7L32 31Z" fill={Colors.primaryDark} />
    </Svg>
);

const OtpVerifyScreen = ({ navigation, route }: Props) => {
    const { email } = route.params;
    const purpose = route.params.purpose;
    const dispatch = useAppDispatch();
    const [code, setCode] = useState('');
    const [error, setError] = useState<string>();
    const [cooldownSeconds, setCooldownSeconds] = useState(RESEND_COOLDOWN_SECONDS);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setCooldownSeconds((seconds) => Math.max(seconds - 1, 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleCodeChange = (value: string) => {
        setCode(value.replace(/\D/g, '').slice(0, OTP_LENGTH));
        setError(undefined);
    };

    const handleVerify = async () => {
        if (isVerifying || isResending) {
            return;
        }
        if (code.length !== OTP_LENGTH) {
            setError(`Enter the ${OTP_LENGTH}-digit verification code.`);
            return;
        }

        setIsVerifying(true);
        setError(undefined);
        try {
            if (purpose === 'SIGNUP') {
                const result = await verifyOtp({ email, code, purpose });
                showSuccessToast('Email verified', result.message);
                await dispatch(signInWithAccessToken({
                    token: result.token,
                    account: {
                        email,
                        fullName: route.params.fullName,
                    },
                    startSetup: true,
                })).unwrap();
            } else {
                const result = await verifyOtp({ email, code, purpose });
                navigation.replace('ChangePassword', { resetToken: result.resetToken });
            }
        } catch (requestError) {
            console.error('Unable to verify the code:', requestError);
            showErrorToast(
                'Verification failed',
                requestError instanceof Error
                    ? requestError.message
                    : 'An unexpected error occurred. Please try again.',
            );
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResend = async () => {
        if (isResending || isVerifying || cooldownSeconds > 0) {
            return;
        }

        setIsResending(true);
        setError(undefined);
        try {
            const result = await resendOtp({ email, purpose });
            setCode('');
            setCooldownSeconds(RESEND_COOLDOWN_SECONDS);
            showSuccessToast('Code sent', result.message);
        } catch (requestError) {
            console.error('Unable to resend the signup code:', requestError);
            showErrorToast(
                'Could not resend code',
                requestError instanceof Error
                    ? requestError.message
                    : 'An unexpected error occurred. Please try again.',
            );
        } finally {
            setIsResending(false);
        }
    };

    const minutes = Math.floor(cooldownSeconds / 60).toString().padStart(2, '0');
    const seconds = (cooldownSeconds % 60).toString().padStart(2, '0');

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <View style={styles.page}>
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                            accessibilityRole="button"
                            accessibilityLabel="Go back"
                            hitSlop={8}
                        >
                            <BackIcon />
                        </TouchableOpacity>
                        <AppText style={styles.headerTitle}>
                            {purpose === 'RESET_PASSWORD' ? 'Forgot Password' : 'Verify Your Email'}
                        </AppText>
                        <View style={styles.headerSpacer} />
                    </View>

                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.mark}>
                            <HandyMark />
                        </View>

                        <AppText style={styles.instruction}>
                            Enter the verification code sent to{' '}
                            <AppText style={styles.email}>{email}</AppText>.
                        </AppText>

                        <View style={styles.codeInput}>
                            <View style={styles.digitRow} pointerEvents="none">
                                {Array.from({ length: OTP_LENGTH }, (_, index) => (
                                    <View
                                        key={index}
                                        style={[
                                            styles.digitBox,
                                            index === code.length && styles.activeDigitBox,
                                            error && styles.errorDigitBox,
                                        ]}
                                    >
                                        <AppText style={styles.digit}>{code[index] ?? ''}</AppText>
                                    </View>
                                ))}
                            </View>
                            <TextInput
                                style={styles.hiddenInput}
                                value={code}
                                onChangeText={handleCodeChange}
                                keyboardType="number-pad"
                                maxLength={OTP_LENGTH}
                                textContentType="oneTimeCode"
                                accessibilityLabel="Verification code"
                                accessibilityHint={`Enter the ${OTP_LENGTH}-digit code sent to ${email}`}
                                autoCapitalize="none"
                                autoCorrect={false}
                                editable={!isVerifying && !isResending}
                            />
                        </View>
                        {error ? <AppText style={styles.errorText}>{error}</AppText> : null}

                        <View style={styles.resendRow}>
                            <AppText style={styles.resendPrompt}>Did not receive code? </AppText>
                            {cooldownSeconds > 0 ? (
                                <AppText style={styles.resendCountdown}>
                                    Resend code in {minutes}:{seconds}
                                </AppText>
                            ) : (
                                <TouchableOpacity
                                    onPress={handleResend}
                                    disabled={isResending || isVerifying}
                                    accessibilityRole="button"
                                >
                                    {isResending ? (
                                        <ActivityIndicator color={Colors.primaryDark} />
                                    ) : (
                                        <AppText style={styles.resendAction}>Resend code</AppText>
                                    )}
                                </TouchableOpacity>
                            )}
                        </View>
                    </ScrollView>

                    <AppButton
                        style={styles.verifyButton}
                        onPress={handleVerify}
                        disabled={isVerifying || isResending}
                        accessibilityRole="button"
                    >
                        {isVerifying ? (
                            <ActivityIndicator color={Colors.white} />
                        ) : (
                            <AppText style={styles.verifyButtonText}>Verify</AppText>
                        )}
                    </AppButton>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default OtpVerifyScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    keyboardView: {
        flex: 1,
    },
    page: {
        flex: 1,
        width: '100%',
        maxWidth: RS(500),
        alignSelf: 'center',
        paddingBottom: Spacing.lg,
    },
    header: {
        minHeight: RS(56),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.md,
    },
    backButton: {
        width: RS(40),
        height: RS(44),
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    headerTitle: {
        color: Colors.textPrimary,
        fontSize: FontSize.title,
        fontWeight: '600',
    },
    headerSpacer: {
        width: RS(40),
    },
    scrollContent: {
        flexGrow: 1,
        alignItems: 'center',
        paddingHorizontal: RS(28),
        paddingTop: RS(78),
    },
    mark: {
        marginBottom: RS(46),
    },
    instruction: {
        ...TypeScale.body,
        color: Colors.textPrimary,
        fontSize: FontSize.bodyLarge,
        lineHeight: RS(28),
        textAlign: 'center',
        marginBottom: RS(24),
    },
    email: {
        color: Colors.textPrimary,
        fontWeight: '700',
    },
    codeInput: {
        width: '100%',
        maxWidth: RS(360),
        minHeight: RS(62),
        justifyContent: 'center',
    },
    digitRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: RS(8),
    },
    digitBox: {
        width: RS(56),
        height: RS(60),
        borderWidth: 1.5,
        borderColor: '#777B82',
        borderRadius: RS(9),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.background,
    },
    activeDigitBox: {
        borderColor: Colors.primaryDark,
        borderWidth: 2,
    },
    errorDigitBox: {
        borderColor: Colors.failed,
    },
    digit: {
        color: Colors.textPrimary,
        fontSize: RF(25),
        fontWeight: '600',
    },
    hiddenInput: {
        ...StyleSheet.absoluteFill,
        opacity: 0,
        color: 'transparent',
    },
    errorText: {
        alignSelf: 'center',
        marginTop: Spacing.xs,
        color: Colors.failed,
        fontSize: FontSize.caption,

    },
    resendRow: {
        minHeight: RS(52),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginTop: RS(18),
    },
    resendPrompt: {
        color: Colors.textPrimary,
        fontSize: FontSize.body,
    },
    resendCountdown: {
        color: Colors.textPrimary,
        fontSize: FontSize.body,
        fontWeight: '700',
    },
    resendAction: {
        color: Colors.primaryDark,
        fontSize: FontSize.body,
        fontWeight: '700',
        textDecorationLine: 'underline',
    },
    verifyButton: {
        minHeight: RS(62),
        marginHorizontal: RS(28),
        borderRadius: Radii.pill,
        backgroundColor: Colors.primaryDark,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Spacing.lg,
    },
    verifyButtonText: {
        color: Colors.white,
        fontSize: FontSize.bodyLarge,
        fontWeight: '600',
    },
});
