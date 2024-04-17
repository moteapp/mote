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
