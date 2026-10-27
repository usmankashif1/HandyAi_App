import { StyleSheet, View } from 'react-native';
import AppText from '../../../../../components/AppText';
import { RF, RS } from '../../../../../core/utils/responsive';

const ProviderSkillChip = ({ label }: { label: string }) => (
    <View style={styles.chip}>
        <AppText style={styles.label}>{label}</AppText>
    </View>
);

export default ProviderSkillChip;

const NAVY = '#172B4D';

const styles = StyleSheet.create({
    chip: {
        minHeight: RS(29),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#C7D5E7',
        borderRadius: RS(999),
        backgroundColor: '#FFFFFF',
        paddingHorizontal: RS(13),
        paddingVertical: RS(3),
    },
    label: {
        color: NAVY,
        fontSize: RF(13),
        lineHeight: RS(19),
    },
});
