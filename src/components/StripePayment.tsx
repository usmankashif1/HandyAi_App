// import React, { useState } from 'react';
// import {
 //     Text,
//     TouchableOpacity,
//     StyleSheet,

//     ScrollView,
//     Alert,
//     ActivityIndicator,
// } from 'react-native';
// import {
//     CardField,
//     useStripe,
//     CardFieldInput,
// } from '@stripe/stripe-react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';


// function TokenResult({ token }: { token: any }) {
//     return (
//         <Container style={styles.resultCard}>
//             <Text style={styles.resultTitle}>Token Received!</Text>
//             <Text style={styles.resultSubtitle}>Send this token to your backend</Text>

//             <Container style={styles.resultRow}>
//                 <Text style={styles.resultLabel}>Token ID</Text>
//                 <Text style={styles.resultValue}>{token.id}</Text>
//             </Container>

//             <Container style={styles.resultRow}>
//                 <Text style={styles.resultLabel}>Card Brand</Text>
//                 <Text style={styles.resultValue}>{token.card?.brand}</Text>
//             </Container>

//             <Container style={styles.resultRow}>
//                 <Text style={styles.resultLabel}>Last 4</Text>
//                 <Text style={styles.resultValue}>**** {token.card?.last4}</Text>
//             </Container>

//             <Container style={styles.resultRow}>
//                 <Text style={styles.resultLabel}>Expiry</Text>
//                 <Text style={styles.resultValue}>
//                     {token.card?.expMonth}/{token.card?.expYear}
//                 </Text>
//             </Container>

//             <Container style={styles.resultRow}>
//                 <Text style={styles.resultLabel}>Country</Text>
//                 <Text style={styles.resultValue}>{token.card?.country}</Text>
//             </Container>

//             <Container style={styles.divider} />

//             <Text style={styles.rawTitle}>Raw Token Object</Text>
//             <Text style={styles.rawJson}>{JSON.stringify(token, null, 2)}</Text>
//         </Container>
//     );
// }


// export default function StripePayment() {
//     const { createToken } = useStripe();
//     const [cardDetails, setCardDetails] = useState<CardFieldInput.Details | null>(null);
//     const [loading, setLoading] = useState(false);
//     const [token, setToken] = useState<any>(null);



//     const handleGetToken = async () => {

//         if (!cardDetails?.complete) {
//             Alert.alert('Incomplete Card', 'Please fill in all card details');
//             return;
//         }

//         setLoading(true);
//         setToken(null);

//         try {

//             const { token: stripeToken, error } = await createToken({
//                 type: 'Card',
//                 name: 'Test User',
//             });

//             if (error) {
//                 Alert.alert('Error', error.message);
//                 console.log('Stripe Error:', error);
//             } else if (stripeToken) {
//                 console.log('🎉 Token:', stripeToken);
//                 setToken(stripeToken);
//             }
//         } catch (err) {
//             Alert.alert('Error', 'Something went wrong');
//             console.log(err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleReset = () => {
//         setToken(null);
//         setCardDetails(null);
//     };

//     return (


//         <ScrollView contentContainerStyle={styles.container}>


//             <Text style={styles.header}>Stripe Token Test</Text>


//             <Container style={styles.card}>
//                 <Text style={styles.sectionTitle}>Enter Card Details</Text>

//                 <CardField
//                     postalCodeEnabled={false}
//                     placeholders={{
//                         number: '4242 4242 4242 4242',
//                     }}
//                     cardStyle={styles.cardField}
//                     style={styles.cardContainer}
//                     onCardChange={(details) => {
//                         setCardDetails(details);
//                         setToken(null);
//                     }}
//                 />

//                 Card Status
//                 <Text style={styles.cardStatus}>
//                     {!cardDetails
//                         ? 'Enter your card details above'
//                         : cardDetails.complete
//                             ? 'Card details complete'
//                             : ' Keep entering card details...'}
//                 </Text>
//             </Container>


//             <Container style={styles.testCardsCard}>
//                 <Text style={styles.sectionTitle}>🧪 Test Card Numbers</Text>

//                 {[
//                     { label: 'Success', number: '4242 4242 4242 4242' },
//                     { label: 'Declined', number: '4000 0000 0000 0002' },
//                     { label: '3D Secure', number: '4000 0025 0000 3155' },
//                     { label: 'Insufficient', number: '4000 0000 0000 9995' },
//                 ].map((item) => (
//                     <Container key={item.number} style={styles.testRow}>
//                         <Text style={styles.testLabel}>{item.label}</Text>
//                         <Text style={styles.testNumber}>{item.number}</Text>
//                     </Container>
//                 ))}

//                 <Text style={styles.testNote}>
//                     Expiry: any future date (e.g. 12/34){'\n'}
//                     CVC: any 3 digits (e.g. 123)
//                 </Text>
//             </Container>


//             <TouchableOpacity
//                 style={[
//                     styles.button,
//                     (!cardDetails?.complete || loading) && styles.buttonDisabled,
//                 ]}
//                 onPress={handleGetToken}
//                 disabled={!cardDetails?.complete || loading}
//             >
//                 {loading ? (
//                     <ActivityIndicator color="#fff" />
//                 ) : (
//                     <Text style={styles.buttonText}>Get Token </Text>
//                 )}
//             </TouchableOpacity>


//             {token && (
//                 <>
//                     <TokenResult token={token} />
//                     <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
//                         <Text style={styles.resetButtonText}>Reset & Try Again</Text>
//                     </TouchableOpacity>
//                 </>
//             )}

//         </ScrollView>


//     );
// }


// const styles = StyleSheet.create({
//     safe: {
//         flex: 1,
//         backgroundColor: '#f5f5f5',
//     },
//     container: {
//         padding: 20,
//         paddingBottom: 40,
//     },


//     header: {
//         fontSize: 26,
//         fontWeight: '800',
//         color: '#1a1a1a',
//         marginBottom: 8,
//     },
//     modeBadge: {
//         alignSelf: 'flex-start',
//         backgroundColor: '#fef3c7',
//         paddingHorizontal: 12,
//         paddingVertical: 4,
//         borderRadius: 20,
//         marginBottom: 24,
//         borderWidth: 1,
//         borderColor: '#fde68a',
//     },
//     modeBadgeText: {
//         fontSize: 12,
//         color: '#92400e',
//         fontWeight: '600',
//     },

//     card: {
//         backgroundColor: '#fff',
//         borderRadius: 16,
//         padding: 20,
//         marginBottom: 16,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.06,
//         shadowRadius: 8,
//         elevation: 3,
//     },
//     testCardsCard: {
//         backgroundColor: '#fff',
//         borderRadius: 16,
//         padding: 20,
//         marginBottom: 20,
//         borderWidth: 1,
//         borderColor: '#fde68a',
//         backgroundColor: '#fffbeb',
//     },
//     sectionTitle: {
//         fontSize: 15,
//         fontWeight: '700',
//         color: '#1a1a1a',
//         marginBottom: 14,
//     },


//     cardContainer: {
//         height: 50,
//         marginBottom: 10,
//     },
//     cardField: {
//         backgroundColor: '#f9fafb',
//         textColor: '#1a1a1a',
//         borderRadius: 10,
//         borderWidth: 1.5,
//         borderColor: '#e5e7eb',
//         fontSize: 16,
//         placeholderColor: '#9ca3af',
//     },
//     cardStatus: {
//         fontSize: 13,
//         color: '#6b7280',
//         textAlign: 'center',
//         marginTop: 4,
//     },


//     testRow: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingVertical: 6,
//         borderBottomWidth: 1,
//         borderBottomColor: '#fde68a',
//     },
//     testLabel: {
//         width: 120,
//         fontSize: 13,
//         fontWeight: '600',
//         color: '#78350f',
//     },
//     testNumber: {
//         fontSize: 13,
//         color: '#92400e',
//         fontFamily: 'monospace',
//         letterSpacing: 0.5,
//     },
//     testNote: {
//         marginTop: 12,
//         fontSize: 12,
//         color: '#92400e',
//         lineHeight: 20,
//     },


