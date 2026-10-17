import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ReactNode } from 'react';
import {
    Image,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    View,
    useWindowDimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import AppText from '../../../../components/AppText';
import { Colors } from '../../../../core/theme/colors';
import { FontSize, Radii, Spacing, TypeScale } from '../../../../core/theme/designTokens';
import { RS } from '../../../../core/utils/responsive';
import type { ProviderStackParamList } from '../../navigation/provider.types';

type Props = NativeStackScreenProps<ProviderStackParamList, 'Onboarding'>;

type ActionButtonProps = {
    label: string;
    onPress: () => void;
    outlined?: boolean;
};

const GoogleMark = () => (
    <Svg width={RS(22)} height={RS(22)} viewBox="0 0 48 48" accessibilityLabel="Google">
        <Path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.7c3.9-3.6 6-8.9 6-15Z" />
        <Path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.8l-6.7-5.1c-1.8 1.2-4 1.9-6.8 1.9-5.2 0-9.6-3.5-11.2-8.2H5.9v5.3A20 20 0 0 0 24 44Z" />
        <Path fill="#FBBC05" d="M12.8 27.8a12 12 0 0 1 0-7.6v-5.3H5.9a20 20 0 0 0 0 18.2l6.9-5.3Z" />
        <Path fill="#EA4335" d="M24 12c3 0 5.7 1 7.8 3.1l5.9-5.9C34.1 5.8 29.5 4 24 4A20 20 0 0 0 5.9 14.9l6.9 5.3C14.4 15.5 18.8 12 24 12Z" />
    </Svg>
);

const AppleMark = () => (
    <Svg width={RS(20)} height={RS(22)} viewBox="0 0 24 28" accessibilityLabel="Apple">
        <Path
            fill={Colors.textPrimary}
            d="M19.7 14.8c0-3.1 2.5-4.6 2.6-4.7a5.7 5.7 0 0 0-4.5-2.4c-1.9-.2-3.7 1.1-4.7 1.1s-2.5-1.1-4.1-1.1a6.1 6.1 0 0 0-5.1 3.1c-2.2 3.8-.6 9.4 1.5 12.5 1 1.5 2.2 3.2 3.8 3.1 1.5-.1 2.1-1 4-1s2.5 1 4.1 1 2.7-1.5 3.7-3.1a13 13 0 0 0 1.7-3.6 5.3 5.3 0 0 1-3-4.9Zm-3.1-9.1A5.6 5.6 0 0 0 17.9 2a5.7 5.7 0 0 0-3.7 1.9 5.2 5.2 0 0 0-1.4 3.6 4.8 4.8 0 0 0 3.8-1.8Z"
        />
    </Svg>
);

 

const ActionButton = ({ label, onPress, outlined = false }: ActionButtonProps) => (
    <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [
            styles.actionButton,
            outlined ? styles.outlinedButton : styles.primaryButton,
            pressed && styles.pressed,
        ]}
    >
        <AppText style={[styles.actionLabel, outlined && styles.outlinedLabel]}>{label}</AppText>
    </Pressable>
);

const SocialButton = ({ children, label }: { children: ReactNode; label: string }) => (
    <View style={styles.socialButton} accessibilityLabel={label}>
        {children}
        <AppText style={styles.socialLabel}>{label}</AppText>
    </View>
);

