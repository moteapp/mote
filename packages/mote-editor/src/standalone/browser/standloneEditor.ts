import { IStandaloneEditorConstructionOptions, IStandaloneMoteEditor, StandaloneEditor } from "./standloneMoteEditor";
import { StandaloneServices } from "./standloneServices";

/**
 * Create a new editor under `domElement`.
 * `domElement` should be empty (not contain other dom nodes).
 * The editor will read the size of `domElement`.
 */
export function create(domElement: HTMLElement, options?: IStandaloneEditorConstructionOptions): IStandaloneMoteEditor {
	const instantiationService = StandaloneServices.initialize();
	return instantiationService.createInstance(StandaloneEditor, domElement, options);
}

export function onDidChange() {
    
}

export function createMoteEditorAPI() {
    return {
        create: <any>create
    }
}