//     button: {
//         backgroundColor: '#6366f1',
//         padding: 16,
//         borderRadius: 14,
//         alignItems: 'center',
//         marginBottom: 24,
//         shadowColor: '#6366f1',
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.3,
//         shadowRadius: 8,
//         elevation: 5,
//     },
//     buttonDisabled: {
//         backgroundColor: '#d1d5db',
//         shadowOpacity: 0,
//         elevation: 0,
//     },
//     buttonText: {
//         color: '#fff',
//         fontSize: 16,
//         fontWeight: '700',
//         letterSpacing: 0.3,
//     },


//     resetButton: {
//         alignItems: 'center',
//         padding: 12,
//         marginTop: 8,
//     },
//     resetButtonText: {
//         color: '#6366f1',
//         fontSize: 14,
//         fontWeight: '600',
//     },


//     resultCard: {
//         backgroundColor: '#fff',
//         borderRadius: 16,
//         padding: 20,
//         borderWidth: 2,
//         borderColor: '#10b981',
//         shadowColor: '#10b981',
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.15,
//         shadowRadius: 8,
//         elevation: 4,
//     },
//     resultTitle: {
//         fontSize: 18,
//         fontWeight: '800',
//         color: '#059669',
//         marginBottom: 4,
//     },
//     resultSubtitle: {
//         fontSize: 13,
//         color: '#6b7280',
//         marginBottom: 16,
//     },
//     resultRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         paddingVertical: 8,
//         borderBottomWidth: 1,
//         borderBottomColor: '#f3f4f6',
//     },
//     resultLabel: {
//         fontSize: 13,
//         color: '#6b7280',
//         fontWeight: '500',
//     },
//     resultValue: {
//         fontSize: 13,
//         color: '#1a1a1a',
//         fontWeight: '600',
//         textTransform: 'capitalize',
//     },
//     divider: {
//         height: 1,
//         backgroundColor: '#e5e7eb',
//         marginVertical: 14,
//     },
//     rawTitle: {
//         fontSize: 12,
//         fontWeight: '700',
//         color: '#6b7280',
//         marginBottom: 8,
//         textTransform: 'uppercase',
//         letterSpacing: 0.5,
//     },
//     rawJson: {
//         fontSize: 11,
//         color: '#374151',
//         fontFamily: 'monospace',
//         backgroundColor: '#f9fafb',
//         padding: 12,
//         borderRadius: 8,
//         lineHeight: 18,
//     },
// });





















// import React, { useEffect, useState } from 'react';
// import {
//     Alert,
//     StyleSheet,
//     Text,
//     Container,
//     TouchableOpacity,
//     ActivityIndicator,
//     ScrollView,
// } from 'react-native';
// import { useStripe } from '@stripe/stripe-react-native';


// // const API_URL = '192.168.18.100:8000';
// const API_URL = '192.168.18.105:8000';

// interface PaymentSheetParams {
//     paymentIntent: string;
//     ephemeralKey: string;
//     customerId: string;
// }

// interface PaymentResult {
//     success: boolean;
//     message: string;
//     paymentIntentId?: string;
// }

// const StripePayment = () => {
//     const { initPaymentSheet, presentPaymentSheet } = useStripe();

//     const [loading, setLoading] = useState(false);
//     const [sheetReady, setSheetReady] = useState(false);
//     const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
//     const [initError, setInitError] = useState<string | null>(null);

//     const fetchPaymentSheetParams = async (): Promise<PaymentSheetParams> => {
//         console.log('📌 Fetching payment sheet params from backend...');

//         const response = await fetch(`http://${API_URL}/payment-sheet`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         });

//         if (!response.ok) {
//             const errorData = await response.json();
//             throw new Error(errorData.error || 'Failed to fetch payment params');
//         }

//         const data = await response.json();

//         console.log('✅ Received from backend:', data);
//         console.log('   paymentIntent:', data.paymentIntent?.slice(0, 20) + '...');
//         console.log('   ephemeralKey:', data.ephemeralKey?.slice(0, 20) + '...');
//         console.log('   customerId:', data.customerId);

//         return {
//             paymentIntent: data.paymentIntent,
//             ephemeralKey: data.ephemeralKey,
//             customerId: data.customerId,
//         };
//     };


//     const initializePaymentSheet = async () => {
//         setLoading(true);
//         setInitError(null);
//         setSheetReady(false);

//         try {
//             const {
//                 paymentIntent,
//                 ephemeralKey,
//                 customerId,
//             } = await fetchPaymentSheetParams();

//             console.log('Initializing payment sheet...');

//             const { error } = await initPaymentSheet({
//                 merchantDisplayName: 'Test Store',
//                 customerId: customerId,
//                 customerEphemeralKeySecret: ephemeralKey,
//                 paymentIntentClientSecret: paymentIntent,
//                 allowsDelayedPaymentMethods: false,
//                 defaultBillingDetails: {
//                     name: 'Test User',
//                     email: 'testuser@example.com',
//                 },
//                 appearance: {
//                     colors: {
//                         primary: '#6366f1',
//                     },
//                     shapes: {
//                         borderRadius: 12,
//                     },
//                 },
//             });

//             if (error) {
//                 console.error('❌ initPaymentSheet error:', error);
//                 setInitError(error.message);
//                 Alert.alert('Init Error', error.message);
//             } else {
//                 console.log('✅ Payment sheet initialized successfully!');
//                 setSheetReady(true);
//             }
//         } catch (err: any) {
//             console.error('❌ Fetch error:', err.message);
//             setInitError(err.message);
//             Alert.alert('Connection Error', `Cannot connect to server.\n\n${err.message}`);
//         } finally {
//             setLoading(false);
//         }
//     };


//     const openPaymentSheet = async () => {
//         if (!sheetReady) {
//             Alert.alert('Not Ready', 'Payment sheet is not initialized yet');
//             return;
//         }


//         const { error } = await presentPaymentSheet();

//         if (error) {
//             if (error.code === 'Canceled') {
//                 console.log('ℹ️ User cancelled payment');
//                 setPaymentResult({
//                     success: false,
//                     message: 'Payment cancelled by user',
//                 });
//             } else {
//                 console.error('❌ Payment error:', error.message);
//                 setPaymentResult({
//                     success: false,
//                     message: error.message,
//                 });
//                 Alert.alert(`Payment Failed ❌`, error.message);
//             }
//         } else {
//             console.log('🎉 Payment successful!');
//             setPaymentResult({
//                 success: true,
//                 message: 'Payment confirmed successfully!',
//             });
//         }
//     };


//     useEffect(() => {
//         initializePaymentSheet();
//     }, []);

//     return (
//         <ScrollView contentContainerStyle={styles.container}>

//             <Text style={styles.header}>Stripe Payment Sheet</Text>

//             <Container style={[
//                 styles.statusBadge,
//                 loading ? styles.statusLoading :
//                     sheetReady ? styles.statusReady :
//                         initError ? styles.statusError :
//                             styles.statusLoading
//             ]}>
//                 <Text style={styles.statusText}>
//                     {loading ? '⏳ Initializing...' :
//                         sheetReady ? 'Ready to Pay' :
//                             initError ? 'Init Failed' :
//                                 "Loading..."}
//                 </Text>
//             </Container>


//             <Container style={styles.amountCard}>
//                 <Text style={styles.amountLabel}>Amount to Pay</Text>
//                 <Text style={styles.amountValue}>$38.99</Text>
//                 <Text style={styles.amountCurrency}>USD</Text>
//             </Container>



//             {initError && (
//                 <Container style={styles.errorCard}>
//                     <Text style={styles.errorTitle}>Initialization Error</Text>
//                     <Text style={styles.errorMessage}>{initError}</Text>
//                     <TouchableOpacity
//                         style={styles.retryButton}
//                         onPress={initializePaymentSheet}
//                     >
//                         <Text style={styles.retryButtonText}>🔄 Retry</Text>
//                     </TouchableOpacity>
//                 </Container>
//             )}


