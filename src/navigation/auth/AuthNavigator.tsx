import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../../screens/auth/screens/LoginScreen';
import SignUpScreen from '../../screens/auth/screens/SignUpScreen';
import OnboardingScreen from '../../screens/onboarding/OnboardingScreen';
import type { AuthStackParamList } from './auth.types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => (
    <Stack.Navigator initialRouteName="Onboarding" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
);

export default AuthNavigator;
