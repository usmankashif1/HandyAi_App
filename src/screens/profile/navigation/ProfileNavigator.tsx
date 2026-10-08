// import { StyleSheet } from 'react-native'
// import React from 'react'
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import ProfileScreen from '../screens/ProfileScreen';
// import BMIScreen from '../screens/BMIScreen';
// import HelpScreen from '../screens/HelpScreen';
// import PersonalDetails from '../screens/PersonalDetails';
// import InvoicesScreen from '../screens/InvoicesScreen';
// import ContactSupport from '../screens/ContactSupport';
// import { NotificationsScreen } from '../../home/screens/NotificationsScreen';
// type Props = {}

// const ProfileNavigator = (props: Props) => {
//     const Stack = createNativeStackNavigator();

//     return (
//         <Stack.Navigator screenOptions={{ headerShown: false }}>
//             <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
//             <Stack.Screen name="BMIScreen" component={BMIScreen} />
//             <Stack.Screen name="HelpScreen" component={HelpScreen} />
//             <Stack.Screen name="PersonalDetails" component={PersonalDetails} />
//             <Stack.Screen name="InvoicesScreen" component={InvoicesScreen} />
//             <Stack.Screen name="ContactSupport" component={ContactSupport} />
//             <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} />
//         </Stack.Navigator>
//     )
// }

// export default ProfileNavigator

// const styles = StyleSheet.create({})


import ProfileScreen from '../screens/ProfileScreen';

const ProfileNavigator = () => <ProfileScreen />;

export default ProfileNavigator;