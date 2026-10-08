// import AppText from '@/src/components/AppText';
// import Container from '@/src/components/Container';
// import Screen from '@/src/components/Screen';
// import { saveToken } from '@/src/core/utils/tokenStorage';
// import { useAppDispatch } from '@/src/store/hooks';
// import { setOrganization, setToken, setUser } from '@/src/store/slices/organizationSlice';
// import { setTheme } from '@/src/store/slices/themeSlice';
// import React, { useState } from 'react';
// import {
//     ActivityIndicator,
//     Alert,
//     KeyboardAvoidingView,
//     Platform,
//     ScrollView,
//     StyleSheet,
//     TextInput,
//     TouchableOpacity,
// } from 'react-native';

// const API_URL = 'http://178.128.54.158:4000';

// const LoginScreen = () => {
//     const [email, setEmail] = useState('test107@yopmail.com');
//     const [password, setPassword] = useState('Qwerty123!');
//     const [loading, setLoading] = useState(false);
//     const [showPassword, setShowPassword] = useState(false);

//     const dispatch = useAppDispatch();

//     const handleLogin = async () => {
//         // ── Validation ──────────────────────────
//         if (!email.trim()) {
//             Alert.alert('Error', 'Please enter your email');
//             return;
//         }
//         if (!password.trim()) {
//             Alert.alert('Error', 'Please enter your password');
//             return;
//         }

//         setLoading(true);

//         try {
//             const response = await fetch(`${API_URL}/api/v1/auth/member/login`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     email: email.trim(),
//                     password: password,
//                 }),
//             });
//             const data = await response.json();

//             if (response.ok) {
//                 const res = data.organization
//                 const accessToken = typeof data.access_token === 'string' ? data.access_token.trim() : ''
//                 console.log('Success ✅', 'Login successful!');
//                 dispatch(setOrganization(res));
//                 dispatch(setTheme({ primary: res.branding.primary_color, secondary: res.branding.secondary_color, primaryLight: `${res.branding.primary_color}47`, bottomBackgroundColor: `${res.branding.primary_color}15` }));
//                 dispatch(setToken(accessToken));
//                 saveToken(accessToken)
//                 dispatch(setUser(data.member_id));
//             } else {
//                 Alert.alert(
//                     'Login Failed ❌',
//                     data.message || 'Invalid email or password'
//                 );
//             }
//         } catch (error: any) {
//             console.error('Login error:', error);
//             Alert.alert('Error', 'Cannot connect to server. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <Screen>
//             <KeyboardAvoidingView
//                 style={styles.flex}
//                 behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//             >
//                 <ScrollView
//                     contentContainerStyle={styles.scrollContent}
//                     keyboardShouldPersistTaps="handled"
//                     showsVerticalScrollIndicator={false}
//                 >
//                     {/* ── Header ──────────────────────── */}
//                     <Container style={styles.headerContainer}>
//                         <AppText style={styles.emoji}>💪</AppText>
//                         <AppText style={styles.title}>Welcome Back</AppText>
//                         <AppText style={styles.subtitle}>
//                             Sign in to your account
//                         </AppText>
//                     </Container>

//                     {/* ── Form ────────────────────────── */}
//                     <Container style={styles.formContainer}>
//                         {/* Email */}
//                         <Container style={styles.inputGroup}>
//                             <AppText style={styles.label}>Email</AppText>
//                             <TextInput
//                                 style={styles.input}
//                                 placeholder="Enter your email"
//                                 placeholderTextColor="#9ca3af"
//                                 value={email}
//                                 onChangeText={setEmail}
//                                 keyboardType="email-address"
//                                 autoCapitalize="none"
//                                 autoCorrect={false}
//                                 editable={!loading}
//                             />
//                         </Container>

//                         {/* Password */}
//                         <Container style={styles.inputGroup}>
//                             <AppText style={styles.label}>Password</AppText>
//                             <Container style={styles.passwordContainer}>
//                                 <TextInput
//                                     style={styles.passwordInput}
//                                     placeholder="Enter your password"
//                                     placeholderTextColor="#9ca3af"
//                                     value={password}
//                                     onChangeText={setPassword}
//                                     secureTextEntry={!showPassword}
//                                     autoCapitalize="none"
//                                     editable={!loading}
//                                 />
//                                 <TouchableOpacity
//                                     style={styles.eyeButton}
//                                     onPress={() => setShowPassword(!showPassword)}
//                                 >
//                                     <AppText style={styles.eyeIcon}>
//                                         {showPassword ? '🙈' : '👁️'}
//                                     </AppText>
//                                 </TouchableOpacity>
//                             </Container>
//                         </Container>

