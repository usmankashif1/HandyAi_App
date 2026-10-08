import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../../screens/splash/SplashScreen';
import OnboardingScreen from '../../screens/onboarding/OnboardingScreen';
import SetupScreen from '../../screens/setup/SetupScreen';
import StackNavigator from '../main/Stack/StackNavigator';
import type { RootStackParamList } from './root.types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => (
    <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Setup" component={SetupScreen} />
            <Stack.Screen name="Main" component={StackNavigator} />
        </Stack.Navigator>
    </NavigationContainer>
);

export default RootNavigator;