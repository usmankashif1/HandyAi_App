import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../core/theme/colors';
import { TypeScale } from '../core/theme/designTokens';

type Props = {
    title: string;
};

const TabPlaceholderScreen = ({ title }: Props) => (
    <View style={styles.screen}>
        <Text style={styles.title}>{title}</Text>
    </View>
);

export default TabPlaceholderScreen;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.background,
    },
    title: {
        ...TypeScale.heading,
        color: Colors.textPrimary,
    },
});
