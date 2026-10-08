import Svg, { Circle, Path, Rect } from 'react-native-svg';

export type ProfileIconName = 'edit' | 'notes' | 'payment' | 'support' | 'logout' | 'chevron';

type Props = {
    name: ProfileIconName;
    size?: number;
};

const ProfileIcon = ({ name, size = 28 }: Props) => {
    const common = {
        fill: 'none',
        stroke: '#17191C',
        strokeWidth: 1.8,
        strokeLinecap: 'round' as const,
        strokeLinejoin: 'round' as const,
    };

    return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
            {name === 'edit' ? (
                <Path {...common} d="M12 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-6M14.5 4.5l5 5M9 15l1-.2 9.8-9.8a2.1 2.1 0 0 0-3-3L7 12v3h2Z" />
            ) : null}
            {name === 'notes' ? (
                <>
                    <Path {...common} d="M5 3.5h11a2 2 0 0 1 2 2v14H5a2 2 0 0 1-2-2v-12a2 2 0 0 1 2-2Z" />
                    <Path {...common} d="M3 7h5M3 11h4M3 15h4m5-7 6 6m-8 2 2-.5 8.8-8.8a2.1 2.1 0 0 0-3-3L9 12.5 8.5 15Z" />
                </>
            ) : null}
            {name === 'payment' ? (
                <>
                    <Rect {...common} x="2.5" y="4.5" width="19" height="15" rx="2.5" />
                    <Path {...common} d="M3 9h18m-15 6h2m3 0h2m-8 3h2" />
                </>
            ) : null}
            {name === 'support' ? (
                <>
                    <Path {...common} d="M4 13v-2a8 8 0 0 1 16 0v2M4 13H3a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h3v-7H4Zm16 0h1a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-3v-7h2Zm0 6c0 2-2 3-5 3" />
                    <Circle {...common} cx="15" cy="22" r="1" />
                </>
            ) : null}
            {name === 'logout' ? (
                <Path {...common} d="M10 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5m5-4 4-4-4-4m4 4H9" />
            ) : null}
            {name === 'chevron' ? <Path {...common} d="m9 18 6-6-6-6" /> : null}
        </Svg>
    );
};

export default ProfileIcon;
