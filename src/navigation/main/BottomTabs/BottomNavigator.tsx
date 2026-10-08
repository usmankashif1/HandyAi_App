import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Svg, { Circle, Path } from 'react-native-svg';
import { Colors } from '../../../core/theme/colors';
import ChatNavigator from '../../../screens/chat/navigation/ChatNavigator';
import HistoryNavigator from '../../../screens/history/navigation/HistoryNavigator';
import ProfileNavigator from '../../../screens/profile/navigation/ProfileNavigator';
import ScheduleNavigator from '../../../screens/schedule/navigation/ScheduleNavigator';

type BottomTabParamList = {
    Chat: undefined;
    Schedule: undefined;
    History: undefined;
    Profile: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

type IconName = keyof BottomTabParamList;

const TabIcon = ({ name, color, size }: { name: IconName; color: string; size: number }) => {
    const common = {
        fill: 'none',
        stroke: color,
        strokeWidth: 1.8,
        strokeLinecap: 'round' as const,
        strokeLinejoin: 'round' as const,
    };

    return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
            {name === 'Chat' ? (
                <Path {...common} d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H6l-3 2v-5.5A7.5 7.5 0 1 1 20 11.5Z" />
            ) : null}
            {name === 'Schedule' ? (
                <>
                    <Path {...common} d="M5 4.5h14a2 2 0 0 1 2 2v13H3v-13a2 2 0 0 1 2-2Z" />
                    <Path {...common} d="M7 2.5v4M17 2.5v4M3 9h18" />
                    <Circle cx="8" cy="13" r="1" fill={color} />
                    <Circle cx="12" cy="13" r="1" fill={color} />
                    <Circle cx="16" cy="13" r="1" fill={color} />
                </>
            ) : null}
            {name === 'History' ? (
                <>
                    <Path {...common} d="M3.5 11a8.5 8.5 0 1 1 2.1 6.1M3 5.5V11h5.5" />
                    <Path {...common} d="M12 7v5l3.2 2" />
                </>
            ) : null}
            {name === 'Profile' ? (
                <>
                    <Circle {...common} cx="12" cy="8" r="3.5" />
                    <Path {...common} d="M4.5 21a7.5 7.5 0 0 1 15 0" />
                </>
            ) : null}
        </Svg>
    );
};

const BottomNavigator = () => (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: Colors.primaryDark,
            tabBarInactiveTintColor: Colors.textSecondary,
            tabBarLabelStyle: {
                fontSize: 11,
                fontWeight: '500',
            },
            tabBarStyle: {
                backgroundColor: Colors.surface,
                borderTopColor: Colors.border,
            },
            tabBarIcon: ({ color, size }) => (
                <TabIcon name={route.name} color={color} size={size} />
            ),
        })}
    >
        <Tab.Screen name="Chat" component={ChatNavigator} />
        <Tab.Screen name="Schedule" component={ScheduleNavigator} />
        <Tab.Screen name="History" component={HistoryNavigator} />
        <Tab.Screen name="Profile" component={ProfileNavigator} />
    </Tab.Navigator>
);

export default BottomNavigator;