// import { Platform } from 'react-native';


// const BACKEND_URL = 'https://mins-waiting-cabinets-africa.trycloudflare.com';


// // 🔑 FIREBASE CONFIG
// const firebaseConfig = {
//     apiKey: 'AIzaSyBd3sTwKlETsdyxUtHIN-Rsdx9a0suOhwk',
//     authDomain: 'gymsaas-50e83.firebaseapp.com',
//     projectId: 'gymsaas-50e83',
//     storageBucket: 'gymsaas-50e83.firebasestorage.app',
//     messagingSenderId: '526162149515',
//     appId: '1:526162149515:web:4588bc80f37441684fd48e',
// };

// // 🔑 VAPID KEY
// // const VAPID_KEY = 'BH8U7HE3GlMs2h5Al6oR8y8nIg2xA4yY0N5Zo45PCvZmzsbJ07XZ571HC-xcCUHb07aDd0-O522jDyy6V6Sk0FU';
// const VAPID_KEY = 'BCn9tAhidltYe57eLoA2ED1h2AKcYCPWJVaZDOy21MwaH3raChPuyQO-JYS-ZXttlAPJlvTPlJ_2y0zdvjj1OdU'

// let messagingInstance: any = null;

// const isWeb = () => Platform.OS === 'web' && typeof window !== 'undefined';

// // ============================================
// // 🍎 PLATFORM DETECTION
// // ============================================

// export const isIOS = (): boolean => {
//     if (typeof window === 'undefined') return false;
//     return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
// };

// export const isStandalone = (): boolean => {
//     if (typeof window === 'undefined') return false;
//     return (
//         window.matchMedia('(display-mode: standalone)').matches ||
//         (window.navigator as any).standalone === true
//     );
// };

// export const getIOSVersion = (): number | null => {
//     if (!isIOS()) return null;
//     const match = navigator.userAgent.match(/OS (\d+)_(\d+)/);
//     if (!match) return null;
//     return parseFloat(`${match[1]}.${match[2]}`);
// };

// export const canReceivePushNotifications = (): { ok: boolean; reason?: string } => {
//     if (!isIOS()) return { ok: true };

//     const version = getIOSVersion();
//     if (!version || version < 16.4) {
//         return {
//             ok: false,
//             reason: `iOS ${version || 'unknown'} does not support push notifications. Please upgrade to iOS 16.4 or later.`
//         };
//     }

//     if (!isStandalone()) {
//         return {
//             ok: false,
//             reason: 'On iOS, you must install this app to your Home Screen first, then open from the home screen icon.'
//         };
//     }

//     return { ok: true };
// };

// // ============================================
// // 🐛 DEBUG HELPERS
// // ============================================

// const dbg = (label: string, data?: any) => {
//     if (data !== undefined) {
//         console.log(`🐛 [FCM] ${label}`, data);
//     } else {
//         console.log(`🐛 [FCM] ${label}`);
//     }
// };

// const dbgAlert = (label: string, data?: any) => {
//     const text = data !== undefined
//         ? `${label}\n\n${typeof data === 'object' ? JSON.stringify(data, null, 2) : String(data)}`
//         : label;
//     console.log(`🚨 [FCM ALERT] ${label}`, data || '');
//     if (typeof window !== 'undefined' && window.alert) {
//         setTimeout(() => window.alert(text), 100);
//     }
// };

// const withTimeout = <T>(promise: Promise<T>, ms: number, label: string): Promise<T> => {
//     return Promise.race([
//         promise,
//         new Promise<T>((_, reject) =>
//             setTimeout(() => reject(new Error(`⏰ TIMEOUT: ${label} took more than ${ms}ms`)), ms)
//         ),
//     ]);
// };

// // ============================================
// // INIT MESSAGING
// // ============================================

// export const initMessaging = async (): Promise<any | null> => {
//     if (!isWeb()) return null;
//     if (messagingInstance) {
//         dbg('Messaging already initialized, reusing instance');
//         return messagingInstance;
//     }

//     try {
//         dbg('Loading firebase/app module...');
//         const { initializeApp, getApps } = await import('firebase/app');
//         dbg('firebase/app loaded');

//         dbg('Loading firebase/messaging module...');
//         const { getMessaging, isSupported } = await import('firebase/messaging');
//         dbg('firebase/messaging loaded');

//         dbg('Checking isSupported()...');
//         const supported = await isSupported();
//         dbg('isSupported result:', supported);

//         if (!supported) {
//             dbgAlert('⚠️ FCM NOT SUPPORTED', 'This browser does not support Firebase Messaging');
//             return null;
//         }

