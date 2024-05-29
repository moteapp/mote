declare namespace mote.editor {
    /**
     * Create a new editor under `domElement`.
     * `domElement` should be empty (not contain other dom nodes).
     * The editor will read the size of `domElement`.
     */
    export function create(domElement: HTMLElement, options?: IStandaloneEditorConstructionOptions): IStandaloneMoteEditor;

    export interface IStandaloneEditorConstructionOptions {

    }
    
    export interface IStandaloneMoteEditor {
    
    }
}

/**
 * Thenable is a common denominator between ES6 promises, Q, jquery.Deferred, WinJS.Promise,
 * and others. This API makes no assumption about what promise library is being used which
 * enables reusing existing code without migrating to a specific promise implementation. Still,
 * we recommend the use of native promises which are available in this editor.
 */
interface Thenable<T> extends PromiseLike<T> { }
