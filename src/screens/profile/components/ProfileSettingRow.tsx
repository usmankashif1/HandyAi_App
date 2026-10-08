import { FontSize } from '../../../core/theme/designTokens';
import { StyleSheet } from 'react-native';
import AppText from '../../../components/AppText';
import Container from '../../../components/Container';
import { RS } from '../../../core/utils/responsive';
import ProfileIcon, { type ProfileIconName } from './ProfileIcon';



type Props = {
    icon: Extract<ProfileIconName, 'notes' | 'payment' | 'support'>;
    title: string;
    detail?: string;
    compact: boolean;
};

const ProfileSettingRow = ({ icon, title, detail, compact }: Props) => (
    <Container style={[styles.row, compact && styles.compactRow]}>
        <Container style={styles.icon}>
            <ProfileIcon name={icon} size={RS(compact ? 28 : 32)} />
        </Container>
        <Container style={styles.copy}>
            <AppText style={[styles.title, compact && styles.compactTitle]}>{title}</AppText>
            {detail ? (
                <AppText style={[styles.detail, compact && styles.compactDetail]}>{detail}</AppText>
            ) : null}
        </Container>
        <Container style={styles.chevron}>
            <ProfileIcon name="chevron" size={RS(24)} />
        </Container>
    </Container>
);

export default ProfileSettingRow;

const styles = StyleSheet.create({
    row: {
        minHeight: RS(88),
        flexDirection: 'row',
        alignItems: 'center',
        gap: RS(14),
        paddingHorizontal: RS(16),
        paddingVertical: RS(14),
    },
    compactRow: {
        minHeight: RS(76),
        gap: RS(10),
        paddingHorizontal: RS(12),
        paddingVertical: RS(12),
    },
    icon: {
        width: RS(38),
        alignItems: 'center',
    },
    copy: {
        flex: 1,
        minWidth: RS(0),
        gap: RS(4),
    },
    title: {
        color: '#17191C',
        fontSize: FontSize.bodyLarge,
        fontWeight: '600',
    },
    compactTitle: {
        fontSize: FontSize.body,
    },
    detail: {
        color: '#17191C',
        fontSize: FontSize.body,
        lineHeight: RS(23),
    },
    compactDetail: {
        fontSize: FontSize.bodySmall,
        lineHeight: RS(20),
    },
    chevron: {
        width: RS(24),
        alignItems: 'center',
    },
});
