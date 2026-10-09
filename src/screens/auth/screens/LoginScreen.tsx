import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '../../../components/AppButton';
import AppText from '../../../components/AppText';
import { Colors } from '../../../core/theme/colors';
import { FontSize, Radii, Spacing, TypeScale } from '../../../core/theme/designTokens';
import { RS } from '../../../core/utils/responsive';
import type { AuthStackParamList } from '../../../navigation/auth/auth.types';
import { useAuthSession } from '../AuthSessionContext';
import { authenticateLocalAccount } from '../auth.storage';
import SignUpField from '../components/SignUpField';
import Svg, { Path } from 'react-native-svg';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: Props) => {
    const { signIn } = useAuthSession();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState<string | undefined>();
    const [passwordError, setPasswordError] = useState<string | undefined>();
    const [isSigningIn, setIsSigningIn] = useState(false);

    const handleSignIn = async () => {
        const normalizedEmail = email.trim();
        let isValid = true;

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
            setEmailError('Enter a valid email address.');
            isValid = false;
        } else {
            setEmailError(undefined);
        }

        if (!password) {
            setPasswordError('Enter your password.');
            isValid = false;
        } else {
            setPasswordError(undefined);
        }

        if (!isValid) {
            return;
        }

        setIsSigningIn(true);
        try {
            const account = await authenticateLocalAccount(normalizedEmail, password);
            if (!account) {
                Alert.alert('Sign-in failed', 'The email or password is incorrect.');
                return;
            }

            await signIn(account);
        } catch (error) {
            console.error('Unable to sign in with the local account:', error);
            Alert.alert(
                'Could not sign in',
                error instanceof Error ? error.message : 'Please try again.',
            );
        } finally {
            setIsSigningIn(false);
        }
    };






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



    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                        accessibilityRole="button"
                    >
                        <BackIcon />
                        <AppText style={styles.backText}>Back</AppText>
                    </TouchableOpacity>

                    <View style={styles.heading}>
                        <AppText style={styles.title}>Welcome back</AppText>
                        <AppText style={styles.subtitle}>Log in to your Handy AI account.</AppText>
                    </View>

                    <View style={styles.form}>
                        <SignUpField
                            label="Email Address"
                            placeholder="Enter your email"
                            icon="email"
                            value={email}
                            onChangeText={(value) => {
                                setEmail(value);
                                setEmailError(undefined);
                            }}
                            error={emailError}
                            keyboardType="email-address"
                            accessibilityLabel="Email address"
                        />
                        <SignUpField
                            label="Password"
                            placeholder="Enter your password"
                            icon="lock"
                            value={password}
                            onChangeText={(value) => {
                                setPassword(value);
                                setPasswordError(undefined);
                            }}
                            error={passwordError}
                            secure
                            accessibilityLabel="Password"
                        />
                    </View>

                    <AppButton
                        style={[styles.loginButton, isSigningIn && styles.loginButtonDisabled]}
                        onPress={handleSignIn}
                        disabled={isSigningIn}
                        accessibilityRole="button"
                    >
                        {isSigningIn ? (
                            <ActivityIndicator color={Colors.white} />
                        ) : (
                            <AppText style={styles.loginButtonText}>Log In</AppText>
                        )}
                    </AppButton>

                    <AppText style={styles.signupPrompt}>
                        Don&apos;t have an account?{' '}
                        <AppText
                            style={styles.signupLink}
                            onPress={() => navigation.navigate('SignUp')}
                            accessibilityRole="link"
                        >
                            Create account
                        </AppText>
                    </AppText>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    keyboardView: {
        flex: 1,
    },
    content: {
        flexGrow: 1,
        paddingHorizontal: Spacing.xl,
        paddingTop: Spacing.sm,
        paddingBottom: Spacing.xl,
    },
    backButton: {
        minHeight: RS(44),
        justifyContent: 'center',
        alignSelf: 'flex-start',
        flexDirection: "row",
    },
    backText: {
        color: Colors.primaryDark,
        fontSize: FontSize.bodyLarge,
        fontWeight: '600',
    },
    heading: {
        marginTop: Spacing.section,
        marginBottom: Spacing.xxl,
    },
    title: {
        ...TypeScale.heading,
        color: Colors.primaryDark,
        fontSize: FontSize.heroTitle,
        marginBottom: Spacing.xs,
    },
    subtitle: {
        ...TypeScale.body,
        color: Colors.textSecondary,
    },
    form: {
        marginBottom: Spacing.sm,
    },
    loginButton: {
        minHeight: RS(58),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: Radii.pill,
        backgroundColor: Colors.primaryDark,
        marginTop: Spacing.sm,
    },
    loginButtonDisabled: {
        opacity: 0.7,
    },
    loginButtonText: {
        color: Colors.white,
        fontSize: FontSize.bodyLarge,
        fontWeight: '600',
    },
    signupPrompt: {
        ...TypeScale.caption,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginTop: Spacing.xl,
        fontSize: FontSize.bodySmall,
        fontWeight: '600',
    },
    signupLink: {
        color: Colors.primaryDark,
        fontSize: FontSize.bodySmall,
        fontWeight: '600',
    },
});
