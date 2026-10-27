import { StyleSheet, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import AppText from '../../../../../components/AppText';
import { Colors } from '../../../../../core/theme/colors';
import { RF, RS } from '../../../../../core/utils/responsive';
import type { ProviderPayout } from '../earnings.types';

type Props = {
    payout: ProviderPayout;
    isLast: boolean;
};

const PayoutRow = ({ payout, isLast }: Props) => (
    <View style={[styles.row, !isLast && styles.withDivider]}>
        <View style={styles.iconContainer}>
            <Svg width={RS(24)} height={RS(24)} viewBox="0 0 24 24">
                <Rect
                    x="5"
                    y="3"
                    width="14"
                    height="18"
                    rx="2"
                    fill="none"
                    stroke={Colors.secondary}
                    strokeWidth="1.6"
                />
                <Path
                    d="M9 8h6M9 12h6m-6 4h4"
                    fill="none"
                    stroke={Colors.secondary}
                    strokeWidth="1.6"
                    strokeLinecap="round"
                />
            </Svg>
        </View>
        <AppText style={styles.date}>{payout.date}</AppText>
        <View style={styles.amountGroup}>
            <AppText style={styles.amount}>{payout.amount}</AppText>
            <AppText style={styles.provider}>({payout.provider})</AppText>
        </View>
        <View style={styles.statusBadge}>
            <AppText style={styles.statusText}>{payout.status}</AppText>
        </View>
    </View>
);

export default PayoutRow;

const styles = StyleSheet.create({
    row: {
        minHeight: RS(65),
        flexDirection: 'row',
        alignItems: 'center',
        gap: RS(8),
    },
    withDivider: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: Colors.primaryLight,
    },
    iconContainer: {
        width: RS(38),
        height: RS(38),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: RS(18),
        backgroundColor: Colors.secondaryLight,
    },
    date: {
        flex: 1,
        color: Colors.black,
        fontSize: RF(16),
    },
    amountGroup: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: RS(4),
    },
    amount: {
        color: Colors.black,
        fontSize: RF(16),
        fontWeight: '600',
    },
    provider: {
        color: Colors.textSecondary,
        fontSize: RF(12),
    },
    statusBadge: {
        minWidth: RS(44),
        alignItems: 'center',
        borderRadius: RS(999),
        backgroundColor: Colors.secondaryLight,
        paddingHorizontal: RS(8),
        paddingVertical: RS(5),
    },
    statusText: {
        color: Colors.secondary,
        fontSize: RF(14),
    },
});