//             {paymentResult && (
//                 <Container style={[
//                     styles.resultCard,
//                     paymentResult.success ? styles.resultSuccess : styles.resultFailed
//                 ]}>
//                     <Text style={styles.resultTitle}>
//                         {paymentResult.success ? '🎉 Payment Successful!' : 'Payment Failed'}
//                     </Text>
//                     <Text style={styles.resultMessage}>{paymentResult.message}</Text>
//                 </Container>
//             )}


//             <TouchableOpacity
//                 style={[
//                     styles.checkoutButton,
//                     (!sheetReady || loading) && styles.checkoutButtonDisabled,
//                 ]}
//                 onPress={openPaymentSheet}
//                 disabled={!sheetReady || loading}
//             >
//                 {loading ? (
//                     <Container style={styles.loadingRow}>
//                         <ActivityIndicator color="#fff" size="small" />
//                         <Text style={styles.checkoutButtonText}>  Initializing...</Text>
//                     </Container>
//                 ) : (
//                     <Text style={styles.checkoutButtonText}>
//                         {sheetReady ? 'Checkout $38.996 🚀' : 'Please Wait...'}
//                     </Text>
//                 )}
//             </TouchableOpacity>


//             {(paymentResult || initError) && (
//                 <TouchableOpacity
//                     style={styles.reinitButton}
//                     onPress={() => {
//                         setPaymentResult(null);
//                         initializePaymentSheet();
//                     }}
//                 >
//                     <Text style={styles.reinitButtonText}>Start New Payment</Text>
//                 </TouchableOpacity>
//             )}

//         </ScrollView>
//     );
// };

// export default StripePayment;

// const styles = StyleSheet.create({
//     container: {
//         padding: 20,
//         paddingBottom: 60,
//         backgroundColor: '#f9fafb',
//         flexGrow: 1,
//     },
//     header: {
//         fontSize: 24,
//         fontWeight: '800',
//         color: '#111827',
//         marginBottom: 12,
//         marginTop: 20,
//     },

//     statusBadge: {
//         alignSelf: 'flex-start',
//         paddingHorizontal: 14,
//         paddingVertical: 6,
//         borderRadius: 20,
//         marginBottom: 20,
//     },
//     statusLoading: { backgroundColor: '#f59e0b' },
//     statusReady: { backgroundColor: '#10b981' },
//     statusError: { backgroundColor: '#ef4444' },
//     statusText: {
//         color: '#fff',
//         fontSize: 13,
//         fontWeight: '700',
//     },

//     amountCard: {
//         backgroundColor: '#6366f1',
//         borderRadius: 16,
//         padding: 24,
//         alignItems: 'center',
//         marginBottom: 16,
//     },
//     amountLabel: {
//         color: '#c7d2fe',
//         fontSize: 13,
//         fontWeight: '600',
//         marginBottom: 6,
//     },
//     amountValue: {
//         color: '#fff',
//         fontSize: 42,
//         fontWeight: '900',
//     },
//     amountCurrency: {
//         color: '#c7d2fe',
//         fontSize: 14,
//         fontWeight: '600',
//         marginTop: 4,
//     },

//     testCard: {
//         backgroundColor: '#fffbeb',
//         borderRadius: 16,
//         padding: 16,
//         marginBottom: 16,
//         borderWidth: 1,
//         borderColor: '#fde68a',
//     },
//     testTitle: {
//         fontSize: 14,
//         fontWeight: '700',
//         color: '#78350f',
//         marginBottom: 12,
//     },
//     testRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         paddingVertical: 7,
//         borderBottomWidth: 1,
//         borderBottomColor: '#fde68a',
//     },
//     testLabel: {
//         fontSize: 12,
//         fontWeight: '700',
//         color: '#78350f',
//         width: 110,
//     },
//     testNumber: {
//         fontSize: 12,
//         color: '#92400e',
//         fontFamily: 'monospace',
//     },
//     testNote: {
//         marginTop: 10,
//         fontSize: 12,
//         color: '#92400e',
//         lineHeight: 20,
//     },

//     errorCard: {
//         backgroundColor: '#fef2f2',
//         borderRadius: 16,
//         padding: 16,
//         marginBottom: 16,
//         borderWidth: 1,
//         borderColor: '#fecaca',
//     },
//     errorTitle: {
//         fontSize: 14,
//         fontWeight: '700',
//         color: '#991b1b',
//         marginBottom: 6,
//     },
//     errorMessage: {
//         fontSize: 13,
//         color: '#b91c1c',
//         marginBottom: 12,
//     },
//     retryButton: {
//         backgroundColor: '#ef4444',
//         padding: 10,
//         borderRadius: 8,
//         alignItems: 'center',
//     },
//     retryButtonText: {
//         color: '#fff',
//         fontWeight: '700',
//         fontSize: 13,
//     },
//     resultCard: {
//         borderRadius: 16,
//         padding: 16,
//         marginBottom: 16,
//         borderWidth: 1,
//     },
//     resultSuccess: {
//         backgroundColor: '#f0fdf4',
//         borderColor: '#86efac',
//     },
//     resultFailed: {
//         backgroundColor: '#fef2f2',
//         borderColor: '#fecaca',
//     },
//     resultTitle: {
//         fontSize: 16,
//         fontWeight: '800',
//         color: '#111827',
//         marginBottom: 6,
//     },
//     resultMessage: {
//         fontSize: 13,
//         color: '#374151',
//     },

//     checkoutButton: {
//         backgroundColor: '#6366f1',
//         padding: 18,
//         borderRadius: 16,
//         alignItems: 'center',
//         marginBottom: 12,
//         shadowColor: '#6366f1',
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.35,
//         shadowRadius: 10,
//         elevation: 6,
//     },
//     checkoutButtonDisabled: {
//         backgroundColor: '#d1d5db',
//         shadowOpacity: 0,
//         elevation: 0,
//     },
//     checkoutButtonText: {
//         color: '#fff',
//         fontSize: 16,
//         fontWeight: '700',
//     },
//     loadingRow: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },

//     reinitButton: {
//         alignItems: 'center',
//         padding: 14,
//     },
//     reinitButtonText: {
//         color: '#6366f1',
//         fontSize: 14,
//         fontWeight: '700',
//     },
// });








// import React, { useEffect, useState } from "react";

// import {
//     PaymentElement,
//     useStripe,
//     useElements,
// } from "@stripe/react-stripe-js";
// import { Button } from "react-native";


// const API_URL = '192.168.18.100:8000';
// // const API_URL = '192.168.18.105:8000';

// export default function StripePayment() {
//     const stripe = useStripe();
//     const elements = useElements();

//     const [clientSecret, setClientSecret] = useState("");

//     useEffect(() => {
//         createIntent();
//     }, []);

//     const createIntent = async () => {
//         const response = await fetch(
//             `http://${API_URL}/create-payment-intent`,
//             {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//             }
//         );

//         const data = await response.json();
//         console.log(data);
//         setClientSecret(data.clientSecret);
//     }


//     const pay = async () => {
//         if (!stripe || !elements)
//             return;

//         const { error } = await stripe.confirmPayment({
//             elements,
//             confirmParams: {
//                 return_url: window.location.origin,
//             },
//             redirect: "if_required",
//         });

//         if (error) {
//             console.log(error.message);
//             return;
//         }

//         alert("Payment Successful");
//     }

//     if (!clientSecret)
//         return <>Loading...</>;

//     return (
//         <>
//             <PaymentElement />
//             <Button
//                 onPress={pay}
//                 title="Pay"
//             >
//                 Pay
//             </Button>
//         </>
//     );

// }









// import React, { useEffect, useState } from 'react';
// import {
//     PaymentElement,
//     useStripe,
//     useElements,
// } from '@stripe/react-stripe-js';
// import { Container, Text, ActivityIndicator, StyleSheet } from 'react-native';

