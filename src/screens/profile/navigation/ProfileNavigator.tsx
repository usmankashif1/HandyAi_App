import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/ProfileScreen';
import UpdateProfileScreen from '../screens/UpdateProfileScreen';
import type { ProfileStackParamList } from '../profile.types';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileNavigator = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ProfileHome" component={ProfileScreen} />
        <Stack.Screen name="UpdateProfile" component={UpdateProfileScreen} />
    </Stack.Navigator>
);

export default ProfileNavigator;