const ProviderWelcomeScreen = ({ navigation }: Props) => {
    const { height, width } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const heroHeight = Math.min(height * 0.34, width * 0.95);

    return (
        <SafeAreaView style={styles.safeArea} edges={['bottom']}>
            <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={[styles.hero, { height: heroHeight }]}>
                    <Image
                        source={require('../../../../assets/images/handyMan.jpg')}
                        style={styles.heroImage}
                        resizeMode="cover"
                        accessibilityLabel="Handyman ready to help in a customer's home"
                    />
                    <View style={[styles.heroCaption, { top: insets.top   }]}>
                        <AppText style={styles.heroCaptionText}>Earn money on your schedule</AppText>
                    </View>
                </View>

                <View style={styles.content}>
                   
                    <AppText style={styles.title}>
                        Earn on your terms.{'\n'}Provide services, simplified.
                    </AppText>
                    <AppText style={styles.description}>
                        Find cleaning, handyman, electrical, and plumbing jobs in your area.
                    </AppText>

                    <View style={styles.actions}>
                        <View style={styles.loginSection}>
                            <AppText style={styles.accountPrompt}>Already a Provider?</AppText>
                            <ActionButton
                                label="Log in"
                                outlined
                                onPress={() => navigation.navigate('Login', { role: 'PROVIDER' })}
                            />
                        </View>

                        <AppText style={styles.createAccountPrompt}>
                            Don&apos;t have an account? Join as a pro using:
                        </AppText>

                        <ActionButton
                            label="Continue with Email"
                            onPress={() => navigation.navigate('SignUp', { role: 'PROVIDER' })}
                        />
                        <SocialButton label="Continue with Google">
                            <GoogleMark />
                        </SocialButton>
                        <SocialButton label="Continue with Apple">
                            <AppleMark />
                        </SocialButton>
                    </View>

                    <AppText style={styles.legal}>
                        By continuing, you agree to our <AppText style={styles.legalLink}>Terms</AppText>
                        {' '}and <AppText style={styles.legalLink}>Privacy Policy</AppText>.
                    </AppText>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ProviderWelcomeScreen;

const NAVY = '#0B1B3B';
const BUTTON_BLUE = '#283F78';

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
        paddingBottom: Spacing.xs,
    },
    hero: {
        width: '100%',
        overflow: 'hidden',
        borderBottomLeftRadius: Radii.card,
        borderBottomRightRadius: Radii.card,
        backgroundColor: Colors.amberLight,
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    heroCaption: {
        position: 'absolute',
        left: Spacing.md,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: Radii.pill,
        backgroundColor: 'rgba(32, 59, 112, 0.9)',
    },
    heroCaptionText: {
        color: Colors.white,
        fontSize: FontSize.bodySmall,
        fontWeight: '600',
    },
    content: {
        flex: 1,
        paddingHorizontal: Spacing.lg,
        paddingTop: RS(48),
    },
    settingsBadge: {
        position: 'absolute',
        top: RS(23),
        right: Spacing.md,
        width: RS(48),
        height: RS(48),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: RS(4),
        borderColor: '#E4E2DD',
        borderRadius: Radii.pill,
        backgroundColor: '#AAA8A4',
    },
    title: {
        ...TypeScale.heading,
        color: NAVY,
        fontSize: RS(27),
        lineHeight: RS(34),
        letterSpacing: RS(-0.6),
        marginBottom: Spacing.sm,
    },
    description: {
        ...TypeScale.body,
        color: Colors.textPrimary,
        fontSize: FontSize.bodyLarge,
        lineHeight: RS(24),
    },
    actions: {
        marginTop: 'auto',
        paddingTop: RS(30),
        gap: Spacing.sm,
    },
    loginSection: {
        alignItems: 'center',
        gap: Spacing.xs,
    },
    accountPrompt: {
        color: Colors.textPrimary,
        fontSize: FontSize.body,
        fontWeight: '700',
        textAlign: 'center',
    },
    actionButton: {
        minHeight: RS(52),
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: Radii.pill,
        paddingHorizontal: Spacing.lg,
    },
    primaryButton: {
        backgroundColor: BUTTON_BLUE,
        shadowColor: NAVY,
        shadowOffset: { width: 0, height: RS(4) },
        shadowOpacity: 0.18,
        shadowRadius: RS(8),
        elevation: 3,
    },
    outlinedButton: {
        borderWidth: RS(1),
        borderColor: NAVY,
        backgroundColor: Colors.background,
    },
    actionLabel: {
        color: Colors.white,
        fontSize: FontSize.bodyLarge,
        fontWeight: '600',
        textAlign: 'center',
    },
    outlinedLabel: {
        color: NAVY,
        fontSize: FontSize.body,
        fontWeight: '700',
    },
    createAccountPrompt: {
        color: Colors.textPrimary,
        fontSize: FontSize.body,
        lineHeight: RS(24),
        textAlign: 'center',
        marginTop: Spacing.xs,
    },
    socialButton: {
        minHeight: RS(50),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        borderRadius: Radii.pill,
        backgroundColor: '#ECEDEA',
        paddingHorizontal: Spacing.lg,
    },
    socialLabel: {
        color: Colors.textPrimary,
        fontSize: FontSize.bodyLarge,
        fontWeight: '500',
        textAlign: 'center',
    },
    legal: {
        ...TypeScale.caption,
        color: Colors.textPrimary,
        fontSize: FontSize.bodySmall,
        lineHeight: RS(20),
        textAlign: 'center',
        marginTop: Spacing.sm,
    },
    legalLink: {
        color: BUTTON_BLUE,
        fontSize: FontSize.bodySmall,
        fontWeight: '600',
    },
    pressed: {
        opacity: 0.78,
    },
});
