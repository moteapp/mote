import { EditorSelection } from "./core/selection";
import { CursorChangeReason } from "./cursorEvents";

export const enum ViewEventType {
	ViewCompositionStart,
	ViewCompositionEnd,
	ViewConfigurationChanged,
	ViewCursorStateChanged,
	ViewDecorationsChanged,
	ViewFlushed,
	ViewFocusChanged,
	ViewLanguageConfigurationChanged,
	ViewLineMappingChanged,
	ViewLinesChanged,
	ViewLinesDeleted,
	ViewLinesInserted,
	ViewRevealRangeRequest,
	ViewScrollChanged,
	ViewThemeChanged,
	ViewTokensChanged,
	ViewTokensColorsChanged,
	ViewZonesChanged,
}

export class ViewCursorStateChangedEvent {

	public readonly type = ViewEventType.ViewCursorStateChanged;

	constructor(
		public readonly selections: EditorSelection[],
		public readonly reason: CursorChangeReason
	) { }
}