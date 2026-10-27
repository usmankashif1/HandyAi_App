import { Pressable, StyleSheet, View } from 'react-native';
import AppText from '../../../../../components/AppText';
import { Colors } from '../../../../../core/theme/colors';
import { FontSize, Radii, Spacing, TypeScale } from '../../../../../core/theme/designTokens';
import { RS } from '../../../../../core/utils/responsive';

const JobDetailActions = () => (
    <View style={styles.actions}>
        <Pressable accessibilityRole="button" style={styles.acceptButton}>
            <AppText style={styles.acceptText}>Accept Job</AppText>
        </Pressable>
        <Pressable accessibilityRole="button" style={styles.declineButton}>
            <AppText style={styles.declineText}>Decline</AppText>
        </Pressable>
    </View>
);

export default JobDetailActions;

const styles = StyleSheet.create({
    actions: {
        flexDirection: 'row',
        gap: Spacing.sm,
        paddingHorizontal: Spacing.md,
        paddingTop: Spacing.sm,
        paddingBottom: Spacing.xs,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: Colors.primaryLight,
        backgroundColor: Colors.background,
    },
    acceptButton: {
        flex: 1,
        minHeight: RS(50),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: Radii.pill,
        backgroundColor: Colors.primaryDark,
    },
    acceptText: {
        ...TypeScale.body,
        color: Colors.white,
        fontSize: FontSize.body,
        fontWeight: '600',
    },
    declineButton: {
        flex: 1,
        minHeight: RS(50),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: Colors.primaryDark,
        borderRadius: Radii.pill,
    },
    declineText: {
        ...TypeScale.body,
        color: Colors.primaryDark,
        fontSize: FontSize.body,
        fontWeight: '600',
    },
});
