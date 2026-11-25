import { createSlice } from '@reduxjs/toolkit'
import { api } from '../utils/api'

// Keeps the same shape the UI used with react-redux-firebase:
// state.session.auth.{uid,isEmpty,isLoaded} and state.session.profile.{displayName,email,cart,wishlist,isEmpty,isAdmin}
const signedOut = {
    auth: { uid: null, isEmpty: true, isLoaded: true },
    profile: { isEmpty: true, isLoaded: true }
}

const fromProfile = (profile) => profile ? {
    auth: { uid: profile.uid, isEmpty: false, isLoaded: true },
    profile: { ...profile, isEmpty: false, isLoaded: true }
} : signedOut

const sessionSlice = createSlice({
    name: 'session',
    initialState: {
        auth: { uid: null, isEmpty: true, isLoaded: false },
        profile: { isEmpty: true, isLoaded: false }
    },
    reducers: {
        setProfile(state, action) {
            return fromProfile(action.payload)
        },
        setCart(state, action) {
            state.profile.cart = action.payload
        },
        setWishlist(state, action) {
            state.profile.wishlist = action.payload
        }
    }
})

export const { setProfile, setCart, setWishlist } = sessionSlice.actions
export default sessionSlice.reducer

// Re-reads the session from the server cookie (e.g. on page load).
export const refreshSession = () => async (dispatch) => {
    try {
        const { profile } = await api('/api/auth/me')
        dispatch(setProfile(profile))
    } catch (e) {
        // Network/server error: keep whatever we had.
    }
}

export const login = (email, password) => async (dispatch) => {
    const { profile } = await api('/api/auth/login', { method: 'POST', body: { email, password } })
    dispatch(setProfile(profile))
    return profile
}

export const signup = (fullname, email, password) => async (dispatch) => {
    const { profile } = await api('/api/auth/signup', { method: 'POST', body: { fullname, email, password } })
    dispatch(setProfile(profile))
    return profile
}