//         const existingApps = getApps();
//         const app = existingApps.length ? existingApps[0] : initializeApp(firebaseConfig);
//         messagingInstance = getMessaging(app);
//         dbg('✅ Messaging instance created');
//         return messagingInstance;
//     } catch (err: any) {
//         dbgAlert('❌ initMessaging ERROR', {
//             name: err?.name,
//             message: err?.message,
//             code: err?.code,
//         });
//         return null;
//     }
// };

// // ============================================
// // SW REGISTRATION
// // ============================================

// const registerFirebaseSW = async (): Promise<ServiceWorkerRegistration | undefined> => {
//     if (!('serviceWorker' in navigator)) {
//         dbgAlert('❌ No serviceWorker in navigator');
//         return undefined;
//     }

//     try {
//         dbg('Checking for existing SW registrations...');
//         const allRegs = await navigator.serviceWorker.getRegistrations();
//         dbg(`Found ${allRegs.length} existing SW registrations`);

//         let reg: ServiceWorkerRegistration | undefined;

//         if (allRegs.length > 0) {
//             dbg('Using existing SW registration');
//             reg = allRegs.find(r => r.active?.scriptURL.includes('firebase-messaging-sw.js')) || allRegs[0];
//         } else {
//             dbg('No SW found. Registering /firebase-messaging-sw.js now...');
//             reg = await withTimeout(
//                 navigator.serviceWorker.register('/firebase-messaging-sw.js', { scope: '/' }),
//                 15000,
//                 'SW register'
//             );
//             dbg('✅ SW registered:', reg.scope);
//         }

//         dbg('Waiting for SW to be ready...');
//         await withTimeout(
//             navigator.serviceWorker.ready,
//             15000,
//             'SW ready'
//         );

//         const finalReg = await navigator.serviceWorker.getRegistration();
//         if (!finalReg) {
//             dbgAlert('❌ Cannot get final registration');
//             return undefined;
//         }

//         dbg('✅ SW fully ready!');
//         dbg('  Scope:', finalReg.scope);
//         dbg('  Active URL:', finalReg.active?.scriptURL);
//         dbg('  Active state:', finalReg.active?.state);

//         const controller = navigator.serviceWorker.controller;
//         dbg('  Controller:', controller?.scriptURL || 'NONE');

//         return finalReg;
//     } catch (err: any) {
//         dbgAlert('❌ SW REGISTER/READY FAILED', {
//             name: err?.name,
//             message: err?.message,
//         });
//         return undefined;
//     }
// };

// // ============================================
// // 🍎 iOS-SPECIFIC: Raw Push Subscription
// // ============================================

// const getIOSPushSubscription = async (
//     swRegistration: ServiceWorkerRegistration
// ): Promise<string | null> => {
//     try {
//         dbg('🍎 iOS: Converting VAPID key...');
//         const padding = '='.repeat((4 - VAPID_KEY.length % 4) % 4);
//         const base64 = (VAPID_KEY + padding).replace(/-/g, '+').replace(/_/g, '/');
//         const raw = atob(base64);
//         const key = new Uint8Array([...raw].map(c => c.charCodeAt(0)));
//         dbg('🍎 iOS: VAPID key converted');

//         // Check for existing subscription
//         const existingSub = await swRegistration.pushManager.getSubscription();
//         if (existingSub) {
//             dbg('🍎 iOS: Using existing subscription');
//             const subJson = existingSub.toJSON();
//             dbgAlert('🎉 iOS Existing Subscription!',
//                 'Endpoint: ' + (subJson.endpoint || '').substring(0, 80));
//             return JSON.stringify(subJson);
//         }

//         // Create new subscription
//         dbg('🍎 iOS: Creating new push subscription...');
//         const sub = await withTimeout(
//             swRegistration.pushManager.subscribe({
//                 userVisibleOnly: true,
//                 applicationServerKey: key,
//             }),
//             30000,
//             'iOS push subscribe'
//         );

//         dbg('🍎 iOS: ✅ Subscription created!');
//         dbg('  Endpoint:', sub.endpoint);

//         const subJson = sub.toJSON();
//         dbgAlert('🎉 iOS Subscription SUCCESS!',
//             'Endpoint: ' + sub.endpoint.substring(0, 80) +
//             '\n\nSave this JSON to send push messages');

//         return JSON.stringify(subJson);
//     } catch (err: any) {
//         dbgAlert('❌ iOS Push FAILED', {
//             name: err?.name,
//             message: err?.message,
//             code: err?.code,
//         });
//         return null;
//     }
// };

// // ============================================
// // 🎯 MAIN: REQUEST PERMISSION + GET TOKEN
// // ============================================

// export const requestPermissionAndGetToken = async (): Promise<string | null> => {
//     if (!isWeb()) return null;

