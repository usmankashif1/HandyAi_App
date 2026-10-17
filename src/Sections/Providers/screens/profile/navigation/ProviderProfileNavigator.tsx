import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ProviderProfileStackParamList } from '../profile.types';
import ProviderProfileScreen from '../screens/ProviderProfileScreen';
import ProviderSettingsScreen from '../../settings/screens/ProviderSettingsScreen';

const Stack = createNativeStackNavigator<ProviderProfileStackParamList>();

const ProviderProfileNavigator = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ProfileHome" component={ProviderProfileScreen} />
        <Stack.Screen name="ProviderSettings" component={ProviderSettingsScreen} />
    </Stack.Navigator>
);

export default ProviderProfileNavigator;
