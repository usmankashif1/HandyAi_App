import { Modal, Pressable, StyleSheet, View } from 'react-native';
import AppText from '../../../../../components/AppText';
import { Colors } from '../../../../../core/theme/colors';
import { RS } from '../../../../../core/utils/responsive';
import type { ScheduleCategory } from '../schedule.types';

const CATEGORIES: ScheduleCategory[] = ['All', 'Cleaning', 'Plumbing', 'Handyman'];

type Props = {
    visible: boolean;
    selectedCategory: ScheduleCategory;
    onSelectCategory: (category: ScheduleCategory) => void;
    onClose: () => void;
    onReset: () => void;
};

const ScheduleFilterSheet = ({
    visible,
    selectedCategory,
    onSelectCategory,
    onClose,
    onReset,
}: Props) => (
    <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
    >
        <View style={styles.overlay}>
            <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close filters"
                onPress={onClose}
                style={StyleSheet.absoluteFill}
            />
            <View style={styles.sheet}>
                <View style={styles.handle} />
                <View style={styles.heading}>
                    <AppText style={styles.title}>Filter schedule</AppText>
                    <Pressable accessibilityRole="button" onPress={onReset} hitSlop={8}>
                        <AppText style={styles.reset}>Reset</AppText>
                    </Pressable>
                </View>
                <AppText style={styles.label}>Service type</AppText>
                <View style={styles.options}>
                    {CATEGORIES.map((category) => {
                        const selected = selectedCategory === category;
                        return (
                            <Pressable
                                key={category}
                                accessibilityRole="button"
                                accessibilityState={{ selected }}
                                onPress={() => onSelectCategory(category)}
                                style={[styles.option, selected && styles.selectedOption]}
                            >
                                <AppText style={[styles.optionText, selected && styles.selectedOptionText]}>
                                    {category}
                                </AppText>
                            </Pressable>
                        );
                    })}
                </View>
                <Pressable
                    accessibilityRole="button"
                    onPress={onClose}
                    style={styles.applyButton}
                >
                    <AppText style={styles.applyText}>Show schedule</AppText>
                </Pressable>
            </View>
        </View>
    </Modal>
);

export default ScheduleFilterSheet;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(16, 38, 77, 0.38)',
    },
    sheet: {
        borderTopLeftRadius: RS(22),
        borderTopRightRadius: RS(22),
        backgroundColor: Colors.white,
        paddingHorizontal: RS(22),
        paddingTop: RS(10),
        paddingBottom: RS(30),
    },
    handle: {
        width: RS(42),
        height: RS(4),
        alignSelf: 'center',
        borderRadius: RS(2),
        backgroundColor: Colors.border,
        marginBottom: RS(18),
    },
    heading: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: RS(22),
    },
    title: {
        color: Colors.primaryDark,
        fontSize: RS(20),
        fontWeight: '600',
    },
    reset: {
        color: Colors.primary,
        fontSize: RS(14),
        fontWeight: '500',
    },
    label: {
        color: Colors.textSecondary,
        fontSize: RS(13),
        marginBottom: RS(12),
    },
    options: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: RS(9),
        marginBottom: RS(24),
    },
    option: {
        minHeight: RS(38),
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: RS(999),
        paddingHorizontal: RS(15),
    },
    selectedOption: {
        borderColor: Colors.primaryDark,
        backgroundColor: Colors.primaryDark,
    },
    optionText: {
        color: Colors.primaryDark,
        fontSize: RS(13),
    },
    selectedOptionText: {
        color: Colors.white,
        fontWeight: '500',
    },
    applyButton: {
        minHeight: RS(48),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: RS(12),
        backgroundColor: Colors.primaryDark,
    },
    applyText: {
        color: Colors.white,
        fontSize: RS(15),
        fontWeight: '600',
    },
});