//     try {
//         dbg('===== START TOKEN REQUEST =====');
//         dbg('User Agent:', navigator.userAgent);
//         dbg('Online:', navigator.onLine);
//         dbg('Is iOS:', isIOS());
//         dbg('Is Standalone:', isStandalone());

//         // ---- iOS PRE-CHECK ----
//         const iosCheck = canReceivePushNotifications();
//         if (!iosCheck.ok) {
//             dbgAlert('❌ iOS Requirement Not Met', iosCheck.reason);
//             return null;
//         }

//         // ---- STEP 1 ----
//         if (!('Notification' in window)) {
//             dbgAlert('❌ Step 1: No Notification API');
//             return null;
//         }
//         dbg('✅ Step 1: Notification API available');

//         // ---- STEP 2 ----
//         if (!('serviceWorker' in navigator)) {
//             dbgAlert('❌ Step 2: No ServiceWorker API');
//             return null;
//         }
//         dbg('✅ Step 2: ServiceWorker API available');

//         if (!('PushManager' in window)) {
//             dbgAlert('❌ PushManager not available');
//             return null;
//         }
//         dbg('✅ PushManager available');

//         // ---- STEP 3 ----
//         dbg('Requesting notification permission...');
//         const permission = await Notification.requestPermission();
//         dbg('Permission result:', permission);
//         if (permission !== 'granted') {
//             dbgAlert('❌ Permission denied', permission);
//             return null;
//         }
//         dbg('✅ Step 3: Permission granted');

//         // ---- STEP 4 ----
//         dbg('Initializing messaging...');
//         const messaging = await initMessaging();
//         if (!messaging) {
//             dbgAlert('❌ Step 4: Messaging init returned null');
//             return null;
//         }
//         dbg('✅ Step 4: Messaging ready');

//         // ---- STEP 5 ----
//         dbg('Getting SW registration...');
//         const swRegistration = await registerFirebaseSW();
//         if (!swRegistration) {
//             dbgAlert('❌ Step 5: SW registration failed');
//             return null;
//         }
//         dbg('✅ Step 5: SW ready');

//         // ---- 🍎 iOS PATH: Use Raw Push API ----
//         if (isIOS()) {
//             dbg('🍎 iOS detected - using raw Push API (Firebase FCM unreliable on iOS)');
//             return await getIOSPushSubscription(swRegistration);
//         }

//         // ---- ANDROID/DESKTOP PATH: Firebase FCM ----
//         dbg('===== FIREBASE getToken() =====');
//         const { getToken, deleteToken } = await import('firebase/messaging');

//         try {
//             await deleteToken(messaging);
//             dbg('Old token deleted');
//         } catch (delErr: any) {
//             dbg('No old token to delete');
//         }

//         dbg('Calling getToken()...');
//         const token = await withTimeout(
//             getToken(messaging, {
//                 vapidKey: VAPID_KEY,
//                 serviceWorkerRegistration: swRegistration,
//             }),
//             30000,
//             'getToken'
//         );

//         if (token) {
//             dbgAlert('🎉 TOKEN RECEIVED!',
//                 'Length: ' + token.length +
//                 '\nFirst 40 chars: ' + token.substring(0, 40) + '...');
//             return token;
//         } else {
//             dbgAlert('⚠️ getToken returned NULL/EMPTY');
//             return null;
//         }
//     } catch (err: any) {
//         dbgAlert('💥 EXCEPTION', {
//             name: err?.name,
//             code: err?.code,
//             message: err?.message,
//         });
//         return null;
//     }
// };

// // ============================================
// // FOREGROUND MESSAGES
// // ============================================

// export const listenForegroundMessages = async (
//     callback: (payload: any) => void
// ): Promise<() => void> => {
//     if (!isWeb()) return () => { };

//     // iOS doesn't support Firebase's onMessage - foreground uses standard push events
//     if (isIOS()) {
//         dbg('🍎 iOS: Skipping Firebase onMessage listener (not supported)');
//         return () => { };
//     }

//     const messaging = await initMessaging();
//     if (!messaging) return () => { };

//     try {
//         const { onMessage } = await import('firebase/messaging');

//         const unsubscribe = onMessage(messaging, (payload) => {
//             dbg('📩 Foreground message received:', payload);
//             callback(payload);

//             if (Notification.permission === 'granted') {
//                 navigator.serviceWorker.ready.then((reg) => {
//                     reg.showNotification(payload.notification?.title || payload.data?.title || 'GymSaaS', {
//                         body: payload.notification?.body || payload.data?.body || '',
//                         icon: '/icons/icon-192.png',
//                         badge: '/icons/icon-192.png',
//                         tag: 'foreground-' + Date.now(),
//                         data: { url: payload.data?.url || '/' },
//                     } as NotificationOptions);
//                 });
//             }
//         });

