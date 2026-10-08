import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image, ScrollView, StatusBar, StyleSheet, useWindowDimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import AppButton from '../../components/AppButton';
import AppText from '../../components/AppText';
import Container from '../../components/Container';
import { Colors } from '../../core/theme/colors';
import { FontSize, Radii, Spacing, TypeScale } from '../../core/theme/designTokens';
import { RS } from '../../core/utils/responsive';
import type { RootStackParamList } from '../../navigation/root/root.types';



type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const GoogleMark = () => (
    <Svg width={22} height={22} viewBox="0 0 48 48" accessibilityLabel="Google">
        <Path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.7c3.9-3.6 6-8.9 6-15Z" />
        <Path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.8l-6.7-5.1c-1.8 1.2-4 1.9-6.8 1.9-5.2 0-9.6-3.5-11.2-8.2H5.9v5.3A20 20 0 0 0 24 44Z" />
        <Path fill="#FBBC05" d="M12.8 27.8a12 12 0 0 1 0-7.6v-5.3H5.9a20 20 0 0 0 0 18.2l6.9-5.3Z" />
        <Path fill="#EA4335" d="M24 12c3 0 5.7 1 7.8 3.1l5.9-5.9C34.1 5.8 29.5 4 24 4A20 20 0 0 0 5.9 14.9l6.9 5.3C14.4 15.5 18.8 12 24 12Z" />
    </Svg>
);

const AppleMark = () => (
    <Svg width={20} height={22} viewBox="0 0 24 28" accessibilityLabel="Apple">
        <Path
            fill={Colors.textPrimary}
            d="M19.7 14.8c0-3.1 2.5-4.6 2.6-4.7a5.7 5.7 0 0 0-4.5-2.4c-1.9-.2-3.7 1.1-4.7 1.1s-2.5-1.1-4.1-1.1a6.1 6.1 0 0 0-5.1 3.1c-2.2 3.8-.6 9.4 1.5 12.5 1 1.5 2.2 3.2 3.8 3.1 1.5-.1 2.1-1 4-1s2.5 1 4.1 1 2.7-1.5 3.7-3.1a13 13 0 0 0 1.7-3.6 5.3 5.3 0 0 1-3-4.9Zm-3.1-9.1A5.6 5.6 0 0 0 17.9 2a5.7 5.7 0 0 0-3.7 1.9 5.2 5.2 0 0 0-1.4 3.6 4.8 4.8 0 0 0 3.8-1.8Z"
        />
    </Svg>
);

const OnboardingScreen = ({ navigation }: Props) => {
    const { height, width } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const heroHeight = Math.min(height * 0.36, width * 0.82);

    return (
        <SafeAreaView style={styles.safeArea} edges={['bottom']}>
            <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Container style={[styles.hero, { height: heroHeight }]}>
                    <Image
                        source={require('../../assets/images/Onboarding_Home.jpg')}
                        style={styles.heroImage}
                        resizeMode="cover"
                        accessibilityLabel="Bright, welcoming living room"
                    />
                    <Container style={[styles.heroCaption, { top: insets.top + Spacing.sm }]}>
                        <AppText style={styles.heroCaptionText}>A better home starts here</AppText>
                    </Container>
                </Container>

                <Container style={styles.content}>
                    <AppText style={styles.title}>Your personal home assistant, simplified.</AppText>
                    <AppText style={styles.description}>
                        Book cleaning, handyman, electrical, and plumbing with a single prompt.
                    </AppText>

                    <Container style={styles.actions}>
                        <AppButton
                            style={styles.primaryButton}
                            accessibilityRole="button"
                            onPress={() => navigation.navigate('Setup')}
                        >
                            <AppText style={styles.primaryButtonText}>Continue with Email</AppText>
                        </AppButton>
                        <Container style={styles.secondaryButton} accessibilityRole="button">
                            <GoogleMark />
                            <AppText style={styles.secondaryButtonText}>Continue with Google</AppText>
                        </Container>
                        <Container style={styles.secondaryButton} accessibilityRole="button">
                            <AppleMark />
                            <AppText style={styles.secondaryButtonText}>Continue with Apple</AppText>
                        </Container>
                    </Container>

                    <AppText style={styles.legal}>
                        By continuing, you agree to our <AppText style={styles.legalLink}>Terms</AppText>
                        {' '}and <AppText style={styles.legalLink}>Privacy Policy</AppText>.
                    </AppText>
                </Container>
            </ScrollView>
        </SafeAreaView>
    );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: Spacing.md,
    },
    hero: {
        width: '100%',
        overflow: 'hidden',
        borderBottomLeftRadius: Radii.card,
        borderBottomRightRadius: Radii.card,
        backgroundColor: Colors.amberLight,
        marginBottom: Spacing.xl,
        justifyContent: 'center',
    },
    heroCaption: {
        position: 'absolute',
        left: Spacing.md,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: Radii.pill,
        backgroundColor: 'rgba(32, 59, 112, 0.82)',
    },
    heroCaptionText: {
        color: Colors.white,
        fontSize: FontSize.bodySmall,
        fontWeight: '600',
    },
    content: {
        flex: 1,
        paddingHorizontal: Spacing.xl,
    },
    title: {
        ...TypeScale.heading,
        color: Colors.primaryDark,
        fontSize: FontSize.heroTitle,
        lineHeight: RS(36),
        letterSpacing: RS(-0.7),
        marginBottom: Spacing.sm,
    },
    description: {
        ...TypeScale.body,
        color: Colors.textPrimary,
        fontSize: FontSize.body,
        lineHeight: RS(24),
    },
    actions: {
        gap: Spacing.sm,
        marginTop: 'auto',
    },
    primaryButton: {
        minHeight: RS(54),
        borderRadius: Radii.pill,
        backgroundColor: Colors.primaryDark,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Spacing.lg,
        shadowColor: Colors.primaryDark,
        shadowOffset: { width: RS(0), height: RS(5) },
        shadowOpacity: 0.16,
        shadowRadius: RS(10),
        elevation: 3,
    },
    primaryButtonText: {
        color: Colors.white,
        fontSize: FontSize.body,
        fontWeight: '600',
    },
    secondaryButton: {
        minHeight: RS(50),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        borderRadius: Radii.pill,
        backgroundColor: '#ECEDEA',
        paddingHorizontal: Spacing.lg,
    },
    secondaryButtonText: {
        color: Colors.textPrimary,
        fontSize: FontSize.body,
        fontWeight: '500',
    },
    legal: {
        ...TypeScale.caption,
        color: Colors.textSecondary,
        textAlign: 'center',
        fontSize: FontSize.caption,
        lineHeight: RS(18),
        marginTop: Spacing.md,
    },
    legalLink: {
        color: Colors.primaryDark,
        fontWeight: '600',
        fontSize: FontSize.caption,

    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
});
