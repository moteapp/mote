
import { Disposable } from 'vs/base/common/lifecycle';

export interface ISerializedEditorInput {
	readonly id: string;
	readonly value: string;
}

export interface ISerializedEditorGroupModel {
	readonly id: number;
	readonly locked?: boolean;
	readonly editors: ISerializedEditorInput[];
	readonly mru: number[];
	readonly preview?: number;
	sticky?: number;
}

export function isSerializedEditorGroupModel(group?: unknown): group is ISerializedEditorGroupModel {
	const candidate = group as ISerializedEditorGroupModel | undefined;

	return !!(candidate && typeof candidate === 'object' && Array.isArray(candidate.editors) && Array.isArray(candidate.mru));
}

export interface IReadonlyEditorGroupModel {

}

interface IEditorGroupModel extends IReadonlyEditorGroupModel {

}

export class EditorGroupModel extends Disposable implements IEditorGroupModel {

    constructor(
		labelOrSerializedGroup: ISerializedEditorGroupModel | undefined,
    ) {
        super();
    }
}
