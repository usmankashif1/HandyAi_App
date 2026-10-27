import { useState } from 'react';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import {
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import AppText from '../../../../../components/AppText';
import { Colors } from '../../../../../core/theme/colors';
import { FontSize, TypeScale } from '../../../../../core/theme/designTokens';
import { RF, RS } from '../../../../../core/utils/responsive';
import type { ProviderTabParamList } from '../../../navigation/provider.types';
import EarningsMetricCard from '../components/EarningsMetricCard';
import PayoutRow from '../components/PayoutRow';
import type { ProviderPayout } from '../earnings.types';

type Props = BottomTabScreenProps<ProviderTabParamList, 'Earnings'>;

const PAYOUTS: ProviderPayout[] = [
    { id: 'payout-1', date: 'Apr 24, 2025', amount: '$180.00', provider: 'Stripe', status: 'Paid' },
    { id: 'payout-2', date: 'Apr 20, 2025', amount: '$120.00', provider: 'Stripe', status: 'Paid' },
    { id: 'payout-3', date: 'Apr 15, 2025', amount: '$95.00', provider: 'Stripe', status: 'Paid' },
    { id: 'payout-4', date: 'Apr 10, 2025', amount: '$160.00', provider: 'Stripe', status: 'Paid' },
    { id: 'payout-5', date: 'Apr 5, 2025', amount: '$140.00', provider: 'Stripe', status: 'Paid' },
    { id: 'payout-6', date: 'Mar 30, 2025', amount: '$110.00', provider: 'Stripe', status: 'Paid' },
];

const ProviderEarningsScreen = ({ navigation }: Props) => {
    const [showAllPayouts, setShowAllPayouts] = useState(false);
    const visiblePayouts = showAllPayouts ? PAYOUTS : PAYOUTS.slice(0, 4);

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
            <View style={styles.header}>
                <View style={styles.titleRow}>
                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Back to jobs"
                        onPress={() => navigation.navigate('Jobs')}
                        hitSlop={8}
                        style={styles.backButton}
                    >
                        <Svg width={RS(30)} height={RS(30)} viewBox="0 0 24 24">
                            <Path
                                d="m15 18-6-6 6-6"
                                fill="none"
                                stroke={Colors.primaryDark}
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </Svg>
                    </Pressable>
                    <AppText style={styles.title}>Earnings</AppText>
                </View>
            </View>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.metricsRow}>
                    <EarningsMetricCard
                        title="Total Earned"
                        value="$1,240"
                        caption="↑ 12% this month"
                        positive
                    />
                    <EarningsMetricCard
                        title="Pending Release"
                        value="$320"
                        caption="(via Stripe)"
                    />
                </View>
                <EarningsMetricCard
                    title="Completed Jobs"
                    value="18"
                    caption="↑ 3 this week"
                    fullWidth
                    positive
                />

                <View style={styles.payoutsHeading}>
                    <AppText style={styles.sectionTitle}>Recent Payouts</AppText>
                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={showAllPayouts ? 'Show fewer payouts' : 'View all payouts'}
                        onPress={() => setShowAllPayouts((showing) => !showing)}
                        hitSlop={8}
                    >
                        <AppText style={styles.viewAll}>
                            {showAllPayouts ? 'Show Less' : 'View All'}
                        </AppText>
                    </Pressable>
                </View>
                <View style={styles.payoutsCard}>
                    {visiblePayouts.map((payout, index) => (
                        <PayoutRow
                            key={payout.id}
                            payout={payout}
                            isLast={index === visiblePayouts.length - 1}
                        />
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ProviderEarningsScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        paddingHorizontal: RS(18),
        paddingTop: RS(8),
        paddingBottom: RS(12),
        gap: RS(20),
    },
    titleRow: {
        minHeight: RS(40),
        flexDirection: 'row',
        alignItems: 'center',
        gap: RS(12),
    },
    backButton: {
        width: RS(30),
        height: RS(40),
        justifyContent: 'center',
    },
    title: {
        ...TypeScale.heading,
        color: Colors.textPrimary,
        fontSize: FontSize.heroTitle,
    },
    scrollContent: {
        gap: RS(12),
        paddingHorizontal: RS(20),
        paddingBottom: RS(24),
    },
    metricsRow: {
        flexDirection: 'row',
        gap: RS(10),
    },
    payoutsHeading: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: RS(12),
        marginBottom: RS(2),
    },
    sectionTitle: {
        color: Colors.black,
        fontSize: RF(20),
        fontWeight: '600',
    },
    viewAll: {
        color: Colors.black,
        fontSize: RF(16),
        fontWeight: '500',
        textDecorationLine: 'underline',
    },
    payoutsCard: {
        borderWidth: 1,
        borderColor: Colors.primaryLight,
        borderRadius: RS(16),
        backgroundColor: Colors.white,
        paddingHorizontal: RS(10),
    },
});
