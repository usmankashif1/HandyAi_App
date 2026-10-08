import { StyleSheet } from 'react-native';
import { Colors } from '../core/theme/colors';
import { TypeScale } from '../core/theme/designTokens';
import Container from './Container';
import AppText from './AppText';


type Props = {
    title: string;
};

const TabPlaceholderScreen = ({ title }: Props) => (
    <Container style={styles.screen}>
        <AppText style={styles.title}>{title}</AppText>
    </Container>
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
