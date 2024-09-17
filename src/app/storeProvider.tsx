'use client';
import { fetchAuthConfig } from 'mote/app/store/features/auth/authSlice';
import { PropsWithChildren, useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from './store/store';

export default function StoreProvider({ children }: PropsWithChildren) {
    const storeRef = useRef<AppStore>();
    if (!storeRef.current) {
        // Create the store instance the first time this renders
        storeRef.current = makeStore();
        // Load the initial state bellow
        storeRef.current.dispatch(fetchAuthConfig());
    }

    return <Provider store={storeRef.current}>{children}</Provider>;
}
