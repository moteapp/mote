import { IWorkspaceToOpen } from "mote/platform/window/common/window";

/**
 * The `IWorkbench` interface is the API facade for web embedders
 * to call into the workbench.
 *
 * Note: Changes to this interface need to be announced and adopted.
 */
export interface IWorkbench {
    /**
	 * Triggers shutdown of the workbench programmatically. After this method is
	 * called, the workbench is not usable anymore and the page needs to reload
	 * or closed.
	 *
	 * This will also remove any `beforeUnload` handlers that would bring up a
	 * confirmation dialog.
	 *
	 * The returned promise should be awaited on to ensure any data to persist
	 * has been persisted.
	 */
	shutdown: () => Promise<void>;
}

export interface IWorkbenchConstructionOptions {
    
}

/**
 * A workspace to open in the workbench can either be:
 * - a workspace file with 0-N folders (via `workspaceUri`)
 * - a single folder (via `folderUri`)
 * - empty (via `undefined`)
 */
export type IWorkspace = IWorkspaceToOpen | undefined;
