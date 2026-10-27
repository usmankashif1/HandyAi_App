import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import AppText from '../../../../../components/AppText';
import { Colors } from '../../../../../core/theme/colors';
import { RF, RS, RW } from '../../../../../core/utils/responsive';

type Props = {
    selectedDate: Date;
    onSelectDate: (date: Date) => void;
};

const startOfWeek = (date: Date) => {
    const start = new Date(date);
    const dayOffset = (start.getDay() + 6) % 7;
    start.setDate(start.getDate() - dayOffset);
    start.setHours(0, 0, 0, 0);
    return start;
};

const formatWeekRange = (weekStart: Date) => {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    if (weekStart.getMonth() === weekEnd.getMonth()) {
        return `${weekStart.toLocaleDateString('en-US', { month: 'short' })} ${weekStart.getDate()} – ${weekEnd.getDate()}`;
    }

    return `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
};

const ScheduleDateSelector = ({ selectedDate, onSelectDate }: Props) => {
    const weekStart = startOfWeek(selectedDate);
    const dates = Array.from({ length: 7 }, (_, index) => {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + index);
        return date;
    });

    const shiftWeek = (amount: number) => {
        const nextDate = new Date(selectedDate);
        nextDate.setDate(nextDate.getDate() + amount * 7);
        onSelectDate(nextDate);
    };

    return (
        <View style={styles.container}>
            <View style={styles.weekHeader}>
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Previous week"
                    onPress={() => shiftWeek(-1)}
                    hitSlop={8}
                    style={styles.weekButton}
                >
                    <Svg width={RS(28)} height={RS(28)} viewBox="0 0 24 24">
                        <Path
                            d="m15 18-6-6 6-6"
                            fill="none"
                            stroke={Colors.black}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </Svg>
                </Pressable>
                <AppText style={styles.weekLabel}>{formatWeekRange(weekStart)}</AppText>
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Next week"
                    onPress={() => shiftWeek(1)}
                    hitSlop={8}
                    style={styles.weekButton}
                >
                    <Svg width={RS(28)} height={RS(28)} viewBox="0 0 24 24">
                        <Path
                            d="m9 18 6-6-6-6"
                            fill="none"
                            stroke={Colors.black}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </Svg>
                </Pressable>
            </View>
            <View style={styles.dateRow}>
                {dates.map((date) => {
                    const selected = date.toDateString() === selectedDate.toDateString();
                    return (
                        <Pressable
                            key={date.toISOString()}
                            accessibilityRole="button"
                            accessibilityLabel={date.toLocaleDateString('en-US', {
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric',
                            })}
                            accessibilityState={{ selected }}
                            onPress={() => onSelectDate(date)}
                            style={styles.dateButton}
                        >
                            <View style={[styles.dateCircle, selected && styles.selectedCircle]}>
                                <AppText style={[styles.weekday, selected && styles.selectedText]}>
                                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                </AppText>
                                <AppText style={[styles.dateNumber, selected && styles.selectedText]}>
                                    {date.getDate()}
                                </AppText>
                            </View>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
};

export default ScheduleDateSelector;

const styles = StyleSheet.create({
    container: {
        gap: RS(8),
        paddingTop: RS(12),
        paddingBottom: RS(11),
    },
    weekHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: RS(4),
    },
    weekButton: {
        width: RS(35),
        height: RS(35),
        alignItems: 'center',
        justifyContent: 'center',
    },
    weekLabel: {
        color: Colors.textSecondary,
        fontSize: RF(18),
        fontWeight: '500',
    },
    dateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dateButton: {
        flex: 1,
        alignItems: 'center',
        gap: RS(5),
    },
    weekday: {
        color: Colors.textSecondary,
        fontSize: RF(16),
    },
    dateCircle: {
        paddingVertical: RS(12),
        paddingHorizontal: RS(8),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: RS(50),
    },
    selectedCircle: {
        backgroundColor: Colors.primary,
    },
    dateNumber: {
        color: Colors.black,
        fontSize: RF(16),
    },
    selectedText: {
        color: Colors.white,
        fontWeight: '600',
    },
});
