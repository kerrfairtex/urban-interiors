import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { api } from "../utils/api";
import { setWishlist } from "./sessionReducer";

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: {
        info: '',
        wishlist: []
    },
    reducers: {
        addItemToWishlist(state, action) {
            if (action.payload.info === 'ADD')
                toast.success('Item has been added to wishlist')
            else if (action.payload.info === 'FAIL')
                toast.info('Item already exists in wishlist')
            return {
                info: action.payload.info,
                wishlist: action.payload.items
            }
        },
        removeItemFromWishlist(state, action) {
            if (action.payload.info === 'DELETE')
                toast.info('Item has been removed from wishlist')
            return {
                info: action.payload.info,
                wishlist: action.payload.items
            }
        }
    }
})

export const { addItemToWishlist, removeItemFromWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer

export const addToWishlist = (productId, wishlist = []) => {
    return async (dispatch) => {
        if (wishlist.includes(productId)) {
            dispatch(addItemToWishlist({ info: 'FAIL', items: wishlist }))
            return
        }
        try {
            const { wishlist: items } = await api('/api/wishlist', {
                method: 'POST', body: { action: 'add', productId }
            })
            dispatch(setWishlist(items))
            dispatch(addItemToWishlist({ info: 'ADD', items }))
        } catch (e) {
            if (e.status === 409) dispatch(addItemToWishlist({ info: 'FAIL', items: wishlist }))
            else toast.error(e.message)
        }
    }
}

export const deleteFromWishlist = (productId) => {
    return async (dispatch) => {
        try {
            const { wishlist: items } = await api('/api/wishlist', {
                method: 'POST', body: { action: 'remove', productId }
            })
            dispatch(setWishlist(items))
            dispatch(removeItemFromWishlist({ info: 'DELETE', items }))
        } catch (e) {
            toast.error(e.message)
        }
    }
}