//         return unsubscribe;
//     } catch (err) {
//         console.error('listenForegroundMessages error:', err);
//         return () => { };
//     }
// };

// // ============================================
// // PERMISSION STATUS
// // ============================================

// export const getPermissionStatus = (): string => {
//     if (!isWeb() || !('Notification' in window)) return 'unsupported';
//     return Notification.permission;
// };











// // ============================================
// // BACKEND INTEGRATION
// // ============================================

// /** Send subscription to backend for storage */
// export const sendSubscriptionToBackend = async (
//     tokenOrSubscription: string,
//     userId: string = 'test-user'
// ): Promise<boolean> => {
//     try {
//         let subscription: any;

//         if (isIOS()) {
//             subscription = JSON.parse(tokenOrSubscription);
//         } else {
//             const reg = await navigator.serviceWorker.ready;
//             const sub = await reg.pushManager.getSubscription();
//             if (!sub) {
//                 console.error('No push subscription found');
//                 return false;
//             }
//             subscription = sub.toJSON();
//         }

//         const response = await fetch(`${BACKEND_URL}/subscribe`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'ngrok-skip-browser-warning': 'true',
//                 'Bypass-Tunnel-Reminder': 'true', // Added for Localtunnel support
//             },
//             body: JSON.stringify({ subscription, userId }),
//         });

//         const result = await response.json();
//         console.log('✅ Backend response:', result);
//         return result.success;
//     } catch (err) {
//         console.error('❌ Backend subscribe error:', err);
//         return false;
//     }
// };

// /** Trigger test push via backend */
// export const sendTestPushViaBackend = async (
//     title: string = 'Test from Backend',
//     body: string = 'Push works!'
// ): Promise<boolean> => {
//     try {
//         const response = await fetch(`${BACKEND_URL}/send-to-all`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'ngrok-skip-browser-warning': 'true',
//                 'Bypass-Tunnel-Reminder': 'true', // Added for Localtunnel support
//             },
//             body: JSON.stringify({ title, body, url: '/' }),
//         });

//         const result = await response.json();
//         console.log('✅ Test push result:', result);
//         return true;
//     } catch (err) {
//         console.error('❌ Test push error:', err);
//         return false;
//     }
// };























































// // src/core/utils/webPush.ts
// import { Platform } from 'react-native';
// import { API_URL } from './config';

// // ============================================
// // CONFIG
// // ============================================
// const BACKEND_URL = API_URL;

// // const VAPID_KEY = 'BCn9tAhidltYe57eLoA2ED1h2AKcYCPWJVaZDOy21MwaH3raChPuyQO-JYS-ZXttlAPJlvTPlJ_2y0zdvjj1OdU';

// const VAPID_KEY = "BEqySq45PgCul2eaguiY9oaW3WBBVAdPZU5yDcg6TF0_oCjsc3PbLHur82NbI0OMdRoiowXSyXq8-Ak05Hug9KM";

// // ============================================
// // HELPERS
// // ============================================
// const isWeb = () => Platform.OS === 'web' && typeof window !== 'undefined';

// const dbg = (label: string, data?: any) => {
//     if (data !== undefined) {
//         console.log(`[WebPush] ${label}`, data);
//     } else {
//         console.log(`[WebPush] ${label}`);
//     }
// };

// // Convert VAPID key to Uint8Array
// const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
//     const padding = '='.repeat((4 - base64String.length % 4) % 4);
//     const base64 = (base64String + padding)
//         .replace(/-/g, '+')
//         .replace(/_/g, '/');
//     const rawData = atob(base64);
//     return new Uint8Array(
//         rawData.split('').map(char => char.charCodeAt(0))
//     );
// };

// // ============================================
// // PLATFORM DETECTION
// // ============================================
// export const isIOS = (): boolean => {
//     if (typeof window === 'undefined') return false;
//     return /iPad|iPhone|iPod/.test(navigator.userAgent)
//         && !(window as any).MSStream;
// };

// export const isStandalone = (): boolean => {
//     if (typeof window === 'undefined') return false;
//     return (
//         window.matchMedia('(display-mode: standalone)').matches ||
//         (window.navigator as any).standalone === true
//     );
// };

// export const getIOSVersion = (): number | null => {
//     if (!isIOS()) return null;
//     const match = navigator.userAgent.match(/OS (\d+)_(\d+)/);
//     if (!match) return null;
//     return parseFloat(`${match[1]}.${match[2]}`);
// };

// export const canReceivePushNotifications = (): {
//     ok: boolean;
//     reason?: string
// } => {
//     if (!isIOS()) return { ok: true };

