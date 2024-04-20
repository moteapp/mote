import { URI } from "vs/base/common/uri";

export const WindowMinimumSize = {
	WIDTH: 400,
	WIDTH_WITH_VERTICAL_PANEL: 600,
	HEIGHT: 270
};

export interface IPoint {
	readonly x: number;
	readonly y: number;
}

export interface IRectangle extends IPoint {
	readonly width: number;
	readonly height: number;
}

export interface IBaseOpenWindowsOptions {

	/**
	 * Whether to reuse the window or open a new one.
	 */
	readonly forceReuseWindow?: boolean;

	/**
	 * The remote authority to use when windows are opened with either
	 * - no workspace (empty window)
	 * - a workspace that is neither `file://` nor `vscode-remote://`
	 * Use 'null' for a local window.
	 * If not set, defaults to the remote authority of the current window.
	 */
	readonly remoteAuthority?: string | null;
}

export interface IOpenWindowOptions extends IBaseOpenWindowsOptions {

}

export interface IOpenEmptyWindowOptions extends IBaseOpenWindowsOptions { }


export interface IBaseWindowOpenable {
	label?: string;
}

export interface IWorkspaceToOpen extends IBaseWindowOpenable {
	readonly workspaceUri: URI;
}

export interface IFileToOpen extends IBaseWindowOpenable {
	readonly fileUri: URI;
}

export type IWindowOpenable = IWorkspaceToOpen | IFileToOpen;
