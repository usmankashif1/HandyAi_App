import { FontSize } from '../../../core/theme/designTokens';
import { Image, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '../../../core/theme/colors';
import type { ScheduleBooking, ScheduleBookingStatus } from '../schedule.types';
import Container from '../../../components/Container';
import AppText from '../../../components/AppText';
import AppButton from '../../../components/AppButton';
import { RH, RS, RW } from '../../../core/utils/responsive';



type Props = {
    booking: ScheduleBooking;
    onMessage: () => void;
};

const BookingStatusBadge = ({ status }: { status: ScheduleBookingStatus }) => {
    const confirmed = status === 'Confirmed';

    return (
        <Container style={[styles.statusBadge, confirmed ? styles.confirmedBadge : styles.onTheWayBadge]}>
            <AppText style={[styles.statusText, confirmed ? styles.confirmedText : styles.onTheWayText]}>
                {status}
            </AppText>
        </Container>
    );
};

const ActionIcon = ({ edit }: { edit: boolean }) => (
    <Svg width={RS(22)} height={RS(22)} viewBox="0 0 24 24">
        {edit ? (
            <Path
                d="M12 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-6M14.5 4.5l5 5M9 15l1-.2 9.8-9.8a2.1 2.1 0 0 0-3-3L7 12v3h2Z"
                fill="none"
                stroke={Colors.textSecondary}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        ) : (
            <Path
                d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H6l-3 2v-5.5A7.5 7.5 0 1 1 20 11.5Zm-11-1 2.5 2 3.5-3"
                fill="none"
                stroke={Colors.textSecondary}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        )}
    </Svg>
);

const ScheduleBookingCard = ({ booking, onMessage }: Props) => (
    <Container style={styles.card}>
        <Container style={styles.details}>
            <Image
                source={{ uri: booking.image }}
                style={styles.image}
                resizeMode="cover"
                accessibilityLabel={`${booking.service} service`}
            />
            <Container style={styles.info}>
                <Container style={styles.heading}>
                    <AppText style={styles.serviceName} numberOfLines={1}>{booking.service}</AppText>
                    <BookingStatusBadge status={booking.status} />
                </Container>
                <AppText style={styles.providerName} numberOfLines={1}>{booking.provider}</AppText>
                <AppText style={styles.time} numberOfLines={1}>{booking.time}</AppText>
            </Container>
        </Container>

        <Container style={styles.actionRow}>
            <AppButton style={styles.actionButton} accessibilityRole="button" accessibilityLabel="Edit booking">
                <ActionIcon edit />
                <AppText style={styles.actionText}>Edit</AppText>
            </AppButton>
            <AppButton
                style={({ pressed }) => [styles.actionButton, pressed && styles.actionPressed]}
                accessibilityRole="button"
                accessibilityLabel={`Message ${booking.providerName}`}
                onPress={onMessage}
            >
                <ActionIcon edit={false} />
                <AppText style={styles.actionText}>Message</AppText>
            </AppButton>
        </Container>
    </Container>
);

export default ScheduleBookingCard;

const styles = StyleSheet.create({
    card: {
        padding: RS(12),
        borderWidth: 1,
        borderColor: '#E1E1DE',
        borderRadius: RS(20),
        backgroundColor: Colors.surface,
    },
    details: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: RS(12),
    },
    image: {
        width: RW(68),
        height: RH(76),
        borderRadius: RS(12),
        backgroundColor: '#E7E4DC',
    },
    info: {
        flex: 1,
        minWidth: 0,
        gap: RS(5),
    },
    heading: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: RS(6),
    },
    serviceName: {
        flexShrink: 1,
        color: '#171923',
        fontSize: FontSize.bodyLarge,
        fontWeight: '700',
    },
    statusBadge: {
        flexShrink: 0,
        paddingHorizontal: RS(9),
        paddingVertical: RS(4),
        borderWidth: 1,
        borderRadius: RS(999),
    },
    confirmedBadge: {
        borderColor: '#71B9AC',
        backgroundColor: '#DDF1EA',
    },
    onTheWayBadge: {
        borderColor: '#E0C35F',
        backgroundColor: '#FFF4D3',
    },
    statusText: {
        fontSize: FontSize.bodySmall,
        lineHeight: RH(18),
    },
    confirmedText: {
        color: '#176B60',
    },
    onTheWayText: {
        color: '#92721B',
    },
    providerName: {
        color: '#45464B',
        fontSize: FontSize.body,
    },
    time: {
        color: '#292A2E',
        fontSize: FontSize.body,
    },
    actionRow: {
        flexDirection: 'row',
        gap: RS(10),
        marginTop: RS(14),
    },
    actionButton: {
        flex: 1,
        minHeight: RH(44),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: RS(8),
        borderWidth: 1,
        borderColor: '#DEDEDF',
        borderRadius: RS(999),
    },
    actionPressed: {
        backgroundColor: '#F2F3F5',
    },
    actionText: {
        color: Colors.textSecondary,
        fontSize: FontSize.body,
    },
});
