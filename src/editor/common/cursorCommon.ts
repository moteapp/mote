import { ICommand } from "./editorCommon";

export class EditOperationResult {

    constructor(
        readonly commands: Array<ICommand>,
        readonly opts: {
			shouldPushStackElementBefore: boolean;
			shouldPushStackElementAfter: boolean;
		}
    ) {

    }
}