import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as DocumentPicker from 'expo-document-picker';
import * as Linking from 'expo-linking';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import AppText from '../../../../../components/AppText';
import { Colors } from '../../../../../core/theme/colors';
import { showErrorToast, showSuccessToast } from '../../../../../core/utils/toast';
import { RF, RS } from '../../../../../core/utils/responsive';
import { useAppDispatch, useAppSelector } from '../../../../../store/hooks';
import { fetchProviderCategories, uploadProviderDocuments } from '../../onboarding/providerOnboarding.api';
import type { ProviderCategory, ProviderDocumentKey } from '../../onboarding/providerOnboarding.api';
import ProviderTimePickerField from '../../onboarding/components/ProviderTimePickerField';
import {
    fetchProviderProfile,
    updateProviderProfile,
    type ProviderProfileAvailabilityUpdate,
    type ProviderProfileUpdate,
} from '../../profile/providerProfile.api';
import type { ProviderProfileStackParamList } from '../../profile/profile.types';
import { setProviderProfile } from '../../../../../store/slices/providerProfileSlice';

type DetailRouteName =
    | 'ProviderPersonalInformation'
    | 'ProviderServiceAreas'
    | 'ProviderAvailability'
    | 'ProviderDocuments'
    | 'ProviderPaymentDetails';

type Props = NativeStackScreenProps<ProviderProfileStackParamList, DetailRouteName>;

const DAY_OPTIONS = [
    { dayOfWeek: 1, label: 'Monday' },
    { dayOfWeek: 2, label: 'Tuesday' },
    { dayOfWeek: 3, label: 'Wednesday' },
    { dayOfWeek: 4, label: 'Thursday' },
    { dayOfWeek: 5, label: 'Friday' },
    { dayOfWeek: 6, label: 'Saturday' },
    { dayOfWeek: 0, label: 'Sunday' },
];
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;
const DOCUMENT_TITLES: Record<ProviderDocumentKey, string> = {
    GOVERNMENT_ID: 'Government ID',
    RIGHT_TO_WORK: 'Right to Work',
    LIABILITY_INSURANCE: 'Liability Insurance',
    REFERENCE: 'Reference',
    PROFILE_PHOTO: 'Profile Photo',
};
const DOCUMENT_KEYS = Object.keys(DOCUMENT_TITLES) as ProviderDocumentKey[];

const titles: Record<DetailRouteName, string> = {
    ProviderPersonalInformation: 'Personal Information',
    ProviderServiceAreas: 'Service Areas & Services',
    ProviderAvailability: 'Availability',
    ProviderDocuments: 'Documents',
    ProviderPaymentDetails: 'Payment Details',
};

const formatStatus = (value: string): string => (
    value.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
);

const formatTime = (value: string): string => {
    const [hourText, minuteText] = value.split(':');
    const hour = Number(hourText);
    if (!Number.isFinite(hour) || !minuteText) {
        return value;
    }

    return `${hour % 12 || 12}:${minuteText} ${hour >= 12 ? 'PM' : 'AM'}`;
};

const parseCoverage = (value: string): string[] => (
    [...new Set(value.split(/[,\n;]/).map((postcode) => postcode.trim()).filter(Boolean))]
);

const isProviderDocumentKey = (value: string): value is ProviderDocumentKey => (
    DOCUMENT_KEYS.some((key) => key === value)
);

const documentTitle = (type: string): string => (
    isProviderDocumentKey(type) ? DOCUMENT_TITLES[type] : formatStatus(type)
);

const DetailField = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.field}>
        <AppText style={styles.label}>{label}</AppText>
        <AppText style={styles.value}>{value}</AppText>
    </View>
);

