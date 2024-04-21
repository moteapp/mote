import { registerAction2 } from 'vs/platform/actions/common/actions';
import { NavigateForwardAction, NewEmptyEditorWindowAction } from './editorActions';

registerAction2(NewEmptyEditorWindowAction);

registerAction2(NavigateForwardAction);