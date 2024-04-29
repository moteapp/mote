
//#region Basic definitions

export enum AnnotationType {
	Bold = 'b',
	Italics = 'i',
	Strike = 's',
	Code = 'c',
	Underline = '_',
	Link = 'a'
}

export type IAnnotation = [string];

/**
 * A segment of text with optional annotations.
 * The first element is the text, the second element is an array of annotations.
 * 
 * Example: 
 * ```
 * ['Hello, world!', [['b'], ['a', 'www.hello.com']]]
 * ```
 * - It represents the text "Hello, world!" with a bold annotation and a link annotation.
 * - The link annotation points to "www.hello.com".
 */
export type ISegment = [string, IAnnotation[]?];

export type RecordMetadata = Record<string, unknown>;

export interface IRecord {
	/**
	 * The unique identifier of the record.
	 */
	id: string;

    /**
     * The title of the record.
     * The format is an array of segments.
     * @see {@link ISegment} for more details.
     */
	title: ISegment[];
	
    /**
     * The content of the record.
     * Each of the elements is a id of {@link IRecord}.
     */
	content: string[];
    metadata: RecordMetadata;
	version: number;
	lastVersion: number;
    table: string;
	parentId?: string;
	spaceId?: string;
	userId: string;
	type: string;
}

export interface IRecordModel extends IRecord {
	
}

export enum Role {
	Editor = 0,
	Reader,
	CommmetOnly,
	ReadAndWrite,
}

export enum PermissionType {
	Public = 'public',
	Space = 'space',
	User = 'user',
}

export interface IRecordWithRole {
	role: Role;
	record: IRecord;
}

//#endregion

export enum RecordEditType {
	Update = 0,
    Set,
    ListBefore,
    ListAfter,
    ListRemove,
}

export interface IOperation {
    id: string;
    table: string;
    path: string[];
    type: RecordEditType;
    size?: number;
    args: any;
}

interface IListAfterArgs {
	id: string;
	after: string;
}

export interface IListAfterOperation extends IOperation {
	args: {
		id: string;
		after: string;
	};

}

export interface IPointer {
    table: string;
    id: string;
    spaceId?: string;
}

export function generateRecordKey(record: IRecord): string {
    return `${record.table}:${record.id}`;
}