const ProviderSettingDetailsScreen = ({ navigation, route }: Props) => {
    const dispatch = useAppDispatch();
    const { token } = useAppSelector((state) => state.auth);
    const cachedProfile = useAppSelector((state) => state.providerProfile.profile);
    const profile = cachedProfile ?? route.params.profile;
    const section = route.name;
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formError, setFormError] = useState<string>();
    const [bio, setBio] = useState(profile.bio);
    const [fullName, setFullName] = useState(profile.user.fullName);
    const [address, setAddress] = useState(profile.user.address ?? '');
    const [userPostcode, setUserPostcode] = useState(profile.user.postcode ?? '');
    const [coverageText, setCoverageText] = useState(profile.postcodeCoverage.join(', '));
    const [selectedCategoryIds, setSelectedCategoryIds] = useState(
        profile.categories.map((category) => category.id),
    );
    const [availability, setAvailability] = useState<ProviderProfileAvailabilityUpdate[]>(() => (
        profile.availability.map(({ dayOfWeek, startTime, endTime }) => ({
            dayOfWeek,
            startTime: startTime.slice(0, 5),
            endTime: endTime.slice(0, 5),
        }))
    ));
    const [categories, setCategories] = useState<ProviderCategory[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(
        section === 'ProviderServiceAreas' && Boolean(token),
    );
    const [categoryError, setCategoryError] = useState<string | undefined>(
        section === 'ProviderServiceAreas' && !token
            ? 'Sign in again to load service categories.'
            : '',
    );
    const [categoryRetry, setCategoryRetry] = useState(0);
    const [isPickingDocument, setIsPickingDocument] = useState<string>();

    useEffect(() => {
        if (section !== 'ProviderServiceAreas') {
            return undefined;
        }
        if (!token) {
            return undefined;
        }

        const controller = new AbortController();
        void fetchProviderCategories(token, controller.signal)
            .then((items) => {
                setCategories(items);
                setCategoryError(undefined);
            })
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
    }, [categoryRetry, section, token]);

    const toggleCategory = (categoryId: string) => {
        setSelectedCategoryIds((selected) => (
            selected.includes(categoryId)
                ? selected.filter((id) => id !== categoryId)
                : [...selected, categoryId]
        ));
    };

    const toggleAvailabilityDay = (dayOfWeek: number) => {
        setAvailability((current) => {
            const existing = current.find((item) => item.dayOfWeek === dayOfWeek);
            if (existing) {
                return current.filter((item) => item.dayOfWeek !== dayOfWeek);
            }
            return [...current, { dayOfWeek, startTime: '09:00', endTime: '17:00' }];
        });
    };

    const updateAvailabilityTime = (
        dayOfWeek: number,
        field: 'startTime' | 'endTime',
        value: string,
    ) => {
        setAvailability((current) => current.map((item) => (
            item.dayOfWeek === dayOfWeek ? { ...item, [field]: value } : item
        )));
    };

    const saveProfileChanges = async () => {
        if (isSaving) {
            return;
        }
        if (!token) {
            setFormError('Your session has expired. Please sign in again.');
            return;
        }

        const updates: ProviderProfileUpdate = {};
        if (section === 'ProviderPersonalInformation') {
            const user: NonNullable<ProviderProfileUpdate['user']> = {};
            const trimmedName = fullName.trim();
            if (!trimmedName) {
                setFormError('Enter your full name.');
                return;
            }
            if (trimmedName !== profile.user.fullName) user.fullName = trimmedName;
            if (address.trim() !== (profile.user.address ?? '')) user.address = address.trim();
            if (userPostcode.trim() !== (profile.user.postcode ?? '')) {
                user.postcode = userPostcode.trim();
            }
            if (bio.trim() !== profile.bio) updates.bio = bio.trim();
            if (Object.keys(user).length) updates.user = user;
        } else if (section === 'ProviderServiceAreas') {
            const postcodes = parseCoverage(coverageText);
            if (!postcodes.length) {
                setFormError('Add at least one postcode area you cover.');
                return;
            }
            if (!selectedCategoryIds.length) {
                setFormError('Select at least one service category.');
                return;
            }
            if (isLoadingCategories || categoryError) {
                setFormError('Load the service categories before saving.');
                return;
            }
            if (JSON.stringify(postcodes) !== JSON.stringify(profile.postcodeCoverage)) {
                updates.postcodeCoverage = postcodes;
            }
            const previousCategoryIds = profile.categories.map((category) => category.id).sort();
            const nextCategoryIds = [...selectedCategoryIds].sort();
            if (JSON.stringify(nextCategoryIds) !== JSON.stringify(previousCategoryIds)) {
                updates.categoryIds = selectedCategoryIds;
            }
        } else if (section === 'ProviderAvailability') {
            if (!availability.length) {
                setFormError('Select at least one available day.');
                return;
            }
            const seenDays = new Set<number>();
            for (const item of availability) {
                if (
                    !Number.isInteger(item.dayOfWeek)
                    || item.dayOfWeek < 0
                    || item.dayOfWeek > 6
                    || !TIME_PATTERN.test(item.startTime)
                    || !TIME_PATTERN.test(item.endTime)
                    || item.startTime >= item.endTime
                    || seenDays.has(item.dayOfWeek)
                ) {
                    setFormError('Check that each selected day has valid hours and the end is later than the start.');
                    return;
                }
                seenDays.add(item.dayOfWeek);
            }
            const previous = profile.availability
                .map(({ dayOfWeek, startTime, endTime }) => ({
                    dayOfWeek,
                    startTime: startTime.slice(0, 5),
                    endTime: endTime.slice(0, 5),
                }))
                .sort((a, b) => a.dayOfWeek - b.dayOfWeek);
            const next = [...availability].sort((a, b) => a.dayOfWeek - b.dayOfWeek);
            if (JSON.stringify(next) !== JSON.stringify(previous)) {
                updates.availability = next;
            }
        } else {
            return;
        }

        if (Object.keys(updates).length === 0) {
            setFormError('There are no changes to save.');
            return;
        }

        setIsSaving(true);
        setFormError(undefined);
        try {
            const updatedProfile = await updateProviderProfile(token, updates);
            dispatch(setProviderProfile(updatedProfile));
            setBio(updatedProfile.bio);
            setFullName(updatedProfile.user.fullName);
            setAddress(updatedProfile.user.address ?? '');
            setUserPostcode(updatedProfile.user.postcode ?? '');
            setCoverageText(updatedProfile.postcodeCoverage.join(', '));
            setSelectedCategoryIds(updatedProfile.categories.map((category) => category.id));
            setAvailability(updatedProfile.availability.map(({ dayOfWeek, startTime, endTime }) => ({
                dayOfWeek,
                startTime: startTime.slice(0, 5),
                endTime: endTime.slice(0, 5),
            })));
            setIsEditing(false);
            showSuccessToast('Profile updated');
        } catch (error) {
            console.error('Unable to update provider profile:', error);
            const message = error instanceof Error
                ? error.message
                : 'Could not update your profile. Please try again.';
            setFormError(message);
            showErrorToast('Update failed', message);
        } finally {
            setIsSaving(false);
        }
    };

    const pickAndUploadDocument = async (documentType: string, documentId: string) => {
        if (isPickingDocument || !token) {
            if (!token) {
                showErrorToast('Sign in required', 'Sign in again before replacing a document.');
            }
            return;
        }

        if (!isProviderDocumentKey(documentType)) {
            showErrorToast('Cannot replace document', 'This document type is not supported for replacement.');
            return;
        }
        const documentKey = documentType;

        setIsPickingDocument(documentId);
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*',
                copyToCacheDirectory: true,
                multiple: false,
            });
            if (result.canceled || !result.assets[0]) {
                return;
            }

            await uploadProviderDocuments(token, { [documentKey]: result.assets[0] });
            showSuccessToast(`${DOCUMENT_TITLES[documentKey]} uploaded`);

            try {
                const updatedProfile = await fetchProviderProfile(token);
                dispatch(setProviderProfile(updatedProfile));
            } catch (refreshError) {
                console.error('Document uploaded, but provider profile refresh failed:', refreshError);
                showErrorToast(
                    'Document uploaded',
                    'Your document was uploaded, but the updated status could not be loaded. Reopen this screen to refresh.',
                );
            }
        } catch (error) {
            console.error('Unable to replace provider document:', error);
            showErrorToast(
                'Upload failed',
                error instanceof Error ? error.message : 'Could not upload this document. Please try again.',
            );
        } finally {
            setIsPickingDocument(undefined);
        }
    };

    const openDocument = async (fileUrl: string) => {
        let parsedUrl: URL;
        try {
            parsedUrl = new URL(fileUrl);
        } catch {
            showErrorToast('Cannot open document', 'This document link is invalid.');
            return;
        }
        if (parsedUrl.protocol !== 'https:') {
            showErrorToast('Cannot open document', 'Only secure document links can be opened.');
            return;
        }

        try {
            await Linking.openURL(parsedUrl.toString());
        } catch (error) {
            console.error('Unable to open provider document:', error);
            showErrorToast(
                'Cannot open document',
                error instanceof Error
                    ? error.message
                    : 'No app could open this document on your device.',
            );
        }
    };

    const cancelEditing = () => {
        setBio(profile.bio);
        setFullName(profile.user.fullName);
        setAddress(profile.user.address ?? '');
        setUserPostcode(profile.user.postcode ?? '');
        setCoverageText(profile.postcodeCoverage.join(', '));
        setSelectedCategoryIds(profile.categories.map((category) => category.id));
        setAvailability(profile.availability.map(({ dayOfWeek, startTime, endTime }) => ({
            dayOfWeek,
            startTime: startTime.slice(0, 5),
            endTime: endTime.slice(0, 5),
        })));
        setFormError(undefined);
        setIsEditing(false);
    };

    const canEdit = section === 'ProviderPersonalInformation'
        || section === 'ProviderServiceAreas'
        || section === 'ProviderAvailability';
    const documentPhoto = profile.documents.find((item) => item.type === 'PROFILE_PHOTO');
    const photoUrl = profile.user.photoUrl ?? documentPhoto?.fileUrl;

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
            <View style={styles.header}>
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Back to provider settings"
                    onPress={() => navigation.goBack()}
                    style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
                >
                    <Svg width={RS(28)} height={RS(28)} viewBox="0 0 24 24">
                        <Path
                            d="m15 18-6-6 6-6"
                            fill="none"
                            stroke={NAVY}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </Svg>
                </Pressable>
                <AppText style={styles.heading}>{titles[section]}</AppText>
                {canEdit && !isEditing ? (
                    <Pressable
                        accessibilityRole="button"
                        onPress={() => {
                            setFormError(undefined);
                            setIsEditing(true);
                        }}
                        style={styles.headerAction}
                    >
                        <AppText style={styles.headerActionText}>Edit</AppText>
                    </Pressable>
                ) : <View style={styles.headerAction} />}
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {section === 'ProviderPersonalInformation' ? (
                    <>
                        <View style={styles.personCard}>
                            {photoUrl ? (
                                <Image
                                    source={{ uri: photoUrl }}
                                    style={styles.avatar}
                                    accessibilityLabel={`${profile.user.fullName} profile photo`}
                                />
                            ) : (
                                <View style={styles.avatarPlaceholder}>
                                    <AppText style={styles.avatarInitial}>
                                        {profile.user.fullName.charAt(0).toUpperCase() || 'P'}
                                    </AppText>
                                </View>
                            )}
                            <AppText style={styles.personName}>{profile.user.fullName || 'Provider'}</AppText>
                            <AppText style={styles.personEmail}>{profile.user.email}</AppText>
                        </View>
                        <View style={styles.card}>
                            {isEditing ? (
                                <>
                                    <InputField label="Full name" value={fullName} onChangeText={setFullName} />
                                    <InputField label="Address" value={address} onChangeText={setAddress} />
                                    <InputField
                                        label="Postcode"
                                        value={userPostcode}
                                        onChangeText={setUserPostcode}
                                        autoCapitalize="characters"
                                    />
                                    <InputField
                                        label="Professional bio"
                                        value={bio}
                                        onChangeText={setBio}
                                        multiline
                                    />
                                </>
                            ) : (
                                <>
                                    <DetailField label="Full name" value={profile.user.fullName} />
                                    <DetailField label="Email" value={profile.user.email} />
                                    <DetailField label="Address" value={profile.user.address || 'Not provided'} />
                                    <DetailField label="Postcode" value={profile.user.postcode || 'Not provided'} />
                                    <DetailField label="Professional bio" value={profile.bio || 'No bio provided'} />
                                    <DetailField label="Profile status" value={formatStatus(profile.status)} />
                                    {profile.rejectionReason ? (
                                        <DetailField label="Review message" value={profile.rejectionReason} />
                                    ) : null}
                                </>
                            )}
                        </View>
                    </>
                ) : null}

                {section === 'ProviderServiceAreas' ? (
                    <View style={styles.card}>
                        {isEditing ? (
                            <>
                                <InputField
                                    label="Postcode coverage"
                                    value={coverageText}
                                    onChangeText={setCoverageText}
                                    autoCapitalize="characters"
                                    helper="Separate postcodes with commas or new lines."
                                />
                                <AppText style={styles.subheading}>Service categories</AppText>
                                {isLoadingCategories ? (
                                    <ActivityIndicator color={Colors.primaryDark} />
                                ) : categoryError ? (
                                    <View style={styles.inlineError}>
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
                                ) : categories.length ? (
                                    <View style={styles.categoryList}>
                                        {categories.map((category) => {
                                            const selected = selectedCategoryIds.includes(category.id);
                                            return (
                                                <Pressable
                                                    key={category.id}
                                                    accessibilityRole="checkbox"
                                                    accessibilityState={{ checked: selected }}
                                                    onPress={() => toggleCategory(category.id)}
                                                    style={[
                                                        styles.categoryChip,
                                                        selected && styles.categoryChipSelected,
                                                    ]}
                                                >
                                                    <AppText style={[
                                                        styles.categoryText,
                                                        selected && styles.categoryTextSelected,
                                                    ]}>
                                                        {category.name}
                                                    </AppText>
                                                </Pressable>
                                            );
                                        })}
                                    </View>
                                ) : (
                                    <AppText style={styles.emptyText}>No service categories are available.</AppText>
                                )}
                            </>
                        ) : (
                            <>
                                <AppText style={styles.subheading}>Postcode coverage</AppText>
                                {profile.postcodeCoverage.length ? (
                                    <View style={styles.categoryList}>
                                        {profile.postcodeCoverage.map((postcode) => (
                                            <View key={postcode} style={styles.readonlyChip}>
                                                <AppText style={styles.categoryText}>{postcode}</AppText>
                                            </View>
                                        ))}
                                    </View>
                                ) : <AppText style={styles.emptyText}>No service areas have been added.</AppText>}
                                <AppText style={styles.subheading}>Services</AppText>
                                {profile.categories.length ? (
                                    <View style={styles.categoryList}>
                                        {profile.categories.map((category) => (
                                            <View key={category.id} style={styles.readonlyChip}>
                                                <AppText style={styles.categoryText}>{category.name}</AppText>
                                            </View>
                                        ))}
                                    </View>
                                ) : <AppText style={styles.emptyText}>No service categories selected.</AppText>}
                            </>
                        )}
                    </View>
                ) : null}

                {section === 'ProviderAvailability' ? (
                    <View style={styles.card}>
                        {isEditing ? (
                            <>
                                <AppText style={styles.helper}>
                                    Choose your working days, then set the hours for each day.
                                </AppText>
                                <View style={styles.dayOptions}>
                                    {DAY_OPTIONS.map(({ dayOfWeek, label }) => {
                                        const selected = availability.some((item) => item.dayOfWeek === dayOfWeek);
                                        return (
                                            <Pressable
                                                key={dayOfWeek}
                                                accessibilityRole="checkbox"
                                                accessibilityState={{ checked: selected }}
                                                onPress={() => toggleAvailabilityDay(dayOfWeek)}
                                                style={[
                                                    styles.dayChip,
                                                    selected && styles.dayChipSelected,
                                                ]}
                                            >
                                                <AppText style={[
                                                    styles.dayText,
                                                    selected && styles.dayTextSelected,
                                                ]}>
                                                    {label}
                                                </AppText>
                                            </Pressable>
                                        );
                                    })}
                                </View>
                                {[...availability].sort((a, b) => a.dayOfWeek - b.dayOfWeek).map((item) => (
                                    <View key={item.dayOfWeek} style={styles.availabilityEditor}>
                                        <AppText style={styles.subheading}>
                                            {DAY_NAMES[item.dayOfWeek]}
                                        </AppText>
                                        <View style={styles.timeRow}>
                                            <ProviderTimePickerField
                                                label="Start time"
                                                accessibilityLabel={`${DAY_NAMES[item.dayOfWeek]} start time`}
                                                value={item.startTime}
                                                onChange={(value) => updateAvailabilityTime(
                                                    item.dayOfWeek,
                                                    'startTime',
                                                    value,
                                                )}
                                            />
                                            <ProviderTimePickerField
                                                label="End time"
                                                accessibilityLabel={`${DAY_NAMES[item.dayOfWeek]} end time`}
                                                value={item.endTime}
                                                onChange={(value) => updateAvailabilityTime(
                                                    item.dayOfWeek,
                                                    'endTime',
                                                    value,
                                                )}
                                            />
                                        </View>
                                    </View>
                                ))}
                            </>
                        ) : profile.availability.length ? (
                            [...profile.availability]
                                .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
                                .map((item) => (
                                    <View key={item.id} style={styles.listRow}>
                                        <AppText style={styles.value}>
                                            {DAY_NAMES[item.dayOfWeek] ?? `Day ${item.dayOfWeek}`}
                                        </AppText>
                                        <AppText style={styles.value}>
                                            {formatTime(item.startTime)} - {formatTime(item.endTime)}
                                        </AppText>
                                    </View>
                                ))
                        ) : <AppText style={styles.emptyText}>No availability has been set.</AppText>}
                    </View>
                ) : null}

                {section === 'ProviderDocuments' ? (
                    <View style={styles.documentList}>
                        {DOCUMENT_KEYS.map((key) => {
                            const document = profile.documents.find((item) => item.type === key);
                            const documentId = document?.id ?? key;
                            const isUploading = isPickingDocument === documentId;
                            const submittedDate = document ? new Date(document.createdAt) : undefined;
                            const dateLabel = submittedDate
                                ? Number.isNaN(submittedDate.getTime())
                                    ? 'Date unavailable'
                                    : submittedDate.toLocaleDateString()
                                : undefined;
                            return (
                                <View key={key} style={styles.card}>
                                    <View style={styles.documentTitleBlock}>
                                        <AppText style={styles.subheading}>{DOCUMENT_TITLES[key]}</AppText>
                                        <AppText style={styles.label}>
                                            {document
                                                ? `${formatStatus(document.status)}${dateLabel ? ` · Submitted ${dateLabel}` : ''}`
                                                : 'Not uploaded'}
                                        </AppText>
                                    </View>
                                    <View style={styles.documentActions}>
                                        {document ? (
                                            <Pressable
                                                accessibilityRole="button"
                                                onPress={() => void openDocument(document.fileUrl)}
                                                style={({ pressed }) => [
                                                    styles.secondaryButton,
                                                    pressed && styles.pressed,
                                                ]}
                                            >
                                                <AppText style={styles.secondaryButtonText}>View document</AppText>
                                            </Pressable>
                                        ) : null}
                                        <Pressable
                                            accessibilityRole="button"
                                            disabled={Boolean(isPickingDocument)}
                                            onPress={() => void pickAndUploadDocument(key, documentId)}
                                            style={({ pressed }) => [
                                                styles.secondaryButton,
                                                Boolean(isPickingDocument) && styles.disabledButton,
                                                pressed && styles.pressed,
                                            ]}
                                        >
                                            {isUploading ? (
                                                <ActivityIndicator size="small" color={Colors.primaryDark} />
                                            ) : (
                                                <AppText style={styles.secondaryButtonText}>
                                                    {document ? 'Replace' : 'Upload'}
                                                </AppText>
                                            )}
                                        </Pressable>
                                    </View>
                                </View>
                            );
                        })}
                        {profile.documents
                            .filter((document) => !isProviderDocumentKey(document.type))
                            .map((document) => (
                                <View key={document.id} style={styles.card}>
                                    <View style={styles.documentTitleBlock}>
                                        <AppText style={styles.subheading}>
                                            {documentTitle(document.type)}
                                        </AppText>
                                        <AppText style={styles.label}>
                                            {formatStatus(document.status)}
                                        </AppText>
                                    </View>
                                    <Pressable
                                        accessibilityRole="button"
                                        onPress={() => void openDocument(document.fileUrl)}
                                        style={({ pressed }) => [
                                            styles.secondaryButton,
                                            pressed && styles.pressed,
                                        ]}
                                    >
                                        <AppText style={styles.secondaryButtonText}>View document</AppText>
                                    </Pressable>
                                </View>
                            ))}
                    </View>
                ) : null}

                {section === 'ProviderPaymentDetails' ? (
                    <View style={styles.card}>
                        <DetailField
                            label="Stripe status"
                            value={profile.stripeAccountId ? 'Connected' : 'Not connected'}
                        />
                    </View>
                ) : null}

                {formError ? (
                    <View style={styles.errorCard} accessibilityRole="alert">
                        <AppText style={styles.errorText}>{formError}</AppText>
                    </View>
                ) : null}
            </ScrollView>

            {isEditing ? (
                <View style={styles.footer}>
                    <Pressable
                        accessibilityRole="button"
                        disabled={isSaving}
                        onPress={cancelEditing}
                        style={({ pressed }) => [styles.cancelButton, pressed && styles.pressed]}
                    >
                        <AppText style={styles.cancelText}>Cancel</AppText>
                    </Pressable>
                    <Pressable
                        accessibilityRole="button"
                        disabled={isSaving}
                        onPress={() => void saveProfileChanges()}
                        style={({ pressed }) => [
                            styles.saveButton,
                            isSaving && styles.disabledButton,
                            pressed && styles.pressed,
                        ]}
                    >
                        {isSaving ? (
                            <ActivityIndicator color={Colors.white} />
                        ) : <AppText style={styles.saveText}>Save changes</AppText>}
                    </Pressable>
                </View>
            ) : null}
        </SafeAreaView>
    );
};

