import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import type { ProviderTabParamList } from './provider.types';
import ProviderJobsScreen from '../screens/jobs/screens/ProviderJobsScreen';
import ProviderProfileNavigator from '../screens/profile/navigation/ProviderProfileNavigator';
import ProviderPlaceholderScreen from '../screens/dashboard/components/ProviderPlaceholderScreen';

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

const ProviderTabsNavigator = () => (
    <Tab.Navigator
        initialRouteName="Jobs"
        screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: '#10264D',
            tabBarInactiveTintColor: '#626D7D',
            tabBarLabelStyle: {
                fontSize: 12,
                fontWeight: '500',
                marginTop: 2,
            },
            tabBarIcon: ({ color }) => <TabIcon name={route.name} color={color} />,
            tabBarStyle: {
                height: 64,
                paddingTop: 7,
                paddingBottom: 5,
                borderTopColor: '#D7DFE9',
                backgroundColor: '#FFFFFF',
            },
        })}
    >
        <Tab.Screen name="Jobs" component={ProviderJobsScreen} />
        <Tab.Screen name="Schedule" component={ProviderPlaceholderScreen} />
        <Tab.Screen name="Earnings" component={ProviderPlaceholderScreen} />
        <Tab.Screen name="Profile" component={ProviderProfileNavigator} />
    </Tab.Navigator>
);

export default ProviderTabsNavigator;
