type SessionExpiredHandler = (expiredToken: string) => void;

let sessionExpiredHandler: SessionExpiredHandler | undefined;

export const registerSessionExpiredHandler = (handler: SessionExpiredHandler): void => {
    sessionExpiredHandler = handler;
};

export const notifySessionExpired = (expiredToken: string): void => {
    sessionExpiredHandler?.(expiredToken);
};