const InputField = ({
    label,
    value,
    onChangeText,
    autoCapitalize = 'sentences',
    multiline = false,
    helper,
}: {
    label: string;
    value: string;
    onChangeText: (value: string) => void;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    multiline?: boolean;
    helper?: string;
}) => (
    <View style={styles.inputField}>
        <AppText style={styles.label}>{label}</AppText>
        <TextInput
            value={value}
            onChangeText={onChangeText}
            autoCapitalize={autoCapitalize}
            autoCorrect={false}
            multiline={multiline}
            textAlignVertical={multiline ? 'top' : 'center'}
            accessibilityLabel={label}
            style={[styles.input, multiline && styles.multilineInput]}
        />
        {helper ? <AppText style={styles.helper}>{helper}</AppText> : null}
    </View>
);

export default ProviderSettingDetailsScreen;

const NAVY = '#172B4D';

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        minHeight: RS(64),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: RS(20),
    },
    backButton: {
        position: 'absolute',
        left: RS(20),
        width: RS(42),
        height: RS(44),
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    headerAction: {
        position: 'absolute',
        right: RS(20),
        minWidth: RS(42),
        height: RS(44),
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    headerActionText: {
        color: Colors.primaryDark,
        fontSize: RF(15),
        fontWeight: '700',
    },
    heading: {
        maxWidth: '70%',
        color: NAVY,
        fontSize: RF(21),
        lineHeight: RS(29),
        fontWeight: '700',
        textAlign: 'center',
    },
    content: {
        flexGrow: 1,
        gap: RS(14),
        paddingHorizontal: RS(20),
        paddingTop: RS(12),
        paddingBottom: RS(24),
    },
    personCard: {
        alignItems: 'center',
        gap: RS(5),
        borderWidth: 1,
        borderColor: '#D5DFEC',
        borderRadius: RS(17),
        backgroundColor: Colors.white,
        padding: RS(18),
    },
    avatar: {
        width: RS(96),
        height: RS(96),
        borderRadius: RS(48),
        backgroundColor: '#E8EEF6',
    },
    avatarPlaceholder: {
        width: RS(96),
        height: RS(96),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: RS(48),
        backgroundColor: '#E8EEF6',
    },
    avatarInitial: {
        color: NAVY,
        fontSize: RF(36),
        fontWeight: '700',
    },
    personName: {
        color: NAVY,
        fontSize: RF(20),
        lineHeight: RS(27),
        fontWeight: '700',
        textAlign: 'center',
        marginTop: RS(4),
    },
    personEmail: {
        color: Colors.textSecondary,
        fontSize: RF(14),
        lineHeight: RS(20),
        textAlign: 'center',
    },
    card: {
        gap: RS(12),
        borderWidth: 1,
        borderColor: '#D5DFEC',
        borderRadius: RS(17),
        backgroundColor: Colors.white,
        paddingHorizontal: RS(16),
        paddingVertical: RS(15),
    },
    field: {
        gap: RS(3),
    },
    label: {
        color: Colors.textSecondary,
        fontSize: RF(12),
        lineHeight: RS(17),
    },
    value: {
        color: NAVY,
        fontSize: RF(14),
        lineHeight: RS(21),
        fontWeight: '500',
    },
    inputField: {
        gap: RS(6),
    },
    input: {
        minHeight: RS(48),
        borderWidth: 1,
        borderColor: '#C9D5E6',
        borderRadius: RS(11),
        backgroundColor: Colors.white,
        color: NAVY,
        fontSize: RF(14),
        paddingHorizontal: RS(13),
    },
    multilineInput: {
        minHeight: RS(104),
        paddingTop: RS(12),
        textAlignVertical: 'top',
    },
    helper: {
        color: Colors.textSecondary,
        fontSize: RF(12),
        lineHeight: RS(18),
    },
    subheading: {
        color: NAVY,
        fontSize: RF(15),
        lineHeight: RS(21),
        fontWeight: '700',
    },
    listRow: {
        minHeight: RS(30),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: RS(12),
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#D5DFEC',
        paddingVertical: RS(7),
    },
    categoryList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: RS(8),
    },
    categoryChip: {
        minHeight: RS(38),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#C9D5E6',
        borderRadius: RS(20),
        backgroundColor: Colors.white,
        paddingHorizontal: RS(13),
    },
    categoryChipSelected: {
        borderColor: Colors.primaryDark,
        backgroundColor: Colors.primaryLight,
    },
    readonlyChip: {
        minHeight: RS(34),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: RS(17),
        backgroundColor: Colors.primaryLight,
        paddingHorizontal: RS(12),
    },
    categoryText: {
        color: NAVY,
        fontSize: RF(13),
        lineHeight: RS(19),
        fontWeight: '500',
    },
    categoryTextSelected: {
        color: Colors.primaryDark,
        fontWeight: '700',
    },
    dayOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: RS(7),
    },
    dayChip: {
        minHeight: RS(36),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#C9D5E6',
        borderRadius: RS(18),
        paddingHorizontal: RS(11),
    },
    dayChipSelected: {
        borderColor: Colors.primaryDark,
        backgroundColor: Colors.primaryLight,
    },
    dayText: {
        color: NAVY,
        fontSize: RF(12),
        fontWeight: '500',
    },
    dayTextSelected: {
        color: Colors.primaryDark,
        fontWeight: '700',
    },
    availabilityEditor: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#D5DFEC',
        paddingTop: RS(12),
    },
    timeRow: {
        flexDirection: 'row',
        gap: RS(10),
    },
    emptyText: {
        color: Colors.textSecondary,
        fontSize: RF(14),
        lineHeight: RS(21),
        textAlign: 'center',
    },
    documentList: {
        gap: RS(12),
    },
    documentTitleBlock: {
        flex: 1,
        gap: RS(3),
    },
    documentActions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: RS(8),
    },
    secondaryButton: {
        minHeight: RS(40),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.primaryDark,
        borderRadius: RS(20),
        paddingHorizontal: RS(14),
    },
    secondaryButtonText: {
        color: Colors.primaryDark,
        fontSize: RF(13),
        fontWeight: '600',
    },
    errorCard: {
        borderRadius: RS(12),
        backgroundColor: Colors.failedLight,
        padding: RS(12),
    },
    errorText: {
        color: Colors.failed,
        fontSize: RF(13),
        lineHeight: RS(19),
    },
    inlineError: {
        gap: RS(8),
    },
    retryText: {
        color: Colors.primaryDark,
        fontSize: RF(14),
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        gap: RS(10),
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#D5DFEC',
        backgroundColor: Colors.background,
        paddingHorizontal: RS(20),
        paddingTop: RS(9),
        paddingBottom: RS(10),
    },
    cancelButton: {
        minHeight: RS(48),
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.primaryDark,
        borderRadius: RS(24),
    },
    cancelText: {
        color: Colors.primaryDark,
        fontSize: RF(14),
        fontWeight: '600',
    },
    saveButton: {
        minHeight: RS(48),
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: RS(24),
        backgroundColor: Colors.primaryDark,
    },
    saveText: {
        color: Colors.white,
        fontSize: RF(14),
        fontWeight: '700',
    },
    disabledButton: {
        opacity: 0.6,
    },
    pressed: {
        opacity: 0.75,
    },
});
