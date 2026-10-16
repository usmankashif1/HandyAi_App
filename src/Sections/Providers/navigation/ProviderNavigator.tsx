import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChangePasswordScreen from '../../Customers/screens/auth/screens/ChangePasswordScreen';
import ForgotPasswordScreen from '../../Customers/screens/auth/screens/ForgotPasswordScreen';
import LoginScreen from '../../Customers/screens/auth/screens/LoginScreen';
import OtpVerifyScreen from '../../Customers/screens/auth/screens/OtpVerifyScreen';
import SignUpScreen from '../../Customers/screens/auth/screens/SignUpScreen';
import ProviderOnboardingScreen from '../screens/onboarding/ProviderOnboardingScreen';
import ProviderWelcomeScreen from '../screens/onboarding/ProviderWelcomeScreen';
import ProviderTabsNavigator from './ProviderTabsNavigator';
import type { ProviderStackParamList } from './provider.types';

const Stack = createNativeStackNavigator<ProviderStackParamList>();

type ProviderNavigatorProps = {
    startAtProviderOnboarding?: boolean;
};

const ProviderNavigator = ({ startAtProviderOnboarding = false }: ProviderNavigatorProps) => (
    <Stack.Navigator
        initialRouteName={startAtProviderOnboarding ? 'ProviderOnboarding' : 'Onboarding'}
        screenOptions={{ headerShown: false }}
    >
        <Stack.Screen name="Onboarding" component={ProviderWelcomeScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="OtpVerify" component={OtpVerifyScreen} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
        <Stack.Screen name="ProviderOnboarding" component={ProviderOnboardingScreen} />
        <Stack.Screen name="ProviderDashboard" component={ProviderTabsNavigator} />
    </Stack.Navigator>
);

export default ProviderNavigator;
