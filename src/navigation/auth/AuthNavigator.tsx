import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../../screens/auth/screens/LoginScreen';
import OtpVerifyScreen from '../../screens/auth/screens/OtpVerifyScreen';
import ForgotPasswordScreen from '../../screens/auth/screens/ForgotPasswordScreen';
import ChangePasswordScreen from '../../screens/auth/screens/ChangePasswordScreen';
import SignUpScreen from '../../screens/auth/screens/SignUpScreen';
import OnboardingScreen from '../../screens/onboarding/OnboardingScreen';
import type { AuthStackParamList } from './auth.types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => (
    <Stack.Navigator initialRouteName="Onboarding" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="OtpVerify" component={OtpVerifyScreen} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
    </Stack.Navigator>
);

export default AuthNavigator;
