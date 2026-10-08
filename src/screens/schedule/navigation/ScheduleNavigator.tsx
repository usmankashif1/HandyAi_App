import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProviderChatScreen from '../../chat/screens/ProviderChatScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import type { ScheduleStackParamList } from '../schedule.types';

const Stack = createNativeStackNavigator<ScheduleStackParamList>();

const ScheduleNavigator = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ScheduleHome" component={ScheduleScreen} />
        <Stack.Screen name="ProviderChat" component={ProviderChatScreen} />
    </Stack.Navigator>
);

export default ScheduleNavigator;
