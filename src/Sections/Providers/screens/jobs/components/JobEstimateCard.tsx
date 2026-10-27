import { StyleSheet, View } from 'react-native';
import AppText from '../../../../../components/AppText';
import { Colors } from '../../../../../core/theme/colors';
import { FontSize, Radii, Spacing, TypeScale } from '../../../../../core/theme/designTokens';
import type { ProviderJob } from '../jobs.types';

type Props = {
    job: ProviderJob;
};

const JobEstimateCard = ({ job }: Props) => (
    <View style={styles.card}>
        <AppText style={styles.estimate}>
            Est. Earnings: {job.price.replace(' (est.)', '')}
        </AppText>
        <AppText style={styles.duration}>Estimated Duration: {job.duration}</AppText>
    </View>
);

export default JobEstimateCard;

const styles = StyleSheet.create({
    card: {
        gap: Spacing.xxs,
        borderWidth: 1,
        borderColor: Colors.amber,
        borderRadius: Radii.md,
        backgroundColor: Colors.amberLight,
        padding: Spacing.sm,
    },
    estimate: {
        ...TypeScale.body,
        color: Colors.primaryDark,
        fontSize: FontSize.subtitle,
        fontWeight: '600',
    },
    duration: {
        ...TypeScale.body,
        color: Colors.primaryDark,
        fontSize: FontSize.subtitle,
    },
});
