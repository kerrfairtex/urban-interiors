import { api } from '../utils/api'

export const signOut = () => {
    return async (dispatch) => {
        localStorage.removeItem('PRODUCT_REF')
        try {
            await api('/api/auth/logout', { method: 'POST' })
        } finally {
            // Resets every slice (see rootReducer in store.js).
            dispatch({ type: 'app/logout' })
        }
    }
}
