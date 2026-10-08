import React from "react";
import {
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
    return (
        <Text
            allowFontScaling={allowFontScaling}

            style={[
                Typography[variant],
                {
                    color,
                    includeFontPadding: false,
                    textAlignVertical: "center",
                },
                style,
            ]}
            {...rest}
        >
            {children}
        </Text>
    );
};

export default React.memo(AppText);