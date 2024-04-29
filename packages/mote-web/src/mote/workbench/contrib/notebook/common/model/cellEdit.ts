import { URI } from 'vs/base/common/uri';
import { IResourceUndoRedoElement, UndoRedoElementType } from 'vs/platform/undoRedo/common/undoRedo';

export class InsertCellEdit implements IResourceUndoRedoElement {

    type: UndoRedoElementType.Resource = UndoRedoElementType.Resource;

    get label() {
        return 'Insert Cell';
    }

    code: string = 'undoredo.textBufferEdit';
    
    constructor(
		public resource: URI,
    ) {
        
    }
    undo(): void | Promise<void> {
        
    }

    redo(): void | Promise<void> {
        
    }
}