import { createSlice } from "@reduxjs/toolkit"
import { toast } from "react-toastify"
import { api } from "../utils/api"
import { setCart } from "./sessionReducer"

const dataState = {
    isLoading: true,
    isFetching: false,
    isLoaded: false,
    error: null,
    data: {}
}

const orderSlice = createSlice({
    name: 'orders',
    initialState: dataState,
    reducers: {
        fetchOrders(state, action) {
            return action.payload
        },
        createOrder(state, action) {
            return action.payload
        },
        updateStatus(state, action) {
            const { orderId, status } = action.payload
            if (Array.isArray(state.data)) {
                const order = state.data.find(o => o.orderId === orderId)
                if (order) order.status = status
            }
        }
    }
})

export const { fetchOrders, createOrder, updateStatus } = orderSlice.actions

export default orderSlice.reducer

const loadOrders = (path) => {
    return async (dispatch) => {
        dispatch(fetchOrders({
            ...dataState, isFetching: true
        }))
        try {
            const { orders } = await api(path)
            dispatch(fetchOrders({
                ...dataState,
                isLoading: false,
                isFetching: false,
                isLoaded: true,
                data: orders
            }))
        } catch (e) {
            dispatch(fetchOrders({
                ...dataState,
                isLoading: false,
                isFetching: false,
                isLoaded: true,
                error: e.message,
                data: null
            }))
        }
    }
}

export const retrieveOrders = () => loadOrders('/api/orders')

export const retrieveAllOrders = () => loadOrders('/api/admin/orders')

// Places an order from the signed-in user's cart. Resolves to the order, or null on failure.
export const addOrder = (userInfo) => {
    return async (dispatch) => {
        dispatch(createOrder({
            ...dataState, isFetching: true
        }))
        try {
            const { order, cart } = await api('/api/orders', { method: 'POST', body: userInfo })
            dispatch(setCart(cart))
            dispatch(createOrder({
                ...dataState,
                isLoading: false,
                isFetching: false,
                isLoaded: true,
                data: order
            }))
            return order
        } catch (e) {
            toast.error(e.message)
            dispatch(createOrder({
                ...dataState,
                isLoading: false,
                isFetching: false,
                error: e.message,
                data: {}
            }))
            return null
        }
    }
}

export const updateOrderStatus = (uid, orderId, status) => {
    return async (dispatch) => {
        try {
            await api('/api/admin/orders', { method: 'PATCH', body: { orderId, status } })
            dispatch(updateStatus({ orderId, status }))
            toast.info('Order status has been updated')
        } catch (e) {
            toast.error('Order status failed to update')
        }
    }
}
