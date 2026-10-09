import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SetupScreen from '../../../screens/setup/SetupScreen';
import BottomNavigator from '../BottomTabs/BottomNavigator';
import type { MainStackParamList } from './main.types';

const Stack = createNativeStackNavigator<MainStackParamList>();

type StackNavigatorProps = {
    startAtSetup?: boolean;
};

const StackNavigator = ({ startAtSetup = false }: StackNavigatorProps) => (
    <Stack.Navigator
        initialRouteName={startAtSetup ? 'Setup' : 'BottomTabs'}
        screenOptions={{ headerShown: false }}
    >
        <Stack.Screen name="BottomTabs" component={BottomNavigator} />
        <Stack.Screen name="Setup" component={SetupScreen} />
    </Stack.Navigator>
);

export default StackNavigator;
