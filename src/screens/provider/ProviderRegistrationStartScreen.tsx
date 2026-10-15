import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppText from '../../components/AppText';
import { Colors } from '../../core/theme/colors';
import { Radii, Spacing } from '../../core/theme/designTokens';
import type { ProviderStackParamList } from '../../navigation/provider/provider.types';

type Props = NativeStackScreenProps<ProviderStackParamList, 'RegistrationStart'>;

const ProviderRegistrationStartScreen = ({ navigation }: Props) => (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
        <View style={styles.content}>
            <Pressable
                accessibilityRole="button"
                onPress={() => navigation.goBack()}
                style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
            >
                <AppText style={styles.backText}>‹</AppText>
            </Pressable>
            <View style={styles.message}>
                <AppText style={styles.title}>Join Handy AI as a Pro</AppText>
                <AppText style={styles.description}>
                    Provider registration is coming soon. Your professional journey will start here.
                </AppText>
            </View>
        </View>
    </SafeAreaView>
);

export default ProviderRegistrationStartScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        flex: 1,
        padding: Spacing.xl,
    },
    backButton: {
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: Radii.pill,
        backgroundColor: Colors.primaryLight,
    },
    backText: {
        color: Colors.primaryDark,
        fontSize: 34,
        lineHeight: 40,
        marginTop: -4,
    },
    message: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Spacing.md,
    },
    title: {
        color: Colors.primaryDark,
        fontSize: 26,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: Spacing.sm,
    },
    description: {
        color: Colors.textSecondary,
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'center',
    },
    pressed: {
        opacity: 0.78,
    },
});
