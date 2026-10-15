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
import AppText from '../../../components/AppText';
import { Colors } from '../../../core/theme/colors';
import { FontSize, Spacing } from '../../../core/theme/designTokens';
import { RS } from '../../../core/utils/responsive';
import { showSuccessToast } from '../../../core/utils/toast';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { loadUserProfile, saveUserProfile } from '../../../store/slices/profileSlice';
import type { ProfileStackParamList, UserProfile } from '../profile.types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'UpdateProfile'>;

type FormValues = {
    fullName: string;
    address: string;
    postcode: string;
    householdNotes: string;
};

const UpdateProfileScreen = ({ navigation }: Props) => {
    const dispatch = useAppDispatch();
    const token = useAppSelector((state) => state.auth.token);
    const { profile, isLoading, error } = useAppSelector((state) => state.profile);

    useEffect(() => {
        if (!profile && !isLoading && !error && token) {
            void dispatch(loadUserProfile({ accessToken: token }));
        }
    }, [dispatch, error, isLoading, profile, token]);

    const isInitialLoading = !profile && isLoading;

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
                            onPress={() => navigation.goBack()}
                            style={styles.backButton}
                            accessibilityRole="button"
                            accessibilityLabel="Go back"
                        >
                            <AppText style={styles.backArrow}>‹</AppText>
                        </TouchableOpacity>
                        <AppText style={styles.title}>Update Profile</AppText>
                        <View style={styles.headerSpacer} />
                    </View>

                    {isInitialLoading ? (
                        <View style={styles.centerState}>
                            <ActivityIndicator size="large" color={Colors.primaryDark} />
                            <AppText style={styles.stateText}>Loading your profile…</AppText>
                        </View>
                    ) : !profile ? (
                        <View style={styles.centerState}>
                            <AppText style={styles.errorText}>
                                {error ?? 'Your profile could not be loaded.'}
                            </AppText>
                            <TouchableOpacity
                                onPress={() => {
                                    if (token) {
                                        void dispatch(loadUserProfile({ accessToken: token }));
                                    }
                                }}
                                style={styles.retryButton}
                                accessibilityRole="button"
                            >
                                <AppText style={styles.retryText}>Try again</AppText>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <ProfileEditor profile={profile} token={token} onSaved={() => navigation.goBack()} />
                    )}
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

type ProfileEditorProps = {
    profile: UserProfile;
    token: string | null;
    onSaved: () => void;
};

const ProfileEditor = ({ profile, token, onSaved }: ProfileEditorProps) => {
    const dispatch = useAppDispatch();
    const error = useAppSelector((state) => state.profile.error);
    const [values, setValues] = useState<FormValues>(() => ({
        fullName: profile.fullName,
        address: profile.address ?? '',
        postcode: profile.postcode ?? '',
        householdNotes: profile.householdNotes ?? '',
    }));
    const [validationError, setValidationError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const updateField = (field: keyof FormValues, value: string) => {
        setValues((current) => ({ ...current, [field]: value }));
        setValidationError(null);
    };

    const handleSave = async () => {
        if (isSaving) {
            return;
        }
        if (!token) {
            setValidationError('Your session has expired. Please sign in again.');
            return;
        }
        if (!values.fullName.trim()) {
            setValidationError('Enter your full name.');
            return;
        }

        setIsSaving(true);
        setValidationError(null);
        try {
            await dispatch(saveUserProfile({
                accessToken: token,
                updates: {
                    fullName: values.fullName.trim(),
                    address: values.address.trim() || null,
                    postcode: values.postcode.trim() || null,
                    householdNotes: values.householdNotes.trim() || null,
                },
            })).unwrap();
            showSuccessToast('Profile updated');
            onSaved();
        } catch (saveError) {
            console.error('Unable to update profile:', saveError);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <AppText style={styles.description}>
                    Update your account details below.
                </AppText>
                {validationError || error ? (
                    <View style={styles.errorCard} accessibilityRole="alert">
                        <AppText style={styles.errorText}>
                            {validationError ?? error}
                        </AppText>
                    </View>
                ) : null}
                <View style={styles.form}>
                    <ProfileField
                        label="Full name"
                        value={values.fullName}
                        placeholder="Enter your full name"
                        onChangeText={(value) => updateField('fullName', value)}
                        autoCapitalize="words"
                    />
                    <ProfileField
                        label="Address"
                        value={values.address}
                        placeholder="Enter your address"
                        onChangeText={(value) => updateField('address', value)}
                        autoCapitalize="words"
                    />
                    <ProfileField
                        label="Postcode"
                        value={values.postcode}
                        placeholder="Enter your postcode"
                        onChangeText={(value) => updateField('postcode', value)}
                        autoCapitalize="characters"
                    />
                    <ProfileField
                        label="Household notes"
                        value={values.householdNotes}
                        placeholder="Add any details that will help your service provider"
                        onChangeText={(value) => updateField('householdNotes', value)}
                        multiline
                    />
                </View>
            </ScrollView>

            <TouchableOpacity
                onPress={() => void handleSave()}
                disabled={isSaving}
                style={[styles.saveButton, isSaving && styles.disabledButton]}
                accessibilityRole="button"
                accessibilityLabel="Save profile changes"
            >
                {isSaving ? (
                    <ActivityIndicator color={Colors.white} />
                ) : (
                    <AppText style={styles.saveText}>Save Changes</AppText>
                )}
            </TouchableOpacity>
        </>
    );
};

type ProfileFieldProps = {
    label: string;
    value: string;
    placeholder: string;
    onChangeText: (value: string) => void;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    multiline?: boolean;
};

const ProfileField = ({
    label,
    value,
    placeholder,
    onChangeText,
    autoCapitalize = 'sentences',
    multiline = false,
}: ProfileFieldProps) => (
    <View style={styles.fieldGroup}>
        <AppText style={styles.fieldLabel}>{label}</AppText>
        <TextInput
            style={[styles.input, multiline && styles.multilineInput]}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={Colors.textLight}
            autoCapitalize={autoCapitalize}
            autoCorrect={false}
            multiline={multiline}
            textAlignVertical={multiline ? 'top' : 'center'}
            accessibilityLabel={label}
        />
    </View>
);

export default UpdateProfileScreen;

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
        height: RS(40),
        alignItems: 'center',
        justifyContent: 'center',
    },
    backArrow: {
        color: Colors.textPrimary,
        fontSize: RS(36),
        lineHeight: RS(40),
    },
    title: {
        color: Colors.textPrimary,
        fontSize: FontSize.subheading,
        fontWeight: '700',
    },
    headerSpacer: {
        width: RS(40),
    },
    scrollContent: {
        flexGrow: 1,
        gap: RS(20),
        paddingHorizontal: Spacing.md,
        paddingTop: RS(18),
        paddingBottom: RS(20),
    },
    description: {
        color: Colors.textSecondary,
        fontSize: FontSize.body,
    },
    form: {
        gap: RS(18),
    },
    fieldGroup: {
        gap: RS(8),
    },
    fieldLabel: {
        color: Colors.textPrimary,
        fontSize: FontSize.body,
        fontWeight: '600',
    },
    input: {
        minHeight: RS(54),
        paddingHorizontal: RS(16),
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: RS(14),
        backgroundColor: Colors.surface,
        color: Colors.textPrimary,
        fontSize: FontSize.body,
    },
    multilineInput: {
        minHeight: RS(120),
        paddingTop: RS(14),
        paddingBottom: RS(14),
    },
    errorCard: {
        padding: RS(14),
        borderRadius: RS(14),
        backgroundColor: Colors.failedLight,
    },
    errorText: {
        color: Colors.failed,
        fontSize: FontSize.body,
        textAlign: 'center',
    },
    centerState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: RS(14),
        paddingHorizontal: Spacing.md,
    },
    stateText: {
        color: Colors.textSecondary,
        fontSize: FontSize.body,
    },
    retryButton: {
        minHeight: RS(44),
        justifyContent: 'center',
        paddingHorizontal: RS(18),
        borderRadius: RS(12),
        backgroundColor: Colors.primaryLight,
    },
    retryText: {
        color: Colors.primaryDark,
        fontSize: FontSize.body,
        fontWeight: '600',
    },
    saveButton: {
        minHeight: RS(54),
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: Spacing.md,
        borderRadius: RS(16),
        backgroundColor: Colors.primaryDark,
    },
    disabledButton: {
        opacity: 0.65,
    },
    saveText: {
        color: Colors.white,
        fontSize: FontSize.bodyLarge,
        fontWeight: '700',
    },
});