//     const version = getIOSVersion();
//     if (!version || version < 16.4) {
//         return {
//             ok: false,
//             reason: `iOS ${version || 'unknown'} does not support push notifications. Please upgrade to iOS 16.4 or later.`
//         };
//     }

//     if (!isStandalone()) {
//         return {
//             ok: false,
//             reason: 'On iOS, you must install this app to your Home Screen first, then open from the home screen icon.'
//         };
//     }

//     return { ok: true };
// };

// // ============================================
// // SERVICE WORKER REGISTRATION
// // ============================================
// const registerServiceWorker = async (): Promise<
//     ServiceWorkerRegistration | undefined
// > => {
//     if (!('serviceWorker' in navigator)) {
//         dbg('❌ ServiceWorker not supported');
//         return undefined;
//     }

//     try {
//         dbg('Checking existing SW registrations...');
//         const allRegs = await navigator.serviceWorker.getRegistrations();
//         dbg(`Found ${allRegs.length} existing registrations`);

//         // Use existing or register new
//         let reg: ServiceWorkerRegistration;

//         if (allRegs.length > 0) {
//             // Use existing service worker
//             reg = allRegs.find(r =>
//                 r.active?.scriptURL.includes('service-worker.js')
//             ) || allRegs[0];
//             dbg('Using existing SW:', reg.scope);
//         } else {
//             // Register new service worker
//             dbg('Registering new SW...');
//             reg = await navigator.serviceWorker.register(
//                 '/service-worker.js',
//                 { scope: '/' }
//             );
//             dbg('SW registered:', reg.scope);
//         }

//         // Wait for SW to be ready
//         dbg('Waiting for SW ready...');
//         await navigator.serviceWorker.ready;
//         dbg('✅ SW ready!');

//         return reg;
//     } catch (err: any) {
//         dbg('❌ SW registration failed', err.message);
//         return undefined;
//     }
// };

// // ============================================
// // MAIN: REQUEST PERMISSION + GET SUBSCRIPTION
// // Works for BOTH Android and iOS
// // ============================================
// export const requestPermissionAndGetToken = async (): Promise<
//     string | null
// > => {
//     if (!isWeb()) return null;

//     try {
//         dbg('===== START WEB PUSH SETUP =====');
//         dbg('User Agent:', navigator.userAgent);
//         dbg('Is iOS:', isIOS());
//         dbg('Is Standalone:', isStandalone());

//         // iOS pre-check
//         const iosCheck = canReceivePushNotifications();
//         if (!iosCheck.ok) {
//             dbg('❌ iOS requirement not met', iosCheck.reason);
//             return null;
//         }

//         // Check Notification API
//         if (!('Notification' in window)) {
//             dbg('❌ Notification API not supported');
//             return null;
//         }
//         dbg('✅ Notification API available');

//         // Check ServiceWorker API
//         if (!('serviceWorker' in navigator)) {
//             dbg('❌ ServiceWorker not supported');
//             return null;
//         }
//         dbg('✅ ServiceWorker available');

//         // Check PushManager
//         if (!('PushManager' in window)) {
//             dbg('❌ PushManager not supported');
//             return null;
//         }
//         dbg('✅ PushManager available');

//         // Request permission
//         dbg('Requesting notification permission...');
//         const permission = await Notification.requestPermission();
//         dbg('Permission result:', permission);

//         if (permission !== 'granted') {
//             dbg('❌ Permission denied');
//             return null;
//         }
//         dbg('✅ Permission granted');

//         // Register service worker
//         dbg('Registering service worker...');
//         const swReg = await registerServiceWorker();
//         if (!swReg) {
//             dbg('❌ SW registration failed');
//             return null;
//         }
//         dbg('✅ SW ready');

//         // Get existing subscription or create new one
//         // This works for BOTH Android and iOS
//         dbg('Getting push subscription...');
//         let subscription = await swReg.pushManager.getSubscription();

//         if (subscription) {
//             dbg('✅ Existing subscription found');
//             dbg('Endpoint:', subscription.endpoint);
//         } else {
//             dbg('Creating new subscription...');
//             subscription = await swReg.pushManager.subscribe({
//                 userVisibleOnly: true,
//                 applicationServerKey: urlBase64ToUint8Array(VAPID_KEY),
//             });
//             dbg('✅ New subscription created');
//             dbg('Endpoint:', subscription.endpoint);
//         }

//         const subscriptionJson = JSON.stringify(subscription.toJSON());
//         dbg('✅ Subscription ready for both Android and iOS');
//         return subscriptionJson;

//     } catch (err: any) {
//         dbg('💥 Exception', {
//             name: err?.name,
//             message: err?.message,
//             code: err?.code,
//         });
//         return null;
//     }
// };

