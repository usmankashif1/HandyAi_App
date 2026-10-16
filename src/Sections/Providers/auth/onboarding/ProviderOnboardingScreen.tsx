import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import {
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
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import AppText from '../../../../components/AppText';
import { Colors } from '../../../../core/theme/colors';
import { Radii, Spacing } from '../../../../core/theme/designTokens';
import { RS } from '../../../../core/utils/responsive';
import type { ProviderStackParamList } from '../../navigation/provider.types';

type Props = NativeStackScreenProps<ProviderStackParamList, 'SignUp'>;
type ProfileField = 'fullName' | 'phone' | 'address' | 'postcode';
type Service = 'Cleaning' | 'Handyman' | 'Electrical' | 'Plumbing';

const PROFILE_FIELDS: { key: ProfileField; label: string; placeholder: string; keyboardType?: 'phone-pad' }[] = [
    { key: 'fullName', label: 'Full Name', placeholder: 'e.g. Ahmed Khan' },
    { key: 'phone', label: 'Phone Number', placeholder: '+92 300 1234567', keyboardType: 'phone-pad' },
    { key: 'address', label: 'Primary Address', placeholder: 'House 12, Street 4, Islamabad' },
    { key: 'postcode', label: 'Postcode', placeholder: '44000' },
];

const SERVICES: { name: Service; icon: string }[] = [
    { name: 'Cleaning', icon: '✦' },
    { name: 'Handyman', icon: '⌁' },
    { name: 'Electrical', icon: 'ϟ' },
    { name: 'Plumbing', icon: '♧' },
];

const DOCUMENTS = [
    { title: 'Government ID', detail: 'Passport / Driving License', icon: 'id' },
    { title: 'Right to Work', detail: 'Work Permit / Visa', icon: 'work' },
    { title: 'Public Liability Insurance', detail: 'Certificate (min. £1M)', icon: 'shield' },
    { title: 'Professional License', detail: 'Trade License / Certification (if applicable)', icon: 'license' },
];

const StepIcon = ({ kind }: { kind: string }) => (
    <Svg width={RS(31)} height={RS(31)} viewBox="0 0 32 32" fill="none">
        {kind === 'id' && (
            <>
                <Rect x="3" y="6" width="26" height="20" rx="2" stroke="#10264D" strokeWidth="2" />
                <Circle cx="11" cy="14" r="3" stroke="#10264D" strokeWidth="2" />
                <Path d="M6.5 22c.8-3 2.3-4 4.5-4s3.7 1 4.5 4M19 12h6m-6 5h6m-6 5h4" stroke="#10264D" strokeWidth="2" strokeLinecap="round" />
            </>
        )}
        {kind === 'work' && (
            <>
                <Rect x="6" y="3" width="20" height="26" rx="2" stroke="#10264D" strokeWidth="2" />
                <Circle cx="16" cy="14" r="6" stroke="#10264D" strokeWidth="2" />
                <Path d="M10 14h12m-6-6c2 2 2 10 0 12m-6-6c1-2 3-3 6-3s5 1 6 3m-11 8h10" stroke="#10264D" strokeWidth="1.8" strokeLinecap="round" />
            </>
        )}
        {kind === 'shield' && (
            <>
                <Path d="M16 3 27 7v8c0 7-4.5 11.5-11 14-6.5-2.5-11-7-11-14V7l11-4Z" stroke="#10264D" strokeWidth="2.2" strokeLinejoin="round" />
                <Path d="m10.5 16 3.5 3.5 7.5-8" stroke="#10264D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </>
        )}
        {kind === 'license' && (
            <>
                <Rect x="4" y="3" width="24" height="25" rx="2" stroke="#10264D" strokeWidth="2" />
                <Path d="M9 9h14M9 14h14M9 19h8m5 3 3 2v-8" stroke="#10264D" strokeWidth="2" strokeLinecap="round" />
            </>
        )}
    </Svg>
);

const ProviderOnboardingScreen = ({ navigation }: Props) => {
    const { width } = useWindowDimensions();
    const [step, setStep] = useState(1);
    const [profile, setProfile] = useState<Record<ProfileField, string>>({
        fullName: '',
        phone: '',
        address: '',
        postcode: '',
    });
    const [selectedServices, setSelectedServices] = useState<Service[]>(['Cleaning', 'Handyman']);
    const [experience, setExperience] = useState('');
    const isNarrow = width < 370;

    const goBack = () => {
        if (step > 1) {
            setStep((current) => current - 1);
            return;
        }
        navigation.goBack();
    };

    const toggleService = (service: Service) => {
        setSelectedServices((current) =>
            current.includes(service)
                ? current.filter((selected) => selected !== service)
                : [...current, service],
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
                            accessibilityLabel="Go back"
                            onPress={goBack}
                            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
                        >
                            <Svg width={RS(25)} height={RS(25)} viewBox="0 0 24 24">
                                <Path d="m15 18-6-6 6-6" fill="none" stroke={NAVY} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                            </Svg>
                        </Pressable>
                        <AppText style={styles.stepLabel}>Step {step} of 4</AppText>
                        <View style={styles.topBarSpacer} />
                    </View>

                    <View style={styles.progressTrack} accessibilityLabel={`Step ${step} of 4`}>
                        {[1, 2, 3, 4].map((item) => (
                            <View
                                key={item}
                                style={[styles.progressSegment, item <= step && styles.progressActive]}
                            />
                        ))}
                    </View>

                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        {step === 1 && (
                            <View>
                                <AppText style={styles.title}>Tell us about yourself</AppText>
                                <AppText style={styles.description}>
                                    We&apos;ll use this information to verify your identity and set up your provider account.
                                </AppText>
                                <View style={styles.fields}>
                                    {PROFILE_FIELDS.map((field) => (
                                        <View key={field.key} style={styles.field}>
                                            <AppText style={styles.fieldLabel}>{field.label}</AppText>
                                            <TextInput
                                                value={profile[field.key]}
                                                onChangeText={(value) =>
                                                    setProfile((current) => ({ ...current, [field.key]: value }))
                                                }
                                                placeholder={field.placeholder}
                                                placeholderTextColor="#77859A"
                                                keyboardType={field.keyboardType ?? 'default'}
                                                autoCapitalize="words"
                                                style={styles.input}
                                            />
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}

                        {step === 2 && (
                            <View>
                                <AppText style={styles.title}>Select Your Services</AppText>
                                <AppText style={styles.description}>
                                    Choose the services you are qualified to provide.
                                </AppText>
                                <View style={styles.services}>
                                    {SERVICES.map(({ name, icon }) => {
                                        const selected = selectedServices.includes(name);
                                        return (
                                            <Pressable
                                                key={name}
                                                accessibilityRole="checkbox"
                                                accessibilityState={{ checked: selected }}
                                                onPress={() => toggleService(name)}
                                                style={({ pressed }) => [
                                                    styles.serviceCard,
                                                    isNarrow && styles.serviceCardNarrow,
                                                    selected && styles.serviceCardSelected,
                                                    pressed && styles.pressed,
                                                ]}
                                            >
                                                <View style={styles.serviceIcon}>
                                                    <AppText style={styles.serviceGlyph}>{icon}</AppText>
                                                </View>
                                                <AppText style={styles.serviceName}>{name}</AppText>
                                                <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
                                                    {selected && <AppText style={styles.checkmark}>✓</AppText>}
                                                </View>
                                            </Pressable>
                                        );
                                    })}
                                </View>
                                <AppText style={styles.fieldLabel}>
                                    Add Skills &amp; Experience <AppText style={styles.optional}>(Optional)</AppText>
                                </AppText>
                                <TextInput
                                    value={experience}
                                    onChangeText={setExperience}
                                    placeholder="e.g. 5+ years experience, kitchen & bathroom specialist..."
                                    placeholderTextColor="#77859A"
                                    multiline
                                    textAlignVertical="top"
                                    style={styles.experienceInput}
                                />
                            </View>
                        )}

                        {step === 3 && (
                            <View>
                                <AppText style={styles.title}>Upload Your Documents</AppText>
                                <AppText style={styles.description}>
                                    Please upload clear photos of your documents. We&apos;ll verify them manually.
                                </AppText>
                                <View style={styles.documents}>
                                    {DOCUMENTS.map((document) => (
                                        <View key={document.title} style={styles.documentCard}>
                                            <View style={styles.documentIcon}>
                                                <StepIcon kind={document.icon} />
                                            </View>
                                            <View style={styles.documentCopy}>
                                                <AppText style={styles.documentTitle}>{document.title}</AppText>
                                                <AppText style={styles.documentDetail}>{document.detail}</AppText>
                                            </View>
                                            <View style={styles.uploadPill}>
                                                <AppText style={styles.uploadText}>Upload</AppText>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}

                        {step === 4 && (
                            <View>
                                <AppText style={styles.title}>Application Submitted</AppText>
                                <AppText style={styles.description}>
                                    Your application has been submitted and is under manual review by our team.
                                </AppText>
                                <View style={styles.reviewCard}>
                                    <View style={styles.reviewIcon}>
                                        <Svg width={RS(42)} height={RS(42)} viewBox="0 0 42 42">
                                            <Circle cx="21" cy="21" r="17" fill="none" stroke="#218D70" strokeWidth="3" />
                                            <Path d="M21 11v11l7 4" fill="none" stroke="#218D70" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                        </Svg>
                                    </View>
                                    <View style={styles.reviewCopy}>
                                        <AppText style={styles.reviewTitle}>Under Manual Team Review</AppText>
                                        <AppText style={styles.reviewText}>We&apos;ll notify you within 1-3 business days.</AppText>
                                    </View>
                                </View>
                                <AppText style={styles.meanwhileTitle}>Meanwhile, you can:</AppText>
                                {['Set your availability', 'Complete your profile', 'Explore available jobs'].map((item) => (
                                    <View key={item} style={styles.checklistItem}>
                                        <View style={styles.checklistCheck}>
                                            <AppText style={styles.checklistCheckText}>✓</AppText>
                                        </View>
                                        <AppText style={styles.checklistText}>{item}</AppText>
                                    </View>
                                ))}
                            </View>
                        )}
                    </ScrollView>

                    <View style={styles.bottomAction}>
                        {step < 4 ? (
                            <Pressable
                                accessibilityRole="button"
                                onPress={() => setStep((current) => current + 1)}
                                style={({ pressed }) => [styles.nextButton, pressed && styles.pressed]}
                            >
                                <AppText style={styles.nextText}>Next</AppText>
                            </Pressable>
                        ) : (
                            <Pressable
                                accessibilityRole="button"
                                onPress={() => navigation.navigate('ProviderDashboard')}
                                style={({ pressed }) => [
                                    styles.nextButton,
                                    styles.dashboardButton,
                                    pressed && styles.pressed,
                                ]}
                            >
                                <AppText style={styles.nextText}>Go to Dashboard</AppText>
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
        fontSize: RS(16),
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
        fontSize: RS(27),
        lineHeight: RS(35),
        fontWeight: '700',
        marginBottom: RS(8),
    },
    description: {
        color: '#667487',
        fontSize: RS(16),
        lineHeight: RS(24),
        marginBottom: RS(22),
    },
    fields: {
        gap: RS(14),
    },
    field: {
        gap: RS(6),
    },
    fieldLabel: {
        color: '#718096',
        fontSize: RS(15),
        lineHeight: RS(21),
    },
    input: {
        minHeight: RS(50),
        borderWidth: 1,
        borderColor: '#C9D5E6',
        borderRadius: RS(10),
        backgroundColor: Colors.white,
        paddingHorizontal: RS(15),
        color: NAVY,
        fontSize: RS(16),
    },
    services: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        rowGap: RS(12),
        marginBottom: RS(23),
    },
    serviceCard: {
        width: '48.5%',
        minHeight: RS(140),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: RS(1.2),
        borderColor: '#D0DBE9',
        borderRadius: RS(15),
        backgroundColor: Colors.white,
        padding: RS(11),
    },
    serviceCardNarrow: {
        width: '100%',
        minHeight: RS(82),
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: RS(12),
        paddingHorizontal: RS(16),
    },
    serviceCardSelected: {
        borderColor: '#3D8FEA',
    },
    serviceIcon: {
        width: RS(60),
        height: RS(60),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: Radii.pill,
        backgroundColor: '#EEF3F9',
        marginBottom: RS(6),
    },
    serviceGlyph: {
        color: NAVY,
        fontSize: RS(31),
        lineHeight: RS(38),
    },
    serviceName: {
        color: NAVY,
        fontSize: RS(16),
        fontWeight: '500',
    },
    checkbox: {
        position: 'absolute',
        top: RS(10),
        right: RS(10),
        width: RS(23),
        height: RS(23),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: '#C9D5E6',
        borderRadius: RS(5),
    },
    checkboxSelected: {
        borderColor: '#3D8FEA',
        backgroundColor: NAVY,
    },
    checkmark: {
        color: Colors.white,
        fontSize: RS(15),
        lineHeight: RS(19),
        fontWeight: '700',
    },
    optional: {
        color: '#718096',
        fontSize: RS(14),
    },
    experienceInput: {
        minHeight: RS(105),
        borderWidth: 1,
        borderColor: '#C9D5E6',
        borderRadius: RS(10),
        backgroundColor: Colors.white,
        padding: RS(14),
        color: NAVY,
        fontSize: RS(15),
        lineHeight: RS(22),
        marginTop: RS(8),
    },
    documents: {
        gap: RS(12),
    },
    documentCard: {
        minHeight: RS(92),
        flexDirection: 'row',
        alignItems: 'center',
        gap: RS(10),
        borderWidth: 1,
        borderColor: '#C9D5E6',
        borderRadius: RS(15),
        backgroundColor: Colors.white,
        paddingHorizontal: RS(12),
        paddingVertical: RS(10),
    },
    documentIcon: {
        width: RS(58),
        height: RS(58),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: Radii.pill,
        backgroundColor: '#E8EEF6',
    },
    documentCopy: {
        flex: 1,
        gap: RS(2),
    },
    documentTitle: {
        color: NAVY,
        fontSize: RS(15),
        lineHeight: RS(20),
        fontWeight: '600',
    },
    documentDetail: {
        color: '#6B7787',
        fontSize: RS(13),
        lineHeight: RS(18),
    },
    uploadPill: {
        minHeight: RS(40),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: Radii.pill,
        backgroundColor: '#E7EDF5',
        paddingHorizontal: RS(13),
    },
    uploadText: {
        color: NAVY,
        fontSize: RS(14),
        fontWeight: '500',
    },
    reviewCard: {
        minHeight: RS(100),
        flexDirection: 'row',
        alignItems: 'center',
        gap: RS(13),
        borderWidth: 1,
        borderColor: '#A9DCCF',
        borderRadius: RS(20),
        backgroundColor: '#E8F7F3',
        padding: RS(16),
        marginTop: RS(4),
        marginBottom: RS(34),
    },
    reviewIcon: {
        width: RS(48),
        alignItems: 'center',
    },
    reviewCopy: {
        flex: 1,
        gap: RS(5),
    },
    reviewTitle: {
        color: '#218D70',
        fontSize: RS(17),
        fontWeight: '700',
    },
    reviewText: {
        color: '#218D70',
        fontSize: RS(14),
        lineHeight: RS(20),
    },
    meanwhileTitle: {
        color: '#172643',
        fontSize: RS(18),
        fontWeight: '600',
        marginBottom: RS(12),
    },
    checklistItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: RS(13),
        marginBottom: RS(14),
    },
    checklistCheck: {
        width: RS(23),
        height: RS(23),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: Radii.pill,
        backgroundColor: '#2DA181',
    },
    checklistCheckText: {
        color: Colors.white,
        fontSize: RS(14),
        fontWeight: '700',
    },
    checklistText: {
        color: '#26364F',
        fontSize: RS(16),
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
    dashboardButton: {
        marginTop: 'auto',
    },
    nextText: {
        color: Colors.white,
        fontSize: RS(17),
        fontWeight: '600',
    },
    pressed: {
        opacity: 0.78,
    },
});
