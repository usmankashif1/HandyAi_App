import { Image, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import AppText from '../../../../../components/AppText';
import { Colors } from '../../../../../core/theme/colors';
import { RF, RS } from '../../../../../core/utils/responsive';
import type { ScheduleAppointment } from '../schedule.types';

type Props = {
    appointment: ScheduleAppointment;
};

const ScheduleAppointmentCard = ({ appointment }: Props) => (
    <View style={styles.card}>
        <View style={styles.topRow}>
            <AppText style={styles.time}>
                {appointment.startTime} - {appointment.endTime}
            </AppText>
            <View style={styles.statusBadge}>
                <AppText style={styles.statusText}>Upcoming</AppText>
            </View>
        </View>
        <View style={styles.details}>
            <Image
                source={require('../../../../../assets/images/handyMan.jpg')}
                style={styles.serviceImage}
                accessibilityLabel={`${appointment.service} service`}
            />
            <View style={styles.info}>
                <AppText style={styles.service} numberOfLines={1}>
                    {appointment.service}
                </AppText>
                <View style={styles.detailRow}>
                    <View style={styles.avatar}>
                        <Text allowFontScaling={false} style={styles.avatarText}>
                            {appointment.customer.charAt(0)}
                        </Text>
                    </View>
                    <AppText style={styles.customer} numberOfLines={1}>
                        {appointment.customer}
                    </AppText>
                </View>
                <View style={styles.detailRow}>
                    <Svg width={RS(15)} height={RS(15)} viewBox="0 0 24 24">
                        <Path
                            d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"
                            fill="none"
                            stroke={Colors.textSecondary}
                            strokeWidth="1.8"
                        />
                        <Circle
                            cx="12"
                            cy="10"
                            r="2.5"
                            fill="none"
                            stroke={Colors.textSecondary}
                            strokeWidth="1.8"
                        />
                    </Svg>
                    <AppText style={styles.location} numberOfLines={1}>
                        {appointment.location}
                    </AppText>
                </View>
            </View>
            <View style={styles.rating}>
                <AppText style={styles.star}>★</AppText>
                <AppText style={styles.ratingText}>{appointment.rating}</AppText>
            </View>
        </View>
    </View>
);

export default ScheduleAppointmentCard;

const styles = StyleSheet.create({
    card: {
        borderWidth: RS(1),
        borderColor: Colors.border,
        borderRadius: RS(12),
        backgroundColor: Colors.white,
        padding: RS(12),
        gap: RS(8),
        shadowColor: Colors.primaryDark,
        shadowOpacity: 0.04,
        shadowRadius: RS(6),
        shadowOffset: { width: 0, height: RS(2) },
        elevation: 1,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: RS(8),
    },
    time: {
        flexShrink: 1,
        color: Colors.black,
        fontSize: RF(14),
        fontWeight: '600',
    },
    statusBadge: {
        borderRadius: RS(999),
        backgroundColor: Colors.secondaryLight,
        paddingHorizontal: RS(9),
        paddingVertical: RS(3),
    },
    statusText: {
        color: Colors.secondary,
        fontSize: RF(14),
        fontWeight: '500',
    },
    details: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: RS(9),
    },
    serviceImage: {
        width: RS(60),
        height: RS(60),
        borderRadius: RS(9),
    },
    info: {
        flex: 1,
        gap: RS(3),
    },
    service: {
        color: Colors.black,
        fontSize: RF(18),
        fontWeight: '600',
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: RS(5),
    },
    avatar: {
        width: RS(24),
        height: RS(24),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: RS(50),
        backgroundColor: Colors.primaryLight,
    },
    avatarText: {
        color: Colors.black,
        fontSize: RF(12),
        lineHeight: RS(16),
        fontWeight: '600',
        includeFontPadding: false,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    customer: {
        flexShrink: 1,
        color: Colors.textPrimary,
        fontSize: RF(16),
    },
    location: {
        flex: 1,
        color: Colors.textSecondary,
        fontSize: RF(14),
    },
    rating: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: RS(2),
    },
    star: {
        color: Colors.warning,
        fontSize: RF(14),
    },
    ratingText: {
        color: Colors.primaryDark,
        fontSize: RF(14),
    },
});
