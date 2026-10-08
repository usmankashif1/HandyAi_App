import { FontSize } from '../../../core/theme/designTokens';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, TextInput, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '../../../components/AppButton';
import AppText from '../../../components/AppText';
import Container from '../../../components/Container';
import { Colors } from '../../../core/theme/colors';
import { RS } from '../../../core/utils/responsive';
import type { ScheduleStackParamList } from '../../schedule/schedule.types';
import ChatAvatar from '../components/ChatAvatar';
import ChatIcon from '../components/ChatIcon';
import ChatMessageBubble from '../components/ChatMessageBubble';



type Props = NativeStackScreenProps<ScheduleStackParamList, 'ProviderChat'>;

type Message = {
    id: number;
    text: string;
    from: 'provider' | 'customer';
    time: string;
};

const initialMessages: Message[] = [
    {
        id: 1,
        from: 'customer',
        text: 'I need a deep clean for my home tomorrow morning.',
        time: '1:38 PM',
    },
    {
        id: 2,
        from: 'provider',
        text: 'Hello, I can confirm the booking. Could you please send the exact address?',
        time: '1:40 PM',
    },
    {
        id: 3,
        from: 'customer',
        text: "Yes! I'm 10 minutes away. See you soon.",
        time: '1:46 PM',
    },
    {
        id: 4,
        from: 'provider',
        text: 'Perfect, thanks!',
        time: '1:46 PM',
    },
];

