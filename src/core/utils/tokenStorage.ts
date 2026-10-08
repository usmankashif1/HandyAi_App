const TOKEN_STORAGE_KEY = 'gymsaas_pwa_access_token_v1'

const getWebStorage = () => {
    if (typeof globalThis === 'undefined') {
        return null
    }

    if (typeof globalThis.localStorage !== 'undefined') {
        return globalThis.localStorage
    }

    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
        return window.localStorage
    }

    return null
}

export const saveToken = (token: string | null | undefined) => {
    const storage = getWebStorage()
    if (!storage) {
        return
    }

    if (!token || !token.trim()) {
        storage.removeItem(TOKEN_STORAGE_KEY)
        return
    }

    try {
        storage.setItem(TOKEN_STORAGE_KEY, token.trim())
    } catch (error) {
        console.warn('Unable to persist token locally:', error)
    }
}

export const readToken = () => {
    const storage = getWebStorage()
    if (!storage) {
        return null
    }

    try {
        const token = storage.getItem(TOKEN_STORAGE_KEY)
        if (!token || !token.trim()) {
            storage.removeItem(TOKEN_STORAGE_KEY)
            return null
        }

        return token.trim()
    } catch (error) {
        console.warn('Unable to read persisted token:', error)
        return null
    }
}

export const clearToken = () => {
    const storage = getWebStorage()
    if (!storage) {
        return
    }

    try {
        storage.removeItem(TOKEN_STORAGE_KEY)
    } catch (error) {
        console.warn('Unable to clear persisted token:', error)
    }
}

export const hasPersistedToken = () => Boolean(readToken())
