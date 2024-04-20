import { localize } from 'vs/nls';
import { RawContextKey } from 'vs/platform/contextkey/common/contextkey';


//#region < --- Views --- >

export const FocusedViewContext = new RawContextKey<string>('focusedView', '', localize('focusedView', "The identifier of the view that has keyboard focus"));
export function getVisbileViewContextKey(viewId: string): string { return `view.${viewId}.visible`; }

//#endregion