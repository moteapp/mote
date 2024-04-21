import { registerAction2 } from 'vs/platform/actions/common/actions';
import { NavigateBackwardsAction, NavigateForwardAction, NewEmptyEditorWindowAction } from './editorActions';

registerAction2(NewEmptyEditorWindowAction);

registerAction2(NavigateBackwardsAction);
registerAction2(NavigateForwardAction);