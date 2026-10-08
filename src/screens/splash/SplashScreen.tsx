import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import {
    ActivityIndicator,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '../../core/theme/colors';
import { Radii, Spacing, TypeScale } from '../../core/theme/designTokens';
import type { RootStackParamList } from '../../navigation/root/root.types';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const SPLASH_DURATION_MS = 2500;

const SplashScreen = ({ navigation }: Props) => {
    useEffect(() => {
        const timeout = setTimeout(() => {
            navigation.replace('Onboarding');
        }, SPLASH_DURATION_MS);

        return () => clearTimeout(timeout);
    }, [navigation]);

    return (
        <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

            <View style={styles.brandArea}>
                <View style={styles.brand}>
                    <View style={styles.mark}>
                        <View style={[styles.halo, styles.haloOuter]} />
                        <View style={[styles.halo, styles.haloInner]} />
                        <Svg width={144} height={144} viewBox="0 0 160 160" accessibilityLabel="Handy AI house mark">
                            <Path
                                d="M28 130V78a10 10 0 0 1 3-7l42-42a10 10 0 0 1 14 0l42 42a10 10 0 0 1 3 7v52"
                                fill="none"
                                stroke={Colors.primaryDark}
                                strokeWidth={11}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <Path
                                d="M119 50V39"
                                fill="none"
                                stroke={Colors.primaryDark}
                                strokeWidth={9}
                                strokeLinecap="round"
                            />
                            <Path
                                d="M80 73c4 12 9 17 21 21-12 4-17 9-21 21-4-12-9-17-21-21 12-4 17-9 21-21Z"
                                fill={Colors.amber}
                            />
                        </Svg>
                    </View>

                    <Text style={styles.title}>Handy AI</Text>
                    <Text style={styles.tagline}>Your home. Our AI.</Text>
                </View>
            </View>

            <View style={styles.loading}>
                <Text style={styles.loadingText}>
                    Loading your smart home assistant...
                </Text>
                <View style={styles.spinner}>
                    <ActivityIndicator size="small" color={Colors.primary} />
                </View>
            </View>
        </SafeAreaView>
    );
};

export default SplashScreen;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.background,
        paddingHorizontal: Spacing.xl,
    },
    brandArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    brand: {
        alignItems: 'center',
        transform: [{ translateY: -Spacing.sm }],
    },
    mark: {
        width: 240,
        height: 220,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.xs,
    },
    halo: {
        position: 'absolute',
        borderRadius: Radii.pill,
    },
    haloOuter: {
        width: 220,
        height: 220,
        backgroundColor: Colors.amberLight,
        opacity: 0.28,
    },
    haloInner: {
        width: 164,
        height: 164,
        backgroundColor: Colors.amber,
        opacity: 0.1,
    },
    title: {
        ...TypeScale.heading,
        color: Colors.primaryDark,
        fontWeight: '700',
        fontSize: 48,
        lineHeight: 58,
        letterSpacing: -1.5,
        marginTop: Spacing.xs,
    },
    tagline: {
        ...TypeScale.subtitle,
        color: Colors.textSecondary,
        fontSize: 18,
        lineHeight: 28,
        marginTop: Spacing.xs,
    },
    loading: {
        alignItems: 'center',
        paddingBottom: Spacing.xxl,
    },
    loadingText: {
        ...TypeScale.caption,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginBottom: Spacing.lg,
    },
    spinner: {
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: Radii.pill,
        backgroundColor: Colors.primaryLight,
    },
});
