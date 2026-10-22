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
import AppText from '../../../../../components/AppText';
import { Colors } from '../../../../../core/theme/colors';
import { RS } from '../../../../../core/utils/responsive';
import type { ProviderTabParamList } from '../../../navigation/provider.types';
import EarningsHeader from '../components/EarningsHeader';
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
            <EarningsHeader onBackPress={() => navigation.navigate('Jobs')} />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <AppText style={styles.screenTitle}>Earnings</AppText>
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
    scrollContent: {
        gap: RS(12),
        paddingHorizontal: RS(20),
        paddingBottom: RS(24),
    },
    screenTitle: {
        color: Colors.primaryDark,
        fontSize: RS(30),
        fontWeight: '700',
        marginTop: RS(12),
        marginBottom: RS(2),
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
        color: Colors.primaryDark,
        fontSize: RS(20),
        fontWeight: '600',
    },
    viewAll: {
        color: Colors.primaryDark,
        fontSize: RS(15),
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
