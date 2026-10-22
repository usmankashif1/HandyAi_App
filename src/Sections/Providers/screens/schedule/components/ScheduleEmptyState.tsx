import { Image, StyleSheet, View } from 'react-native';
import AppText from '../../../../../components/AppText';
import { Colors } from '../../../../../core/theme/colors';
import { RS } from '../../../../../core/utils/responsive';

type Props = {
    hasSearchOrFilter: boolean;
};

const ScheduleEmptyState = ({ hasSearchOrFilter }: Props) => (
    <View style={styles.container}>
        <Image
            source={require('../../../../../assets/images/serviceTacker_image.png')}
            style={styles.illustration}
            resizeMode="contain"
            accessibilityLabel="No appointments scheduled"
        />
        <AppText style={styles.title}>No jobs scheduled for this day.</AppText>
        {hasSearchOrFilter && (
            <AppText style={styles.subtitle}>
                Try changing your search or filters.
            </AppText>
        )}
    </View>
);

export default ScheduleEmptyState;

const styles = StyleSheet.create({
    container: {
        minHeight: RS(250),
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: RS(20),
        paddingVertical: RS(20),
    },
    illustration: {
        width: RS(145),
        height: RS(125),
        marginBottom: RS(8),
    },
    title: {
        color: Colors.primaryDark,
        fontSize: RS(14),
        textAlign: 'center',
    },
    subtitle: {
        color: Colors.textSecondary,
        fontSize: RS(12),
        textAlign: 'center',
        marginTop: RS(5),
    },
});
