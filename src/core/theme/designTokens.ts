import { Colors } from "./colors";
import { RF, RS } from "../utils/responsive";

export const Gradients = {
    primary: [Colors.primaryDark, Colors.primary] as const,
    amber: [Colors.amberDark, Colors.amber] as const,
    success: ["#0B766F", Colors.secondary] as const,
    neutral: ["#D9DADD", Colors.textLight] as const,
};

export const Spacing = {
    xxs: RS(4),
    xs: RS(8),
    sm: RS(12),
    md: RS(16),
    lg: RS(20),
    xl: RS(24),
    xxl: RS(32),
    xxxl: RS(40),
    section: RS(48),
    screen: RS(64),
} as const;

export const Radii = {
    sm: RS(8),
    md: RS(12),
    lg: RS(16),
    xl: RS(20),
    card: RS(24),
    pill: RS(999),
} as const;

export const FontSize = {
    display: RF(48),
    heroTitle: RF(30),
    heading: RF(28),
    pageTitle: RF(26),
    title: RF(24),
    subheading: RF(22),
    subtitle: RF(20),
    bodyLarge: RF(18),
    body: RF(16),
    bodySmall: RF(14),
    caption: RF(12),
} as const;

export const TypeScale = {
    heading: { fontSize: FontSize.heading, lineHeight: RF(36), fontWeight: "700" },
    subtitle: { fontSize: FontSize.body, lineHeight: RF(24), fontWeight: "400" },
    body: { fontSize: FontSize.body, lineHeight: RF(24), fontWeight: "400" },
    caption: { fontSize: FontSize.caption, lineHeight: RF(18), fontWeight: "400" },
} as const;

export const Components = {
    button: {
        height: RS(48),
        horizontalPadding: RS(20),
        radius: Radii.lg,
    },
    input: {
        height: RS(48),
        horizontalPadding: Spacing.md,
        radius: Radii.md,
        borderColor: Colors.border,
    },
    card: {
        padding: Spacing.md,
        radius: Radii.card,
        backgroundColor: Colors.surface,
    },
} as const;

export const Elevation = {
    card: {
        shadowColor: Colors.charcoal,
        shadowOpacity: 0.08,
        shadowRadius: RS(16),
        shadowOffset: { width: 0, height: RS(6) },
        elevation: 3,
    },
} as const;
