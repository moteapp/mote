'use client';
import { PropsWithChildren, useRef } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { fetchAuthConfig } from 'mote/app/store/features/auth/authSlice';
import { makeStore, AppStore } from './store/store';

export default function StoreProvider({ children }: PropsWithChildren) {
    const storeRef = useRef<AppStore>(); 
    if (!storeRef.current) {
        console.log('[StoreProvider] Creating store');
        // Create the store instance the first time this renders
        storeRef.current = makeStore();
        // Load the initial state bellow
        storeRef.current.dispatch(fetchAuthConfig());
    }

    return (
        <Provider store={storeRef.current}>
            <PersistGate loading={<h1>Loading</h1>} persistor={(storeRef.current as any).__persistor}>
                {children}
            </PersistGate>
        </Provider>
    );
}
