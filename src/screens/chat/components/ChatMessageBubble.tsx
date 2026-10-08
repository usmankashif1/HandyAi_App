import { StyleSheet } from 'react-native';
import AppText from '../../../components/AppText';
import Container from '../../../components/Container';
import { Colors } from '../../../core/theme/colors';
import { FontSize } from '../../../core/theme/designTokens';
import { RS } from '../../../core/utils/responsive';
import ChatAvatar from './ChatAvatar';
import ChatIcon from './ChatIcon';



export type ChatMessageVariant = 'assistant' | 'user' | 'provider' | 'customer';

type Props = {
    text: string;
    variant: ChatMessageVariant;
    time?: string;
    sender?: string;
    showChecks?: boolean;
    showCustomerAvatar?: boolean;
};

const ChatMessageBubble = ({
    text,
    variant,
    time,
    sender,
    showChecks = false,
    showCustomerAvatar = false,
}: Props) => {
    const outgoing = variant === 'user' || variant === 'customer';
    const compactChatStyle = variant === 'provider' || variant === 'customer';

    return (
        <Container
            style={[
                styles.bubble,
                compactChatStyle && styles.compactBubble,
                outgoing ? styles.outgoingBubble : styles.incomingBubble,
                variant === 'assistant' && styles.assistantBubble,
                variant === 'user' && styles.userBubble,
                showCustomerAvatar && styles.withCustomerAvatar,
            ]}
        >
            {sender ? <AppText style={styles.sender}>{sender}</AppText> : null}
            <AppText style={[styles.messageText, outgoing && styles.outgoingText]}>{text}</AppText>
            {time || showChecks ? (
                <Container style={styles.meta}>
                    {time ? <AppText style={[styles.time, outgoing && styles.outgoingTime]}>{time}</AppText> : null}
                    {showChecks ? <ChatIcon name="checks" color="#D8E2EF" size={RS(15)} /> : null}
                </Container>
            ) : null}
            {showCustomerAvatar ? (
                <Container style={styles.customerAvatar}>
                    <ChatAvatar kind="customer" size={RS(30)} />
                </Container>
            ) : null}
        </Container>
    );
};

export default ChatMessageBubble;

const styles = StyleSheet.create({
    bubble: {
        maxWidth: '84%',
        paddingHorizontal: RS(14),
        paddingVertical: RS(11),
        borderRadius: RS(22),
    },
    compactBubble: {
        maxWidth: '88%',
        paddingHorizontal: RS(12),
        paddingTop: RS(9),
        paddingBottom: RS(8),
    },
    incomingBubble: {
        backgroundColor: '#E0E4EA',
        borderTopLeftRadius: 8,
    },
    assistantBubble: {
        backgroundColor: '#E7E9EC',
    },
    outgoingBubble: {
        backgroundColor: Colors.primaryDark,
        borderBottomRightRadius: 8,
    },
    userBubble: {
        marginLeft: RS(40),
    },
    withCustomerAvatar: {
        paddingRight: RS(42),
    },
    sender: {
        marginBottom: RS(2),
        color: '#141820',
        fontSize: FontSize.bodySmall,
        fontWeight: '600',
    },
    messageText: {
        color: '#16191F',
        fontSize: FontSize.body,
        lineHeight: RS(23),
    },
    outgoingText: {
        color: Colors.white,
    },
    meta: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: RS(3),
        marginTop: RS(4),
    },
    time: {
        color: '#697484',
        fontSize: FontSize.caption,
    },
    outgoingTime: {
        color: '#CBD7E6',
    },
    customerAvatar: {
        position: 'absolute',
        top: RS(8),
        right: RS(8),
    },
});
