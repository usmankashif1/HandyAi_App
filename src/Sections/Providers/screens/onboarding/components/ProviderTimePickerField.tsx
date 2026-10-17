import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import {
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import AppText from '../../../../../components/AppText';
import { Colors } from '../../../../../core/theme/colors';
import { Spacing } from '../../../../../core/theme/designTokens';
import { RS } from '../../../../../core/utils/responsive';

type ProviderTimePickerFieldProps = {
    label: string;
    accessibilityLabel: string;
    value: string;
    onChange: (value: string) => void;
};

const parseTime = (value: string): Date => {
    const [hours = '9', minutes = '0'] = value.split(':');
    const date = new Date();
    date.setHours(Number(hours), Number(minutes), 0, 0);
    return date;
};

const formatTime = (date: Date): string => (
    `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
);

const ProviderTimePickerField = ({
    label,
    accessibilityLabel,
    value,
    onChange,
}: ProviderTimePickerFieldProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [selectedTime, setSelectedTime] = useState(() => parseTime(value));

    const openPicker = () => {
        const initialValue = parseTime(value);
        setSelectedTime(initialValue);

        if (Platform.OS === 'android') {
            DateTimePickerAndroid.open({
                value: initialValue,
                mode: 'time',
                is24Hour: true,
                onValueChange: (_event, date) => {
                    onChange(formatTime(date));
                },
            });
            return;
        }

        if (Platform.OS === 'ios') {
            setIsVisible(true);
        }
    };

    if (Platform.OS === 'web') {
        return (
            <View style={styles.field}>
                <AppText style={styles.label}>{label}</AppText>
                <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="09:00"
                    placeholderTextColor="#77859A"
                    keyboardType="numbers-and-punctuation"
                    accessibilityLabel={accessibilityLabel}
                    style={styles.valueButton}
                />
            </View>
        );
    }

    return (
        <View style={styles.field}>
            <AppText style={styles.label}>{label}</AppText>
            <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${accessibilityLabel}, ${value}. Tap to choose time.`}
                onPress={openPicker}
                style={({ pressed }) => [styles.valueButton, pressed && styles.pressed]}
            >
                <AppText style={styles.valueText}>{value}</AppText>
                <Svg width={RS(22)} height={RS(22)} viewBox="0 0 24 24">
                    <Circle
                        cx="12"
                        cy="12"
                        r="9"
                        fill="none"
                        stroke={Colors.primaryDark}
                        strokeWidth="1.8"
                    />
                    <Path
                        d="M12 7v5l3.2 2"
                        fill="none"
                        stroke={Colors.primaryDark}
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </Svg>
            </Pressable>

            {Platform.OS === 'ios' ? (
                <Modal
                    visible={isVisible}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setIsVisible(false)}
                >
                    <View style={styles.modalBackdrop}>
                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel="Close time picker"
                            onPress={() => setIsVisible(false)}
                            style={StyleSheet.absoluteFill}
                        />
                        <SafeAreaView style={styles.modalSheet} edges={['bottom']}>
                            <View style={styles.modalHeader}>
                                <Pressable
                                    accessibilityRole="button"
                                    onPress={() => setIsVisible(false)}
                                    hitSlop={10}
                                >
                                    <AppText style={styles.modalAction}>Cancel</AppText>
                                </Pressable>
                                <AppText style={styles.modalTitle}>{label}</AppText>
                                <Pressable
                                    accessibilityRole="button"
                                    onPress={() => {
                                        onChange(formatTime(selectedTime));
                                        setIsVisible(false);
                                    }}
                                    hitSlop={10}
                                >
                                    <AppText style={styles.modalAction}>Done</AppText>
                                </Pressable>
                            </View>
                            <DateTimePicker
                                value={selectedTime}
                                mode="time"
                                display="spinner"
                                is24Hour
                                onValueChange={(_event, date) => setSelectedTime(date)}
                                themeVariant="light"
                            />
                        </SafeAreaView>
                    </View>
                </Modal>
            ) : null}
        </View>
    );
};

export default ProviderTimePickerField;

const styles = StyleSheet.create({
    field: {
        flex: 1,
    },
    label: {
        color: '#718096',
        fontSize: RS(15),
        lineHeight: RS(21),
        marginBottom: RS(6),
    },
    valueButton: {
        minHeight: RS(50),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#C9D5E6',
        borderRadius: RS(10),
        backgroundColor: Colors.white,
        paddingHorizontal: RS(15),
        marginBottom: RS(18),
    },
    valueText: {
        color: '#10264D',
        fontSize: RS(16),
    },
    modalBackdrop: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
    },
    modalSheet: {
        borderTopLeftRadius: RS(20),
        borderTopRightRadius: RS(20),
        backgroundColor: Colors.white,
        paddingBottom: Spacing.sm,
    },
    modalHeader: {
        minHeight: RS(54),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.lg,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: Colors.border,
    },
    modalTitle: {
        color: Colors.textPrimary,
        fontSize: RS(16),
        fontWeight: '600',
    },
    modalAction: {
        color: Colors.primaryDark,
        fontSize: RS(16),
        fontWeight: '600',
    },
    pressed: {
        opacity: 0.75,
    },
});