//                         {/* Forgot Password */}
//                         <TouchableOpacity style={styles.forgotButton}>
//                             <AppText style={styles.forgotText}>
//                                 Forgot Password?
//                             </AppText>
//                         </TouchableOpacity>

//                         {/* Login Button */}
//                         <TouchableOpacity
//                             style={[
//                                 styles.loginButton,
//                                 loading && styles.loginButtonDisabled,
//                             ]}
//                             onPress={handleLogin}
//                             disabled={loading}
//                             activeOpacity={0.8}
//                         >
//                             {loading ? (
//                                 <ActivityIndicator color="#fff" />
//                             ) : (
//                                 <AppText style={styles.loginButtonText}>
//                                     Sign In
//                                 </AppText>
//                             )}
//                         </TouchableOpacity>
//                     </Container>

//                     {/* ── Footer ─────────────────────── */}
//                     <Container style={styles.footer}>
//                         <AppText style={styles.footerText}>
//                             Don't have an account?{' '}
//                         </AppText>
//                         <TouchableOpacity>
//                             <AppText style={styles.signUpText}>Sign Up</AppText>
//                         </TouchableOpacity>
//                     </Container>
//                 </ScrollView>
//             </KeyboardAvoidingView>
//         </Screen>
//     );
// };

// export default LoginScreen;

// const styles = StyleSheet.create({
//     flex: {
//         flex: 1,
//     },
//     scrollContent: {
//         flexGrow: 1,
//         justifyContent: 'center',
//         padding: 24,
//     },

//     // Header
//     headerContainer: {
//         alignItems: 'center',
//         marginBottom: 36,
//     },
//     emoji: {
//         fontSize: 48,
//         marginBottom: 16,
//     },
//     title: {
//         fontSize: 28,
//         fontWeight: '800',
//         color: '#111827',
//         marginBottom: 6,
//     },
//     subtitle: {
//         fontSize: 15,
//         color: '#6b7280',
//         fontWeight: '500',
//     },

//     // Form
//     formContainer: {
//         marginBottom: 24,
//     },
//     inputGroup: {
//         marginBottom: 18,
//     },
//     label: {
//         fontSize: 14,
//         fontWeight: '600',
//         color: '#374151',
//         marginBottom: 8,
//     },
//     input: {
//         backgroundColor: '#f9fafb',
//         borderWidth: 1.5,
//         borderColor: '#e5e7eb',
//         borderRadius: 12,
//         paddingHorizontal: 16,
//         paddingVertical: 14,
//         fontSize: 15,
//         color: '#111827',
//     },

//     // Password
//     passwordContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: '#f9fafb',
//         borderWidth: 1.5,
//         borderColor: '#e5e7eb',
//         borderRadius: 12,
//     },
//     passwordInput: {
//         flex: 1,
//         paddingHorizontal: 16,
//         paddingVertical: 14,
//         fontSize: 15,
//         color: '#111827',
//     },
//     eyeButton: {
//         paddingHorizontal: 14,
//         paddingVertical: 14,
//     },
//     eyeIcon: {
//         fontSize: 18,
//     },

//     // Forgot
//     forgotButton: {
//         alignSelf: 'flex-end',
//         marginBottom: 24,
//     },
//     forgotText: {
//         fontSize: 13,
//         color: '#6366f1',
//         fontWeight: '600',
//     },

//     // Login Button
//     loginButton: {
//         backgroundColor: '#6366f1',
//         borderRadius: 14,
//         paddingVertical: 16,
//         alignItems: 'center',
//         shadowColor: '#6366f1',
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.3,
//         shadowRadius: 8,
//         elevation: 5,
//     },
//     loginButtonDisabled: {
//         backgroundColor: '#a5b4fc',
//         shadowOpacity: 0,
//         elevation: 0,
//     },
//     loginButtonText: {
//         color: '#fff',
//         fontSize: 16,
//         fontWeight: '700',
//         letterSpacing: 0.3,
//     },

//     // Footer
//     footer: {
//         flexDirection: 'row',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     footerText: {
//         fontSize: 14,
//         color: '#6b7280',
//     },
//     signUpText: {
//         fontSize: 14,
//         color: '#6366f1',
//         fontWeight: '700',
//     },
// });

import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const LoginScreen = () => {
    return (
        <View>
            <Text>LoginScreen</Text>
        </View>
    )
}

export default LoginScreen

const styles = StyleSheet.create({})