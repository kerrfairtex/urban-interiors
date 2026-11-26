import { createSlice } from '@reduxjs/toolkit'
import { upload } from '@vercel/blob/client'
import { toast } from 'react-toastify'
import { api } from '../utils/api'

const dataState = {
    isLoading: true,
    isFetching: false,
    isLoaded: false,
    error: null,
    data: null
}

export const addProductSlice = createSlice({
    name: 'addProducts',
    initialState: dataState,
    reducers: {
        addProduct(state, action) {
            if (action.payload.error) toast.error(action.payload.error)
            else toast.success('Product has been added to database')
            return action.payload
        }
    }
})

export const { addProduct } = addProductSlice.actions

export default addProductSlice.reducer

// Uploads the images straight to Vercel Blob, then saves the product with their URLs.
export const addNewProduct = (product, changeLoadState) => {
    return async (dispatch) => {
        try {
            const files = (product.images || []).filter(Boolean)
            const images = await Promise.all(files.map(async (file) => {
                const blob = await upload(`products/${product.category}/${file.name}`, file, {
                    access: 'public',
                    handleUploadUrl: '/api/admin/upload'
                })
                return blob.url
            }))
            const views = {}
            for (const [key, file] of Object.entries(product.viewFiles || {})) {
                if (!file) continue
                const blob = await upload(`products/${product.category}/${key}-${file.name}`, file, {
                    access: 'public',
                    handleUploadUrl: '/api/admin/upload'
                })
                views[key] = blob.url
            }
            const { viewFiles, ...rest } = product
            const { product: saved } = await api('/api/admin/products', {
                method: 'POST', body: { ...rest, images, details: { ...rest.details, views } }
            })
            dispatch(addProduct({
                ...dataState,
                isLoading: false,
                isLoaded: true,
                data: saved.pid
            }))
        } catch (e) {
            dispatch(addProduct({
                ...dataState,
                isLoading: false,
                isLoaded: true,
                error: e.message
            }))
        } finally {
            changeLoadState()
        }
    }
}
