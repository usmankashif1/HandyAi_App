import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import AppText from '../../../../../components/AppText';
import { Colors } from '../../../../../core/theme/colors';
import { FontSize, Radii, Spacing, TypeScale } from '../../../../../core/theme/designTokens';
import { RS } from '../../../../../core/utils/responsive';
import type { ProviderJob } from '../jobs.types';

type Props = {
    job: ProviderJob;
};

const JobLocationCard = ({ job }: Props) => (
    <View style={styles.card}>
        <View style={styles.map}>
            <Svg width="100%" height="100%" viewBox="0 0 360 112" preserveAspectRatio="xMidYMid slice">
                <Rect width="360" height="112" fill="#E7EDF1" />
                <Path d="M0 75 66 36l58 18 49-42 68 27 56-25 63 20v78H0Z" fill="#E1E9DF" />
                <Path d="M-10 91 56 27l50 46 55-63 68 56 55-37 85 46M31 122l55-69 63 24 44-52 45 48 74-37 57 39" fill="none" stroke="#FFFFFF" strokeWidth="10" />
                <Path d="M-10 91 56 27l50 46 55-63 68 56 55-37 85 46M31 122l55-69 63 24 44-52 45 48 74-37 57 39" fill="none" stroke="#CCD6DF" strokeWidth="1.5" />
                <Path d="M116 115 142 74l49-4 25-29" fill="none" stroke="#8EB0D5" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                <Path d="M180 59c0-8 6-14 14-14s14 6 14 14c0 10-14 25-14 25s-14-15-14-25Z" fill={Colors.primaryDark} />
                <Circle cx="194" cy="59" r="4" fill={Colors.white} />
            </Svg>
            <View style={styles.mapLabel}>
                <Svg width={RS(18)} height={RS(18)} viewBox="0 0 24 24">
                    <Path
                        d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"
                        fill="none"
                        stroke={Colors.primaryDark}
                        strokeWidth={2}
                    />
                    <Circle cx="12" cy="10" r="2.5" fill="none" stroke={Colors.primaryDark} strokeWidth={2} />
                </Svg>
                <AppText style={styles.mapLabelText}>{job.location} ({job.distance})</AppText>
            </View>
        </View>
        <View style={styles.address}>
            <AppText style={styles.addressText}>{job.fullAddress}</AppText>
        </View>
    </View>
);

export default JobLocationCard;

const styles = StyleSheet.create({
    card: {
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: Colors.primaryLight,
        borderRadius: Radii.md,
        backgroundColor: Colors.white,
    },
    map: {
        height: RS(112),
        justifyContent: 'center',
        backgroundColor: '#E7EDF1',
    },
    mapLabel: {
        position: 'absolute',
        top: RS(10),
        left: RS(10),
        maxWidth: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
        borderRadius: Radii.sm,
        backgroundColor: Colors.white,
        paddingHorizontal: Spacing.xs,
        paddingVertical: RS(5),
    },
    mapLabelText: {
        ...TypeScale.body,
        flexShrink: 1,
        color: Colors.primaryDark,
        fontSize: FontSize.bodySmall,
    },
    address: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
        borderTopWidth: 1,
        borderTopColor: Colors.primaryLight,
    },
    addressText: {
        ...TypeScale.body,
        color: Colors.textPrimary,
        fontSize: FontSize.bodySmall,
    },
});
