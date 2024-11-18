import { IModel } from 'mote/editor/common/model';
import { useSyncExternalStore } from 'react';

export function useModelChanges<T>(model: IModel<T>) {
    return useSyncExternalStore(
        (callback) => {
            const listener = model.onDidChange(callback);
            return () => listener.dispose();
        },
        () => model.state
    );
}
