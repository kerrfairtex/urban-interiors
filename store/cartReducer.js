import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { api } from "../utils/api";
import { setCart } from "./sessionReducer";

export const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        info: '',
        items: []
    },
    reducers: {
        addItemToCart(state, action) {
            if (action.payload.info === 'ADD')
                toast.success('Item has been added to Cart')
            else if (action.payload.info === 'UPDATE')
                toast.success('Cart updated to your new selection')
            else if (action.payload.info === 'FAIL')
                toast.info('Item already exists in Cart')
            return { ...state, info: action.payload.info }
        },
        increaseItemQuantity(state, action) {
            return state
        },
        decreaseItemQuantity(state, action) {
            return state
        },
        deleteItemFromCart(state, action) {
            if (action.payload.info === 'DELETE')
                toast.info('Item has been deleted from Cart')
            return { ...state, info: action.payload.info }
        },
        clearCart(state, action) {
            return {...state, info: action.payload.info}
        }
    }
})

export const
    { addItemToCart, increaseItemQuantity, decreaseItemQuantity, deleteItemFromCart, clearCart }
    = cartSlice.actions

export default cartSlice.reducer

// The server owns the cart and recalculates totals; we just store what it returns.
const updateCart = async (dispatch, body) => {
    try {
        const { cart } = await api('/api/cart', { method: 'POST', body })
        dispatch(setCart(cart))
        return true
    } catch (e) {
        if (e.status === 409) return 'FAIL'
        toast.error(e.message)
        return false
    }
}

export const addToCart = (productId, options, cart) => {
    return async (dispatch) => {
        const existed = !!cart?.items?.[productId]
        const result = await updateCart(dispatch, { action: 'add', productId, options })
        if (result === true) dispatch(addItemToCart({ info: existed ? 'UPDATE' : 'ADD' }))
    }
}

export const increaseQuantity = (productId) => {
    return async (dispatch) => {
        if (await updateCart(dispatch, { action: 'increase', productId }))
            dispatch(increaseItemQuantity())
    }
}

export const decreaseQuantity = (productId) => {
    return async (dispatch) => {
        if (await updateCart(dispatch, { action: 'decrease', productId }))
            dispatch(decreaseItemQuantity())
    }
}

export const deleteFromCart = (productId) => {
    return async (dispatch) => {
        if (await updateCart(dispatch, { action: 'remove', productId }))
            dispatch(deleteItemFromCart({ info: 'DELETE' }))
    }
}

export const deleteCart = () => {
    return async (dispatch) => {
        if (await updateCart(dispatch, { action: 'clear' }))
            dispatch(clearCart({ info: 'CLEAR' }))
    }
}
