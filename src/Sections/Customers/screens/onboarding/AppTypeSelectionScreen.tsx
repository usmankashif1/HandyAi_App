import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ReactNode } from 'react';
import {
    BackHandler,
    Image,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import AppText from '../../../../components/AppText';
import { Colors } from '../../../../core/theme/colors';
import { Radii } from '../../../../core/theme/designTokens';
import { RS } from '../../../../core/utils/responsive';
import type { AuthStackParamList } from '../../navigation/auth/auth.types';

type Props = NativeStackScreenProps<AuthStackParamList, 'AppTypeSelection'>;

type RoleCardProps = {
    title: string;
    description: string;
    action: string;
    illustration: ReactNode;
    outlined?: boolean;
    onPress: () => void;
};

const BackIcon = () => (
    <Svg width={RS(26)} height={RS(26)} viewBox="0 0 24 24">
        <Path
            d="m15 18-6-6 6-6"
            fill="none"
            stroke={Colors.primaryDark}
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);


const RoleCard = ({
    title,
    description,
    action,
    illustration,
    outlined = false,
    onPress,
}: RoleCardProps) => (
    <View style={styles.card}>
        <View style={styles.cardCopy}>
            <AppText style={styles.cardTitle}>{title}</AppText>
            <AppText style={styles.cardDescription}>{description}</AppText>
            <Pressable
                accessibilityRole="button"
                onPress={onPress}
                style={({ pressed }) => [
                    styles.actionButton,
                    outlined ? styles.outlinedAction : styles.primaryAction,
                    pressed && styles.pressed,
                ]}
            >
                <AppText style={[styles.actionText, outlined && styles.outlinedActionText]}>
                    {action}
                </AppText>
            </Pressable>
        </View>
        <View style={styles.illustration}>{illustration}</View>
    </View>
);

const AppTypeSelectionScreen = ({ navigation }: Props) => (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <StatusBar barStyle="dark-content" backgroundColor={styles.safeArea.backgroundColor} />
        <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.header}>
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Go back"
                    onPress={() => BackHandler.exitApp()}
                    style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
                >
                    <BackIcon />
                </Pressable>
                <AppText style={styles.heading}>Welcome to Handy AI</AppText>
            </View>
            <AppText style={styles.subtitle}>How can we help you today?</AppText>

            <View style={styles.cards}>
                <RoleCard
                    title="Need a Service?"
                    description="Book trusted professionals for cleaning, repair, and more."
                    action="Find a Service"
                    illustration={<Image source={require('../../../../assets/images/serviceTacker_image.png')} style={{ width: '100%', height: '100%' }} />}
                    onPress={() => navigation.navigate('Onboarding')}
                />
                <RoleCard
                    title="Register as a Pro"
                    description="Offer your skills, get bookings, and grow your business."
                    action="Join as Provider"
                    illustration={<Image source={require('../../../../assets/images/provider_image.png')} style={{ width: '100%', height: '100%' }} />}
                    outlined
                    onPress={() => navigation.navigate('ProviderRegistration')}
                />
            </View>

            <View style={styles.footer}>
                <AppText style={styles.footerText}>
                    <AppText style={styles.footerBrand}>Handy AI</AppText>
                    {'  ·  Trusted Service Providers'}
                </AppText>
                <AppText style={styles.footerText}>Better jobs. Happier homes.</AppText>
            </View>
        </ScrollView>
    </SafeAreaView>
);

export default AppTypeSelectionScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F3F6FC',
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: RS(24),
        paddingTop: RS(12),
        paddingBottom: RS(18),
    },
    header: {
        height: RS(50),
        alignItems: 'center',
        justifyContent: 'center',
    },
    backButton: {
        position: 'absolute',
        left: 0,
        width: RS(48),
        height: RS(48),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: Radii.pill,
        backgroundColor: '#E4EAF4',
    },
    heading: {
        color: '#0C1F42',
        fontSize: RS(23),
        fontWeight: '700',
        textAlign: 'center',
    },
    subtitle: {
        color: Colors.textSecondary,
        fontSize: RS(18),
        lineHeight: RS(27),
        textAlign: 'center',
        marginTop: RS(20),
        marginBottom: RS(30),
    },
    cards: {
        gap: RS(16),
    },
    card: {
        minHeight: RS(228),
        flexDirection: 'row',
        overflow: 'hidden',
        borderRadius: RS(18),
        borderWidth: 1,
        borderColor: '#C9D5E6',
        backgroundColor: Colors.white,
        shadowColor: '#203B70',
        shadowOffset: { width: 0, height: RS(5) },
        shadowOpacity: 0.1,
        shadowRadius: RS(12),
        elevation: 3,
    },
    cardCopy: {
        zIndex: 1,
        width: '64%',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingLeft: RS(18),
        paddingVertical: RS(18),
    },
    cardTitle: {
        color: '#0C1F42',
        fontSize: RS(22),
        lineHeight: RS(29),
        fontWeight: '700',
        marginBottom: RS(8),
    },
    cardDescription: {
        color: Colors.textSecondary,
        fontSize: RS(16),
        lineHeight: RS(23),
        marginBottom: RS(18),
    },
    actionButton: {
        minHeight: RS(46),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: Radii.pill,
        paddingHorizontal: RS(17),
    },
    primaryAction: {
        backgroundColor: '#10264D',
    },
    outlinedAction: {
        borderWidth: RS(1.5),
        borderColor: '#10264D',
        backgroundColor: Colors.white,
    },
    actionText: {
        color: Colors.white,
        fontSize: RS(15),
        fontWeight: '600',
        textAlign: 'center',
    },
    outlinedActionText: {
        color: '#10264D',
    },
    illustration: {
        position: 'absolute',
        top: RS(5),
        right: RS(-20),
        bottom: RS(5),
        width: '45%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    footer: {
        alignItems: 'center',
        marginTop: 'auto',
        paddingTop: RS(22),
        gap: RS(4),
    },
    footerText: {
        color: Colors.textSecondary,
        fontSize: RS(13),
        lineHeight: RS(20),
        textAlign: 'center',
    },
    footerBrand: {
        color: Colors.textSecondary,
        fontWeight: '700',
    },
    pressed: {
        opacity: 0.78,
    },
});
