import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RF, RS } from '../../../core/utils/responsive';
import type { ProviderTabParamList } from './provider.types';
import ProviderJobsNavigator from '../screens/jobs/navigation/ProviderJobsNavigator';
import ProviderEarningsScreen from '../screens/earnings/screens/ProviderEarningsScreen';
import ProviderScheduleScreen from '../screens/schedule/screens/ProviderScheduleScreen';
import ProviderProfileNavigator from '../screens/profile/navigation/ProviderProfileNavigator';

const Tab = createBottomTabNavigator<ProviderTabParamList>();

const TabIcon = ({ name, color }: { name: keyof ProviderTabParamList; color: string }) => {
    const common = {
        fill: 'none',
        stroke: color,
        strokeWidth: 1.8,
        strokeLinecap: 'round' as const,
        strokeLinejoin: 'round' as const,
    };

    return (
        <Svg width={25} height={25} viewBox="0 0 24 24">
            {name === 'Jobs' && (
                <>
                    <Rect x="3" y="7" width="18" height="14" rx="2" {...common} />
                    <Path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m-13 5h18m-11-1v3h4v-3" {...common} />
                </>
            )}
            {name === 'Schedule' && (
                <>
                    <Rect x="3" y="5" width="18" height="16" rx="2" {...common} />
                    <Path d="M16 3v4M8 3v4M3 10h18" {...common} />
                </>
            )}
            {name === 'Earnings' && (
                <>
                    <Circle cx="12" cy="12" r="9" {...common} />
                    <Path d="M15 9.5c-.6-.8-1.5-1.2-2.7-1.2-1.3 0-2.3.7-2.3 1.8 0 2.8 5.5 1.1 5.5 4.1 0 1.2-1.1 2-2.7 2-1.2 0-2.3-.5-3-1.4M12 6.5v11" {...common} />
                </>
            )}
            {name === 'Profile' && (
                <>
                    <Circle cx="12" cy="7.5" r="3.5" {...common} />
                    <Path d="M4.5 21v-2a7.5 7.5 0 0 1 15 0v2" {...common} />
                </>
            )}
        </Svg>
    );
};

const ProviderTabsNavigator = () => {
    const insets = useSafeAreaInsets();
    const tabBarBottomInset = Math.max(insets.bottom, RS(8));

    return (
        <Tab.Navigator
            initialRouteName="Jobs"
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: '#10264D',
                tabBarInactiveTintColor: '#626D7D',
                tabBarLabelStyle: {
                    fontSize: RF(12),
                    fontWeight: '500',
                    marginTop: 2,
                },
                safeAreaInsets: { bottom: tabBarBottomInset },
                tabBarIcon: ({ color }) => <TabIcon name={route.name} color={color} />,
                tabBarStyle: ['JobDetails', 'ClientChat', 'Notifications'].includes(getFocusedRouteNameFromRoute(route) ?? '')
                    ? { display: 'none' }
                    : {
                        height: RS(64) + tabBarBottomInset,
                        paddingTop: RS(7),
                        paddingBottom: tabBarBottomInset,
                        borderTopColor: '#D7DFE9',
                        backgroundColor: '#FFFFFF',
                    },
            })}
        >
            <Tab.Screen name="Jobs" component={ProviderJobsNavigator} />
            <Tab.Screen name="Schedule" component={ProviderScheduleScreen} />
            <Tab.Screen name="Earnings" component={ProviderEarningsScreen} />
            <Tab.Screen name="Profile" component={ProviderProfileNavigator} />
        </Tab.Navigator>
    );
};

export default ProviderTabsNavigator;