// // ============================================
// // FOREGROUND MESSAGES
// // Pure Web Push - No Firebase needed
// // Listen for messages from service worker
// // ============================================
// export const listenForegroundMessages = async (
//     callback: (payload: any) => void
// ): Promise<() => void> => {
//     if (!isWeb()) return () => { };

//     try {
//         // Listen for messages from service worker
//         const handler = (event: MessageEvent) => {
//             if (event.data && event.data.type === 'PUSH_RECEIVED') {
//                 dbg('📩 Foreground message from SW:', event.data);
//                 callback(event.data.payload);
//             }
//         };

//         navigator.serviceWorker.addEventListener('message', handler);
//         dbg('✅ Foreground message listener attached');

//         // Return unsubscribe function
//         return () => {
//             navigator.serviceWorker.removeEventListener('message', handler);
//             dbg('Foreground message listener removed');
//         };
//     } catch (err: any) {
//         dbg('❌ listenForegroundMessages error', err.message);
//         return () => { };
//     }
// };

// // ============================================
// // PERMISSION STATUS
// // ============================================
// export const getPermissionStatus = (): string => {
//     if (!isWeb() || !('Notification' in window)) return 'unsupported';
//     return Notification.permission;
// };

// // ============================================
// // UNSUBSCRIBE
// // ============================================
// export const unsubscribeFromPush = async (): Promise<boolean> => {
//     if (!isWeb()) return false;

//     try {
//         const reg = await navigator.serviceWorker.ready;
//         const subscription = await reg.pushManager.getSubscription();

//         if (!subscription) {
//             dbg('No subscription found to remove');
//             return true;
//         }

//         await subscription.unsubscribe();
//         dbg('✅ Unsubscribed successfully');
//         return true;
//     } catch (err: any) {
//         dbg('❌ Unsubscribe failed', err.message);
//         return false;
//     }
// };

// // ============================================
// // SEND SUBSCRIPTION TO BACKEND
// // Works for both Android and iOS
// // ============================================
// export const sendSubscriptionToBackend = async (
//     tokenOrSubscription: string,
//     userId: string = 'test-user'
// ): Promise<boolean> => {
//     try {
//         // Parse subscription JSON (same format for both platforms)
//         const subscription = JSON.parse(tokenOrSubscription);

//         dbg('Sending subscription to backend...');
//         dbg('Platform:', isIOS() ? 'iOS' : 'Android/Desktop');

//         const response = await fetch(`${BACKEND_URL}/subscribe`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Bypass-Tunnel-Reminder': 'true',
//             },
//             body: JSON.stringify({ subscription, userId }),
//         });

//         const result = await response.json();
//         dbg('✅ Backend response:', result);
//         return result.success;
//     } catch (err: any) {
//         dbg('❌ Backend subscribe error:', err.message);
//         return false;
//     }
// };

// // ============================================
// // SEND TEST PUSH VIA BACKEND
// // ============================================
// export const sendTestPushViaBackend = async (
//     title: string = 'Test from Backend',
//     body: string = 'Push works!'
// ): Promise<boolean> => {
//     try {
//         dbg('Sending test push via backend...');

//         const response = await fetch(`${BACKEND_URL}/send-to-all`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Bypass-Tunnel-Reminder': 'true',
//             },
//             body: JSON.stringify({ title, body, url: '/' }),
//         });

//         const result = await response.json();
//         dbg('✅ Test push result:', result);
//         return true;
//     } catch (err: any) {
//         dbg('❌ Test push error:', err.message);
//         return false;
//     }
// };












































import { Platform } from 'react-native';
import { API_URL } from './config';

// ============================================
// CONFIG
// ============================================

// IMPORTANT:
// This must be the SAME public VAPID key configured
// on your backend.
const VAPID_KEY =
    'BEqySq45PgCul2eaguiY9oaW3WBBVAdPZU5yDcg6TF0_oCjsc3PbLHur82NbI0OMdRoiowXSyXq8-Ak05Hug9KM';

// ============================================
// HELPERS
// ============================================

const isWeb = () =>
    Platform.OS === 'web' && typeof window !== 'undefined';

const dbg = (label: string, data?: any) => {
    if (data !== undefined) {
        console.log(`[WebPush] ${label}`, data);
    } else {
        console.log(`[WebPush] ${label}`);
    }
};

const urlBase64ToUint8Array = (
    base64String: string,
): Uint8Array<ArrayBuffer> => {
    const padding = '='.repeat(
        (4 - (base64String.length % 4)) % 4,
    );

    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = atob(base64);

    return new Uint8Array(
        rawData
            .split('')
            .map(char => char.charCodeAt(0)),
    );
};

// ============================================
// PLATFORM DETECTION
// ============================================

