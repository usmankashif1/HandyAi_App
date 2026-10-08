import { Colors } from "./colors";
import { Theme } from "./themeTypes";

export const defaultTheme: Theme = {
    font: "Poppins",

    primary: Colors.primary,
    primaryDark: Colors.primaryDark,
    primaryLight: Colors.primaryLight,
    bottomBackgroundColor: Colors.secondaryLight,

    secondary: Colors.secondary,
    secondaryLight: Colors.secondaryLight,
    amber: Colors.amber,
    amberDark: Colors.amberDark,
    amberLight: Colors.amberLight,

    background: Colors.background,

    white: Colors.white,

    black: Colors.black,

    textPrimary: Colors.textPrimary,

    textSecondary: Colors.textSecondary,

    textLight: Colors.textLight,

    border: Colors.border,

    success: Colors.success,
    successLight: Colors.successLight,

    failed: Colors.failed,
    failedLight: Colors.failedLight,

    warning: Colors.warning,
    warningLight: Colors.warningLight,

};