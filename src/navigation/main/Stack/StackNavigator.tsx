import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import BottomNavigator from '../BottomTabs/BottomNavigator';

type MainStackParamList = {
    BottomTabs: undefined;
};

const Stack = createNativeStackNavigator<MainStackParamList>();

const StackNavigator = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="BottomTabs" component={BottomNavigator} />
    </Stack.Navigator>
);

export default StackNavigator;
