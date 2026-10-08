import Svg, { Circle, Path } from 'react-native-svg';
import { Colors } from '../../../core/theme/colors';

export type ChatIconName =
    | 'back'
    | 'chevron'
    | 'microphone'
    | 'send'
    | 'phone'
    | 'more'
    | 'attachment'
    | 'checks';

type Props = {
    name: ChatIconName;
    color?: string;
    size?: number;
};

const ChatIcon = ({ name, color = Colors.primaryDark, size = 24 }: Props) => {
    const common = {
        fill: 'none',
        stroke: color,
        strokeWidth: 1.9,
        strokeLinecap: 'round' as const,
        strokeLinejoin: 'round' as const,
    };

    return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
            {name === 'back' ? <Path {...common} d="m15 18-6-6 6-6" /> : null}
            {name === 'chevron' ? <Path {...common} d="m6 9 6 6 6-6" /> : null}
            {name === 'phone' ? (
                <Path {...common} d="M7 3H5a2 2 0 0 0-2 2c0 8.8 7.2 16 16 16a2 2 0 0 0 2-2v-2l-5-2-2 3a14 14 0 0 1-7-7l3-2-2-5Z" />
            ) : null}
            {name === 'more' ? (
                <>
                    <Circle cx="12" cy="5" r="2" fill={color} />
                    <Circle cx="12" cy="12" r="2" fill={color} />
                    <Circle cx="12" cy="19" r="2" fill={color} />
                </>
            ) : null}
            {name === 'microphone' ? (
                <>
                    <Path {...common} d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Z" />
                    <Path {...common} d="M19 11v1a7 7 0 0 1-14 0v-1m7 8v3m-4 0h8" />
                </>
            ) : null}
            {name === 'attachment' ? (
                <Path {...common} d="m21 11.5-8.7 8.7a5.5 5.5 0 0 1-7.8-7.8l9.2-9.2a3.5 3.5 0 0 1 5 5l-9.2 9.2a1.5 1.5 0 0 1-2.1-2.1l8.5-8.5" />
            ) : null}
            {name === 'send' ? (
                <Path d="m21 3-7.2 18-3.5-7.3L3 10.2 21 3Z" fill={color} stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
            ) : null}
            {name === 'checks' ? <Path {...common} d="m2 13 4 4L16 7m-4 10 2 2 8-9" /> : null}
        </Svg>
    );
};

export default ChatIcon;
