// import React from "react";
// import {
//     ActivityIndicator,
//     Pressable,
//     StyleProp,
//     StyleSheet,
//     ViewStyle,
// } from "react-native";

// import Container from "./Container";
// import AppText from "./AppText";

// import { RH, RS, RW } from "@/src/core/utils/responsive";
// import { FontFamily, TypographyVariant } from "@/src/core/theme/typography";
// import { useAppSelector } from "@/src/store/hooks";

// interface Props {
//     title: string;

//     onPress: () => void;

//     icon?: React.ReactNode;

//     loading?: boolean;

//     disabled?: boolean;

//     backgroundColor?: string;

//     textColor?: string;

//     borderColor?: string;

//     borderWidth?: number;

//     borderRadius?: number;

//     height?: number;

//     fullWidth?: boolean;

//     style?: StyleProp<ViewStyle>;

//     shadow?: boolean;
//     variant?: TypographyVariant;
//     txtStyle?: StyleProp<ViewStyle>;

// }

// const AppButton: React.FC<Props> = ({
//     title,
//     onPress,
//     icon,
//     loading = false,
//     disabled = false,

//     backgroundColor,
//     textColor,
//     borderColor = "transparent",
//     borderWidth = 0,

//     borderRadius = RS(16),

//     height = RH(50),

//     fullWidth = true,

//     shadow = false,

//     style,
//     variant,
//     txtStyle
// }) => {
//     const theme = useAppSelector(
//         state => state.theme
//     );

//     const bg = backgroundColor

//     const txt = textColor

//     return (
//         <Pressable
//             disabled={disabled || loading}
//             onPress={onPress}
//             style={({ pressed }) => ({
//                 opacity: pressed ? 0.85 : disabled ? 0.5 : 1,
//             })}
//         >
//             <Container
//                 style={[
//                     styles.button,
//                     {
//                         backgroundColor: bg,
//                         borderColor,
//                         borderWidth,
//                         borderRadius,
//                         height,
//                         alignSelf: fullWidth ? "stretch" : "flex-start",
//                     },
//                     shadow && styles.shadow,
//                     style,
//                 ]}
//             >
//                 {loading ? (
//                     <ActivityIndicator color={txt} />
//                 ) : (
//                     <>
//                         {icon}
//                         <AppText
//                             variant={variant ? variant : "bodySmall"}
//                             style={[
//                                 styles.text, txtStyle,
//                                 {
//                                     color: txt,
//                                     marginLeft: icon ? RW(8) : 0,
//                                 },
//                             ]}
//                         >
//                             {title}
//                         </AppText>
//                     </>
//                 )}
//             </Container>
//         </Pressable>
//     );
// };

// export default React.memo(AppButton);

// const styles = StyleSheet.create({
//     button: {
//         flexDirection: "row",
//         justifyContent: "center",
//         alignItems: "center",

//         paddingHorizontal: RW(18),
//     },

//     text: {
//         fontFamily: FontFamily.semiBold,
//     },

//     shadow: {
//         shadowColor: "#000",
//         shadowOpacity: 0.15,
//         shadowRadius: RS(8),
//         shadowOffset: {
//             width: 0,
//             height: RH(3),
//         },
//         elevation: 5,
//     },
// });







import React from "react";
import {
    ActivityIndicator,
    Pressable,
    type PressableProps,
    StyleProp,
    StyleSheet,
    TextStyle,
} from "react-native";

import Container from "./Container";
import AppText from "./AppText";

import { RH, RW, RS } from "@/core/utils/responsive";
import {
    TypographyVariant,
} from "@/core/theme/typography";
import { defaultTheme } from "@/core/theme/defaultTheme";

type ButtonVariant =
    | "filled"
    | "outline"
    | "text";

type ButtonSize =
    | "small"
    | "medium"
    | "large";

interface AppButtonProps extends Pick<
    PressableProps,
    | "accessibilityHint"
    | "accessibilityLabel"
    | "accessibilityRole"
    | "accessibilityState"
    | "hitSlop"
    | "onLongPress"
    | "testID"
