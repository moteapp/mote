import { combineSlices, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
  } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import { authSlice } from './features/auth/authSlice';
import { blockSlice } from './features/block/blockSlice';
import { layoutSlice } from './features/layout/layoutSlice';
// eslint-disable-next-line no-duplicate-imports
import type { Action, ThunkAction } from '@reduxjs/toolkit';

// `combineSlices` automatically combines the reducers using
// their `reducerPath`s, therefore we no longer need to call `combineReducers`.
const rootReducer = combineSlices(layoutSlice, authSlice, blockSlice);

const createNoopStorage = () => {
    return {
        getItem() {
            return Promise.resolve(null);
        },
        setItem(_key: string, value: number) {
            return Promise.resolve(value);
        },
        removeItem() {
            return Promise.resolve();
        },
    };
};

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
}

// Infer the `RootState` type from the root reducer
export type RootState = ReturnType<typeof rootReducer>;

const persistedReducer = persistReducer(persistConfig, rootReducer) as any as typeof rootReducer;

// The store setup is wrapped in `makeStore` to allow reuse
// when setting up tests that need the same store config
export const makeStore = (preloadedState?: Partial<RootState>) => {
    const store = configureStore({
        reducer: persistedReducer,
        // Adding the api middleware enables caching, invalidation, polling,
        // and other useful features of `rtk-query`.
        middleware: (getDefaultMiddleware) => {
            return getDefaultMiddleware(
                {
                    serializableCheck: {
                        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
                    },
                }
            ); // .concat(quotesApiSlice.middleware);
        },
        preloadedState,
    });
    // @ts-expect-error Description: This hack is used for SSR.
    store.__persistor = persistStore(store);
    // configure listeners using the provided defaults
    // optional, but required for `refetchOnFocus`/`refetchOnReconnect` behaviors
    setupListeners(store.dispatch);
    return store;
};

// Infer the type of `store`
export type AppStore = ReturnType<typeof makeStore>

// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore['dispatch'];

export type AppThunk<ThunkReturnType = void> = ThunkAction<
    ThunkReturnType,
    RootState,
    unknown,
    Action
>;
