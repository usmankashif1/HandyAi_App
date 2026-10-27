import { StyleSheet, View } from 'react-native';
import AppText from '../../../../../components/AppText';
import { Colors } from '../../../../../core/theme/colors';
import { RF, RS } from '../../../../../core/utils/responsive';

type Props = {
    title: string;
    value: string;
    caption: string;
    fullWidth?: boolean;
    positive?: boolean;
};

const EarningsMetricCard = ({
    title,
    value,
    caption,
    fullWidth = false,
    positive = false,
}: Props) => (
    <View style={[styles.card, fullWidth && styles.fullWidth]}>
        <AppText style={styles.title}>{title}</AppText>
        <AppText style={styles.value}>{value}</AppText>
        <AppText style={[styles.caption, positive && styles.positiveCaption]}>
            {caption}
        </AppText>
    </View>
);

export default EarningsMetricCard;

const styles = StyleSheet.create({
    card: {
        flex: 1,
        minHeight: RS(120),
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.primaryLight,
        borderRadius: RS(16),
        paddingHorizontal: RS(16),
        paddingVertical: RS(12),
        gap: RS(4),
        backgroundColor: Colors.white,
    },
    fullWidth: {
        flex: undefined,
        minHeight: RS(112),
    },
    title: {
        color: Colors.black,
        fontSize: RF(16),
        fontWeight: "bold"
    },
    value: {
        color: Colors.black,
        fontSize: RF(28),
        fontWeight: 'bold',
    },
    caption: {
        color: Colors.textSecondary,
        fontSize: RF(14),
    },
    positiveCaption: {
        color: Colors.secondary,
    },
});
