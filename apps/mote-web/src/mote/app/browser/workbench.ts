import * as zhCNBundle from 'extensions/languages/zh-cn.json';
import * as nls from '@mote/base/common/nls';
nls.create('zh-cn', zhCNBundle);

import { mainWindow } from 'mote/base/browser/window';
import { ColorScheme, IWorkbenchConstructionOptions, IWorkspace, IWorkspaceProvider } from 'mote/workbench/browser/web.api';
import { LogLevel, URI, create } from 'mote/workbench/workbench.web.main';
import { isStandalone } from 'vs/base/browser/browser';
import { Schemas } from 'vs/base/common/network';
import { parse, posix } from 'vs/base/common/path';
import { isEqual } from 'vs/base/common/resources';
import { ltrim } from 'vs/base/common/strings';
import { UriComponents } from 'vs/base/common/uri';
import { isFolderToOpen, isWorkspaceToOpen } from 'vs/platform/window/common/window';
import { LightModernColors } from './theme';
import './useWorker';

class WorkspaceProvider implements IWorkspaceProvider {

	private static QUERY_PARAM_EMPTY_WINDOW = 'ew';
	private static QUERY_PARAM_FOLDER = 'folder';
	private static QUERY_PARAM_WORKSPACE = 'workspace';

	private static QUERY_PARAM_PAYLOAD = 'payload';

	static create(config: IWorkbenchConstructionOptions & { folderUri?: UriComponents; workspaceUri?: UriComponents }) {
		let foundWorkspace = false;
		let workspace: IWorkspace;
		let payload = Object.create(null);

		const query = new URL(document.location.href).searchParams;
		query.forEach((value, key) => {
			switch (key) {

				// Folder
				case WorkspaceProvider.QUERY_PARAM_FOLDER:
					if (config.remoteAuthority && value.startsWith(posix.sep)) {
						// when connected to a remote and having a value
						// that is a path (begins with a `/`), assume this
						// is a vscode-remote resource as simplified URL.
						workspace = { folderUri: URI.from({ scheme: Schemas.vscodeRemote, path: value, authority: config.remoteAuthority }) };
					} else {
						workspace = { folderUri: URI.parse(value) };
					}
					foundWorkspace = true;
					break;

				// Workspace
				case WorkspaceProvider.QUERY_PARAM_WORKSPACE:
					if (config.remoteAuthority && value.startsWith(posix.sep)) {
						// when connected to a remote and having a value
						// that is a path (begins with a `/`), assume this
						// is a vscode-remote resource as simplified URL.
						workspace = { workspaceUri: URI.from({ scheme: Schemas.vscodeRemote, path: value, authority: config.remoteAuthority }) };
					} else {
						workspace = { workspaceUri: URI.parse(value) };
					}
					foundWorkspace = true;
					break;

				// Empty
				case WorkspaceProvider.QUERY_PARAM_EMPTY_WINDOW:
					workspace = undefined;
					foundWorkspace = true;
					break;

				// Payload
				case WorkspaceProvider.QUERY_PARAM_PAYLOAD:
					try {
						payload = parse(value); // use marshalling#parse() to revive potential URIs
					} catch (error) {
						console.error(error); // possible invalid JSON
					}
					break;
			}
		});

		// If no workspace is provided through the URL, check for config
		// attribute from server
		if (!foundWorkspace) {
			if (config.folderUri) {
				workspace = { folderUri: URI.revive(config.folderUri) };
			} else if (config.workspaceUri) {
				workspace = { workspaceUri: URI.revive(config.workspaceUri) };
			}
		}

		payload = payload || {};
		payload['skipWelcome'] = 'true'; // always skip the welcome page

		return new WorkspaceProvider(workspace, payload, config);
	}

	readonly trusted = true;

	private constructor(
		readonly workspace: IWorkspace,
		readonly payload: object,
		private readonly config: IWorkbenchConstructionOptions
	) {
	}

