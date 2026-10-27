import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProviderJobDetailsScreen from '../screens/ProviderJobDetailsScreen';
import ProviderJobsScreen from '../screens/ProviderJobsScreen';
import ProviderClientChatScreen from '../../chat/screens/ProviderClientChatScreen';
import ProviderNotificationsScreen from '../../notifications/screens/ProviderNotificationsScreen';
import type { ProviderJobsStackParamList } from '../jobs.types';

const Stack = createNativeStackNavigator<ProviderJobsStackParamList>();

const ProviderJobsNavigator = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="JobList" component={ProviderJobsScreen} />
        <Stack.Screen
            name="JobDetails"
            component={ProviderJobDetailsScreen}
            options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
            name="ClientChat"
            component={ProviderClientChatScreen}
            options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
            name="Notifications"
            component={ProviderNotificationsScreen}
            options={{ animation: 'slide_from_right' }}
        />
    </Stack.Navigator>
);

export default ProviderJobsNavigator;
