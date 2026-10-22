import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import Svg, { Circle, Path, Polygon } from 'react-native-svg';
import { Colors } from '../../../../../core/theme/colors';
import { RS } from '../../../../../core/utils/responsive';

type Props = {
    query: string;
    onChangeQuery: (value: string) => void;
    onPressFilter: () => void;
    activeFilterCount: number;
};

const ScheduleSearchBar = ({
    query,
    onChangeQuery,
    onPressFilter,
    activeFilterCount,
}: Props) => (
    <View style={styles.container}>
        <View style={styles.inputContainer}>
            <Svg width={RS(19)} height={RS(19)} viewBox="0 0 24 24">
                <Circle
                    cx="10.8"
                    cy="10.8"
                    r="6.8"
                    fill="none"
                    stroke={Colors.textSecondary}
                    strokeWidth="1.7"
                />
                <Path
                    d="m16 16 4.3 4.3"
                    fill="none"
                    stroke={Colors.textSecondary}
                    strokeWidth="1.7"
                    strokeLinecap="round"
                />
            </Svg>
            <TextInput
                accessibilityLabel="Search scheduled jobs"
                value={query}
                onChangeText={onChangeQuery}
                placeholder="Search"
                placeholderTextColor={Colors.textSecondary}
                returnKeyType="search"
                style={styles.input}
            />
        </View>
        <Pressable
            accessibilityRole="button"
            accessibilityLabel={activeFilterCount ? `Filter jobs, ${activeFilterCount} active` : 'Filter jobs'}
            accessibilityState={{ selected: activeFilterCount > 0 }}
            onPress={onPressFilter}
            hitSlop={6}
            style={styles.filterButton}
        >
            <Svg width={RS(21)} height={RS(21)} viewBox="0 0 24 24">
                <Polygon
                    points="3,5 21,5 14,13 14,20 10,22 10,13"
                    fill="none"
                    stroke={Colors.primaryDark}
                    strokeWidth="1.7"
                    strokeLinejoin="round"
                />
            </Svg>
            {activeFilterCount > 0 && <View style={styles.filterIndicator} />}
        </Pressable>
    </View>
);

export default ScheduleSearchBar;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: RS(9),
    },
    inputContainer: {
        minHeight: RS(42),
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: RS(8),
        borderRadius: RS(9),
        backgroundColor: Colors.white,
        paddingHorizontal: RS(11),
    },
    input: {
        flex: 1,
        minHeight: RS(42),
        color: Colors.textPrimary,
        fontSize: RS(14),
        paddingVertical: 0,
    },
    filterButton: {
        width: RS(42),
        height: RS(42),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: RS(9),
        backgroundColor: Colors.white,
    },
    filterIndicator: {
        position: 'absolute',
        top: RS(7),
        right: RS(7),
        width: RS(7),
        height: RS(7),
        borderRadius: RS(4),
        backgroundColor: Colors.secondary,
    },
});
