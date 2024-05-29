import { Event } from "vs/base/common/event";
import { EditorSelection } from "./core/selection";
import { PartialCursorState, SingleCursorState } from "./cursorCommon";
import { CursorChangeReason } from "./cursorEvents";
import { ViewCursorStateChangedEvent } from "./viewEvents";

export interface IViewModel {

    onCursorStateChanged: Event<ViewCursorStateChangedEvent>;

    selection: EditorSelection;

    getLineContent(lineNumber: number): string;

    setCursorStates(source: string | null | undefined, reason: CursorChangeReason, states: SingleCursorState[] | null): boolean;
}