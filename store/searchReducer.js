import { createSlice } from "@reduxjs/toolkit"
import { api } from "../utils/api"

const dataState = {
    isLoading: true,
    isFetching: false,
    isLoaded: false,
    error: null,
    data: []
}

export const searchSlice = createSlice({
    name: 'search',
    initialState: dataState,
    reducers: {
        search(state, action) {
            return action.payload
        }
    }
})

export const { search } = searchSlice.actions

export default searchSlice.reducer

export const searchProducts = (searchTerm) => {
    return async (dispatch) => {
        dispatch(search({
            ...dataState, isFetching: true
        }))
        try {
            const { products } = await api(`/api/search?q=${encodeURIComponent(searchTerm)}`)
            dispatch(search({
                ...dataState,
                isLoading: false,
                isFetching: false,
                isLoaded: true,
                data: products
            }))
        } catch (e) {
            dispatch(search({
                ...dataState,
                isLoading: false,
                isFetching: false,
                error: e.message,
                data: null
            }))
        }
    }
}
