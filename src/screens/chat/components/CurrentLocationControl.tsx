import { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { useCurrentLocation } from '../../../core/location/LocationPermissionProvider';
import { Colors } from '../../../core/theme/colors';
import { FontSize, Radii } from '../../../core/theme/designTokens';
import { RS } from '../../../core/utils/responsive';

const LocationPin = () => (
    <Svg width={RS(18)} height={RS(18)} viewBox="0 0 24 24" accessibilityElementsHidden>
        <Path
            d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"
            fill="none"
            stroke={Colors.primaryDark}
            strokeWidth="1.8"
            strokeLinejoin="round"
        />
        <Circle cx="12" cy="10" r="2.2" fill="none" stroke={Colors.primaryDark} strokeWidth="1.8" />
    </Svg>
);

const CurrentLocationControl = () => {
    const { permissionState, currentLocation, requestLocationPermission } = useCurrentLocation();
    const [containerWidth, setContainerWidth] = useState(0);
    const [textWidth, setTextWidth] = useState(0);
    const [translateX] = useState(() => new Animated.Value(0));
    const needsPermission = permissionState === 'denied' || permissionState === 'unavailable';
    const label = permissionState === 'requesting'
        ? 'Finding location…'
        : needsPermission
            ? 'Turn on location'
            : currentLocation ?? 'Getting location…';
    const textGap = RS(24);
    const measuredTextWidth = textWidth || label.length * FontSize.bodySmall;
    const loopDistance = measuredTextWidth + textGap;

    useEffect(() => {
        translateX.stopAnimation();
        translateX.setValue(0);
        if (!containerWidth || !textWidth) {
            return undefined;
        }

        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(translateX, {
                    toValue: -loopDistance,
                    duration: Math.max(4500, loopDistance * 55),
                    useNativeDriver: true,
                }),
                Animated.timing(translateX, {
                    toValue: 0,
                    duration: 0,
                    useNativeDriver: true,
                }),
                Animated.delay(5000),
            ]),
        );
        animation.start();

        return () => animation.stop();
    }, [containerWidth, loopDistance, textWidth, translateX]);

    return (
        <TouchableOpacity
            style={styles.button}
            onPress={() => {
                if (needsPermission) {
                    void requestLocationPermission();
                }
            }}
            accessibilityRole="button"
            accessibilityLabel={needsPermission ? 'Turn on location' : `Current location: ${label}`}
            accessibilityState={{ disabled: !needsPermission }}
            disabled={!needsPermission}
            activeOpacity={0.75}
        >
            <LocationPin />
            <View
                style={styles.textViewport}
                onLayout={(event) => setContainerWidth(event.nativeEvent.layout.width)}
            >
                <Animated.View style={{ alignSelf: 'flex-start', transform: [{ translateX }] }}>
                    <View style={[styles.tickerTrack, { columnGap: textGap }]}>
                        <Text
                            style={[styles.locationText, { width: measuredTextWidth }]}
                            numberOfLines={1}
                            ellipsizeMode="clip"
                        >
                            {label}
                        </Text>
                        <Text
                            style={[styles.locationText, { width: measuredTextWidth }]}
                            numberOfLines={1}
                            ellipsizeMode="clip"
                        >
                            {label}
                        </Text>
                    </View>
                </Animated.View>
            </View>
            <Text
                accessible={false}
                pointerEvents="none"
                numberOfLines={1}
                style={[styles.measurementText, { width: Math.max(1, label.length * FontSize.bodySmall) }]}
                onTextLayout={(event) => {
                    const [line] = event.nativeEvent.lines;
                    if (line) {
                        setTextWidth(line.width);
                    }
                }}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
};

export default CurrentLocationControl;

const styles = StyleSheet.create({
    button: {
        width: RS(155),
        minHeight: RS(50),
        flexShrink: 0,
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: RS(6),
        paddingHorizontal: RS(10),
        borderWidth: 1,
        borderColor: '#D0D3D8',
        borderRadius: Radii.pill,
        backgroundColor: Colors.background,
    },
    textViewport: {
        flex: 1,
        overflow: 'hidden',
    },
    tickerTrack: {
        flexDirection: 'row',
        alignSelf: 'flex-start',
    },
    locationText: {
        color: Colors.textPrimary,
        fontSize: FontSize.bodySmall,
        flexShrink: 0,
        includeFontPadding: false,
    },
    measurementText: {
        position: 'absolute',
        left: 0,
        top: 0,
        opacity: 0,
        fontSize: FontSize.bodySmall,
        includeFontPadding: false,
    },
});
