import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ProviderProfileStackParamList } from '../profile.types';
import ProviderProfileScreen from '../screens/ProviderProfileScreen';
import ProviderSettingsScreen from '../../settings/screens/ProviderSettingsScreen';
import ProviderSettingDetailsScreen from '../../settings/screens/ProviderSettingDetailsScreen';

const Stack = createNativeStackNavigator<ProviderProfileStackParamList>();

const ProviderProfileNavigator = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ProfileHome" component={ProviderProfileScreen} />
        <Stack.Screen name="ProviderSettings" component={ProviderSettingsScreen} />
        <Stack.Screen name="ProviderPersonalInformation" component={ProviderSettingDetailsScreen} />
        <Stack.Screen name="ProviderServiceAreas" component={ProviderSettingDetailsScreen} />
        <Stack.Screen name="ProviderAvailability" component={ProviderSettingDetailsScreen} />
        <Stack.Screen name="ProviderDocuments" component={ProviderSettingDetailsScreen} />
        <Stack.Screen name="ProviderPaymentDetails" component={ProviderSettingDetailsScreen} />
    </Stack.Navigator>
);

export default ProviderProfileNavigator;
