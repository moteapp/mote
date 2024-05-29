export type EventHandler = (e: any) => boolean;

export interface KeyboardShortcut {
    listener: any;
    enabled: boolean;
    shortcuts: Record<string, EventHandler | undefined>;
    dispose(): void;
}

class KeyboardShortcutsRegistryImpl {

    private shortcuts: KeyboardShortcut | null = null;
    private stack: KeyboardShortcut[] = [];
    
    constructor() {
       
    }

    getStack() {
        return this.stack;
    }

    getShortcuts(): KeyboardShortcut['shortcuts'] | undefined {
        return this.shortcuts?.shortcuts;
    }
    
    registerShortcut(shortcut: KeyboardShortcut) {
        this.stack.push(shortcut);
    }

    removeShortcut(listener: any) {
        const index = this.stack.findIndex(s => s.listener === listener);
        if (index > -1) {
            this.stack.splice(index, 1);
        }
    }
}

export const KeyboardShortcutsRegistry: KeyboardShortcutsRegistryImpl = new KeyboardShortcutsRegistryImpl();