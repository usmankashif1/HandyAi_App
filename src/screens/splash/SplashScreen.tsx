import { ActivityIndicator, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import AppText from '../../components/AppText';
import Container from '../../components/Container';
import { Colors } from '../../core/theme/colors';
import { FontSize, Radii, Spacing, TypeScale } from '../../core/theme/designTokens';
import { RS } from '../../core/utils/responsive';

const SplashScreen = () => (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

        <Container style={styles.brandArea}>
            <Container style={styles.brand}>
                <Container style={styles.mark}>
                    <Container style={[styles.halo, styles.haloOuter]} />
                    <Container style={[styles.halo, styles.haloInner]} />
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
                </Container>

                <AppText style={styles.title}>Handy AI</AppText>
                <AppText style={styles.tagline}>Your home. Our AI.</AppText>
            </Container>
        </Container>

        <Container style={styles.loading}>
            <AppText style={styles.loadingText}>
                Loading your smart home assistant...
            </AppText>
            <Container style={styles.spinner}>
                <ActivityIndicator size="small" color={Colors.primary} />
            </Container>
        </Container>
    </SafeAreaView>
);

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
        width: RS(240),
        height: RS(220),
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.xs,
    },
    halo: {
        position: 'absolute',
        borderRadius: Radii.pill,
    },
    haloOuter: {
        width: RS(220),
        height: RS(220),
        backgroundColor: Colors.amberLight,
        opacity: 0.28,
    },
    haloInner: {
        width: RS(164),
        height: RS(164),
        backgroundColor: Colors.amber,
        opacity: 0.1,
    },
    title: {
        ...TypeScale.heading,
        color: Colors.primaryDark,
        fontWeight: '700',
        fontSize: FontSize.display,
        lineHeight: RS(58),
        letterSpacing: RS(-1.5),
        marginTop: Spacing.xs,
    },
    tagline: {
        ...TypeScale.subtitle,
        color: Colors.textSecondary,
        fontSize: FontSize.bodyLarge,
        lineHeight: RS(28),
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
        width: RS(48),
        height: RS(48),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: Radii.pill,
        backgroundColor: Colors.primaryLight,
    },
});
