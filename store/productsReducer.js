import { createSlice } from "@reduxjs/toolkit";
import { api } from "../utils/api";

// `lastVisible` is the offset of the next page to load.
const dataState = {
    isLoading: true,
    isFetching: false,
    isLoaded: false,
    error: null,
    data: {},
    lastVisible: null,
    endOfData: false
}

export const productSlice = createSlice({
    name: 'products',
    initialState: dataState,
    reducers: {
        fetchProducts(state, action) {
            return action.payload
        },
        filterProductsByPrice(state, action) {
            return action.payload
        },
        filterProductsBySubCategory(state, action) {
            return action.payload
        }
    }
})

export const { fetchProducts, filterProductsByPrice, filterProductsBySubCategory }
    = productSlice.actions

export default productSlice.reducer

const loadProducts = (action, params, prevData = {}) => {
    return async (dispatch) => {
        dispatch(action({
            ...dataState, data: prevData, isFetching: true
        }))
        const query = new URLSearchParams(
            Object.entries(params).filter(([, v]) => v !== null && v !== undefined && v !== '')
        )
        try {
            const { products, nextOffset, endOfData } = await api(`/api/products?${query}`)
            const result = {}
            products.forEach(product => { result[product.pid] = product })
            dispatch(action({
                ...dataState,
                isLoading: false,
                isFetching: false,
                isLoaded: true,
                data: { ...prevData, ...result },
                lastVisible: nextOffset,
                endOfData
            }))
        } catch (e) {
            dispatch(action({
                ...dataState,
                isLoading: false,
                isFetching: false,
                error: e.message,
                data: null
            }))
        }
    }
}

export const getProducts = (path, prevData, lastVisible) =>
    loadProducts(fetchProducts, { category: path, offset: lastVisible || 0 }, prevData || {})

// Filters always start from the first page of matching products.
export const getProductsByColor = (path, color) =>
    loadProducts(fetchProducts, { category: path, color })

export const getProductsByPrice = (path, minPrice, maxPrice) =>
    loadProducts(filterProductsByPrice, { category: path, minPrice, maxPrice })

export const getProductsBySubCategory = (subCategory) =>
    loadProducts(filterProductsBySubCategory, { subcategory: subCategory })
