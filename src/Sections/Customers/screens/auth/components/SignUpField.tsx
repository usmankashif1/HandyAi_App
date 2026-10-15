import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import AppText from '../../../components/AppText';
import { Colors } from '../../../core/theme/colors';
import { FontSize, Radii, Spacing } from '../../../core/theme/designTokens';
import { RS } from '../../../core/utils/responsive';

type FieldIcon = 'user' | 'email' | 'lock';

type SignUpFieldProps = {
    label: string;
    placeholder: string;
    icon: FieldIcon;
    value: string;
    onChangeText: (value: string) => void;
    error?: string;
    keyboardType?: 'default' | 'email-address';
    autoCapitalize?: 'none' | 'words';
    secure?: boolean;
    accessibilityLabel: string;
};

const FieldLeadingIcon = ({ name }: { name: FieldIcon }) => {
    const iconColor = Colors.primaryDark;

    if (name === 'user') {
        return (
            <Svg width={RS(30)} height={RS(30)} viewBox="0 0 24 24" accessibilityElementsHidden>
                <Circle cx="12" cy="7.5" r="3.5" fill="none" stroke={iconColor} strokeWidth="1.8" />
                <Path
                    d="M4.5 20v-1.2a7.5 7.5 0 0 1 15 0V20"
                    fill="none"
                    stroke={iconColor}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                />
            </Svg>
        );
    }

    if (name === 'email') {
        return (
            <Svg width={RS(30)} height={RS(30)} viewBox="0 0 24 24" accessibilityElementsHidden>
                <Rect
                    x="2.5"
                    y="4.5"
                    width="19"
                    height="15"
                    rx="1.5"
                    fill="none"
                    stroke={iconColor}
                    strokeWidth="1.8"
                />
                <Path
                    d="m3.5 6 8.5 7 8.5-7"
                    fill="none"
                    stroke={iconColor}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </Svg>
        );
    }

    return (
        <Svg width={RS(30)} height={RS(30)} viewBox="0 0 24 24" accessibilityElementsHidden>
            <Rect
                x="4"
                y="10"
                width="16"
                height="11"
                rx="2"
                fill="none"
                stroke={iconColor}
                strokeWidth="1.8"
            />
            <Path
                d="M8 10V7a4 4 0 0 1 8 0v3"
                fill="none"
                stroke={iconColor}
                strokeWidth="1.8"
                strokeLinecap="round"
            />
            <Circle cx="12" cy="15.5" r="1" fill={iconColor} />
            <Path d="M12 16.5v1.5" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" />
        </Svg>
    );
};

const PasswordVisibilityIcon = ({ visible }: { visible: boolean }) => (
    <Svg width={RS(24)} height={RS(24)} viewBox="0 0 24 24" accessibilityElementsHidden>
        <Path
            d="M2.5 12s3.3-6 9.5-6 9.5 6 9.5 6-3.3 6-9.5 6-9.5-6-9.5-6Z"
            fill="none"
            stroke={Colors.textSecondary}
            strokeWidth="1.7"
            strokeLinejoin="round"
        />
        <Circle cx="12" cy="12" r="2.7" fill="none" stroke={Colors.textSecondary} strokeWidth="1.7" />
        {!visible ? (
            <Path
                d="m3 3 18 18"
                fill="none"
                stroke={Colors.textSecondary}
                strokeWidth="1.7"
                strokeLinecap="round"
            />
        ) : null}
    </Svg>
);

const SignUpField = ({
    label,
    placeholder,
    icon,
    value,
    onChangeText,
    error,
    keyboardType = 'default',
    autoCapitalize = 'none',
    secure = false,
    accessibilityLabel,
}: SignUpFieldProps) => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const isPassword = secure;

    return (
        <View style={styles.fieldGroup}>
            <View style={[styles.field, error ? styles.fieldError : null]}>
                <FieldLeadingIcon name={icon} />
                <View style={styles.fieldContent}>
                    <AppText style={styles.label}>{label}</AppText>
                    <TextInput
                        style={styles.input}
                        value={value}
                        onChangeText={onChangeText}
                        placeholder={placeholder}
                        placeholderTextColor={Colors.textSecondary}
                        keyboardType={keyboardType}
                        autoCapitalize={autoCapitalize}
                        autoCorrect={false}
                        secureTextEntry={isPassword && !passwordVisible}
                        accessibilityLabel={accessibilityLabel}
                        accessibilityHint={error}
                        returnKeyType="next"
                    />
                </View>
                {isPassword ? (
                    <TouchableOpacity
                        style={styles.visibilityButton}
                        onPress={() => setPasswordVisible((visible) => !visible)}
                        accessibilityRole="button"
                        accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'}
                        hitSlop={8}
                    >
                        <PasswordVisibilityIcon visible={passwordVisible} />
                    </TouchableOpacity>
                ) : null}
            </View>
            {error ? <AppText style={styles.errorText}>{error}</AppText> : null}
        </View>
    );
};

export default SignUpField;

const styles = StyleSheet.create({
    fieldGroup: {
        marginBottom: Spacing.lg,
    },
    field: {
        minHeight: RS(82),
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#C5C7CA',
        borderRadius: Radii.xl,
        paddingHorizontal: Spacing.md,
        backgroundColor: Colors.background,
    },
    fieldError: {
        borderColor: Colors.failed,
    },
    fieldContent: {
        flex: 1,
        justifyContent: 'center',
        marginLeft: Spacing.md,
    },
    label: {
        color: Colors.textPrimary,
        fontSize: FontSize.bodySmall,
        fontWeight: '500',
        lineHeight: RS(22),
    },
    input: {
        minHeight: RS(30),
        padding: 0,
        color: Colors.textPrimary,
        fontSize: FontSize.body,
        lineHeight: RS(26),
    },
    visibilityButton: {
        minWidth: RS(36),
        minHeight: RS(44),
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: Spacing.xs,
    },
    errorText: {
        marginTop: Spacing.xxs,
        marginLeft: Spacing.xs,
        color: Colors.failed,
        fontSize: FontSize.caption,
    },
});
