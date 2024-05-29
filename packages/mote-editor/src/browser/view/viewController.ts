import { Event } from "vs/base/common/event";
import { Position } from "@mote/editor/common/core/position";
import { EditorSelection } from "@mote/editor/common/core/selection";
import { RecordModel } from "@mote/editor/common/model/recordModel";
import { ISegment } from "@mote/editor/common/recordCommon";
import { NavigationCommandRevealType } from "../commands/navigation";
import { CursorChangeReason } from "@mote/editor/common/cursorEvents";
import { IViewModel } from "@mote/editor/common/viewModelCommon";
import { SelectionStartKind, SingleCursorState } from "@mote/editor/common/cursorCommon";
import { EditorRange } from "@mote/editor/common/core/range";
import { ViewCursorStateChangedEvent } from "@mote/editor/common/viewEvents";

export interface ICommandDelegate {

	getSelection(): EditorSelection;

	paste(text: string, pasteOnNewLine: boolean, multicursorText: string[] | null, mode: string | null): void;

	type(text: string, model: RecordModel<ISegment[]>): void;

	lineBreak(model: RecordModel<ISegment[]>): void;

	compositionType(text: string, replacePrevCharCnt: number, replaceNextCharCnt: number, positionDelta: number): void;

	startComposition(): void;

	endComposition(): void;

	cut(): void;
}

export class ViewController {

	public onCursorStateChanged: Event<ViewCursorStateChangedEvent>;

    constructor(
		private readonly viewModel: IViewModel,
        private readonly commandDelegate: ICommandDelegate
    ) {
		this.onCursorStateChanged = viewModel.onCursorStateChanged;
    }

	public moveTo(viewPosition: Position, revealType: NavigationCommandRevealType): void {
		const cursorState = new SingleCursorState(
			EditorRange.fromPositions(viewPosition),
			SelectionStartKind.Simple,
			0,
			viewPosition,
			0
		);
		console.log('moveTo->', cursorState.position);
		this.viewModel.setCursorStates('', CursorChangeReason.ContentFlush, [cursorState]);
	}

	public getSelection(): EditorSelection {
		return this.commandDelegate.getSelection();
	}

	public getCurrentContent(): string {
		return this.viewModel.getLineContent(this.getSelection().startLineNumber);
	}

    public paste(text: string, pasteOnNewLine: boolean, multicursorText: string[] | null, mode: string | null): void {
		this.commandDelegate.paste(text, pasteOnNewLine, multicursorText, mode);
	}

    public type(text: string, model: RecordModel<ISegment[]>): void {
		const content = this.getCurrentContent();
		this.commandDelegate.type(text, model);
		const selection = this.getSelection();
        const newPosition = selection.getPosition().delta(0, text.length - content.length);
		this.moveTo(newPosition, NavigationCommandRevealType.Regular);
	}

	public lineBreak(model: RecordModel<ISegment[]>): void {
		this.commandDelegate.lineBreak(model);
		const selection = this.getSelection();
        const newPosition = selection.getPosition().delta(+1, 0);
		this.moveTo(newPosition, NavigationCommandRevealType.Regular);
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