import { Composite } from 'mote/workbench/browser/composite';
import { IEditorPane } from 'mote/workbench/common/editorCommon';
import { DEFAULT_EDITOR_MAX_DIMENSIONS, DEFAULT_EDITOR_MIN_DIMENSIONS } from './editor';

/**
 * The base class of editors in the workbench. Editors register themselves for specific editor inputs.
 * Editors are layed out in the editor part of the workbench in editor groups. Multiple editors can be
 * open at the same time. Each editor has a minimized representation that is good enough to provide some
 * information about the state of the editor data.
 *
 * The workbench will keep an editor alive after it has been created and show/hide it based on
 * user interaction. The lifecycle of a editor goes in the order:
 *
 * - `createEditor()`
 * - `setEditorVisible()`
 * - `layout()`
 * - `setInput()`
 * - `focus()`
 * - `dispose()`: when the editor group the editor is in closes
 *
 * During use of the workbench, a editor will often receive a `clearInput()`, `setEditorVisible()`, `layout()` and
 * `focus()` calls, but only one `create()` and `dispose()` call.
 *
 * This class is only intended to be subclassed and not instantiated.
 */
export abstract class EditorPane extends Composite implements IEditorPane {

    get minimumWidth() { return DEFAULT_EDITOR_MIN_DIMENSIONS.width; }
	get maximumWidth() { return DEFAULT_EDITOR_MAX_DIMENSIONS.width; }
	get minimumHeight() { return DEFAULT_EDITOR_MIN_DIMENSIONS.height; }
	get maximumHeight() { return DEFAULT_EDITOR_MAX_DIMENSIONS.height; }
}