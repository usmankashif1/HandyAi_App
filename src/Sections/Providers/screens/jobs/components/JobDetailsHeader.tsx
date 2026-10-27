import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import AppText from '../../../../../components/AppText';
import { Colors } from '../../../../../core/theme/colors';
import { FontSize, Radii, Spacing, TypeScale } from '../../../../../core/theme/designTokens';
import { RS } from '../../../../../core/utils/responsive';

type Props = {
    onBackPress: () => void;
};

const JobDetailsHeader = ({ onBackPress }: Props) => (
    <View style={styles.header}>
        <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back to job requests"
            onPress={onBackPress}
            hitSlop={8}
            style={styles.backButton}
        >
            <Svg width={RS(30)} height={RS(30)} viewBox="0 0 24 24">
                <Path
                    d="m15 18-6-6 6-6"
                    fill="none"
                    stroke={Colors.primaryDark}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </Svg>
        </Pressable>
        <AppText style={styles.title}>Job Details</AppText>
        <View style={styles.rightSpacer} />
    </View>
);

export default JobDetailsHeader;

const styles = StyleSheet.create({
    header: {
        minHeight: RS(54),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.md,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: Colors.primaryLight,
    },
    backButton: {
        width: RS(36),
        height: RS(42),
        justifyContent: 'center',
    },
    title: {
        position: 'absolute',
        left: RS(52),
        right: RS(52),
        ...TypeScale.body,
        color: Colors.black,
        fontSize: FontSize.subheading,
        fontWeight: '800',
        textAlign: 'center',
    },
    rightSpacer: {
        width: RS(36),
        height: RS(42),
        borderRadius: Radii.md,
    },
});