// const API_URL = 'http://192.168.18.100:8000'; // Change to your deployed backend for production

// export default function CheckoutScreen() {
//     const stripe = useStripe();
//     const elements = useElements();

//     const [clientSecret, setClientSecret] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [message, setMessage] = useState<string | null>(null);

//     useEffect(() => {
//         createIntent();
//     }, []);

//     const createIntent = async () => {
//         try {
//             const response = await fetch(`${API_URL}/create-payment-intent`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ amount: 3899, email: 'user@example.com' }),
//             });
//             const data = await response.json();
//             setClientSecret(data.clientSecret);
//             console.log("create-payment-intent", data)
//         } catch (err) {
//             setMessage('Failed to initialize payment');
//         }
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!stripe || !elements) return;

//         setLoading(true);
//         setMessage(null);

//         const { error, paymentIntent } = await stripe.confirmPayment({
//             elements,
//             confirmParams: {
//                 return_url: window.location.href,
//             },
//             redirect: 'if_required',
//         });

//         if (error) {
//             setMessage(error.message || 'Payment failed');
//         } else if (paymentIntent && paymentIntent.status === 'succeeded') {
//             setMessage('✅ Payment successful!');
//             // Call your backend to verify and activate membership
//             await verifyPayment(paymentIntent.id);
//         }

//         setLoading(false);
//     };

//     const verifyPayment = async (paymentIntentId: string) => {
//         try {
//             const res = await fetch(`${API_URL}/verify-payment`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ paymentIntentId }),
//             });
//             const data = await res.json();
//             console.log('Verification:', data);
//         } catch (err) {
//             console.error('Verification failed:', err);
//         }
//     };

//     if (!clientSecret) {
//         return (
//             <Container style={styles.center}>
//                 <ActivityIndicator size="large" color="#6366f1" />
//                 <Text style={styles.loadingText}>Initializing checkout...</Text>
//             </Container>
//         );
//     }

//     return (
//         <Container style={styles.container}>
//             <Text style={styles.header}>Secure Checkout</Text>
//             <Text style={styles.amount}>$38.99 USD</Text>

//             {/* Web form - PaymentElement renders real DOM elements */}
//             <form onSubmit={handleSubmit} style={{ width: '100%' }}>
//                 <div style={styles.paymentElementWrapper}>
//                     <PaymentElement />
//                 </div>

//                 <button
//                     type="submit"
//                     disabled={!stripe || loading}
//                     style={{
//                         ...styles.payButton,
//                         opacity: !stripe || loading ? 0.6 : 1,
//                     }}
//                 >
//                     {loading ? 'Processing...' : 'Pay Now'}
//                 </button>
//             </form>

//             {message && (
//                 <Text style={[
//                     styles.message,
//                     message.includes('successful') ? styles.success : styles.error
//                 ]}>
//                     {message}
//                 </Text>
//             )}
//         </Container>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 20,
//         backgroundColor: '#f9fafb',
//         maxWidth: 500,
//         alignSelf: 'center',
//         width: '100%',
//     },
//     center: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     header: {
//         fontSize: 24,
//         fontWeight: '800',
//         marginBottom: 8,
//         color: '#111827',
//     },
//     amount: {
//         fontSize: 32,
//         fontWeight: '900',
//         color: '#6366f1',
//         marginBottom: 24,
//     },
//     loadingText: {
//         marginTop: 12,
//         color: '#6b7280',
//     },
//     paymentElementWrapper: {
//         marginBottom: 20,
//         padding: 16,
//         backgroundColor: '#fff',
//         borderRadius: 12,
//         borderWidth: 1,
//         borderColor: '#e5e7eb',
//     },
//     payButton: {
//         width: '100%',
//         padding: 16,
//         backgroundColor: '#6366f1',
//         color: '#fff',
//         borderRadius: 12,
//         // border: 'none',
//         fontSize: 16,
//         fontWeight: '700',
//         cursor: 'pointer',
//     },
//     message: {
//         marginTop: 16,
//         textAlign: 'center',
//         fontSize: 14,
//         fontWeight: '600',
//     },
//     success: { color: '#10b981' },
//     error: { color: '#ef4444' },
// });












// import React, { useEffect, useState, useCallback } from 'react';
// import { Container, Text, ActivityIndicator, StyleSheet, Platform } from 'react-native';
// import { loadStripe } from '@stripe/stripe-js';
// import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

// const PUBLISHABLE_KEY =
//     'pk_test_51TjXxmE8dmQNwkVN2fBlVpIKodG2GI2PiL6ryxLQnzjcJ5pIGN0rl2d68JVzpb1V5mXsZ0vPUiqkOcFKSrXrBDMM00iaKKPGrF';

// const API_URL = 'http://192.168.18.100:8000';

// const stripePromise = loadStripe(PUBLISHABLE_KEY);


// interface PaymentIntentResponse {
//     clientSecret: string;
//     paymentIntentId: string;
//     customerId: string;
//     amount: number;
//     currency: string;
// }


// function CheckoutForm({
//     amount,
//     paymentIntentId,
//     onSuccess,
//     onError,
// }: {
//     amount: number;
//     paymentIntentId: string;
//     onSuccess: (id: string) => void;
//     onError: (msg: string) => void;
// }) {
//     const stripe = useStripe();
//     const elements = useElements();
//     const [loading, setLoading] = useState(false);

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();

//         if (!stripe || !elements) return;

//         setLoading(true);

//         try {
//             const { error, paymentIntent } = await stripe.confirmPayment({
//                 elements,
//                 confirmParams: {
//                     return_url: typeof window !== 'undefined' ? window.location.href : '',
//                 },
//                 redirect: 'if_required', // ✅ Don't redirect for card payments
//             });

//             if (error) {
//                 onError(error.message || 'Payment failed');
//             } else if (paymentIntent?.status === 'succeeded') {
//                 onSuccess(paymentIntent.id);
//             } else {
//                 onError(`Unexpected status: ${paymentIntent?.status}`);
//             }
//         } catch (err: any) {
//             onError(err.message || 'Something went wrong');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         // Must use HTML form on web for PaymentElement
//         <form onSubmit={handleSubmit}>

//             <div style={{
//                 padding: '16px',
//                 backgroundColor: '#fff',
//                 borderRadius: '12px',
//                 border: '1px solid #e5e7eb',
//                 marginBottom: '20px',
//             }}>
//                 <PaymentElement
//                     options={{
//                         layout: 'tabs', // 'tabs' | 'accordion' | 'auto'
//                         defaultValues: {
//                             billingDetails: {
//                                 name: 'Test User',
//                                 email: 'test@example.com',
//                             },
//                         },
//                     }}
//                 />
//             </div>

//             <button
//                 type="submit"
//                 disabled={!stripe || !elements || loading}
//                 style={{
//                     width: '100%',
//                     padding: '16px',
//                     backgroundColor: !stripe || loading ? '#a5b4fc' : '#6366f1',
//                     color: '#fff',
//                     border: 'none',
//                     borderRadius: '12px',
//                     fontSize: '16px',
//                     fontWeight: '700',
//                     cursor: !stripe || loading ? 'not-allowed' : 'pointer',
//                     transition: 'all 0.2s',
//                 }}
//             >
//                 {loading ? '⏳ Processing...' : `Pay $${(amount / 100).toFixed(2)}`}
//             </button>
//         </form>
//     );
// }




// function SuccessScreen({
//     paymentIntentId,
//     amount,
//     onReset,
// }: {
//     paymentIntentId: string;
//     amount: number;
//     onReset: () => void;
// }) {
//     return (
//         <div style={{
//             backgroundColor: '#f0fdf4',
//             border: '2px solid #86efac',
//             borderRadius: '16px',
//             padding: '32px',
//             textAlign: 'center',
//         }}>
//             <div style={{ fontSize: '56px', marginBottom: '12px' }}>🎉</div>
//             <h2 style={{ color: '#065f46', marginBottom: '8px' }}>Payment Successful!</h2>
//             <p style={{
//                 fontSize: '32px',
//                 fontWeight: '900',
//                 color: '#10b981',
//                 margin: '0 0 16px',
//             }}>
//                 ${(amount / 100).toFixed(2)} USD
//             </p>

