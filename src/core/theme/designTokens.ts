import { Colors } from "./colors";

export const Gradients = {
    primary: [Colors.primaryDark, Colors.primary] as const,
    amber: [Colors.amberDark, Colors.amber] as const,
    success: ["#0B766F", Colors.secondary] as const,
    neutral: ["#D9DADD", Colors.textLight] as const,
};

export const Spacing = {
    xxs: 4,
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    xxxl: 40,
    section: 48,
    screen: 64,
} as const;

export const Radii = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    card: 24,
    pill: 999,
} as const;

export const TypeScale = {
    heading: { fontSize: 32, lineHeight: 40, fontWeight: "700" },
    subtitle: { fontSize: 16, lineHeight: 24, fontWeight: "400" },
    body: { fontSize: 16, lineHeight: 24, fontWeight: "400" },
    caption: { fontSize: 15, lineHeight: 24, fontWeight: "400" },
} as const;

export const Components = {
    button: {
        height: 48,
        horizontalPadding: 20,
        radius: Radii.lg,
    },
    input: {
        height: 48,
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
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 6 },
        elevation: 3,
    },
} as const;
