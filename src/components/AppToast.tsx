import Toast, { ErrorToast, InfoToast, SuccessToast } from 'react-native-toast-message';
import type { ToastConfig } from 'react-native-toast-message';
import { Colors } from '../core/theme/colors';
import { FontSize, Radii, Spacing } from '../core/theme/designTokens';
import { RS } from '../core/utils/responsive';

const toastConfig: ToastConfig = {
    success: (props) => (
        <SuccessToast
            {...props}
            style={[styles.toast, styles.successToast]}
            contentContainerStyle={styles.content}
            text1Style={styles.title}
            text2Style={styles.message}
        />
    ),
    error: (props) => (
        <ErrorToast
            {...props}
            style={[styles.toast, styles.errorToast]}
            contentContainerStyle={styles.content}
            text1Style={styles.title}
            text2Style={styles.message}
        />
    ),
    info: (props) => (
        <InfoToast
            {...props}
            style={[styles.toast, styles.infoToast]}
            contentContainerStyle={styles.content}
            text1Style={styles.title}
            text2Style={styles.message}
        />
    ),
};

const AppToast = () => (
    <Toast
        config={toastConfig}
        position="top"
        topOffset={RS(56)}
        visibilityTime={4000}
        autoHide
        swipeable
    />
);

export default AppToast;

const styles = {
    toast: {
        minHeight: RS(64),
        borderLeftWidth: RS(4),
        borderRadius: Radii.md,
        backgroundColor: Colors.surface,
        marginHorizontal: Spacing.md,
        shadowColor: Colors.black,
        shadowOpacity: 0.12,
        shadowRadius: RS(8),
        shadowOffset: { width: 0, height: RS(3) },
        elevation: 4,
    },
    successToast: {
        borderLeftColor: Colors.success,
    },
    errorToast: {
        borderLeftColor: Colors.failed,
    },
    infoToast: {
        borderLeftColor: Colors.primary,
    },
    content: {
        paddingHorizontal: Spacing.md,
    },
    title: {
        color: Colors.textPrimary,
        fontSize: FontSize.body,
        fontWeight: '700' as const,
    },
    message: {
        color: Colors.textSecondary,
        fontSize: FontSize.bodySmall,
    },
};
