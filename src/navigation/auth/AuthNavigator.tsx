import React from 'react'
import Login from '../../screens/auth/screens/LoginScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const AuthNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
    </Stack.Navigator>
  )
}

export default AuthNavigator
