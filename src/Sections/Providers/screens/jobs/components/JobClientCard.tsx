import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import AppText from '../../../../../components/AppText';
import { Colors } from '../../../../../core/theme/colors';
import { FontSize, Radii, Spacing, TypeScale } from '../../../../../core/theme/designTokens';
import { RS } from '../../../../../core/utils/responsive';
import type { ProviderJob } from '../jobs.types';

type Props = {
    job: ProviderJob;
    onMessage: () => void;
};

const JobClientCard = ({ job, onMessage }: Props) => (
    <View style={styles.card}>
        <View style={styles.avatar}>
            <AppText style={styles.avatarText}>
                {job.clientName.split(' ').map((name) => name[0]).join('')}
            </AppText>
        </View>
        <View style={styles.clientInfo}>
            <View style={styles.nameRow}>
                <AppText style={styles.name} numberOfLines={1}>{job.clientName}</AppText>
                <View style={styles.verifiedBadge}>
                    <Svg width={RS(14)} height={RS(14)} viewBox="0 0 24 24">
                        <Path d="m5 12 4 4L19 6" fill="none" stroke={Colors.success} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                    <AppText style={styles.verifiedText}>Verified</AppText>
                </View>
            </View>
            <View style={styles.ratingRow}>
                <AppText style={styles.star}>★</AppText>
                <AppText style={styles.rating}>{job.rating}</AppText>
                <AppText style={styles.reviews}>({job.reviews})</AppText>
            </View>
        </View>
        <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Message ${job.clientName}`}
            onPress={onMessage}
            style={styles.messageButton}
        >
            <AppText style={styles.messageText}>Message Client</AppText>
        </Pressable>
    </View>
);

export default JobClientCard;

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        borderWidth: 1,
        borderColor: Colors.primaryLight,
        borderRadius: Radii.md,
        backgroundColor: Colors.white,
        padding: Spacing.sm,
    },
    avatar: {
        width: RS(48),
        height: RS(48),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: Radii.pill,
        backgroundColor: Colors.primaryLight,
    },
    avatarText: {
        ...TypeScale.body,
        color: Colors.primaryDark,
        fontSize: FontSize.bodyLarge,
        fontWeight: '600',
    },
    clientInfo: {
        flex: 1,
        gap: RS(2),
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: RS(5),
    },
    name: {
        ...TypeScale.body,
        flexShrink: 1,
        color: Colors.primaryDark,
        fontSize: FontSize.body,
        fontWeight: '600',
    },
    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: RS(3),
        borderRadius: Radii.pill,
        backgroundColor: Colors.successLight,
        paddingHorizontal: RS(6),
        paddingVertical: RS(2),
    },
    verifiedText: {
        ...TypeScale.caption,
        color: Colors.success,
        fontSize: FontSize.caption,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: RS(4),
    },
    star: {
        color: '#E79A32',
        fontSize: FontSize.bodyLarge,
    },
    rating: {
        ...TypeScale.body,
        color: Colors.primaryDark,
        fontSize: FontSize.body,
    },
    reviews: {
        ...TypeScale.body,
        color: Colors.textSecondary,
        fontSize: FontSize.bodySmall,
    },
    messageButton: {
        minHeight: RS(40),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: Colors.primaryDark,
        borderRadius: Radii.pill,
        paddingHorizontal: Spacing.sm,
    },
    messageText: {
        ...TypeScale.body,
        color: Colors.primaryDark,
        fontSize: FontSize.bodySmall,
        fontWeight: '500',
    },
});
