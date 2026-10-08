import { Image } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

export type ChatAvatarKind = 'assistant' | 'provider' | 'customer';

type Props = {
    kind: ChatAvatarKind;
    size: number;
};

const avatarUris: Record<Exclude<ChatAvatarKind, 'assistant'>, string> = {
    provider: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80',
    customer: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
};

const AssistantIllustration = ({ size }: { size: number }) => (
    <Svg width={size} height={size} viewBox="0 0 48 48" accessibilityLabel="Handy AI assistant">
        <Circle cx="24" cy="24" r="24" fill="#D8E0E5" />
        <Path d="M7 47c1.7-9.4 7.4-14 17-14s15.3 4.6 17 14" fill="#415D67" />
        <Path d="M14 18c0-8.5 4.1-13 10-13 6.2 0 10 4.5 10 13v5H14Z" fill="#292D32" />
        <Path d="M16 18c0-5.5 3.2-9 8-9s8 3.5 8 9v6c0 6-3.4 10-8 10s-8-4-8-10Z" fill="#C88967" />
        <Path d="M14 19c.2-8.2 4.1-13 10-13s10 4.8 10 13c-3.2-1-5.4-3.6-6.3-6.2-3.1 3.6-7.5 5.5-13.7 6.2Z" fill="#292D32" />
        <Path d="M20 26c1.1.8 2.3 1.2 4 1.2s2.9-.4 4-1.2" fill="none" stroke="#7D483A" strokeWidth="1.1" strokeLinecap="round" />
        <Circle cx="20.5" cy="21.5" r="1" fill="#292D32" />
        <Circle cx="27.5" cy="21.5" r="1" fill="#292D32" />
    </Svg>
);

const ChatAvatar = ({ kind, size }: Props) => {
    if (kind === 'assistant') {
        return <AssistantIllustration size={size} />;
    }

    return (
        <Image
            source={{ uri: avatarUris[kind] }}
            style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: '#D7DDE2' }}
            accessibilityLabel={kind === 'provider' ? 'Provider profile photo' : 'Your profile photo'}
        />
    );
};

export default ChatAvatar;
