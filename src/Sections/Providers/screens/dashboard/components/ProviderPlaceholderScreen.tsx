import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppText from '../../../../../components/AppText';
import { Colors } from '../../../../../core/theme/colors';
import { RS } from '../../../../../core/utils/responsive';
import type { ProviderTabParamList } from '../../../navigation/provider.types';

type Props = BottomTabScreenProps<ProviderTabParamList>;

const ProviderPlaceholderScreen = ({ route }: Props) => (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
        <View style={styles.content}>
            <AppText style={styles.title}>{route.name}</AppText>
            <AppText style={styles.description}>
                Your {route.name.toLowerCase()} information will appear here.
            </AppText>
        </View>
    </SafeAreaView>
);

export default ProviderPlaceholderScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: RS(24),
    },
    title: {
        color: '#10264D',
        fontSize: RS(27),
        fontWeight: '700',
        marginBottom: RS(8),
    },
    description: {
        color: Colors.textSecondary,
        fontSize: RS(15),
        textAlign: 'center',
    },
});
