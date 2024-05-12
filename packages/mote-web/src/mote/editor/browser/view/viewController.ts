import { RecordModel } from "mote/editor/common/model/recordModel";
import { ISegment } from "mote/editor/common/recordCommon";

export interface ICommandDelegate {
	paste(text: string, pasteOnNewLine: boolean, multicursorText: string[] | null, mode: string | null): void;
	type(text: string, model: RecordModel<ISegment[]>): void;
	lineBreak(model: RecordModel<ISegment[]>): void;
	compositionType(text: string, replacePrevCharCnt: number, replaceNextCharCnt: number, positionDelta: number): void;
	startComposition(): void;
	endComposition(): void;
	cut(): void;
}

export class ViewController {

    constructor(
        private readonly commandDelegate: ICommandDelegate
    ) {

    }

    public paste(text: string, pasteOnNewLine: boolean, multicursorText: string[] | null, mode: string | null): void {
		this.commandDelegate.paste(text, pasteOnNewLine, multicursorText, mode);
	}

    public type(text: string, model: RecordModel<ISegment[]>): void {
		this.commandDelegate.type(text, model);
	}

	public lineBreak(model: RecordModel<ISegment[]>): void {
		this.commandDelegate.lineBreak(model);
	}

	public compositionType(text: string, replacePrevCharCnt: number, replaceNextCharCnt: number, positionDelta: number): void {
		this.commandDelegate.compositionType(text, replacePrevCharCnt, replaceNextCharCnt, positionDelta);
	}

	public compositionStart(): void {
		this.commandDelegate.startComposition();
	}

	public compositionEnd(): void {
		this.commandDelegate.endComposition();
	}

	public cut(): void {
		this.commandDelegate.cut();
	}
}