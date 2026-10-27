import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as DocumentPicker from 'expo-document-picker';
import { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    TextInput,
    View,
    useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import AppText from '../../../../components/AppText';
import ProviderTimePickerField from './components/ProviderTimePickerField';
import { Colors } from '../../../../core/theme/colors';
import { Radii, Spacing } from '../../../../core/theme/designTokens';
import { showErrorToast, showSuccessToast } from '../../../../core/utils/toast';
import { RF, RS } from '../../../../core/utils/responsive';
import { useAppSelector } from '../../../../store/hooks';
import type { ProviderStackParamList } from '../../navigation/provider.types';
import {
    fetchProviderCategories,
    submitProviderOnboarding,
    toProviderDocuments,
    uploadProviderDocuments,
    type ProviderCategory,
    type ProviderDocumentKey,
} from './providerOnboarding.api';

type Props = NativeStackScreenProps<ProviderStackParamList, 'ProviderOnboarding'>;
type DocumentSelection = Partial<Record<ProviderDocumentKey, DocumentPicker.DocumentPickerAsset>>;
type AvailabilityDay = { dayOfWeek: number; label: string };

const DAYS: AvailabilityDay[] = [
    { dayOfWeek: 1, label: 'Monday' },
    { dayOfWeek: 2, label: 'Tuesday' },
    { dayOfWeek: 3, label: 'Wednesday' },
    { dayOfWeek: 4, label: 'Thursday' },
    { dayOfWeek: 5, label: 'Friday' },
    { dayOfWeek: 6, label: 'Saturday' },
    { dayOfWeek: 0, label: 'Sunday' },
];

const REQUIRED_DOCUMENTS: {
    key: ProviderDocumentKey;
    title: string;
    detail: string;
}[] = [
    { key: 'GOVERNMENT_ID', title: 'Government ID', detail: 'Choose any file type' },
    { key: 'RIGHT_TO_WORK', title: 'Right to Work', detail: 'Choose any file type' },
    { key: 'LIABILITY_INSURANCE', title: 'Liability Insurance', detail: 'Choose any file type' },
    { key: 'REFERENCE', title: 'Reference', detail: 'Choose any file type' },
    { key: 'PROFILE_PHOTO', title: 'Profile Photo', detail: 'Choose any file type' },
];

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

const timeToMinutes = (value: string): number => {
    const [hours, minutes] = value.split(':').map(Number);
    return hours * 60 + minutes;
};

const parseCoverage = (value: string): string[] => (
    [...new Set(value.split(/[,\n;]/).map((postcode) => postcode.trim()).filter(Boolean))]
);

const ProviderOnboardingScreen = ({ navigation }: Props) => {
    const { width } = useWindowDimensions();
    const { account, role, token } = useAppSelector((state) => state.auth);
    const [step, setStep] = useState(1);
    const [bio, setBio] = useState('');
    const [coverageInput, setCoverageInput] = useState('');
    const [categories, setCategories] = useState<ProviderCategory[]>([]);
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [categoryError, setCategoryError] = useState<string>();
    const [categoryRetry, setCategoryRetry] = useState(0);
    const [selectedDays, setSelectedDays] = useState<number[]>([]);
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('17:00');
    const [documents, setDocuments] = useState<DocumentSelection>({});
    const [isPickingDocument, setIsPickingDocument] = useState<ProviderDocumentKey>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [onboardingSubmitted, setOnboardingSubmitted] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [formError, setFormError] = useState<string>();
    const isNarrow = width < 370;
    const coverage = useMemo(() => parseCoverage(coverageInput), [coverageInput]);

    useEffect(() => {
        const controller = new AbortController();
        void fetchProviderCategories(token ?? '', controller.signal)
            .then(setCategories)
            .catch((error: unknown) => {
                if (!controller.signal.aborted) {
                    setCategoryError(
                        error instanceof Error
                            ? error.message
                            : 'Could not load service categories. Please try again.',
                    );
                }
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setIsLoadingCategories(false);
                }
            });
        return () => controller.abort();
    }, [categoryRetry, token]);

    const goBack = () => {
        if (step > 1) {
            setStep((current) => current - 1);
            setFormError(undefined);
            return;
        }
        navigation.goBack();
    };

    const toggleCategory = (categoryId: string) => {
        setSelectedCategoryIds((current) => (
            current.includes(categoryId)
                ? current.filter((id) => id !== categoryId)
                : [...current, categoryId]
        ));
    };

    const toggleDay = (dayOfWeek: number) => {
        setSelectedDays((current) => (
            current.includes(dayOfWeek)
                ? current.filter((day) => day !== dayOfWeek)
                : [...current, dayOfWeek]
        ));
    };

    const pickDocument = async (documentKey: ProviderDocumentKey) => {
        if (isPickingDocument) {
            return;
        }
        setIsPickingDocument(documentKey);
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*',
                copyToCacheDirectory: true,
                multiple: false,
            });
            if (!result.canceled && result.assets[0]) {
                setDocuments((current) => ({ ...current, [documentKey]: result.assets[0] }));
            }
        } catch (error) {
            console.error('Unable to select provider document:', error);
            showErrorToast(
                'Could not select file',
                error instanceof Error ? error.message : 'Please choose the file again.',
            );
        } finally {
            setIsPickingDocument(undefined);
        }
    };

    const validateStep = (): boolean => {
        if (step === 1) {
            if (!bio.trim()) {
                setFormError('Add a short description of your experience.');
                return false;
            }
            if (coverage.length === 0) {
                setFormError('Add at least one postcode area you cover.');
                return false;
            }
            if (selectedCategoryIds.length === 0) {
                setFormError('Select at least one service category.');
                return false;
            }
            if (isLoadingCategories || categoryError) {
                setFormError('Service categories must load before you can continue.');
                return false;
            }
        }

        if (step === 2) {
            if (selectedDays.length === 0) {
                setFormError('Select at least one available day.');
                return false;
            }
            if (!TIME_PATTERN.test(startTime) || !TIME_PATTERN.test(endTime)) {
                setFormError('Enter start and end times in 24-hour format, such as 09:00.');
                return false;
            }
            if (timeToMinutes(startTime) >= timeToMinutes(endTime)) {
                setFormError('End time must be later than start time.');
                return false;
            }
        }

        setFormError(undefined);
        return true;
    };

    const submitApplication = async () => {
        if (isSubmitting) {
            return;
        }
        if (role !== 'PROVIDER' || !token) {
            setFormError('Please log in to your provider account before submitting onboarding.');
            return;
        }

        const completeDocuments = toProviderDocuments(documents);
        const missingDocument = REQUIRED_DOCUMENTS.find(({ key }) => !documents[key]);
        if (missingDocument) {
            setFormError(`Upload your ${missingDocument.title.toLowerCase()} to continue.`);
            return;
        }
        if (!completeDocuments) {
            setFormError('Select all required documents to continue.');
            return;
        }

        setIsSubmitting(true);
        setFormError(undefined);
        try {
            if (!onboardingSubmitted) {
                await submitProviderOnboarding(token, {
                    bio: bio.trim(),
                    postcodeCoverage: coverage,
                    categoryIds: selectedCategoryIds,
                    availability: selectedDays.map((dayOfWeek) => ({
                        dayOfWeek,
                        startTime,
                        endTime,
                    })),
                });
                setOnboardingSubmitted(true);
            }

            await uploadProviderDocuments(token, completeDocuments);
            setIsComplete(true);
            setStep(4);
            showSuccessToast('Application submitted', 'Your provider onboarding details were submitted.');
        } catch (error) {
            console.error('Unable to submit provider onboarding:', error);
            showErrorToast(
                'Submission failed',
                error instanceof Error ? error.message : 'Please try again.',
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderCategories = () => {
        if (isLoadingCategories) {
            return (
                <View style={styles.inlineStatus}>
                    <ActivityIndicator color={NAVY} />
                    <AppText style={styles.helperText}>Loading service categories...</AppText>
                </View>
            );
        }
        if (categoryError) {
            return (
                <View style={styles.categoryError}>
                    <AppText style={styles.errorText}>{categoryError}</AppText>
                    <Pressable
                        accessibilityRole="button"
                        onPress={() => {
                            setIsLoadingCategories(true);
                            setCategoryError(undefined);
                            setCategoryRetry((current) => current + 1);
                        }}
                    >
                        <AppText style={styles.retryText}>Try again</AppText>
                    </Pressable>
                </View>
            );
        }
        if (categories.length === 0) {
            return <AppText style={styles.helperText}>No service categories are available yet.</AppText>;
        }
        return (
            <View style={[styles.categoryList, isNarrow && styles.categoryListNarrow]}>
                {categories.map((category) => {
                    const selected = selectedCategoryIds.includes(category.id);
                    return (
                        <Pressable
                            key={category.id}
                            accessibilityRole="checkbox"
                            accessibilityState={{ checked: selected }}
                            onPress={() => toggleCategory(category.id)}
                            style={({ pressed }) => [
                                styles.categoryChip,
                                selected && styles.categoryChipSelected,
                                pressed && styles.pressed,
                            ]}
                        >
                            <AppText style={[styles.categoryLabel, selected && styles.categoryLabelSelected]}>
                                {category.name}
                            </AppText>
                        </Pressable>
                    );
                })}
            </View>
        );
    };

    const renderStepContent = () => {
        if (step === 1) {
            return (
                <View>
                    <AppText style={styles.title}>Tell us about your services</AppText>
                    <AppText style={styles.description}>
                        Share your experience, service categories, and the postcode areas you cover.
                    </AppText>
                    <AppText style={styles.fieldLabel}>Professional bio</AppText>
                    <TextInput
                        value={bio}
                        onChangeText={setBio}
                        placeholder="e.g. 10 years of plumbing experience"
                        placeholderTextColor="#77859A"
                        multiline
                        textAlignVertical="top"
                        accessibilityLabel="Professional bio"
                        style={styles.multilineInput}
                    />
                    <AppText style={styles.fieldLabel}>Postcode coverage</AppText>
                    <TextInput
                        value={coverageInput}
                        onChangeText={setCoverageInput}
                        placeholder="Enter areas separated by commas, e.g. SW1, SW3"
                        placeholderTextColor="#77859A"
                        autoCapitalize="characters"
                        accessibilityLabel="Postcode coverage"
                        style={styles.input}
                    />
                    <AppText style={[styles.fieldLabel, styles.sectionLabel]}>Service categories</AppText>
                    {renderCategories()}
                </View>
            );
        }

        if (step === 2) {
            return (
                <View>
                    <AppText style={styles.title}>Set your availability</AppText>
                    <AppText style={styles.description}>
                        Select the days you work and the hours you are available each day.
                    </AppText>
                    <View style={styles.days}>
                        {DAYS.map(({ dayOfWeek, label }) => {
                            const selected = selectedDays.includes(dayOfWeek);
                            return (
                                <Pressable
                                    key={dayOfWeek}
                                    accessibilityRole="checkbox"
                                    accessibilityState={{ checked: selected }}
                                    onPress={() => toggleDay(dayOfWeek)}
                                    style={({ pressed }) => [
                                        styles.dayButton,
                                        selected && styles.dayButtonSelected,
                                        pressed && styles.pressed,
                                    ]}
                                >
                                    <AppText style={[styles.dayLabel, selected && styles.dayLabelSelected]}>
                                        {label}
                                    </AppText>
                                </Pressable>
                            );
                        })}
                    </View>
                    <View style={styles.timeFields}>
                        <ProviderTimePickerField
                            label="Start time"
                            accessibilityLabel="Availability start time"
                            value={startTime}
                            onChange={setStartTime}
                        />
                        <ProviderTimePickerField
                            label="End time"
                            accessibilityLabel="Availability end time"
                            value={endTime}
                            onChange={setEndTime}
                        />
                    </View>
                    <AppText style={styles.helperText}>Use 24-hour time, for example 09:00 to 17:00.</AppText>
                </View>
            );
        }

        if (step === 3) {
            return (
                <View>
                    <AppText style={styles.title}>Upload your documents</AppText>
                    <AppText style={styles.description}>
                        Select each file required to complete your provider application.
                    </AppText>
                    <View style={styles.documents}>
                        {REQUIRED_DOCUMENTS.map((document) => {
                            const selectedDocument = documents[document.key];
                            const isPicking = isPickingDocument === document.key;
                            return (
                                <View key={document.key} style={styles.documentCard}>
                                    <View style={styles.documentCopy}>
                                        <AppText style={styles.documentTitle}>{document.title}</AppText>
                                        <AppText style={styles.documentDetail}>
                                            {selectedDocument?.name ?? document.detail}
                                        </AppText>
                                    </View>
                                    <Pressable
                                        accessibilityRole="button"
                                        accessibilityLabel={`${selectedDocument ? 'Change' : 'Choose'} ${document.title}`}
                                        disabled={Boolean(isPickingDocument)}
                                        onPress={() => void pickDocument(document.key)}
                                        style={({ pressed }) => [
                                            styles.uploadButton,
                                            selectedDocument && styles.uploadButtonSelected,
                                            pressed && styles.pressed,
                                        ]}
                                    >
                                        {isPicking ? (
                                            <ActivityIndicator color={NAVY} />
                                        ) : (
                                            <AppText style={styles.uploadText}>
                                                {selectedDocument ? 'Change' : 'Choose file'}
                                            </AppText>
                                        )}
                                    </Pressable>
                                </View>
                            );
                        })}
                    </View>
                    <AppText style={styles.helperText}>Documents can be images or PDF files. Profile photo must be an image.</AppText>
                </View>
            );
        }

        return (
            <View>
                <AppText style={styles.title}>Application submitted</AppText>
                <AppText style={styles.description}>
                    Your provider details and documents have been submitted successfully.
                </AppText>
                <View style={styles.successCard}>
                    <AppText style={styles.successTitle}>You&apos;re all set{account?.fullName ? `, ${account.fullName}` : ''}.</AppText>
                    <AppText style={styles.successDescription}>
                        You can continue to your provider dashboard.
                    </AppText>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <View style={styles.page}>
                    <View style={styles.topBar}>
                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel={step === 4 ? 'Go back to onboarding' : 'Go back'}
                            onPress={goBack}
                            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
                        >
                            <Svg width={RS(25)} height={RS(25)} viewBox="0 0 24 24">
                                <Path
                                    d="m15 18-6-6 6-6"
                                    fill="none"
                                    stroke={NAVY}
                                    strokeWidth="2.4"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </Svg>
                        </Pressable>
                        <AppText style={styles.stepLabel}>
                            {step < 4 ? `Step ${step} of 3` : 'Complete'}
                        </AppText>
                        <View style={styles.topBarSpacer} />
                    </View>

                    {step < 4 ? (
                        <View style={styles.progressTrack} accessibilityLabel={`Step ${step} of 3`}>
                            {[1, 2, 3].map((item) => (
                                <View
                                    key={item}
                                    style={[styles.progressSegment, item <= step && styles.progressActive]}
                                />
                            ))}
                        </View>
                    ) : null}

                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        {renderStepContent()}
                        {formError ? <AppText style={styles.errorText}>{formError}</AppText> : null}
                    </ScrollView>

                    <View style={styles.bottomAction}>
                        {step < 3 ? (
                            <Pressable
                                accessibilityRole="button"
                                onPress={() => {
                                    if (validateStep()) {
                                        setStep((current) => current + 1);
                                    }
                                }}
                                style={({ pressed }) => [styles.nextButton, pressed && styles.pressed]}
                            >
                                <AppText style={styles.nextText}>Continue</AppText>
                            </Pressable>
                        ) : step === 3 ? (
                            <Pressable
                                accessibilityRole="button"
                                disabled={isSubmitting}
                                onPress={() => void submitApplication()}
                                style={({ pressed }) => [
                                    styles.nextButton,
                                    isSubmitting && styles.disabledButton,
                                    pressed && styles.pressed,
                                ]}
                            >
                                {isSubmitting ? (
                                    <ActivityIndicator color={Colors.white} />
                                ) : (
                                    <AppText style={styles.nextText}>Submit application</AppText>
                                )}
                            </Pressable>
                        ) : (
                            <Pressable
                                accessibilityRole="button"
                                disabled={!isComplete}
                                onPress={() => navigation.replace('ProviderDashboard')}
                                style={({ pressed }) => [
                                    styles.nextButton,
                                    !isComplete && styles.disabledButton,
                                    pressed && styles.pressed,
                                ]}
                            >
                                <AppText style={styles.nextText}>Go to dashboard</AppText>
                            </Pressable>
                        )}
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ProviderOnboardingScreen;

const NAVY = '#10264D';

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F4F8FD',
    },
    keyboardView: {
        flex: 1,
    },
    page: {
        flex: 1,
        paddingHorizontal: RS(24),
        paddingTop: RS(8),
    },
    topBar: {
        minHeight: RS(44),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        width: RS(38),
        height: RS(40),
        justifyContent: 'center',
    },
    stepLabel: {
        color: NAVY,
        fontSize: RF(16),
        fontWeight: '500',
    },
    topBarSpacer: {
        width: RS(38),
    },
    progressTrack: {
        flexDirection: 'row',
        gap: RS(5),
        marginTop: RS(8),
        marginBottom: RS(24),
    },
    progressSegment: {
        flex: 1,
        height: RS(7),
        borderRadius: Radii.pill,
        backgroundColor: '#DCE4EF',
    },
    progressActive: {
        backgroundColor: '#3D8FEA',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: RS(14),
    },
    title: {
        color: NAVY,
        fontSize: RF(27),
        lineHeight: RS(35),
        fontWeight: '700',
        marginBottom: RS(8),
    },
    description: {
        color: '#667487',
        fontSize: RF(16),
        lineHeight: RS(24),
        marginBottom: RS(22),
    },
    fieldLabel: {
        color: '#718096',
        fontSize: RF(15),
        lineHeight: RS(21),
        marginBottom: RS(6),
    },
    sectionLabel: {
        marginTop: RS(22),
    },
    input: {
        minHeight: RS(50),
        borderWidth: 1,
        borderColor: '#C9D5E6',
        borderRadius: RS(10),
        backgroundColor: Colors.white,
        paddingHorizontal: RS(15),
        color: NAVY,
        fontSize: RF(16),
        marginBottom: RS(18),
    },
    multilineInput: {
        minHeight: RS(100),
        borderWidth: 1,
        borderColor: '#C9D5E6',
        borderRadius: RS(10),
        backgroundColor: Colors.white,
        padding: RS(14),
        color: NAVY,
        fontSize: RF(16),
        lineHeight: RS(22),
        marginBottom: RS(18),
    },
    categoryList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: RS(10),
    },
    categoryListNarrow: {
        gap: RS(8),
    },
    categoryChip: {
        minHeight: RS(44),
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#C9D5E6',
        borderRadius: Radii.pill,
        backgroundColor: Colors.white,
        paddingHorizontal: RS(16),
    },
    categoryChipSelected: {
        borderColor: NAVY,
        backgroundColor: '#E8EEF6',
    },
    categoryLabel: {
        color: NAVY,
        fontSize: RF(15),
    },
    categoryLabelSelected: {
        fontWeight: '700',
    },
    inlineStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: RS(10),
    },
    helperText: {
        color: '#718096',
        fontSize: RF(13),
        lineHeight: RS(19),
        marginTop: RS(7),
    },
    categoryError: {
        gap: RS(8),
    },
    errorText: {
        color: Colors.failed,
        fontSize: RF(14),
        lineHeight: RS(20),
        marginTop: RS(10),
    },
    retryText: {
        color: NAVY,
        fontSize: RF(14),
        fontWeight: '700',
        textDecorationLine: 'underline',
    },
    days: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: RS(9),
        marginBottom: RS(24),
    },
    dayButton: {
        minHeight: RS(43),
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#C9D5E6',
        borderRadius: Radii.pill,
        backgroundColor: Colors.white,
        paddingHorizontal: RS(13),
    },
    dayButtonSelected: {
        borderColor: NAVY,
        backgroundColor: '#E8EEF6',
    },
    dayLabel: {
        color: NAVY,
        fontSize: RF(14),
    },
    dayLabelSelected: {
        fontWeight: '700',
    },
    timeFields: {
        flexDirection: 'row',
        gap: RS(12),
    },
    documents: {
        gap: RS(12),
    },
    documentCard: {
        minHeight: RS(84),
        flexDirection: 'row',
        alignItems: 'center',
        gap: RS(10),
        borderWidth: 1,
        borderColor: '#C9D5E6',
        borderRadius: RS(15),
        backgroundColor: Colors.white,
        paddingHorizontal: RS(13),
        paddingVertical: RS(10),
    },
    documentCopy: {
        flex: 1,
        gap: RS(3),
    },
    documentTitle: {
        color: NAVY,
        fontSize: RF(15),
        lineHeight: RS(20),
        fontWeight: '600',
    },
    documentDetail: {
        color: '#6B7787',
        fontSize: RF(13),
        lineHeight: RS(18),
    },
    uploadButton: {
        minHeight: RS(40),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: Radii.pill,
        backgroundColor: '#E7EDF5',
        paddingHorizontal: RS(12),
    },
    uploadButtonSelected: {
        backgroundColor: '#E1F2EB',
    },
    uploadText: {
        color: NAVY,
        fontSize: RF(13),
        fontWeight: '600',
    },
    successCard: {
        borderWidth: 1,
        borderColor: '#A9DCCF',
        borderRadius: RS(18),
        backgroundColor: '#E8F7F3',
        padding: RS(18),
    },
    successTitle: {
        color: '#218D70',
        fontSize: RF(18),
        fontWeight: '700',
        marginBottom: RS(6),
    },
    successDescription: {
        color: '#218D70',
        fontSize: RF(14),
        lineHeight: RS(20),
    },
    bottomAction: {
        paddingTop: RS(12),
        paddingBottom: RS(8),
    },
    nextButton: {
        minHeight: RS(56),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: Radii.pill,
        backgroundColor: NAVY,
        paddingHorizontal: Spacing.lg,
    },
    disabledButton: {
        opacity: 0.65,
    },
    nextText: {
        color: Colors.white,
        fontSize: RF(17),
        fontWeight: '600',
    },
    pressed: {
        opacity: 0.78,
    },
});