//             <div style={{
//                 backgroundColor: '#fff',
//                 borderRadius: '10px',
//                 padding: '12px 16px',
//                 marginBottom: '16px',
//                 textAlign: 'left',
//             }}>
//                 <p style={{ fontSize: '11px', color: '#6b7280', margin: '0 0 4px', textTransform: 'uppercase', fontWeight: '700' }}>
//                     Payment Intent ID
//                 </p>
//                 <p style={{ fontSize: '12px', fontFamily: 'monospace', color: '#111827', margin: 0, wordBreak: 'break-all' }}>
//                     {paymentIntentId}
//                 </p>
//             </div>

//             <p style={{ fontSize: '13px', color: '#059669', fontWeight: '600', marginBottom: '20px' }}>
//                 ✅ Backend verified • Order activated
//             </p>

//             <button
//                 onClick={onReset}
//                 style={{
//                     padding: '12px 32px',
//                     backgroundColor: '#6366f1',
//                     color: '#fff',
//                     border: 'none',
//                     borderRadius: '50px',
//                     fontSize: '14px',
//                     fontWeight: '700',
//                     cursor: 'pointer',
//                 }}
//             >
//                 Make Another Payment
//             </button>
//         </div>
//     );
// }

// export default function StripePayment() {
//     const [clientSecret, setClientSecret] = useState<string | null>(null);
//     const [paymentIntentId, setPaymentIntentId] = useState<string>('');
//     const [amount, setAmount] = useState<number>(3899);
//     const [initLoading, setInitLoading] = useState(true);
//     const [initError, setInitError] = useState<string | null>(null);
//     const [paymentSuccess, setPaymentSuccess] = useState(false);
//     const [paymentError, setPaymentError] = useState<string | null>(null);
//     const [verifying, setVerifying] = useState(false);

//     // ── Create intent ────────────────────────────
//     const createIntent = useCallback(async () => {
//         setInitLoading(true);
//         setInitError(null);
//         setClientSecret(null);
//         setPaymentSuccess(false);
//         setPaymentError(null);

//         try {
//             console.log('📌 Creating payment intent...');

//             const response = await fetch(`${API_URL}/create-payment-intent`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     amount: 3899,
//                     email: 'user@example.com',
//                     name: 'Test User',
//                 }),
//             });

//             if (!response.ok) {
//                 const err = await response.json();
//                 throw new Error(err.error || 'Server error');
//             }

//             const data: PaymentIntentResponse = await response.json();
//             console.log('✅ Payment intent created:', data.paymentIntentId);

//             setClientSecret(data.clientSecret);
//             setPaymentIntentId(data.paymentIntentId);
//             setAmount(data.amount);

//         } catch (err: any) {
//             console.error('❌ Create intent failed:', err.message);
//             setInitError(err.message);
//         } finally {
//             setInitLoading(false);
//         }
//     }, []);

//     useEffect(() => {
//         createIntent();
//     }, [createIntent]);


//     const verifyPayment = async (intentId: string) => {
//         setVerifying(true);
//         try {
//             const res = await fetch(`${API_URL}/verify-payment`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ paymentIntentId: intentId }),
//             });
//             const data = await res.json();
//             console.log('✅ Backend verification:', data);
//         } catch (err) {
//             console.error('⚠️ Verification failed:', err);
//         } finally {
//             setVerifying(false);
//         }
//     };

//      const handleSuccess = async (intentId: string) => {
//         console.log('🎉 Payment succeeded:', intentId);
//         setPaymentSuccess(true);
//         await verifyPayment(intentId);
//     };

//     const handleError = (msg: string) => {
//         console.error('❌ Payment error:', msg);
//         setPaymentError(msg);
//     };

//     const handleReset = () => {
//         createIntent();
//     };

//      return (
//         <div style={{
//             maxWidth: '480px',
//             margin: '0 auto',
//             padding: '24px 20px 60px',
//             minHeight: '100vh',
//             backgroundColor: '#f9fafb',
//         }}>
 
//             <h1 style={{
//                 fontSize: '26px',
//                 fontWeight: '900',
//                 color: '#111827',
//                 marginBottom: '4px',
//             }}>
//                 💳 Secure Checkout
//             </h1>

            
//             <div style={{
//                 display: 'inline-block',
//                 backgroundColor: '#fef3c7',
//                 border: '1px solid #fde68a',
//                 borderRadius: '20px',
//                 padding: '4px 12px',
//                 fontSize: '12px',
//                 fontWeight: '700',
//                 color: '#92400e',
//                 marginBottom: '20px',
//             }}>
//                 🧪 Test Mode Active
//             </div>

            
//             <div style={{
//                 backgroundColor: '#6366f1',
//                 borderRadius: '16px',
//                 padding: '24px',
//                 textAlign: 'center',
//                 marginBottom: '20px',
//             }}>
//                 <p style={{ color: '#c7d2fe', fontSize: '12px', fontWeight: '600', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
//                     Order Total
//                 </p>
//                 <p style={{ color: '#fff', fontSize: '42px', fontWeight: '900', margin: 0 }}>
//                     ${(amount / 100).toFixed(2)}
//                 </p>
//                 <p style={{ color: '#a5b4fc', fontSize: '13px', margin: '4px 0 0' }}>USD</p>
//             </div>
 
//             {paymentSuccess && (
//                 <SuccessScreen
//                     paymentIntentId={paymentIntentId}
//                     amount={amount}
//                     onReset={handleReset}
//                 />
//             )}

             
//             {paymentError && !paymentSuccess && (
//                 <div style={{
//                     backgroundColor: '#fef2f2',
//                     border: '1px solid #fecaca',
//                     borderRadius: '12px',
//                     padding: '14px 16px',
//                     marginBottom: '16px',
//                 }}>
//                     <p style={{ color: '#991b1b', fontWeight: '700', margin: '0 0 4px' }}>❌ Payment Failed</p>
//                     <p style={{ color: '#b91c1c', fontSize: '13px', margin: 0 }}>{paymentError}</p>
//                     <button
//                         onClick={handleReset}
//                         style={{
//                             marginTop: '10px',
//                             padding: '8px 16px',
//                             backgroundColor: '#ef4444',
//                             color: '#fff',
//                             border: 'none',
//                             borderRadius: '8px',
//                             cursor: 'pointer',
//                             fontWeight: '700',
//                             fontSize: '13px',
//                         }}
//                     >
//                         🔄 Try Again
//                     </button>
//                 </div>
//             )}

            
//             {initLoading && (
//                 <div style={{ textAlign: 'center', padding: '40px 0' }}>
//                     <div style={{ fontSize: '24px', marginBottom: '12px' }}>⏳</div>
//                     <p style={{ color: '#6b7280', fontWeight: '600' }}>Initializing checkout...</p>
//                 </div>
//             )}

//              {initError && !initLoading && (
//                 <div style={{
//                     backgroundColor: '#fef2f2',
//                     border: '1px solid #fecaca',
//                     borderRadius: '12px',
//                     padding: '16px',
//                     marginBottom: '16px',
//                 }}>
//                     <p style={{ color: '#991b1b', fontWeight: '700', margin: '0 0 8px' }}>
//                         ❌ Cannot Connect to Backend
//                     </p>
//                     <p style={{ color: '#b91c1c', fontSize: '13px', margin: '0 0 12px' }}>{initError}</p>
//                     <p style={{ color: '#6b7280', fontSize: '12px', margin: '0 0 12px' }}>
//                         Make sure: <code>node server.js</code> is running on port 8000
//                     </p>
//                     <button
//                         onClick={createIntent}
//                         style={{
//                             padding: '10px 20px',
//                             backgroundColor: '#6366f1',
//                             color: '#fff',
//                             border: 'none',
//                             borderRadius: '8px',
//                             cursor: 'pointer',
//                             fontWeight: '700',
//                         }}
//                     >
//                         🔄 Retry
//                     </button>
//                 </div>
//             )}

