import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppToast from './src/components/AppToast';
import RootNavigator from './src/navigation/root/RootNavigator';

const App = () => (
    <SafeAreaProvider>
        <RootNavigator />
        <AppToast />
    </SafeAreaProvider>
);

export default App;