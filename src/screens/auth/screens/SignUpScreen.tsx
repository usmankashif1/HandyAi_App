import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import {
    Alert,
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
import { useAuthSession } from '../AuthSessionContext';
import SignUpField from '../components/SignUpField';
import { createLocalAccount } from '../auth.storage';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignUp'>;

type SignUpValues = {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
};

type SignUpErrors = Partial<Record<keyof SignUpValues, string>>;

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

const SignUpScreen = ({ navigation }: Props) => {
    const { signIn } = useAuthSession();
    const [values, setValues] = useState<SignUpValues>({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState<SignUpErrors>({});
    const [isCreatingAccount, setIsCreatingAccount] = useState(false);

    const updateField = (field: keyof SignUpValues, value: string) => {
        setValues((current) => ({ ...current, [field]: value }));
        setErrors((current) => ({ ...current, [field]: undefined }));
    };

    const handleCreateAccount = async () => {
        const nextErrors: SignUpErrors = {};
        if (!values.fullName.trim()) {
            nextErrors.fullName = 'Enter your full name.';
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
            nextErrors.email = 'Enter a valid email address.';
        }
        if (!PASSWORD_RULE.test(values.password)) {
            nextErrors.password = 'Use at least 8 characters, including a number and a symbol.';
        }
        if (!values.confirmPassword || values.confirmPassword !== values.password) {
            nextErrors.confirmPassword = 'Passwords must match.';
        }

        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        setIsCreatingAccount(true);
        try {
            const account = {
                fullName: values.fullName.trim(),
                email: values.email.trim().toLowerCase(),
                password: values.password,
            };
            await createLocalAccount(account);
            await signIn(account, true);
        } catch (error) {
            console.error('Unable to create the local account:', error);
            Alert.alert(
                'Could not create account',
                error instanceof Error ? error.message : 'Please try again.',
            );
        } finally {
            setIsCreatingAccount(false);
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

                        <AppText style={styles.headerTitle}>Create Your Account</AppText>
                        <View style={styles.headerSpacer} />
                    </View>

                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <AppText style={styles.title}>
                            Welcome to personalized Smart Home Assistance
                        </AppText>
                        <AppText style={styles.subtitle}>
                            Let&apos;s get your Handy AI account set up.
                        </AppText>

                        <View style={styles.form}>
                            <SignUpField
                                label="Full Name"
                                placeholder="Enter your full name"
                                icon="user"
                                value={values.fullName}
                                onChangeText={(value) => updateField('fullName', value)}
                                error={errors.fullName}
                                autoCapitalize="words"
                                accessibilityLabel="Full name"
                            />
                            <SignUpField
                                label="Email Address"
                                placeholder="Enter your email"
                                icon="email"
                                value={values.email}
                                onChangeText={(value) => updateField('email', value)}
                                error={errors.email}
                                keyboardType="email-address"
                                accessibilityLabel="Email address"
                            />
                            <SignUpField
                                label="Create Password"
                                placeholder="Enter your password"
                                icon="lock"
                                value={values.password}
                                onChangeText={(value) => updateField('password', value)}
                                error={errors.password}
                                secure
                                accessibilityLabel="Create password"
                            />
                            <AppText style={styles.passwordHint}>
                                Password must be at least 8 characters, include a number and a symbol.
                            </AppText>
                            <SignUpField
                                label="Confirm Password"
                                placeholder="Enter your password again"
                                icon="lock"
                                value={values.confirmPassword}
                                onChangeText={(value) => updateField('confirmPassword', value)}
                                error={errors.confirmPassword}
                                secure
                                accessibilityLabel="Confirm password"
                            />
                        </View>

                        <AppButton
                            style={styles.createButton}
                            onPress={handleCreateAccount}
                            disabled={isCreatingAccount}
                            accessibilityRole="button"
                        >
                            {isCreatingAccount ? (
                                <ActivityIndicator color={Colors.white} />
                            ) : (
                                <AppText style={styles.createButtonText}>Create Account</AppText>
                            )}
                        </AppButton>
                    </ScrollView>

                    {/* <AppText style={styles.legal}>
                        By creating an account, you agree to our Terms{'\n'}and Privacy Policy.
                    </AppText> */}
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default SignUpScreen;

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
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        width: '100%',
        maxWidth: RS(460),
        alignSelf: 'center',
        paddingHorizontal: RS(28),
        paddingTop: Spacing.xl,
        paddingBottom: Spacing.lg,
    },
    title: {
        ...TypeScale.heading,
        color: '#10182F',
        fontSize: RS(27),
        lineHeight: RS(36),
        marginBottom: Spacing.md,
    },
    subtitle: {
        ...TypeScale.body,
        color: '#41434A',
        fontSize: FontSize.bodyLarge,
        lineHeight: RS(28),
        marginBottom: Spacing.xxl,
    },
    form: {
        marginBottom: Spacing.md,
    },
    passwordHint: {
        color: Colors.textPrimary,
        fontSize: FontSize.bodySmall,
        lineHeight: RS(21),
        marginTop: -Spacing.xs,
        left: RS(5),
        marginBottom: Spacing.lg,
    },
    createButton: {
        minHeight: RS(62),
        borderRadius: Radii.pill,
        backgroundColor: Colors.primaryDark,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Spacing.lg,
        shadowColor: Colors.primaryDark,
        shadowOffset: { width: 0, height: RS(5) },
        shadowOpacity: 0.16,
        shadowRadius: RS(10),
        elevation: 3,
        marginTop: Spacing.sm,
    },
    createButtonText: {
        color: Colors.white,
        fontSize: FontSize.bodyLarge,
        fontWeight: '600',
    },
    legal: {
        color: Colors.textPrimary,
        textAlign: 'center',
        fontSize: FontSize.bodySmall,
        lineHeight: RS(21),
        paddingHorizontal: Spacing.xl,
        paddingTop: Spacing.md,
        paddingBottom: Spacing.sm,
    },
});
