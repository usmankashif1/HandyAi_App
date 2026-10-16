import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChangePasswordScreen from '../../Customers/screens/auth/screens/ChangePasswordScreen';
import ForgotPasswordScreen from '../../Customers/screens/auth/screens/ForgotPasswordScreen';
import LoginScreen from '../../Customers/screens/auth/screens/LoginScreen';
import OtpVerifyScreen from '../../Customers/screens/auth/screens/OtpVerifyScreen';
import OnboardingScreen from '../../Customers/screens/onboarding/OnboardingScreen';
import ProviderOnboardingScreen from '../auth/onboarding/ProviderOnboardingScreen';
import ProviderTabsNavigator from './ProviderTabsNavigator';
import type { ProviderStackParamList } from './provider.types';

const Stack = createNativeStackNavigator<ProviderStackParamList>();

const ProviderNavigator = () => (
    <Stack.Navigator initialRouteName="Onboarding" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="SignUp" component={ProviderOnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="OtpVerify" component={OtpVerifyScreen} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
        <Stack.Screen name="ProviderDashboard" component={ProviderTabsNavigator} />
    </Stack.Navigator>
);

export default ProviderNavigator;
