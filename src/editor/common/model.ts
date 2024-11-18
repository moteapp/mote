import { Event } from 'mote/base/common/event';

export interface IModel<T> {
    readonly onDidChange: Event<T>;

    readonly state: T;
}

/**
 * Document snapshot that works like an iterator.
 * Will try to return chunks of roughly ~64KB size.
 * Will return null when finished.
 */
export interface IDocumentSnapshot {
	read(): string | null;
}

/**
 * @internal
 */
export function isIDocumentSnapshot(obj: any): obj is IDocumentSnapshot {
	return (obj && typeof obj.read === 'function');
}


/**
 * A document model represents the state of a document.
 * It is a tree of blocks, where each block has a unique identifier.  
 * 
 * You can list all the blocks in the document by `rootId`.
 */
export interface IDocumentModel {
    /**
	 * A unique identifier associated with this model.
	 */
	readonly rootId: string;

    /**
	 * Replace the entire text buffer value contained in this model.  
     * It's useful when you want to load the document from a markdown file or clipboard.
	 */
	setValue(newValue: string | IDocumentSnapshot): void;

    /**
     * Get the document in text formart.
     */
    getValue(): string;
}