'use client';
import { useSyncExternalStore } from 'react';
import { IModel } from 'mote/editor/common/model';

export function useModelChanges<T>(model: IModel<T>) {
    return useSyncExternalStore(
        (callback) => {
            const listener = model.onDidChange(callback);
            return () => listener.dispose();
        },
        () => model.state
    );
}
