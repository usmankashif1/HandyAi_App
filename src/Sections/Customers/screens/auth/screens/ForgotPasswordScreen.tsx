import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import AppButton from '../../../../../components/AppButton';
import AppText from '../../../../../components/AppText';
import { Colors } from '../../../../../core/theme/colors';
import { FontSize, Radii, Spacing, TypeScale } from '../../../../../core/theme/designTokens';
import { RS } from '../../../../../core/utils/responsive';
import type { AuthStackParamList } from '../../../navigation/auth/auth.types';
import { forgotPassword } from '../auth.api';
import SignUpField from '../components/SignUpField';
import { showErrorToast } from '../../../../../core/utils/toast';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

const EMAIL_RULE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
        <Path
            d="m32 31 2.7 5.3L40 39l-5.3 2.7L32 47l-2.7-5.3L24 39l5.3-2.7L32 31Z"
            fill={Colors.primaryDark}
        />
    </Svg>
);

const ForgotPasswordScreen = ({ navigation }: Props) => {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState<string>();
    const [isSending, setIsSending] = useState(false);

    const handleSendCode = async () => {
        if (isSending) {
            return;
        }

        const normalizedEmail = email.trim().toLowerCase();
        if (!EMAIL_RULE.test(normalizedEmail)) {
            setEmailError('Enter a valid email address.');
            return;
        }

        setEmailError(undefined);
        setIsSending(true);
        try {
            await forgotPassword({ email: normalizedEmail });
            navigation.navigate('OtpVerify', {
                email: normalizedEmail,
                purpose: 'RESET_PASSWORD',
            });
        } catch (error) {
            console.error('Unable to request a password reset code:', error);
            showErrorToast(
                'Could not send code',
                error instanceof Error
                    ? error.message
                    : 'An unexpected error occurred. Please try again.',
            );
        } finally {
            setIsSending(false);
        }
    };

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
                        <AppText style={styles.headerTitle}>Forgot Password</AppText>
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
                            Please enter your registered email below. We will send a 5-digit verification code to your inbox.
                        </AppText>
                        <View style={styles.form}>
                            <SignUpField
                                label="Email Address"
                                placeholder="Enter your email address"
                                icon="email"
                                value={email}
                                onChangeText={(value) => {
                                    setEmail(value);
                                    setEmailError(undefined);
                                }}
                                error={emailError}
                                keyboardType="email-address"
                                accessibilityLabel="Registered email address"
                            />
                        </View>
                    </ScrollView>

                    <AppButton
                        style={styles.submitButton}
                        onPress={handleSendCode}
                        disabled={isSending}
                        accessibilityRole="button"
                    >
                        {isSending ? (
                            <ActivityIndicator color={Colors.white} />
                        ) : (
                            <AppText style={styles.submitButtonText}>Send OTP</AppText>
                        )}
                    </AppButton>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ForgotPasswordScreen;

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
        paddingHorizontal: RS(28),
        paddingTop: RS(78),
    },
    mark: {
        alignItems: 'center',
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
    form: {
        marginTop: Spacing.xs,
    },
    submitButton: {
        minHeight: RS(62),
        marginHorizontal: RS(28),
        borderRadius: Radii.pill,
        backgroundColor: Colors.primaryDark,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Spacing.lg,
    },
    submitButtonText: {
        color: Colors.white,
        fontSize: FontSize.bodyLarge,
        fontWeight: '600',
    },
});
