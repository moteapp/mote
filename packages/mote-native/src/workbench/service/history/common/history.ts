import { EditorInput } from "mote/workbench/common/editor/editorInput";

export interface IHistoryService {

	readonly _serviceBrand: undefined;

    /**
	 * Get the entire history of editors that were opened.
	 */
	getHistory(): readonly (EditorInput)[];

    /**
     * @internal remove this once the editor service is ready
     * @param editor 
     * @param insertFirst 
     */
    addToHistory(editor: EditorInput, insertFirst: boolean): void
}