> {
    title?: string;
    children?: React.ReactNode;
    onPress?: PressableProps["onPress"];

    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;

    variant?: ButtonVariant;

    size?: ButtonSize;

    loading?: boolean;

    disabled?: boolean;

    fullWidth?: boolean;

    elevated?: boolean;

    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;

    typography?: TypographyVariant;

    style?: PressableProps["style"];
    textStyle?: StyleProp<TextStyle>;
}

const AppButton: React.FC<AppButtonProps> = ({
    title,
    children,

    onPress,

    leftIcon,
    rightIcon,

    variant = "filled",

    size = "medium",

    loading = false,

    disabled = false,

    fullWidth = true,

    elevated = false,

    backgroundColor,
    textColor,
    borderColor,

    typography,

    style,
    textStyle,
    accessibilityHint,
    accessibilityLabel,
    accessibilityRole,
    accessibilityState,
    hitSlop,
    onLongPress,
    testID,
}) => {

    const theme = defaultTheme;

    //-------------------------------------
    // Sizes
    //-------------------------------------

    const buttonHeight = {
        small: RH(42),
        medium: RH(52),
        large: RH(60),
    }[size];

    //-------------------------------------
    // Typography
    //-------------------------------------

    const textVariant: TypographyVariant =
        typography ??
        (
            size === "small"
                ? "caption"
                : size === "large"
                    ? "body"
                    : "bodySmall"
        );
    const hasCustomContent = children !== undefined;

    //-------------------------------------
    // Colors
    //-------------------------------------

    let bg = theme.primary;
    let txt = theme.white;
    let border = "transparent";

    switch (variant) {

        case "filled":
            bg = backgroundColor ?? theme.primary;
            txt = textColor ?? theme.white;
            border = borderColor ?? "transparent";
            break;

        case "outline":
            bg = backgroundColor ?? "transparent";
            txt = textColor ?? theme.primary;
            border = borderColor ?? theme.primary;
            break;

        case "text":
            bg = "transparent";
            txt = textColor ?? theme.textSecondary;
            border = "transparent";
            break;
    }

    return (

        <Pressable
            disabled={disabled || loading}
            onPress={onPress}
            onLongPress={onLongPress}
            accessibilityHint={accessibilityHint}
            accessibilityLabel={accessibilityLabel ?? title}
            accessibilityRole={accessibilityRole ?? "button"}
            accessibilityState={{
                ...accessibilityState,
                disabled: disabled || loading || accessibilityState?.disabled,
            }}
            hitSlop={hitSlop}
            testID={testID}
            style={({ pressed }) => [
                styles.pressable,
                { alignSelf: fullWidth ? "stretch" : "flex-start" },
                typeof style === "function" ? style({ pressed }) : style,
                {
                    opacity: pressed
                        ? 0.8
                        : disabled || loading
                            ? 0.45
                            : 1,
                },
            ]}
        >

            <Container
                style={hasCustomContent
                    ? styles.customContent
                    : [
                        styles.button,
                        {
                            backgroundColor: bg,
                            borderColor: border,
                            borderWidth: variant === "outline" ? 1 : 0,
                            minHeight: buttonHeight,
                            alignSelf: fullWidth ? "stretch" : "flex-start",
                        },
                        elevated && styles.shadow,
                    ]}
            >

                {loading ? (

                    <ActivityIndicator
                        color={txt}
                    />

                ) : (

                    <>

                        {children ?? (
                            <>
                                {leftIcon}
                                {title ? (
                                    <AppText
                                        variant={textVariant}
                                        style={[
                                            {
                                                color: txt,
                                            },
                                            textStyle,
                                        ]}
                                    >
                                        {title}
                                    </AppText>
                                ) : null}
                                {rightIcon}
                            </>
                        )}

                    </>

                )}

            </Container>

        </Pressable>

    );
};

export default React.memo(AppButton);

const styles = StyleSheet.create({
    pressable: {
        alignSelf: "stretch",
    },

    customContent: {
        flex: 1,
        alignSelf: "stretch",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: RW(8),
    },

    button: {

        borderRadius: RS(16),

        paddingHorizontal: RW(20),

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "center",

        gap: RW(8),
    },

    shadow: {

        shadowColor: "#000",

        shadowOpacity: 0.12,

        shadowRadius: RS(8),

        shadowOffset: {
            width: 0,
            height: RH(3),
        },

        elevation: 5,
    },

});