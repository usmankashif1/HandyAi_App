import { useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, TextInput, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '../../../components/AppButton';
import AppText from '../../../components/AppText';
import Container from '../../../components/Container';
import { Colors } from '../../../core/theme/colors';
import { FontSize, Radii, Spacing, TypeScale } from '../../../core/theme/designTokens';
import { RS } from '../../../core/utils/responsive';
import ChatAvatar from '../components/ChatAvatar';
import ChatIcon from '../components/ChatIcon';
import ChatMessageBubble from '../components/ChatMessageBubble';
import CurrentLocationControl from '../components/CurrentLocationControl';



type Message = {
    id: number;
    text: string;
    from: 'assistant' | 'user';
};

const initialMessages: Message[] = [
    {
        id: 1,
        from: 'assistant',
        text: "Hi Usman! 👋\nI'm your Handy AI. How can I help you today? You can just tell me what you need—like “clean my house” or “fix a leaking tap”.",
    },
    {
        id: 2,
        from: 'user',
        text: 'I need a deep clean for my home tomorrow morning.',
    },
    {
        id: 3,
        from: 'assistant',
        text: "Great! I've found a trusted provider for a deep clean. Would you like to see the booking plan?",
    },
];

const suggestions = [
    'Deep clean tomorrow',
    'Mount a TV',
    'Fix a leaking tap',
    'Install light fixtures',
];

const ChatScreen = () => {
    const { width } = useWindowDimensions();
    const compact = width < 375;
    const [messages, setMessages] = useState(initialMessages);
    const [message, setMessage] = useState('');
    const scrollRef = useRef<ScrollView>(null);

    const sendMessage = (text = message) => {
        const trimmed = text.trim();
        if (!trimmed) {
            return;
        }

        setMessages((current) => [
            ...current,
            { id: Date.now(), text: trimmed, from: 'user' },
        ]);
        setMessage('');
        requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
    };

    const chooseSuggestion = (suggestion: string) => {
        setMessage(suggestion);
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
            >
                <Container style={styles.screen}>
                    <Container style={[styles.header, compact && styles.compactHeader]}>

                        <Container style={styles.assistantAvatar}>
                            <ChatAvatar kind="assistant" size={RS(compact ? 55 : 52)} />
                        </Container>
                        <Container style={styles.assistantInfo}>
                            <AppText style={styles.assistantName}>Handy AI</AppText>
                            <Container style={styles.statusRow}>
                                <Container style={styles.onlineDot} />
                                <AppText style={styles.statusText}>Active</AppText>
                            </Container>
                        </Container>
                        <CurrentLocationControl />
                    </Container>

                    <ScrollView
                        ref={scrollRef}
                        style={styles.conversation}
                        contentContainerStyle={styles.conversationContent}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        {messages.map((item) => (
                            <Container
                                key={item.id}
                                style={[
                                    styles.messageRow,
                                    item.from === 'user' ? styles.userMessageRow : null,
                                ]}
                            >
                                {item.from === 'assistant' ? <ChatAvatar kind="assistant" size={RS(44)} /> : null}
                                <ChatMessageBubble
                                    text={item.text}
                                    variant={item.from === 'assistant' ? 'assistant' : 'user'}
                                />
                            </Container>
                        ))}
                    </ScrollView>

                    <Container style={styles.bottomArea}>
                        <Container style={styles.suggestions}>
                            {suggestions.map((suggestion) => (
                                <AppButton
                                    key={suggestion}
                                    style={styles.suggestion}
                                    fullWidth={false}
                                    onPress={() => chooseSuggestion(suggestion)}
                                    accessibilityRole="button"
                                >
                                    <AppText style={styles.suggestionText} numberOfLines={1}>
                                        {suggestion}
                                    </AppText>
                                </AppButton>
                            ))}
                        </Container>

                        <Container style={styles.composer}>
                            <TextInput
                                value={message}
                                onChangeText={setMessage}
                                placeholder="Type a message..."
                                placeholderTextColor={Colors.textLight}
                                style={styles.messageInput}
                                multiline
                                maxLength={1000}
                                accessibilityLabel="Type a message"
                                onSubmitEditing={() => sendMessage()}
                                blurOnSubmit
                            />
                            <AppButton
                                style={styles.iconButton}
                                fullWidth={false}
                                accessibilityRole="button"
                                accessibilityLabel="Voice input"
                                onPress={() => Alert.alert('Voice input', 'Voice input is not available yet.')}
                            >
                                <ChatIcon name="microphone" size={RS(26)} />
                            </AppButton>
                            <AppButton
                                style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
                                fullWidth={false}
                                accessibilityRole="button"
                                accessibilityLabel="Send message"
                                accessibilityState={{ disabled: !message.trim() }}
                                disabled={!message.trim()}
                                onPress={() => sendMessage()}
                            >
                                <ChatIcon name="send" color={Colors.white} size={RS(25)} />
                            </AppButton>
                        </Container>
                    </Container>
                </Container>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ChatScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    keyboardView: {
        flex: 1,
    },
    screen: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        minHeight: RS(96),
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: RS(20),
        paddingVertical: Spacing.sm,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: Colors.border,
        gap: RS(8),
        zIndex: 2,
    },
    compactHeader: {
        paddingHorizontal: RS(20),
        gap: RS(4),
    },
    
    assistantAvatar: {
        flexShrink: 0,
        alignSelf: 'center',
    },
    assistantInfo: {
        flex: 1,
        minWidth: 0,
        justifyContent: 'center',
        alignSelf: 'center',
        marginLeft:RS(5),
    },
    assistantName: {
        ...TypeScale.heading,
        color: Colors.textPrimary,
        fontSize: FontSize.subheading,
        lineHeight: RS(28),
        fontWeight: '600',
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
        marginTop: RS(2),
    },
    onlineDot: {
        width: RS(9),
        height: RS(9),
        borderRadius: Radii.pill,
        backgroundColor: Colors.secondary,
    },
    statusText: {
        color: Colors.textSecondary,
        fontSize: FontSize.bodySmall,
    },
    conversation: {
        flex: 1,
    },
    conversationContent: {
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        gap: Spacing.md,
    },
    messageRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: Spacing.sm,
    },
    userMessageRow: {
        justifyContent: 'flex-end',
    },
    bottomArea: {
        paddingHorizontal: Spacing.sm,
        paddingTop: Spacing.xs,
        paddingBottom: Spacing.sm,
        gap: Spacing.md,
        backgroundColor: Colors.background,
    },
    suggestions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    suggestion: {
        minHeight: RS(42),
        flexGrow: 1,
        flexBasis: '46%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Spacing.sm,
        borderWidth: 1,
        borderColor: '#C9CDD4',
        borderRadius: Radii.pill,
        backgroundColor: Colors.background,
    },
    suggestionText: {
        color: Colors.textPrimary,
        fontSize: FontSize.bodySmall,
    },
    composer: {
        minHeight: RS(64),
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.xs,
        borderWidth: 1,
        borderColor: '#D4D7DA',
        borderRadius: Radii.pill,
        backgroundColor: Colors.surface,
        shadowColor: Colors.black,
        shadowOpacity: 0.06,
        shadowRadius: RS(10),
        shadowOffset: { width: RS(0), height: RS(3) },
        elevation: 2,
    },
    messageInput: {
        flex: 1,
        maxHeight: RS(96),
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        color: Colors.textPrimary,
        fontSize: FontSize.body,
        lineHeight: RS(22),
    },
    iconButton: {
        width: RS(42),
        height: RS(46),
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendButton: {
        width: RS(48),
        height: RS(48),
        borderRadius: Radii.pill,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primaryDark,
    },
    sendButtonDisabled: {
        opacity: 0.45,
    },
});
