import { Image, ScrollView, StatusBar, StyleSheet, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppText from '../../../components/AppText';
import Container from '../../../components/Container';
import { Colors } from '../../../core/theme/colors';
import { FontSize } from '../../../core/theme/designTokens';
import { RS } from '../../../core/utils/responsive';
import ProfileIcon from '../components/ProfileIcon';
import ProfileSettingRow from '../components/ProfileSettingRow';



const ProfileScreen = () => {
    const { width } = useWindowDimensions();
    const compact = width < 380;
    const avatarSize = width < 350 ? 80 : compact ? 96 : 112;

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
            <ScrollView
                contentContainerStyle={[styles.content, compact && styles.compactContent]}
                showsVerticalScrollIndicator={false}
            >
                <AppText style={[styles.headerTitle, compact && styles.compactHeaderTitle]}>
                    Account Settings
                </AppText>

                <Container style={[styles.profileCard, compact && styles.compactProfileCard]}>
                    <Image
                        source={{
                            uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=320&h=320&q=85',
                        }}
                        style={{ width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }}
                        accessibilityLabel="Profile photo"
                    />
                    <Container style={styles.profileInfo}>
                        <AppText style={[styles.name, compact && styles.compactName]} numberOfLines={1}>
                            Usman Kashif
                        </AppText>
                        <AppText style={[styles.email, compact && styles.compactEmail]} numberOfLines={1}>
                            usman.kashif@gmail.com
                        </AppText>
                        <Container style={styles.editProfile}>
                            <ProfileIcon name="edit" size={RS(22)} />
                            <AppText style={[styles.editProfileText, compact && styles.compactEditProfileText]}>
                                Edit Profile
                            </AppText>
                        </Container>
                    </Container>
                </Container>

                <Container style={styles.settingsCard}>
                    <ProfileSettingRow icon="notes" title="Household Notes" compact={compact} />
                    <Container style={styles.divider} />
                    <ProfileSettingRow
                        icon="payment"
                        title="Saved Payment Methods"
                        detail="Visa •••• 4242"
                        compact={compact}
                    />
                    <Container style={styles.divider} />
                    <ProfileSettingRow
                        icon="support"
                        title="Support"
                        detail={'Email Support Team'}
                        compact={compact}
                    />
                </Container>

                <Container style={[styles.logoutCard, compact && styles.compactLogoutCard]}>
                    <ProfileIcon name="logout" size={RS(30)} />
                    <AppText style={[styles.logoutText, compact && styles.compactLogoutText]}>Log Out</AppText>
                </Container>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        flexGrow: 1,
        gap: RS(24),
        paddingHorizontal: RS(20),
        paddingTop: RS(16),
        paddingBottom: RS(24),
    },
    compactContent: {
        gap: RS(18),
        paddingHorizontal: RS(20),
        paddingTop: RS(12),
    },
    headerTitle: {
        marginBottom: RS(10),
        color: '#171923',
        fontSize: FontSize.heading,
        fontWeight: '700',
        letterSpacing: RS(-0.5),
    },
    compactHeaderTitle: {
        fontSize: FontSize.heading,

    },
    profileCard: {
        minHeight: RS(176),
        flexDirection: 'row',
        alignItems: 'center',
        gap: RS(16),
        padding: RS(18),
        borderRadius: RS(22),
        backgroundColor: Colors.surface,
        shadowColor: '#30343A',
        shadowOpacity: 0.08,
        shadowRadius: RS(16),
        shadowOffset: { width: RS(0), height: RS(7) },
        elevation: 3,
    },
    compactProfileCard: {
        minHeight: RS(146),
        gap: RS(12),
        padding: RS(14),
    },
    profileInfo: {
        flex: 1,
        minWidth: RS(0),
        gap: RS(7),
    },
    name: {
        color: '#17191C',
        fontSize: FontSize.subheading,
        fontWeight: '700',
    },
    compactName: {
        fontSize: FontSize.bodyLarge,
    },
    email: {
        color: '#17191C',
        fontSize: FontSize.body,
    },
    compactEmail: {
        fontSize: FontSize.caption,
    },
    editProfile: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: RS(8),
        marginTop: RS(5),
    },
    editProfileText: {
        color: '#17191C',
        fontSize: FontSize.bodyLarge,
        fontWeight: '600',
    },
    compactEditProfileText: {
        fontSize: FontSize.body,
    },
    settingsCard: {
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#CFD2D6',
        borderRadius: RS(20),
        backgroundColor: Colors.surface,
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#D5D7DA',
    },
    logoutCard: {
        minHeight: RS(82),
        flexDirection: 'row',
        alignItems: 'center',
        gap: RS(18),
        paddingHorizontal: RS(22),
        borderWidth: 1,
        borderColor: '#CFD2D6',
        borderRadius: RS(20),
        backgroundColor: Colors.surface,
    },
    compactLogoutCard: {
        minHeight: RS(70),
        gap: RS(14),
        paddingHorizontal: RS(16),
    },
    logoutText: {
        color: '#17191C',
        fontSize: FontSize.bodyLarge,
        fontWeight: '600',
    },
    compactLogoutText: {
        fontSize: FontSize.body,
    },
});