//             {/* ✅ KEY FIX: Elements with clientSecret wraps CheckoutForm */}
//             {clientSecret && !paymentSuccess && (
//                 <Elements
//                     stripe={stripePromise}
//                     options={{
//                         clientSecret,          // ✅ Pass clientSecret HERE not in App.tsx
//                         appearance: {
//                             theme: 'stripe',     // 'stripe' | 'night' | 'flat'
//                             variables: {
//                                 colorPrimary: '#6366f1',
//                                 colorBackground: '#ffffff',
//                                 colorText: '#111827',
//                                 colorDanger: '#ef4444',
//                                 fontFamily: 'system-ui, sans-serif',
//                                 borderRadius: '12px',
//                             },
//                         },
//                     }}
//                 >
//                     <CheckoutForm
//                         amount={amount}
//                         paymentIntentId={paymentIntentId}
//                         onSuccess={handleSuccess}
//                         onError={handleError}
//                     />
//                 </Elements>
//             )}

//             {/* Verifying */}
//             {verifying && (
//                 <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '13px', marginTop: '12px' }}>
//                     ⏳ Verifying with server...
//                 </p>
//             )}

//             {/* Security Footer */}
//             <div style={{
//                 display: 'flex',
//                 justifyContent: 'center',
//                 gap: '20px',
//                 marginTop: '24px',
//             }}>
//                 {['🔒 256-bit SSL', '✅ PCI DSS', '⚡ Stripe'].map((item) => (
//                     <span key={item} style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '600' }}>
//                         {item}
//                     </span>
//                 ))}
//             </div>

//         </div>
//     );
// }






















// // StripePayment.tsx
// import React, { useEffect, useState, useCallback } from 'react';
// import {
//   Container,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   ActivityIndicator,
//   StyleSheet,
//   LayoutAnimation,
//   Platform,
// } from 'react-native';
// import { loadStripe } from '@stripe/stripe-js';
// import {
//   Elements,
//   PaymentElement,
//   useStripe,
//   useElements,
// } from '@stripe/react-stripe-js';

// // ─── Config ───────────────────────────────────────────────
// const PUBLISHABLE_KEY =
//   'pk_test_51TjXxmE8dmQNwkVN2fBlVpIKodG2GI2PiL6ryxLQnzjcJ5pIGN0rl2d68JVzpb1V5mXsZ0vPUiqkOcFKSrXrBDMM00iaKKPGrF';

// const API_URL = 'http://192.168.18.100:8000';

// // ✅ Outside component
// const stripePromise = loadStripe(PUBLISHABLE_KEY);

// // ─── Types ────────────────────────────────────────────────
// interface PaymentIntentResponse {
//   clientSecret: string;
//   paymentIntentId: string;
//   customerId: string;
//   amount: number;
//   currency: string;
// }

// // ═══════════════════════════════════════════════════════════
// //  CheckoutForm - MUST be HTML for web PaymentElement
// // ═══════════════════════════════════════════════════════════
// function CheckoutForm({
//   amount,
//   paymentIntentId,
//   onSuccess,
//   onError,
// }: {
//   amount: number;
//   paymentIntentId: string;
//   onSuccess: (id: string) => void;
//   onError: (msg: string) => void;
// }) {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!stripe || !elements) return;

//     setLoading(true);

//     try {
//       const { error, paymentIntent } = await stripe.confirmPayment({
//         elements,
//         confirmParams: {
//           return_url: typeof window !== 'undefined' ? window.location.href : '',
//         },
//         redirect: 'if_required',
//       });

//       if (error) {
//         onError(error.message || 'Payment failed');
//       } else if (paymentIntent?.status === 'succeeded') {
//         onSuccess(paymentIntent.id);
//       } else {
//         onError(`Unexpected status: ${paymentIntent?.status}`);
//       }
//     } catch (err: any) {
//       onError(err.message || 'Something went wrong');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ❌ This part MUST remain HTML - PaymentElement needs <form>
//   return (
//     <form onSubmit={handleSubmit}>
//       <div
//         style={{
//           padding: '16px',
//           backgroundColor: '#fff',
//           borderRadius: '12px',
//           border: '1px solid #e5e7eb',
//           marginBottom: '16px',
//         }}
//       >
//         <PaymentElement
//           options={{
//             layout: 'tabs',
//             defaultValues: {
//               billingDetails: {
//                 name: 'Test User',
//                 email: 'test@example.com',
//               },
//             },
//           }}
//         />
//       </div>

//       <button
//         type="submit"
//         disabled={!stripe || !elements || loading}
//         style={{
//           width: '100%',
//           padding: '16px',
//           backgroundColor: !stripe || loading ? '#a5b4fc' : '#6366f1',
//           color: '#fff',
//           border: 'none',
//           borderRadius: '14px',
//           fontSize: '16px',
//           fontWeight: '700',
//           cursor: !stripe || loading ? 'not-allowed' : 'pointer',
//           transition: 'background-color 0.2s',
//           letterSpacing: '0.3px',
//         }}
//       >
//         {loading ? '⏳ Processing...' : `Pay $${(amount / 100).toFixed(2)}`}
//       </button>
//     </form>
//   );
// }

// // ═══════════════════════════════════════════════════════════
// //  TestCards - React Native ✅
// // ═══════════════════════════════════════════════════════════
// function TestCards() {
//   const [open, setOpen] = useState(false);

//   const toggle = () => {
//     LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
//     setOpen(!open);
//   };

//   const cards = [
//     { label: '✅ Success', number: '4242 4242 4242 4242' },
//     { label: '❌ Declined', number: '4000 0000 0000 0002' },
//     { label: '🔐 3D Secure', number: '4000 0025 0000 3155' },
//     { label: '💸 Insufficient', number: '4000 0000 0000 9995' },
//     { label: '⌛ Expired', number: '4000 0000 0000 0069' },
//   ];

//   return (
//     <Container style={styles.testCardsContainer}>
//       <TouchableOpacity style={styles.testCardsToggle} onPress={toggle}>
//         <Text style={styles.testCardsTitle}>🧪 Test Card Numbers</Text>
//         <Text style={styles.testCardsChevron}>{open ? '▲' : '▼'}</Text>
//       </TouchableOpacity>

//       {open && (
//         <Container style={styles.testCardsContent}>
//           {cards.map((card) => (
//             <Container key={card.number} style={styles.testCardRow}>
//               <Text style={styles.testCardLabel}>{card.label}</Text>
//               <Text style={styles.testCardNumber}>{card.number}</Text>
//             </Container>
//           ))}
//           <Container style={styles.testCardNote}>
//             <Text style={styles.testCardNoteText}>
//               📅 Expiry: 12/34{'  '}🔑 CVC: 123{'  '}📮 ZIP: 12345
//             </Text>
//           </Container>
//         </Container>
//       )}
//     </Container>
//   );
// }

// // ═══════════════════════════════════════════════════════════
// //  SuccessScreen - React Native ✅
// // ═══════════════════════════════════════════════════════════
// function SuccessScreen({
//   paymentIntentId,
//   amount,
//   onReset,
// }: {
//   paymentIntentId: string;
//   amount: number;
//   onReset: () => void;
// }) {
//   return (
//     <Container style={styles.successCard}>
//       <Text style={styles.successIcon}>🎉</Text>
//       <Text style={styles.successTitle}>Payment Successful!</Text>
//       <Text style={styles.successAmount}>
//         ${(amount / 100).toFixed(2)} USD
//       </Text>

//       <Container style={styles.successDetails}>
//         <Text style={styles.successDetailLabel}>Payment Intent ID</Text>
//         <Text style={styles.successDetailValue}>{paymentIntentId}</Text>
//       </Container>

//       <Text style={styles.successNote}>✅ Backend verified • Order activated</Text>

