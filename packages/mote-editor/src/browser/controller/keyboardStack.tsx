import * as React from "react";
import { useEffect } from "react";
import { KeyboardShortcut, KeyboardShortcutsRegistry } from "./keyboardBindingRegistry";

export interface IKeyboardStackEntryProps {
    id: string;
    shortcuts: KeyboardShortcut['shortcuts'];
    children: React.ReactNode;
}

export const KeyboardStackEntry = (props: IKeyboardStackEntryProps) => {

    useEffect(() => {
        const shortcut: KeyboardShortcut = {
            listener: props.id,
            enabled: true,
            shortcuts: props.shortcuts,
            dispose: () => {}
        };

        KeyboardShortcutsRegistry.registerShortcut(shortcut);

        return () => KeyboardShortcutsRegistry.removeShortcut(this);
    }, [props.shortcuts]);
    
    return props.children;
}