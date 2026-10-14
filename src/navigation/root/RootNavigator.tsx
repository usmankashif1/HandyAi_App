import { NavigationContainer } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import SplashScreen from '../../screens/splash/SplashScreen';
import AuthNavigator from '../auth/AuthNavigator';
import StackNavigator from '../main/Stack/StackNavigator';
import { Colors } from '../../core/theme/colors';
import AppText from '../../components/AppText';
import AppButton from '../../components/AppButton';
import { Provider } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { store } from '../../store/store';
import { restoreAccessToken } from '../../store/slices/authSlice';

const SPLASH_DURATION_MS = 2500;

const RootNavigation = () => {
    const [splashComplete, setSplashComplete] = useState(false);
    const dispatch = useAppDispatch();
    const { token, shouldStartSetup, isLoading, initializationError } = useAppSelector(
        (state) => state.auth,
    );

    useEffect(() => {
        const timeout = setTimeout(() => setSplashComplete(true), SPLASH_DURATION_MS);
        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        void dispatch(restoreAccessToken());
    }, [dispatch]);

    if (!splashComplete || isLoading) {
        return <SplashScreen />;
    }

    if (initializationError) {
        return (
            <View style={styles.centered}>
                <AppText style={styles.errorText}>{initializationError}</AppText>
                <AppButton onPress={() => void dispatch(restoreAccessToken())} style={styles.retryButton}>
                    <AppText style={styles.retryText}>Try again</AppText>
                </AppButton>
            </View>
        );
    }

    return (
        <NavigationContainer key={token ? 'authenticated' : 'unauthenticated'}>
            {token ? <StackNavigator startAtSetup={shouldStartSetup} /> : <AuthNavigator />}
        </NavigationContainer>
    );
};

const RootNavigator = () => (
    <Provider store={store}>
        <RootNavigation />
    </Provider>
);

export default RootNavigator;

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        backgroundColor: Colors.background,
    },
    errorText: {
        marginBottom: 16,
        textAlign: 'center',
    },
    retryButton: {
        minHeight: 48,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
        borderRadius: 999,
        backgroundColor: Colors.primaryDark,
    },
    retryText: {
        color: Colors.white,
        fontWeight: '600',
    },
});