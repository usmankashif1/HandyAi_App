import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Rect } from 'react-native-svg';
import AppText from '../../../../../components/AppText';
import { Colors } from '../../../../../core/theme/colors';
import { FontSize, Radii, Spacing, TypeScale } from '../../../../../core/theme/designTokens';
import { RS } from '../../../../../core/utils/responsive';
import JobClientCard from '../components/JobClientCard';
import JobDetailActions from '../components/JobDetailActions';
import JobDetailsHeader from '../components/JobDetailsHeader';
import JobEstimateCard from '../components/JobEstimateCard';
import JobLocationCard from '../components/JobLocationCard';
import type { ProviderJobsStackParamList } from '../jobs.types';

type Props = NativeStackScreenProps<ProviderJobsStackParamList, 'JobDetails'>;

const ProviderJobDetailsScreen = ({ navigation, route }: Props) => {
    const { job } = route.params;

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
            <JobDetailsHeader onBackPress={() => navigation.goBack()} />
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.jobBanner}>
                    <AppText style={styles.jobTitle}>{job.category} - {job.title}</AppText>
                    <View style={styles.categoryBadge}>
                        <AppText style={styles.categoryText}>{job.category}</AppText>
                    </View>
                    <AppText style={styles.jobNumber}>#{job.jobNumber}</AppText>
                </View>

                <View style={styles.dateRow}>
                    <Svg width={RS(24)} height={RS(24)} viewBox="0 0 24 24">
                        <Rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke={Colors.primaryDark} strokeWidth="1.8" />
                        <Path d="M16 3v4M8 3v4M3 10h18M14 16a4 4 0 1 0 8 0 4 4 0 0 0-8 0Zm4-2v2l1.5 1" fill="none" stroke={Colors.primaryDark} strokeWidth="1.8" strokeLinecap="round" />
                    </Svg>
                    <AppText style={styles.dateText}>{job.date} · {job.time}</AppText>
                </View>

                <JobLocationCard job={job} />
                <JobClientCard
                    job={job}
                    onMessage={() => navigation.navigate('ClientChat', { clientName: job.clientName })}
                />
                <JobEstimateCard job={job} />

                <View style={styles.description}>
                    <AppText style={styles.sectionTitle}>Job Details</AppText>
                    {job.description.map((item) => (
                        <AppText key={item} style={styles.descriptionItem}>- {item}</AppText>
                    ))}
                </View>
            </ScrollView>
            <JobDetailActions />
        </SafeAreaView>
    );
};

export default ProviderJobDetailsScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        gap: Spacing.sm,
        padding: Spacing.md,
        paddingBottom: Spacing.lg,
    },
    jobBanner: {
        gap: Spacing.xs,
        borderRadius: Radii.md,
        backgroundColor: Colors.primary,
        padding: Spacing.md,
    },
    jobTitle: {
        ...TypeScale.heading,
        color: Colors.white,
        fontSize: FontSize.title,
        lineHeight: RS(32),
    },
    categoryBadge: {
        alignSelf: 'flex-start',
        borderRadius: Radii.pill,
        backgroundColor: Colors.primaryLight,
        paddingHorizontal: Spacing.sm,
        paddingVertical: RS(2),
    },
    categoryText: {
        ...TypeScale.body,
        color: Colors.primaryDark,
        fontSize: FontSize.bodySmall,
    },
    jobNumber: {
        ...TypeScale.body,
        color: Colors.white,
        fontSize: FontSize.body,
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
        paddingHorizontal: RS(2),
    },
    dateText: {
        ...TypeScale.body,
        flexShrink: 1,
        color: Colors.primaryDark,
        fontSize: FontSize.body,
    },
    description: {
        gap: Spacing.xxs,
    },
    sectionTitle: {
        ...TypeScale.heading,
        color: Colors.primaryDark,
        fontSize: FontSize.subtitle,
        marginBottom: RS(2),
    },
    descriptionItem: {
        ...TypeScale.body,
        color: Colors.textPrimary,
        fontSize: FontSize.body,
        lineHeight: RS(24),
    },
});
