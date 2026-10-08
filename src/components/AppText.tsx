import React from "react";
import {
    StyleSheet,
    Text,
    TextProps,
    StyleProp,
    TextStyle,
} from "react-native";
import { Typography, TypographyVariant } from "../core/theme/typography";
import { Colors } from "../core/theme/colors";



interface AppTextProps extends TextProps {
    variant?: TypographyVariant;
    color?: string;
    style?: StyleProp<TextStyle>;
    children: React.ReactNode;
}   

const AppText: React.FC<AppTextProps> = ({
    variant = "body",
    color = Colors.textPrimary,
    style,
    children,
    allowFontScaling = false,
    ...rest
}) => {
    const resolvedStyle = StyleSheet.flatten([
        Typography[variant],
        { color, includeFontPadding: true },
        style,
    ]);
    const fontSize = typeof resolvedStyle.fontSize === "number"
        ? resolvedStyle.fontSize
        : Typography[variant].fontSize ?? 16;
    const minimumLineHeight = Math.ceil(fontSize * 1.4);

    return (
        <Text
            allowFontScaling={allowFontScaling}
            style={{
                ...resolvedStyle,
                includeFontPadding: true,
                lineHeight: Math.max(resolvedStyle.lineHeight ?? 0, minimumLineHeight),
            }}
            {...rest}
        >
            {children}
        </Text>
    );
};

export default React.memo(AppText);