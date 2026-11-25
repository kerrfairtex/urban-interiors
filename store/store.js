import { combineReducers, configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage'
import persistReducer from 'redux-persist/lib/persistReducer';
import persistStore from 'redux-persist/lib/persistStore';

import sessionReducer, { refreshSession } from './sessionReducer';
import productsReducer from './productsReducer';
import productReducer from './productReducer';
import cartReducer from './cartReducer';
import wishlistReducer from './wishlistReducer';
import orderReducer from './orderReducer';
import addProductReducer from './addProductReducer';
import searchReducer from './searchReducer';

const persistSessionConfig = {
    key: 'session',
    storage
}

const combinedReducers = combineReducers({
    session: persistReducer(persistSessionConfig, sessionReducer),
    products: productsReducer,
    product: productReducer,
    cart: cartReducer,
    order: orderReducer,
    addProduct: addProductReducer,
    wishlist: wishlistReducer,
    search: searchReducer
})

const rootReducer = (state, action) => {
    if (action.type === 'app/logout') {
        state = undefined
        storage.removeItem('persist:session')
    }
    return combinedReducers(state, action)
}

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false
    })
})

// After the saved session is restored, re-check it against the server cookie
// so the cart, wishlist and admin flag are current.
export const persistor = persistStore(store, null, () => {
    if (typeof window !== 'undefined') store.dispatch(refreshSession())
})
