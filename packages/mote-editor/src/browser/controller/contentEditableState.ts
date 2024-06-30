export interface IContentEditableWrapper {
	getValue(): string;
	setValue(reason: string, value: string): void;

	getSelectionStart(): number;
	getSelectionEnd(): number;
	setSelectionRange(reason: string, selectionStart: number, selectionEnd: number): void;
}