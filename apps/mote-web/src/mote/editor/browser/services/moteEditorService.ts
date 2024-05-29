import { createDecorator } from "vs/platform/instantiation/common/instantiation";
import { IMoteEditor } from "../editorBrowser";

export const IMoteEditorService = createDecorator<IMoteEditorService>('moteEditorService');

export interface IMoteEditorService {
	readonly _serviceBrand: undefined;

	getFocusedMoteEditor(): IMoteEditor | null;
	getActiveMoteEditor(): IMoteEditor | null;
}