//       <TouchableOpacity style={styles.successResetBtn} onPress={onReset}>
//         <Text style={styles.successResetBtnText}>Make Another Payment</Text>
//       </TouchableOpacity>
//     </Container>
//   );
// }

// // ═══════════════════════════════════════════════════════════
// //  ErrorCard - React Native ✅
// // ═══════════════════════════════════════════════════════════
// function ErrorCard({
//   title,
//   message,
//   onRetry,
// }: {
//   title: string;
//   message: string;
//   onRetry: () => void;
// }) {
//   return (
//     <Container style={styles.errorCard}>
//       <Text style={styles.errorTitle}>{title}</Text>
//       <Text style={styles.errorMessage}>{message}</Text>
//       <TouchableOpacity style={styles.errorRetryBtn} onPress={onRetry}>
//         <Text style={styles.errorRetryBtnText}>🔄 Try Again</Text>
//       </TouchableOpacity>
//     </Container>
//   );
// }

// // ═══════════════════════════════════════════════════════════
// //  Main Component - React Native ScrollView ✅
// // ═══════════════════════════════════════════════════════════
// export default function StripePayment() {
//   const [clientSecret, setClientSecret] = useState<string | null>(null);
//   const [paymentIntentId, setPaymentIntentId] = useState<string>('');
//   const [amount, setAmount] = useState<number>(3899);
//   const [initLoading, setInitLoading] = useState(true);
//   const [initError, setInitError] = useState<string | null>(null);
//   const [paymentSuccess, setPaymentSuccess] = useState(false);
//   const [paymentError, setPaymentError] = useState<string | null>(null);
//   const [verifying, setVerifying] = useState(false);

//   // ── Create intent ────────────────────────────
//   const createIntent = useCallback(async () => {
//     setInitLoading(true);
//     setInitError(null);
//     setClientSecret(null);
//     setPaymentSuccess(false);
//     setPaymentError(null);

//     try {
//       const response = await fetch(`${API_URL}/create-payment-intent`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           amount: 3899,
//           email: 'user@example.com',
//           name: 'Test User',
//         }),
//       });

//       if (!response.ok) {
//         const err = await response.json();
//         throw new Error(err.error || 'Server error');
//       }

//       const data: PaymentIntentResponse = await response.json();
//       console.log('✅ Payment intent created:', data.paymentIntentId);

//       setClientSecret(data.clientSecret);
//       setPaymentIntentId(data.paymentIntentId);
//       setAmount(data.amount);
//     } catch (err: any) {
//       console.error('❌ Create intent failed:', err.message);
//       setInitError(err.message);
//     } finally {
//       setInitLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     createIntent();
//   }, [createIntent]);

//   // ── Verify ───────────────────────────────────
//   const verifyPayment = async (intentId: string) => {
//     setVerifying(true);
//     try {
//       const res = await fetch(`${API_URL}/verify-payment`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ paymentIntentId: intentId }),
//       });
//       const data = await res.json();
//       console.log('✅ Backend verification:', data);
//     } catch (err) {
//       console.error('⚠️ Verification failed:', err);
//     } finally {
//       setVerifying(false);
//     }
//   };

//   const handleSuccess = async (intentId: string) => {
//     setPaymentSuccess(true);
//     await verifyPayment(intentId);
//   };

//   const handleError = (msg: string) => {
//     setPaymentError(msg);
//   };

//   const handleReset = () => {
//     createIntent();
//   };

//   // ═══════════════════════════════════════════════
//   //  RENDER - ScrollView wrapping everything
//   // ═══════════════════════════════════════════════
//   return (
//     <ScrollView
//       style={styles.scrollView}
//       contentContainerStyle={styles.scrollContent}
//       showsVerticalScrollIndicator={false}
//       keyboardShouldPersistTaps="handled"
//     >
//       {/* ── Header ──────────────────────────────── */}
//       <Text style={styles.header}>💳 Secure Checkout</Text>

//       {/* ── Test Mode Badge ─────────────────────── */}
//       <Container style={styles.testBadge}>
//         <Text style={styles.testBadgeText}>🧪 Test Mode Active</Text>
//       </Container>

//       {/* ── Amount Card ─────────────────────────── */}
//       <Container style={styles.amountCard}>
//         <Text style={styles.amountLabel}>ORDER TOTAL</Text>
//         <Text style={styles.amountValue}>${(amount / 100).toFixed(2)}</Text>
//         <Text style={styles.amountCurrency}>USD</Text>
//       </Container>

//       {/* ── Test Cards ──────────────────────────── */}
//       <TestCards />

//       {/* ── Success Screen ──────────────────────── */}
//       {paymentSuccess && (
//         <SuccessScreen
//           paymentIntentId={paymentIntentId}
//           amount={amount}
//           onReset={handleReset}
//         />
//       )}

//       {/* ── Payment Error ───────────────────────── */}
//       {paymentError && !paymentSuccess && (
//         <ErrorCard
//           title="❌ Payment Failed"
//           message={paymentError}
//           onRetry={handleReset}
//         />
//       )}

//       {/* ── Loading ─────────────────────────────── */}
//       {initLoading && (
//         <Container style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#6366f1" />
//           <Text style={styles.loadingText}>Initializing checkout...</Text>
//         </Container>
//       )}

//       {/* ── Init Error ──────────────────────────── */}
//       {initError && !initLoading && (
//         <ErrorCard
//           title="❌ Cannot Connect to Backend"
//           message={`${initError}\n\nMake sure: node server.js is running on port 8000`}
//           onRetry={createIntent}
//         />
//       )}

//       {/* ════════════════════════════════════════════
//           Payment Form - HTML (Required for Stripe Web)
//           This is the ONLY part that uses HTML elements
//           ════════════════════════════════════════════ */}
//       {clientSecret && !paymentSuccess && (
//         <Container style={styles.paymentFormWrapper}>
//           <Text style={styles.paymentFormTitle}>Payment Details</Text>

//           {/* ❌ <Elements> + <PaymentElement> = Must be HTML */}
//           <Elements
//             stripe={stripePromise}
//             options={{
//               clientSecret,
//               appearance: {
//                 theme: 'stripe',
//                 variables: {
//                   colorPrimary: '#6366f1',
//                   colorBackground: '#ffffff',
//                   colorText: '#111827',
//                   colorDanger: '#ef4444',
//                   fontFamily: 'system-ui, sans-serif',
//                   borderRadius: '12px',
//                   spacingUnit: '4px',
//                 },
//                 rules: {
//                   '.Input': {
//                     padding: '12px',
//                     border: '1.5px solid #e5e7eb',
//                   },
//                   '.Input:focus': {
//                     border: '1.5px solid #6366f1',
//                     boxShadow: '0 0 0 3px rgba(99,102,241,0.15)',
//                   },
//                   '.Label': {
//                     fontWeight: '600',
//                     fontSize: '13px',
//                     marginBottom: '6px',
//                   },
//                   '.Tab': {
//                     borderRadius: '10px',
//                     border: '1.5px solid #e5e7eb',
//                   },
//                   '.Tab--selected': {
//                     borderColor: '#6366f1',
//                     backgroundColor: '#eef2ff',
//                   },
//                 },
//               },
//             }}
//           >
//             <CheckoutForm
//               amount={amount}
//               paymentIntentId={paymentIntentId}
//               onSuccess={handleSuccess}
//               onError={handleError}
//             />
//           </Elements>
//         </Container>
//       )}

//       {/* ── Verifying ───────────────────────────── */}
//       {verifying && (
//         <Container style={styles.verifyingContainer}>
//           <ActivityIndicator size="small" color="#6366f1" />
//           <Text style={styles.verifyingText}>Verifying with server...</Text>
//         </Container>
//       )}

