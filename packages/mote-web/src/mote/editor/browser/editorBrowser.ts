import { ServicesAccessor } from "vs/platform/instantiation/common/instantiation";
import { IViewModel } from "../common/viewModelCommon";

export interface IMoteEditor {

	/**
	 * @internal
	 */
	getViewModel(): IViewModel | null;

    /**
	 * Execute `fn` with the editor's services.
	 * @internal
	 */
	invokeWithinContext<T>(fn: (accessor: ServicesAccessor) => T): T;

}