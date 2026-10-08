import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/root/RootNavigator';

const App = () => (
    <SafeAreaProvider>
        <RootNavigator />
    </SafeAreaProvider>
);

export default App;