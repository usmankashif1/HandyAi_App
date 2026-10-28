import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import AppText from '../../../../../components/AppText';
import { RF, RS } from '../../../../../core/utils/responsive';

export type ProviderSettingIcon =
    | 'personal'
    | 'areas'
    | 'availability'
    | 'documents'
    | 'payment';

type ProviderSettingRowProps = {
    icon: ProviderSettingIcon;
    title: string;
    detail: string;
    onPress: () => void;
};

const SettingIcon = ({ name }: { name: ProviderSettingIcon }) => {
    const common = {
        fill: 'none',
        stroke: '#17385F',
        strokeWidth: 1.8,
        strokeLinecap: 'round' as const,
        strokeLinejoin: 'round' as const,
    };

    return (
        <Svg width={RS(31)} height={RS(31)} viewBox="0 0 32 32">
            {name === 'personal' ? (
                <>
                    <Circle cx="16" cy="10" r="5" {...common} />
                    <Path d="M6.5 27v-2a9.5 9.5 0 0 1 19 0v2" {...common} />
                </>
            ) : null}
            {name === 'areas' ? (
                <>
                    <Path d="M25 13c0 7-9 15-9 15s-9-8-9-15a9 9 0 1 1 18 0Z" {...common} />
                    <Circle cx="16" cy="13" r="3.2" fill="#51A1E6" stroke="none" />
                </>
            ) : null}
            {name === 'availability' ? (
                <>
                    <Rect x="4" y="6" width="24" height="22" rx="3" {...common} />
                    <Path d="M10 3v6m12-6v6M4 12h24" {...common} />
                    <Circle cx="22" cy="22" r="5" fill="#FFFFFF" stroke="#17385F" strokeWidth="1.8" />
                    <Path d="M22 19v3l2 1" {...common} />
                </>
            ) : null}
            {name === 'documents' ? (
                <>
                    <Path d="M8 3h10l7 7v18H8a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3Z" {...common} />
                    <Path d="M18 3v8h7M10 17h10m-10 5h10" {...common} />
                </>
            ) : null}
            {name === 'payment' ? (
                <>
                    <Rect x="3" y="6" width="26" height="20" rx="3" {...common} />
                    <Path d="M4 12h24m-18 8h7" {...common} />
                </>
            ) : null}
        </Svg>
    );
};

const ProviderSettingRow = ({ icon, title, detail, onPress }: ProviderSettingRowProps) => (
    <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${title}. ${detail}`}
        onPress={onPress}
        style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
        <View style={styles.iconCircle}>
            <SettingIcon name={icon} />
        </View>
        <View style={styles.textContent}>
            <AppText style={styles.title}>{title}</AppText>
            <AppText style={styles.detail}>{detail}</AppText>
        </View>
        <Svg width={RS(24)} height={RS(24)} viewBox="0 0 24 24">
            <Path
                d="m9 5 7 7-7 7"
                fill="none"
                stroke="#111827"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    </Pressable>
);

export default ProviderSettingRow;

const NAVY = '#172B4D';

const styles = StyleSheet.create({
    card: {
        minHeight: RS(95),
        flexDirection: 'row',
        alignItems: 'center',
        gap: RS(13),
        borderWidth: 1,
        borderColor: '#C9D9EA',
        borderRadius: RS(20),
        backgroundColor: '#FFFFFF',
        paddingHorizontal: RS(14),
        paddingVertical: RS(12),
    },
    pressed: {
        opacity: 0.75,
    },
    iconCircle: {
        width: RS(57),
        height: RS(57),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: RS(29),
        backgroundColor: '#DCEBFF',
    },
    textContent: {
        flex: 1,
        minWidth: 0,
        gap: RS(2),
    },
    title: {
        color: NAVY,
        fontSize: RF(18),
        lineHeight: RS(23),
        fontWeight: '700',
    },
    detail: {
        color: '#17212E',
        fontSize: RF(14),
        lineHeight: RS(21),
    },
});
