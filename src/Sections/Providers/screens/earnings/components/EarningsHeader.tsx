import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import AppText from '../../../../../components/AppText';
import { Colors } from '../../../../../core/theme/colors';
import { RF, RS } from '../../../../../core/utils/responsive';

type Props = {
    onBackPress: () => void;
};

const EarningsHeader = ({ onBackPress }: Props) => (
    <View style={styles.header}>
        <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back to jobs"
            onPress={onBackPress}
            hitSlop={8}
            style={styles.backButton}
        >
            <Svg width={RS(27)} height={RS(27)} viewBox="0 0 24 24">
                <Path
                    d="m15 18-6-6 6-6M9 12h12"
                    fill="none"
                    stroke={Colors.primaryDark}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </Svg>
        </Pressable>
        <View style={styles.brand}>
            <Svg width={RS(31)} height={RS(31)} viewBox="0 0 24 24">
                <Path
                    d="m2.5 10 9.5-7 9.5 7M5 9v12h14V9m-9 12v-7h4v7"
                    fill="none"
                    stroke={Colors.primaryDark}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </Svg>
            <AppText style={styles.brandText}>Handy AI</AppText>
        </View>
    </View>
);

export default EarningsHeader;

const styles = StyleSheet.create({
    header: {
        minHeight: RS(54),
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: RS(20),
        gap: RS(20),
    },
    backButton: {
        width: RS(30),
        height: RS(40),
        justifyContent: 'center',
    },
    brand: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: RS(6),
    },
    brandText: {
        color: Colors.primaryDark,
        fontSize: RF(21),
        fontWeight: '700',
    },
});