export const isIOS = (): boolean => {
    if (typeof window === 'undefined') return false;

    return (
        /iPad|iPhone|iPod/.test(navigator.userAgent) &&
        !(window as any).MSStream
    );
};

export const isStandalone = (): boolean => {
    if (typeof window === 'undefined') return false;

    return (
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true
    );
};

export const getIOSVersion = (): number | null => {
    if (!isIOS()) return null;

    const match = navigator.userAgent.match(
        /OS (\d+)_(\d+)/,
    );

    if (!match) return null;

    return parseFloat(`${match[1]}.${match[2]}`);
};

export const canReceivePushNotifications = (): {
    ok: boolean;
    reason?: string;
} => {
    if (!isIOS()) {
        return { ok: true };
    }

    const version = getIOSVersion();

    if (!version || version < 16.4) {
        return {
            ok: false,
            reason:
                `iOS ${version || 'unknown'} does not support ` +
                'push notifications. Please upgrade to iOS 16.4 or later.',
        };
    }

    if (!isStandalone()) {
        return {
            ok: false,
            reason:
                'On iOS, install this PWA to the Home Screen first, ' +
                'then open it from the Home Screen.',
        };
    }

    return { ok: true };
};

// ============================================
// SERVICE WORKER
// ============================================

const registerServiceWorker = async (): Promise<
    ServiceWorkerRegistration | undefined
> => {
    if (!('serviceWorker' in navigator)) {
        dbg('❌ ServiceWorker not supported');
        return undefined;
    }

    try {
        const registrations =
            await navigator.serviceWorker.getRegistrations();

        let registration: ServiceWorkerRegistration;

        if (registrations.length > 0) {
            registration =
                registrations.find(item =>
                    item.active?.scriptURL.includes(
                        'service-worker.js',
                    ),
                ) || registrations[0];

            dbg(
                'Using existing Service Worker',
                registration.scope,
            );
        } else {
            registration =
                await navigator.serviceWorker.register(
                    '/service-worker.js',
                    {
                        scope: '/',
                    },
                );

            dbg(
                'New Service Worker registered',
                registration.scope,
            );
        }

        await navigator.serviceWorker.ready;

        return registration;
    } catch (error: any) {
        dbg(
            '❌ Service Worker registration failed',
            error?.message,
        );

        return undefined;
    }
};

// ============================================
// GET / CREATE PUSH SUBSCRIPTION
// ============================================

export const requestPermissionAndGetToken = async (): Promise<
    string | null
> => {
    if (!isWeb()) {
        dbg('Not running on web');
        return null;
    }

    try {
        // iOS requirements check
        const iosCheck = canReceivePushNotifications();

        if (!iosCheck.ok) {
            dbg(
                '❌ iOS requirements not met',
                iosCheck.reason,
            );

            return null;
        }

        // Notification API
        if (!('Notification' in window)) {
            dbg('❌ Notification API not supported');
            return null;
        }

        // Service Worker API
        if (!('serviceWorker' in navigator)) {
            dbg('❌ ServiceWorker not supported');
            return null;
        }

        // Push API
        if (!('PushManager' in window)) {
            dbg('❌ PushManager not supported');
            return null;
        }

        // Ask user permission
        const permission =
            await Notification.requestPermission();

        if (permission !== 'granted') {
            dbg(
                '❌ Notification permission denied',
                permission,
            );

            return null;
        }

        dbg('✅ Notification permission granted');

        // Register Service Worker
        const registration =
            await registerServiceWorker();

        if (!registration) {
            return null;
        }

        // Get existing subscription
        let subscription =
            await registration.pushManager.getSubscription();

        // Create new subscription if not exists
        if (!subscription) {
            subscription =
                await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey:
                        urlBase64ToUint8Array(VAPID_KEY),
                });

            dbg(
                '✅ New Push Subscription created',
                subscription,
            );
        } else {
            dbg(
                '✅ Existing Push Subscription found',
                subscription,
            );
        }

        // This gives:
        // {
        //   endpoint: "...",
        //   expirationTime: null,
        //   keys: {
        //      p256dh: "...",
        //      auth: "..."
        //   }
        // }

        const subscriptionData =
            subscription.toJSON();

        console.log(
            '🔔 COMPLETE PUSH SUBSCRIPTION:',
            subscriptionData,
        );

        return JSON.stringify(subscriptionData);
    } catch (error: any) {
        console.error(
            '❌ Web Push subscription error:',
            error,
        );

        return null;
    }
};

// ============================================
// REGISTER DEVICE WITH BACKEND
// ============================================