//       {/* ── Security Footer ─────────────────────── */}
//       <Container style={styles.securityFooter}>
//         <Container style={styles.securityItem}>
//           <Text style={styles.securityIcon}>🔒</Text>
//           <Text style={styles.securityLabel}>256-bit SSL</Text>
//         </Container>
//         <Container style={styles.securityItem}>
//           <Text style={styles.securityIcon}>✅</Text>
//           <Text style={styles.securityLabel}>PCI DSS</Text>
//         </Container>
//         <Container style={styles.securityItem}>
//           <Text style={styles.securityIcon}>⚡</Text>
//           <Text style={styles.securityLabel}>Stripe</Text>
//         </Container>
//       </Container>

//       {/* ── Powered By ──────────────────────────── */}
//       <Text style={styles.poweredBy}>Powered by Stripe 💜</Text>
//     </ScrollView>
//   );
// }

// // ═══════════════════════════════════════════════════════════
// //  Styles (React Native StyleSheet)
// // ═══════════════════════════════════════════════════════════
// const styles = StyleSheet.create({
//   // ── ScrollView ────────────────────────────────
//   scrollView: {
//     flex: 1,
//     backgroundColor: '#f9fafb',
//   },
//   scrollContent: {
//     padding: 20,
//     paddingBottom: 80,
//     maxWidth: 480,
//     alignSelf: 'center',
//     width: '100%',
//   },

//   // ── Header ────────────────────────────────────
//   header: {
//     fontSize: 26,
//     fontWeight: '900',
//     color: '#111827',
//     marginBottom: 8,
//     marginTop: 10,
//   },

//   // ── Test Badge ────────────────────────────────
//   testBadge: {
//     alignSelf: 'flex-start',
//     backgroundColor: '#fef3c7',
//     borderWidth: 1,
//     borderColor: '#fde68a',
//     borderRadius: 20,
//     paddingHorizontal: 12,
//     paddingVertical: 4,
//     marginBottom: 20,
//   },
//   testBadgeText: {
//     fontSize: 12,
//     fontWeight: '700',
//     color: '#92400e',
//   },

//   // ── Amount Card ───────────────────────────────
//   amountCard: {
//     backgroundColor: '#6366f1',
//     borderRadius: 20,
//     padding: 28,
//     alignItems: 'center',
//     marginBottom: 16,
//     shadowColor: '#6366f1',
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.35,
//     shadowRadius: 16,
//     elevation: 8,
//   },
//   amountLabel: {
//     color: '#c7d2fe',
//     fontSize: 11,
//     fontWeight: '700',
//     letterSpacing: 1,
//     marginBottom: 6,
//   },
//   amountValue: {
//     color: '#ffffff',
//     fontSize: 48,
//     fontWeight: '900',
//     letterSpacing: -1,
//   },
//   amountCurrency: {
//     color: '#a5b4fc',
//     fontSize: 13,
//     fontWeight: '600',
//     marginTop: 4,
//   },

//   // ── Test Cards ────────────────────────────────
//   testCardsContainer: {
//     backgroundColor: '#fffbeb',
//     borderRadius: 14,
//     borderWidth: 1,
//     borderColor: '#fde68a',
//     marginBottom: 16,
//     overflow: 'hidden',
//   },
//   testCardsToggle: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 14,
//   },
//   testCardsTitle: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: '#78350f',
//   },
//   testCardsChevron: {
//     fontSize: 12,
//     color: '#78350f',
//   },
//   testCardsContent: {
//     paddingHorizontal: 14,
//     paddingBottom: 14,
//   },
//   testCardRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 8,
//     borderTopWidth: 1,
//     borderTopColor: '#fde68a',
//   },
//   testCardLabel: {
//     fontSize: 13,
//     fontWeight: '700',
//     color: '#78350f',
//     width: 120,
//   },
//   testCardNumber: {
//     fontSize: 12,
//     color: '#92400e',
//     fontFamily: Platform.OS === 'web' ? 'monospace' : undefined,
//     letterSpacing: 0.5,
//   },
//   testCardNote: {
//     marginTop: 10,
//     backgroundColor: '#fef3c7',
//     borderRadius: 8,
//     padding: 10,
//   },
//   testCardNoteText: {
//     fontSize: 11,
//     color: '#92400e',
//     textAlign: 'center',
//     fontWeight: '600',
//   },

//   // ── Success ───────────────────────────────────
//   successCard: {
//     backgroundColor: '#f0fdf4',
//     borderRadius: 20,
//     borderWidth: 2,
//     borderColor: '#86efac',
//     padding: 28,
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   successIcon: {
//     fontSize: 56,
//     marginBottom: 12,
//   },
//   successTitle: {
//     fontSize: 22,
//     fontWeight: '800',
//     color: '#065f46',
//     marginBottom: 8,
//   },
//   successAmount: {
//     fontSize: 32,
//     fontWeight: '900',
//     color: '#10b981',
//     marginBottom: 16,
//   },
//   successDetails: {
//     backgroundColor: '#ffffff',
//     borderRadius: 12,
//     padding: 14,
//     width: '100%',
//     marginBottom: 14,
//   },
//   successDetailLabel: {
//     fontSize: 10,
//     fontWeight: '700',
//     color: '#6b7280',
//     textTransform: 'uppercase',
//     letterSpacing: 0.5,
//     marginBottom: 4,
//   },
//   successDetailValue: {
//     fontSize: 11,
//     fontWeight: '600',
//     color: '#111827',
//     fontFamily: Platform.OS === 'web' ? 'monospace' : undefined,
//   },
//   successNote: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: '#059669',
//     marginBottom: 20,
//   },
//   successResetBtn: {
//     backgroundColor: '#6366f1',
//     paddingHorizontal: 32,
//     paddingVertical: 14,
//     borderRadius: 50,
//   },
//   successResetBtnText: {
//     color: '#ffffff',
//     fontWeight: '700',
//     fontSize: 14,
//   },

//   // ── Error ─────────────────────────────────────
//   errorCard: {
//     backgroundColor: '#fef2f2',
//     borderRadius: 14,
//     borderWidth: 1,
//     borderColor: '#fecaca',
//     padding: 16,
//     marginBottom: 16,
//   },
//   errorTitle: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: '#991b1b',
//     marginBottom: 6,
//   },
//   errorMessage: {
//     fontSize: 13,
//     color: '#b91c1c',
//     marginBottom: 12,
//     lineHeight: 20,
//   },
//   errorRetryBtn: {
//     backgroundColor: '#ef4444',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 10,
//     alignSelf: 'flex-start',
//   },
//   errorRetryBtnText: {
//     color: '#ffffff',
//     fontWeight: '700',
//     fontSize: 13,
//   },

//   // ── Loading ───────────────────────────────────
//   loadingContainer: {
//     alignItems: 'center',
//     paddingVertical: 40,
//   },
//   loadingText: {
//     marginTop: 12,
//     color: '#6b7280',
//     fontWeight: '600',
//     fontSize: 14,
//   },

//   // ── Payment Form Wrapper ──────────────────────
//   paymentFormWrapper: {
//     marginBottom: 16,
//   },
//   paymentFormTitle: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: '#374151',
//     textTransform: 'uppercase',
//     letterSpacing: 0.5,
//     marginBottom: 12,
//   },

//   // ── Verifying ─────────────────────────────────
//   verifyingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 8,
//     paddingVertical: 12,
//   },
//   verifyingText: {
//     color: '#6b7280',
//     fontSize: 13,
//     fontWeight: '600',
//   },

//   // ── Security Footer ───────────────────────────
//   securityFooter: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     gap: 24,
//     marginTop: 24,
//     marginBottom: 12,
//   },
//   securityItem: {
//     alignItems: 'center',
//   },
//   securityIcon: {
//     fontSize: 18,
//     marginBottom: 4,
//   },
//   securityLabel: {
//     fontSize: 10,
//     color: '#9ca3af',
//     fontWeight: '700',
//   },

//   // ── Powered By ────────────────────────────────
//   poweredBy: {
//     textAlign: 'center',
//     fontSize: 12,
//     color: '#d1d5db',
//     fontWeight: '600',
//     marginTop: 8,
//   },
// });



















