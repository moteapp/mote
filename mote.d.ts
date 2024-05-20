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