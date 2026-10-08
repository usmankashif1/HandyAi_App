import { FontSize } from '../../../core/theme/designTokens';
import { Image, StyleSheet } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import AppButton from '../../../components/AppButton';
import AppText from '../../../components/AppText';
import Container from '../../../components/Container';
import { Colors } from '../../../core/theme/colors';
import { RS } from '../../../core/utils/responsive';
import type { HistoryBooking } from '../history.types';



type Props = {
    booking: HistoryBooking;
    compact: boolean;
    isTrusted: boolean;
    onToggleTrusted: () => void;
};

const TrustedProviderIcon = () => (
    <Svg width={22} height={22} viewBox="0 0 24 24">
        <Rect x="4.5" y="6" width="15" height="15" rx="2.5" fill="none" stroke="#29241F" strokeWidth={1.8} />
        <Path d="M8 3.5v5M16 3.5v5M12 11v5m-2.5-2.5h5" fill="none" stroke="#29241F" strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
);

const HistoryBookingCard = ({ booking, compact, isTrusted, onToggleTrusted }: Props) => (
    <Container style={styles.card}>
        <Container style={styles.details}>
            <Image
                source={{ uri: booking.image }}
                style={[styles.image, compact && styles.compactImage]}
                resizeMode="cover"
                accessibilityLabel={`${booking.service} service`}
            />
            <Container style={styles.info}>
                <Container style={styles.heading}>
                    <AppText style={[styles.serviceName, compact && styles.compactServiceName]} numberOfLines={2}>
                        {booking.service}
                    </AppText>
                    <AppText style={[styles.price, compact && styles.compactPrice]}>{booking.price}</AppText>
                </Container>
                <Container style={styles.dateStatusRow}>
                    <AppText style={[styles.date, compact && styles.compactDate]} numberOfLines={1}>
                        {booking.date}
                    </AppText>
                    <Container style={styles.statusBadge}>
                        <AppText style={styles.statusText}>{booking.status}</AppText>
                    </Container>
                </Container>
                <AppText style={[styles.provider, compact && styles.compactProvider]} numberOfLines={1}>
                    {booking.provider}
                </AppText>
            </Container>
        </Container>

        <AppButton
            style={({ pressed }) => [
                styles.trustedButton,
                compact && styles.compactTrustedButton,
                pressed && styles.trustedButtonPressed,
            ]}
            onPress={onToggleTrusted}
            accessibilityRole="button"
            accessibilityLabel={
                isTrusted
                    ? `${booking.provider} saved as trusted provider`
                    : `Save ${booking.provider} as trusted provider`
            }
            accessibilityState={{ selected: isTrusted }}
        >
            <TrustedProviderIcon />
            <AppText style={[styles.trustedButtonText, compact && styles.compactTrustedButtonText]}>
                {isTrusted ? 'Trusted Provider' : 'Save as Trusted Provider'}
            </AppText>
        </AppButton>
    </Container>
);

export default HistoryBookingCard;

const styles = StyleSheet.create({
    card: {
        padding: RS(12),
        borderWidth: 1,
        borderColor: '#E0DEDA',
        borderRadius: RS(20),
        backgroundColor: Colors.surface,
    },
    details: {
        minHeight: RS(112),
        flexDirection: 'row',
        alignItems: 'center',
        gap: RS(12),
    },
    image: {
        width: RS(68),
        height: RS(76),
        borderRadius: RS(12),
        backgroundColor: '#E7E4DC',
    },
    compactImage: {
        width: RS(56),
        height: RS(68),
    },
    info: {
        flex: 1,
        minWidth: RS(0),
        gap: RS(7),
    },
    heading: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: RS(6),
    },
    serviceName: {
        flex: 1,
        color: '#171411',
        fontSize: FontSize.bodyLarge,
        fontWeight: '700',
        lineHeight: RS(21),
    },
    compactServiceName: {
        fontSize: FontSize.bodyLarge,
        lineHeight: RS(21),
    },
    price: {
        color: '#171411',
        fontSize: FontSize.bodyLarge,
        fontWeight: '700',
    },
    compactPrice: {
        fontSize: FontSize.bodyLarge,
    },
    dateStatusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: RS(6),
    },
    date: {
        flex: 1,
        color: '#72716F',
        fontSize: FontSize.body,
    },
    compactDate: {
        fontSize: FontSize.body,
    },
    statusBadge: {
        flexShrink: 0,
        paddingHorizontal: RS(9),
        paddingVertical: RS(4),
        borderWidth: 1,
        borderColor: '#D2E9DF',
        borderRadius: RS(999),
        backgroundColor: '#E3F3EC',
    },
    statusText: {
        color: '#24694B',
        fontSize: FontSize.bodySmall,
        lineHeight: RS(18),
    },
    provider: {
        color: '#171411',
        fontSize: FontSize.body,
    },
    compactProvider: {
        fontSize: FontSize.body,
    },
    trustedButton: {
        minHeight: RS(48),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: RS(10),
        marginTop: RS(10),
        borderWidth: 1,
        borderColor: '#DFDDDA',
        borderRadius: RS(999),
        backgroundColor: Colors.surface,
    },
    compactTrustedButton: {
        minHeight: RS(44),
        gap: RS(7),
    },
    trustedButtonPressed: {
        backgroundColor: '#F4F2EE',
    },
    trustedButtonText: {
        color: '#29241F',
        fontSize: FontSize.body,
    },
    compactTrustedButtonText: {
        fontSize: FontSize.body,
    },
});