export const registerPushDevice = async (
    subscriptionJson: string,
    accessToken: string,
): Promise<boolean> => {
    try {
        const subscription =
            JSON.parse(subscriptionJson);

        const requestBody = {
            endpoint: subscription.endpoint,
            keys: {
                p256dh: subscription.keys?.p256dh,
                auth: subscription.keys?.auth,
            },
        };

        console.log(
            '📤 REGISTERING DEVICE WITH BACKEND:',
            requestBody,
        );

        const response = await fetch(
            `${API_URL}/api/v1/notifications/web-push-subscription`,
            {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json',
 
                    Authorization: `Bearer ${accessToken}`,
                },

                body: JSON.stringify(requestBody),
            },
        );

        const result = await response.json();

        console.log(
            '📥 DEVICE REGISTRATION RESPONSE:',
            result,
        );

        if (!response.ok) {
            console.error(
                '❌ Device registration failed:',
                result,
            );

            return false;
        }

        dbg('✅ Device registered successfully');

        return true;
    } catch (error: any) {
        console.error(
            '❌ Register device error:',
            error,
        );

        return false;
    }
};

// ============================================
// GET CURRENT SUBSCRIPTION
// Useful if device was already registered
// ============================================

export const getCurrentPushSubscription = async (): Promise<
    string | null
> => {
    if (!isWeb()) {
        return null;
    }

    try {
        const registration =
            await navigator.serviceWorker.ready;

        const subscription =
            await registration.pushManager.getSubscription();

        if (!subscription) {
            return null;
        }

        return JSON.stringify(
            subscription.toJSON(),
        );
    } catch (error) {
        console.error(
            '❌ Failed to get current subscription:',
            error,
        );

        return null;
    }
};

// ============================================
// UNSUBSCRIBE
// ============================================

export const unsubscribeFromPush = async (): Promise<
    boolean
> => {
    if (!isWeb()) {
        return false;
    }

    try {
        const registration =
            await navigator.serviceWorker.ready;

        const subscription =
            await registration.pushManager.getSubscription();

        if (!subscription) {
            dbg('No subscription found');

            return true;
        }

        await subscription.unsubscribe();

        dbg('✅ Unsubscribed successfully');

        return true;
    } catch (error: any) {
        console.error(
            '❌ Unsubscribe failed:',
            error,
        );

        return false;
    }
};

// ============================================
// FOREGROUND MESSAGES
// ============================================

export const listenForegroundMessages = async (
    callback: (payload: any) => void,
): Promise<() => void> => {
    if (!isWeb()) {
        return () => { };
    }

    try {
        const handler = (
            event: MessageEvent,
        ) => {
            if (
                event.data &&
                event.data.type === 'PUSH_RECEIVED'
            ) {
                dbg(
                    '📩 Push received:',
                    event.data,
                );

                callback(event.data.payload);
            }
        };

        navigator.serviceWorker.addEventListener(
            'message',
            handler,
        );

        return () => {
            navigator.serviceWorker.removeEventListener(
                'message',
                handler,
            );
        };
    } catch (error: any) {
        console.error(
            '❌ Foreground listener error:',
            error,
        );

        return () => { };
    }
};

// ============================================
// PERMISSION STATUS
// ============================================

export const getPermissionStatus = (): string => {
    if (
        !isWeb() ||
        !('Notification' in window)
    ) {
        return 'unsupported';
    }

    return Notification.permission;
};
















// =====================================================================
// ADD THIS TO THE END OF YOUR EXISTING: src/core/utils/webPush.ts
//
// It reuses: isWeb, dbg, registerServiceWorker,
// urlBase64ToUint8Array and VAPID_KEY — all already in that file.
// =====================================================================

/**
 * Get (or create) a push subscription WITHOUT showing any prompt.
 * Only works when Notification.permission is ALREADY 'granted'
 * (e.g. user re-enabled notifications in browser/site settings).
 * Returns the subscription JSON, same shape as
 * requestPermissionAndGetToken().
 */
export const createOrGetPushSubscription =
    async (): Promise<string | null> => {
        if (!isWeb()) {
            return null;
        }

        try {
            if (!('Notification' in window) ||
                Notification.permission !== 'granted') {
                dbg(
                    '⛔ createOrGetPushSubscription: ' +
                    'permission is not granted',
                );
                return null;
            }

            const registration =
                await registerServiceWorker();

            if (!registration) {
                return null;
            }

            let subscription =
                await registration.pushManager.getSubscription();

            if (!subscription) {
                subscription =
                    await registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey:
                            urlBase64ToUint8Array(VAPID_KEY),
                    });

                dbg(
                    '✅ New subscription created ' +
                    '(no prompt needed)',
                );
            } else {
                dbg(
                    '✅ Existing subscription found',
                );
            }

            return JSON.stringify(
                subscription.toJSON(),
            );
        } catch (error: any) {
            console.error(
                '❌ createOrGetPushSubscription error:',
                error,
            );
            return null;
        }
    };