const ProviderChatScreen = ({ navigation, route }: Props) => {
    const { width } = useWindowDimensions();
    const compact = width < 360;
    const [messages, setMessages] = useState(initialMessages);
    const [draft, setDraft] = useState('');
    const [menuVisible, setMenuVisible] = useState(false);
    const messagesRef = useRef<ScrollView>(null);
    const { providerName } = route.params;

    const sendMessage = () => {
        const text = draft.trim();
        if (!text) {
            return;
        }

        setMessages((current) => [
            ...current,
            { id: Date.now(), text, from: 'customer', time: 'Now' },
        ]);
        setDraft('');
        requestAnimationFrame(() => messagesRef.current?.scrollToEnd({ animated: true }));
    };

    const chooseMenuAction = (action: 'Report provider' | 'Block provider') => {
        setMenuVisible(false);
        Alert.alert(action, `${action} is for display only in this UI preview.`);
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <Container style={[styles.screen, compact && styles.compactScreen]}>
                    <Container style={[styles.header, compact && styles.compactHeader]}>
                        <AppButton
                            style={styles.headerButton}
                            onPress={() => navigation.goBack()}
                            accessibilityRole="button"
                            accessibilityLabel="Back to schedule"
                        >
                            <ChatIcon name="back" />
                        </AppButton>

                        <ChatAvatar kind="provider" size={RS(compact ? 42 : 48)} />
                        <Container style={styles.providerInfo}>
                            <AppText style={[styles.providerName, compact && styles.compactProviderName]} numberOfLines={1}>
                                {providerName}
                            </AppText>
                            <Container style={styles.activeRow}>
                                <Container style={styles.activeDot} />
                                <AppText style={styles.activeText}>Active</AppText>
                            </Container>
                        </Container>

                        <Container style={styles.headerActions}>
                            <AppButton
                                style={styles.headerActionButton}
                                onPress={() => Alert.alert('Call provider', 'Calling is not available in this UI preview.')}
                                accessibilityRole="button"
                                accessibilityLabel={`Call ${providerName}`}
                            >
                                <ChatIcon name="phone" size={RS(28)} />
                            </AppButton>
                            <Container style={styles.menuContainer}>
                                <AppButton
                                    style={styles.headerActionButton}
                                    onPress={() => setMenuVisible((visible) => !visible)}
                                    accessibilityRole="button"
                                    accessibilityLabel="More provider options"
                                    accessibilityState={{ expanded: menuVisible }}
                                >
                                    <ChatIcon name="more" size={RS(28)} />
                                </AppButton>
                                {menuVisible ? (
                                    <Container style={styles.menu}>
                                        {(['Report provider', 'Block provider'] as const).map((action) => (
                                            <AppButton
                                                key={action}
                                                style={styles.menuItem}
                                                onPress={() => chooseMenuAction(action)}
                                                accessibilityRole="button"
                                            >
                                                <AppText style={styles.menuText}>{action}</AppText>
                                            </AppButton>
                                        ))}
                                    </Container>
                                ) : null}
                            </Container>
                        </Container>
                    </Container>

                    <ScrollView
                        ref={messagesRef}
                        style={styles.conversation}
                        contentContainerStyle={[styles.messageList, compact && styles.compactMessageList]}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        {messages.map((message) => {
                            const isCustomer = message.from === 'customer';

                            return (
                                <Container
                                    key={message.id}
                                    style={[
                                        styles.messageRow,
                                        isCustomer ? styles.customerMessageRow : styles.providerMessageRow,
                                    ]}
                                >
                                    {!isCustomer ? <ChatAvatar kind="provider" size={RS(compact ? 38 : 44)} /> : null}
                                    <ChatMessageBubble
                                        text={message.text}
                                        variant={isCustomer ? 'customer' : 'provider'}
                                        sender={!isCustomer && message.id === 4 ? providerName : undefined}
                                        time={message.time}
                                        showChecks={isCustomer}
                                        showCustomerAvatar={isCustomer}
                                    />
                                </Container>
                            );
                        })}
                    </ScrollView>

                    <Container style={[styles.composer, compact && styles.compactComposer]}>
                        <TextInput
                            value={draft}
                            onChangeText={setDraft}
                            placeholder="Type a message..."
                            placeholderTextColor="#738092"
                            style={styles.messageInput}
                            multiline
                            maxLength={1000}
                            accessibilityLabel="Type a message"
                            onSubmitEditing={sendMessage}
                            blurOnSubmit
                        />
                        <AppButton
                            style={styles.composerIcon}
                            onPress={() => Alert.alert('Voice message', 'Voice messages are for display only in this UI preview.')}
                            accessibilityRole="button"
                            accessibilityLabel="Record a voice message"
                        >
                            <ChatIcon name="microphone" size={RS(23)} />
                        </AppButton>
                        <AppButton
                            style={styles.composerIcon}
                            onPress={() => Alert.alert('Attachment', 'Attachments are for display only in this UI preview.')}
                            accessibilityRole="button"
                            accessibilityLabel="Attach a file"
                        >
                            <ChatIcon name="attachment" size={RS(23)} />
                        </AppButton>
                        <AppButton
                            style={[styles.sendButton, compact && styles.compactSendButton, !draft.trim() && styles.disabledSendButton]}
                            onPress={sendMessage}
                            disabled={!draft.trim()}
                            accessibilityRole="button"
                            accessibilityLabel="Send message"
                            accessibilityState={{ disabled: !draft.trim() }}
                        >
                            <ChatIcon name="send" color={Colors.white} size={RS(22)} />
                        </AppButton>
                    </Container>
                </Container>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ProviderChatScreen;

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
    compactScreen: {
        minWidth: RS(0),
    },
    header: {
        minHeight: RS(84),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: RS(10),
        paddingHorizontal: RS(12),
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#D6DADF',
        zIndex: 2,
    },
    compactHeader: {
        minHeight: RS(72),
        gap: RS(6),
        paddingHorizontal: RS(8),
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerButton: {
        width: RS(44),
        height: RS(44),
        flexShrink: 0,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerActionButton: {
        width: RS(44),
        height: RS(44),
        flexShrink: 0,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
    },
    providerInfo: {
        flex: 1,
        minWidth: RS(0),
        gap: RS(3),
    },
    providerName: {
        color: Colors.primaryDark,
        fontSize: FontSize.subtitle,
        fontWeight: '600',
    },
    compactProviderName: {
        fontSize: FontSize.body,
    },
    activeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: RS(6),
        minWidth: RS(0),
    },
    activeDot: {
        width: RS(9),
        height: RS(9),
        borderRadius: RS(5),
        backgroundColor: '#42B489',
    },
    activeText: {
        color: '#6A7583',
        fontSize: FontSize.bodySmall,
    },
    menuContainer: {
        position: 'relative',
    },
    menu: {
        position: 'absolute',
        top: RS(48),
        right: RS(0),
        zIndex: 5,
        minWidth: RS(188),
        paddingVertical: RS(4),
        borderWidth: 1,
        borderColor: '#E1E3E6',
        borderRadius: RS(12),
        backgroundColor: Colors.surface,
        shadowColor: '#152235',
        shadowOpacity: 0.15,
        shadowRadius: RS(12),
        shadowOffset: { width: RS(0), height: RS(5) },
        elevation: 5,
    },
    menuItem: {
        minHeight: RS(44),
        justifyContent: 'center',
        paddingHorizontal: RS(14),
    },
    menuText: {
        color: Colors.textPrimary,
        fontSize: FontSize.bodySmall,
    },
    conversation: {
        flex: 1,
    },
    messageList: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        gap: RS(20),
        paddingHorizontal: RS(14),
        paddingTop: RS(24),
        paddingBottom: RS(18),
    },
    compactMessageList: {
        gap: RS(14),
        paddingHorizontal: RS(10),
        paddingTop: RS(18),
        paddingBottom: RS(12),
    },
    messageRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: RS(10),
    },
    providerMessageRow: {
        justifyContent: 'flex-start',
    },
    customerMessageRow: {
        justifyContent: 'flex-end',
    },
    composer: {
        minHeight: RS(58),
        flexDirection: 'row',
        alignItems: 'center',
        gap: RS(7),
        marginHorizontal: RS(14),
        marginTop: RS(8),
        marginBottom: RS(8),
        paddingLeft: RS(16),
        paddingRight: RS(6),
        borderWidth: 1,
        borderColor: '#CFD3D8',
        borderRadius: RS(999),
        backgroundColor: '#FBFCFD',
    },
    compactComposer: {
        minHeight: RS(52),
        gap: RS(3),
        marginHorizontal: RS(10),
        paddingLeft: RS(12),
    },
    messageInput: {
        flex: 1,
        maxHeight: RS(92),
        paddingVertical: RS(10),
        color: Colors.textPrimary,
        fontSize: FontSize.body,
    },
    composerIcon: {
        width: RS(32),
        height: RS(40),
        flexShrink: 0,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendButton: {
        width: RS(44),
        height: RS(44),
        flexShrink: 0,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: RS(22),
        backgroundColor: Colors.primaryDark,
    },
    compactSendButton: {
        width: RS(40),
        height: RS(40),
        borderRadius: RS(20),
    },
    disabledSendButton: {
        opacity: 0.92,
    },
});
