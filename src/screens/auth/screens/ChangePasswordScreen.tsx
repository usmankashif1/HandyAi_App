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
import AppButton from '../../../components/AppButton';
import AppText from '../../../components/AppText';
import { Colors } from '../../../core/theme/colors';
import { FontSize, Radii, Spacing, TypeScale } from '../../../core/theme/designTokens';
import { RS } from '../../../core/utils/responsive';
import type { AuthStackParamList } from '../../../navigation/auth/auth.types';
import { resetPassword } from '../auth.api';
import SignUpField from '../components/SignUpField';
import { showErrorToast, showSuccessToast } from '../../../core/utils/toast';

type Props = NativeStackScreenProps<AuthStackParamList, 'ChangePassword'>;

type PasswordErrors = {
    password?: string;
    confirmPassword?: string;
};

const PASSWORD_RULE = /^(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

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

const ChangePasswordScreen = ({ navigation, route }: Props) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<PasswordErrors>({});
    const [isChanging, setIsChanging] = useState(false);

    const handleChangePassword = async () => {
        if (isChanging) {
            return;
        }

        const nextErrors: PasswordErrors = {};
        if (!PASSWORD_RULE.test(password)) {
            nextErrors.password = 'Use at least 8 characters, including a number and a symbol.';
        }
        if (!confirmPassword || confirmPassword !== password) {
            nextErrors.confirmPassword = 'Passwords must match.';
        }
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        setIsChanging(true);
        try {
            const result = await resetPassword({
                resetToken: route.params.resetToken,
                newPassword: password,
            });
            showSuccessToast('Password changed', result.message);
            navigation.popTo('Login');
        } catch (error) {
            console.error('Unable to reset the password:', error);
            showErrorToast(
                'Could not change password',
                error instanceof Error
                    ? error.message
                    : 'An unexpected error occurred. Please try again.',
            );
        } finally {
            setIsChanging(false);
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
                        <AppText style={styles.headerTitle}>Change Password</AppText>
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
                        <AppText style={styles.instruction}>Set a new password.</AppText>
                        <View style={styles.form}>
                            <SignUpField
                                label="New Password"
                                placeholder="Enter a new password"
                                icon="lock"
                                value={password}
                                onChangeText={(value) => {
                                    setPassword(value);
                                    setErrors((current) => ({ ...current, password: undefined }));
                                }}
                                error={errors.password}
                                secure
                                accessibilityLabel="New password"
                            />
                            <AppText style={styles.passwordHint}>
                                Use at least 8 characters, including a number and a symbol.
                            </AppText>
                            <SignUpField
                                label="Confirm New Password"
                                placeholder="Re-enter your new password"
                                icon="lock"
                                value={confirmPassword}
                                onChangeText={(value) => {
                                    setConfirmPassword(value);
                                    setErrors((current) => ({
                                        ...current,
                                        confirmPassword: undefined,
                                    }));
                                }}
                                error={errors.confirmPassword}
                                secure
                                accessibilityLabel="Confirm new password"
                            />
                        </View>
                    </ScrollView>

                    <AppButton
                        style={styles.submitButton}
                        onPress={handleChangePassword}
                        disabled={isChanging}
                        accessibilityRole="button"
                    >
                        {isChanging ? (
                            <ActivityIndicator color={Colors.white} />
                        ) : (
                            <AppText style={styles.submitButtonText}>Change Password</AppText>
                        )}
                    </AppButton>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ChangePasswordScreen;

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
        paddingTop: RS(38),
    },
    mark: {
        alignItems: 'center',
        marginBottom: RS(30),
    },
    instruction: {
        ...TypeScale.body,
        color: Colors.textPrimary,
        fontSize: FontSize.bodyLarge,
        lineHeight: RS(28),
        textAlign: 'center',
        marginBottom: RS(34),
    },
    form: {
        marginTop: Spacing.xs,
    },
    passwordHint: {
        color: Colors.textSecondary,
        fontSize: FontSize.bodySmall,
        lineHeight: RS(21),
        marginTop: -Spacing.xs,
        marginBottom: Spacing.md,
        paddingHorizontal: Spacing.xs,
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
