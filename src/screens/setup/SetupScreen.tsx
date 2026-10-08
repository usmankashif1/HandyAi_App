import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, TextInput, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import AppButton from '../../components/AppButton';
import AppText from '../../components/AppText';
import Container from '../../components/Container';
import { Colors } from '../../core/theme/colors';
import { FontSize, Radii, Spacing, TypeScale } from '../../core/theme/designTokens';
import { RS } from '../../core/utils/responsive';
import type { RootStackParamList } from '../../navigation/root/root.types';



type Props = NativeStackScreenProps<RootStackParamList, 'Setup'>;
type FormValues = {
    fullName: string;
    email: string;
    address: string;
    postcode: string;
    notes: string;
};
type FormErrors = Partial<Record<keyof FormValues, string>>;

const TOTAL_STEPS = 3;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const BackIcon = () => (
    <Svg width={24} height={24} viewBox="0 0 24 24">
        <Path
            d="m15 18-6-6 6-6"
            fill="none"
            stroke={Colors.textPrimary}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

type FieldProps = {
    label: string;
    placeholder: string;
    value: string;
    error?: string;
    onChangeText: (value: string) => void;
    keyboardType?: 'default' | 'phone-pad' | 'email-address';
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
};

const SetupField = ({
    label,
    placeholder,
    value,
    error,
    onChangeText,
    keyboardType = 'default',
    autoCapitalize = 'sentences',
}: FieldProps) => (
    <Container style={styles.fieldGroup}>
        <AppText style={styles.fieldLabel}>{label}</AppText>
        <TextInput
            style={[styles.input, error ? styles.inputError : null]}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={Colors.textLight}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            autoCorrect={false}
            accessibilityLabel={label}
            accessibilityHint={error}
            returnKeyType="next"
        />
        {error ? <AppText style={styles.errorText}>{error}</AppText> : null}
    </Container>
);

const SetupScreen = ({ navigation }: Props) => {
    const { width } = useWindowDimensions();
    const [step, setStep] = useState(1);
    const [values, setValues] = useState<FormValues>({
        fullName: 'test user',
        email: 'test@example.com',
        address: '123 Test Street',
        postcode: 'TEST 123',
        notes: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const emailIsValid = EMAIL_PATTERN.test(values.email.trim());
    const personalDetailsAreValid = Boolean(
        values.fullName.trim()
        && emailIsValid
        && values.address.trim()
        && values.postcode.trim(),
    );

    const updateField = (field: keyof FormValues, value: string) => {
        setValues((current) => ({ ...current, [field]: value }));
        setErrors((current) => ({ ...current, [field]: undefined }));
    };

    const validatePersonalDetails = () => {
        const nextErrors: FormErrors = {};
        if (!values.fullName.trim()) {
            nextErrors.fullName = 'Enter your full name.';
        }

        const normalizedEmail = values.email.trim();
        if (!normalizedEmail) {
            nextErrors.email = 'Enter your email address.';
        } else if (!EMAIL_PATTERN.test(normalizedEmail)) {
            nextErrors.email = 'Enter a valid email address.';
        }

        if (!values.address.trim()) {
            nextErrors.address = 'Enter your primary address.';
        }
        if (!values.postcode.trim()) {
            nextErrors.postcode = 'Enter your postcode.';
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleNext = () => {
        if (step === 1 && !validatePersonalDetails()) {
            return;
        }
        setErrors({});
        setStep((current) => Math.min(current + 1, TOTAL_STEPS));
    };

    const handleSkipHouseholdNotes = () => {
        setErrors({});
        setStep(3);
    };

    const handleBack = () => {
        if (step > 1) {
            setStep((current) => current - 1);
            setErrors({});
            return;
        }
        navigation.goBack();
    };

    const handleFinish = () => navigation.replace('Main');

    const stepContent = () => {
        if (step === 1) {
            return (
                <>
                    <AppText style={styles.title}>Personal Details</AppText>
                    <AppText style={styles.subtitle}>
                        Tell us a bit about yourself so we can provide the best experience.
                    </AppText>
                    <Container style={styles.fields}>
                        <SetupField
                            label="Full Name"
                            placeholder="Enter your full name"
                            value={values.fullName}
                            error={errors.fullName}
                            onChangeText={(value) => updateField('fullName', value)}
                            autoCapitalize="words"
                        />
                        <SetupField
                            label="Email"
                            placeholder="you@example.com"
                            value={values.email}
                            error={errors.email ?? (values.email && !emailIsValid ? 'Enter a valid email address.' : undefined)}
                            onChangeText={(value) => updateField('email', value)}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        <SetupField
                            label="Primary Address"
                            placeholder="Street, city, state"
                            value={values.address}
                            error={errors.address}
                            onChangeText={(value) => updateField('address', value)}
                        />
                        <SetupField
                            label="Postcode"
                            placeholder="Enter postcode"
                            value={values.postcode}
                            error={errors.postcode}
                            onChangeText={(value) => updateField('postcode', value)}
                            autoCapitalize="characters"
                        />
                    </Container>
                </>
            );
        }

        if (step === 2) {
            return (
                <>
                    <AppText style={styles.title}>Household Notes</AppText>
                    <AppText style={styles.subtitle}>
                        Add helpful details for your providers. You can leave this blank and add notes later.
                    </AppText>
                    <Container style={styles.notesCard}>
                        <Container style={styles.notesIcon}>
                            <AppText style={styles.notesIconText}>i</AppText>
                        </Container>
                        <Container style={styles.notesContent}>
                            <AppText style={styles.notesTitle}>Useful things to include</AppText>
                            {['Entry codes', 'Key arrangements', 'Gate access', 'Pet notes', 'Special instructions'].map((item) => (
                                <AppText key={item} style={styles.noteExample}>•  {item}</AppText>
                            ))}
                        </Container>
                    </Container>
                    <TextInput
                        style={styles.notesInput}
                        value={values.notes}
                        onChangeText={(value) => updateField('notes', value)}
                        placeholder="e.g. Front door code: 4587. Dog is friendly; please keep the side gate closed."
                        placeholderTextColor={Colors.textSecondary}
                        multiline
                        textAlignVertical="top"
                        accessibilityLabel="Household notes"
                    />
                </>
            );
        }

        return (
            <>
                <AppText style={styles.title}>Set up your payment</AppText>
                <AppText style={styles.subtitle}>
                    Save a payment method for faster, easier bookings. You can do this later.
                </AppText>
                <Container style={styles.paymentCard}>
                    <AppText style={styles.stripeWordmark}>stripe</AppText>
                    <AppText style={styles.paymentHeading}>Save a card securely</AppText>
                    <AppText style={styles.paymentDescription}>
                        Your payment details are encrypted and handled securely.
                    </AppText>
                    <Container style={styles.emptyPayment}>
                        <AppText style={styles.emptyPaymentTitle}>No payment method saved</AppText>
                        <AppText style={styles.emptyPaymentDescription}>
                            A saved card will appear here when payment setup is available.
                        </AppText>
                    </Container>
                </Container>
                <AppText style={styles.infoMessage}>
                    Payment setup is not connected yet. Skip for now to finish setup.
                </AppText>
            </>
        );
    };

    const compact = width < 360;
    const canContinue = step === 1
        ? personalDetailsAreValid
        : step === 2 && Boolean(values.notes.trim());

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <Container style={styles.page}>
                    <Container style={styles.header}>
                        <AppButton
                            onPress={handleBack}
                            style={styles.backButton}
                            accessibilityRole="button"
                            accessibilityLabel={step === 1 ? 'Back to onboarding' : 'Previous step'}
                            hitSlop={8}
                        >
                            <BackIcon />
                        </AppButton>
                        <AppText style={styles.stepLabel}>Step {step} of {TOTAL_STEPS}</AppText>
                        <Container style={styles.headerSpacer} />
                    </Container>

                    <Container
                        style={styles.progressTrack}
                        accessibilityRole="progressbar"
                        accessibilityValue={{ min: 1, max: TOTAL_STEPS, now: step }}
                        accessibilityLabel={`Setup step ${step} of ${TOTAL_STEPS}`}
                    >
                        <Container style={[styles.progressFill, { width: `${(step / TOTAL_STEPS) * 100}%` }]} />
                    </Container>

                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={[
                            styles.scrollContent,
                            compact ? styles.compactScrollContent : null,
                        ]}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        {stepContent()}
                    </ScrollView>

                    <Container style={styles.footer}>
                        {step < TOTAL_STEPS ? (
                            <>
                                <AppButton
                                    style={[
                                        styles.nextButton,
                                        !canContinue && styles.nextButtonDisabled,
                                    ]}
                                    onPress={handleNext}
                                    accessibilityRole="button"
                                    disabled={!canContinue}
                                    accessibilityState={{ disabled: !canContinue }}
                                >
                                    <AppText style={styles.nextButtonText}>Next</AppText>
                                </AppButton>
                                {step === 2 ? (
                                    <AppButton
                                        onPress={handleSkipHouseholdNotes}
                                        style={styles.skipButton}
                                        accessibilityRole="button"
                                    >
                                        <AppText style={styles.skipButtonText}>Skip for now</AppText>
                                    </AppButton>
                                ) : null}
                            </>
                        ) : (
                            <>
                                <AppButton
                                    style={[styles.paymentButton, styles.paymentButtonDisabled]}
                                    disabled
                                    accessibilityRole="button"
                                    accessibilityState={{ disabled: true }}
                                >
                                    <AppText style={styles.paymentButtonDisabledText}>Add Payment Method</AppText>
                                </AppButton>
                                <AppButton
                                    onPress={handleFinish}
                                    style={styles.skipButton}
                                    accessibilityRole="button"
                                >
                                    <AppText style={styles.skipButtonText}>Skip for now</AppText>
                                </AppButton>
                            </>
                        )}
                    </Container>
                </Container>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default SetupScreen;

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
        maxWidth: RS(560),
        alignSelf: 'center',
    },
    header: {
        minHeight: RS(44),
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.xl,
    },
    backButton: {
        width: RS(40),
        height: RS(40),
        justifyContent: 'center',
    },
    stepLabel: {
        ...TypeScale.body,
        color: Colors.textPrimary,
        marginLeft: Spacing.sm,
        fontWeight: '500',
    },
    headerSpacer: {
        flex: 1,
    },
    progressTrack: {
        height: RS(4),
        marginHorizontal: Spacing.xl + 40,
        marginTop: Spacing.xs,
        marginBottom: Spacing.lg,
        borderRadius: Radii.pill,
        backgroundColor: '#D7D9DC',
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: Radii.pill,
        backgroundColor: Colors.primaryDark,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: Spacing.xl,
        paddingBottom: Spacing.lg,
    },
    compactScrollContent: {
        paddingHorizontal: Spacing.md,
    },
    title: {
        ...TypeScale.heading,
        color: Colors.textPrimary,
        fontSize: FontSize.heading,
        lineHeight: RS(34),
        marginBottom: Spacing.xs,
    },
    subtitle: {
        ...TypeScale.body,
        color: Colors.textPrimary,
        lineHeight: RS(24),
        marginBottom: Spacing.xl,
    },
    fields: {
        gap: Spacing.md,
    },
    fieldGroup: {
        gap: Spacing.xs,
    },
    fieldLabel: {
        color: Colors.textPrimary,
        fontSize: FontSize.bodySmall,
        fontWeight: '500',
    },
    input: {
        minHeight: RS(50),
        borderWidth: 1,
        borderColor: '#C9CDD4',
        borderRadius: Radii.md,
        paddingHorizontal: Spacing.md,
        color: Colors.textPrimary,
        fontSize: FontSize.body,
        backgroundColor: Colors.background,
    },
    inputError: {
        borderColor: Colors.failed,
    },
    errorText: {
        color: Colors.failed,
        fontSize: FontSize.bodySmall,
    },
    notesCard: {
        flexDirection: 'row',
        gap: Spacing.md,
        padding: Spacing.md,
        borderRadius: Radii.lg,
        borderWidth: 1,
        borderColor: Colors.border,
        backgroundColor: Colors.surface,
        marginBottom: Spacing.md,
    },
    notesIcon: {
        width: RS(38),
        height: RS(38),
        borderRadius: Radii.md,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.amberLight,
    },
    notesIconText: {
        color: Colors.amberDark,
        fontSize: FontSize.subtitle,
        fontWeight: '700',
    },
    notesContent: {
        flex: 1,
        gap: Spacing.xs,
    },
    notesTitle: {
        color: Colors.textPrimary,
        fontSize: FontSize.body,
        fontWeight: '600',
        marginBottom: Spacing.xxs,
    },
    noteExample: {
        color: Colors.textPrimary,
        fontSize: FontSize.body,
        lineHeight: RS(21),
    },
    notesInput: {
        minHeight: RS(112),
        borderWidth: 1,
        borderColor: '#C9CDD4',
        borderRadius: Radii.md,
        padding: Spacing.md,
        color: Colors.textPrimary,
        fontSize: FontSize.body,
        lineHeight: RS(22),
        backgroundColor: Colors.background,
    },
    paymentCard: {
        borderWidth: 1,
        borderColor: '#C9CDD4',
        borderRadius: Radii.lg,
        padding: Spacing.md,
        backgroundColor: Colors.background,
    },
    stripeWordmark: {
        color: '#635BFF',
        fontSize: FontSize.title,
        fontWeight: '800',
        letterSpacing: RS(-0.8),
        marginBottom: Spacing.md,
    },
    paymentHeading: {
        color: Colors.textPrimary,
        fontSize: FontSize.body,
        fontWeight: '600',
        marginBottom: Spacing.xs,
    },
    paymentDescription: {
        color: Colors.textSecondary,
        fontSize: FontSize.bodySmall,
        lineHeight: RS(20),
    },
    emptyPayment: {
        alignItems: 'center',
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#C9CDD4',
        borderRadius: Radii.md,
        padding: Spacing.lg,
        marginTop: Spacing.lg,
        backgroundColor: Colors.surface,
    },
    emptyPaymentTitle: {
        color: Colors.textPrimary,
        fontSize: FontSize.body,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: Spacing.xs,
    },
    emptyPaymentDescription: {
        color: Colors.textSecondary,
        fontSize: FontSize.bodySmall,
        lineHeight: RS(19),
        textAlign: 'center',
    },
    infoMessage: {
        color: Colors.warning,
        backgroundColor: Colors.warningLight,
        borderRadius: Radii.md,
        padding: Spacing.md,
        fontSize: FontSize.bodySmall,
        lineHeight: RS(20),
        marginTop: Spacing.md,
    },
    footer: {
        width: '100%',
        maxWidth: RS(560),
        alignSelf: 'center',
        paddingHorizontal: Spacing.xl,
        paddingTop: Spacing.sm,
        paddingBottom: Spacing.xs,
        backgroundColor: Colors.background,
    },
    nextButton: {
        minHeight: RS(54),
        borderRadius: Radii.pill,
        backgroundColor: Colors.warning,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.amberDark,
        shadowOffset: { width: RS(0), height: RS(5) },
        shadowOpacity: 0.18,
        shadowRadius: RS(9),
        elevation: 3,
    },
    nextButtonDisabled: {
        backgroundColor: Colors.amber,
        shadowOpacity: 0,
        elevation: 0,
    },
    nextButtonText: {
        color: Colors.white,
        fontSize: FontSize.bodyLarge,
        fontWeight: '600',
    },
    paymentButton: {
        minHeight: RS(54),
        borderRadius: Radii.pill,
        backgroundColor: Colors.primaryDark,
        alignItems: 'center',
        justifyContent: 'center',
    },
    paymentButtonDisabled: {
        backgroundColor: '#D8DADD',
    },
    paymentButtonDisabledText: {
        color: Colors.textSecondary,
        fontSize: FontSize.body,
        fontWeight: '600',
    },
    skipButton: {
        minHeight: RS(44),
        alignItems: 'center',
        justifyContent: 'center',
    },
    skipButtonText: {
        color: Colors.textPrimary,
        fontSize: FontSize.body,
        textDecorationLine: 'underline',
    },
});