	async open(workspace: IWorkspace, options?: { reuse?: boolean; payload?: object }): Promise<boolean> {
		if (options?.reuse && !options.payload && this.isSame(this.workspace, workspace)) {
			return true; // return early if workspace and environment is not changing and we are reusing window
		}

		const targetHref = this.createTargetUrl(workspace, options);
		if (targetHref) {
			if (options?.reuse) {
				mainWindow.location.href = targetHref;
				return true;
			} else {
				let result;
				if (isStandalone()) {
					result = mainWindow.open(targetHref, '_blank', 'toolbar=no'); // ensures to open another 'standalone' window!
				} else {
					result = mainWindow.open(targetHref);
				}

				return !!result;
			}
		}
		return false;
	}

	private createTargetUrl(workspace: IWorkspace, options?: { reuse?: boolean; payload?: object }): string | undefined {

		// Empty
		let targetHref: string | undefined = undefined;
		if (!workspace) {
			targetHref = `${document.location.origin}${document.location.pathname}?${WorkspaceProvider.QUERY_PARAM_EMPTY_WINDOW}=true`;
		}

		// Folder
		else if (isFolderToOpen(workspace)) {
			const queryParamFolder = this.encodeWorkspacePath(workspace.folderUri);
			targetHref = `${document.location.origin}${document.location.pathname}?${WorkspaceProvider.QUERY_PARAM_FOLDER}=${queryParamFolder}`;
		}

		// Workspace
		else if (isWorkspaceToOpen(workspace)) {
			const queryParamWorkspace = this.encodeWorkspacePath(workspace.workspaceUri);
			targetHref = `${document.location.origin}${document.location.pathname}?${WorkspaceProvider.QUERY_PARAM_WORKSPACE}=${queryParamWorkspace}`;
		}

		// Append payload if any
		if (options?.payload) {
			targetHref += `&${WorkspaceProvider.QUERY_PARAM_PAYLOAD}=${encodeURIComponent(JSON.stringify(options.payload))}`;
		}

		return targetHref;
	}

	private encodeWorkspacePath(uri: URI): string {
		if (this.config.remoteAuthority && uri.scheme === Schemas.vscodeRemote) {

			// when connected to a remote and having a folder
			// or workspace for that remote, only use the path
			// as query value to form shorter, nicer URLs.
			// however, we still need to `encodeURIComponent`
			// to ensure to preserve special characters, such
			// as `+` in the path.

			return encodeURIComponent(`${posix.sep}${ltrim(uri.path, posix.sep)}`).replaceAll('%2F', '/');
		}

		return encodeURIComponent(uri.toString(true));
	}

	private isSame(workspaceA: IWorkspace, workspaceB: IWorkspace): boolean {
		if (!workspaceA || !workspaceB) {
			return workspaceA === workspaceB; // both empty
		}

		if (isFolderToOpen(workspaceA) && isFolderToOpen(workspaceB)) {
			return isEqual(workspaceA.folderUri, workspaceB.folderUri); // same workspace
		}

		if (isWorkspaceToOpen(workspaceA) && isWorkspaceToOpen(workspaceB)) {
			return isEqual(workspaceA.workspaceUri, workspaceB.workspaceUri); // same workspace
		}

		return false;
	}

	hasRemote(): boolean {
		if (this.workspace) {
			if (isFolderToOpen(this.workspace)) {
				return this.workspace.folderUri.scheme === Schemas.vscodeRemote;
			}

			if (isWorkspaceToOpen(this.workspace)) {
				return this.workspace.workspaceUri.scheme === Schemas.vscodeRemote;
			}
		}

		return true;
	}
}

const config: IWorkbenchConstructionOptions & { folderUri?: UriComponents; workspaceUri?: UriComponents; callbackRoute: string } = {
    initialColorTheme: { themeType: ColorScheme.LIGHT, colors: LightModernColors},
    developmentOptions: {
        logLevel: LogLevel.Debug,
    }
};

// Create workbench
create(mainWindow.document.body, {
    windowIndicator: {label: 'Mote', tooltip: 'Mote Web'},
    workspaceProvider: WorkspaceProvider.create(config),
});
