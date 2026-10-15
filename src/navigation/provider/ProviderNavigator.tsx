import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProviderRegistrationStartScreen from '../../screens/provider/ProviderRegistrationStartScreen';
import type { ProviderStackParamList } from './provider.types';

const Stack = createNativeStackNavigator<ProviderStackParamList>();

const ProviderNavigator = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="RegistrationStart" component={ProviderRegistrationStartScreen} />
    </Stack.Navigator>
);

export default ProviderNavigator;
