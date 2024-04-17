/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export type MoteWindow = Window & typeof globalThis & {
	readonly moteWindowId: number;
};

export function ensureMoteWindow(targetWindow: Window, fallbackWindowId: number): asserts targetWindow is MoteWindow {
	const MoteWindow = targetWindow as Partial<MoteWindow>;

	if (typeof MoteWindow.moteWindowId !== 'number') {
		Object.defineProperty(MoteWindow, 'moteWindowId', {
			get: () => fallbackWindowId
		});
	}
}

// eslint-disable-next-line no-restricted-globals
export const mainWindow = window as MoteWindow;

export function isAuxiliaryWindow(obj: Window): obj is MoteWindow {
	if (obj === mainWindow) {
		return false;
	}

	const candidate = obj as MoteWindow | undefined;

	return typeof candidate?.moteWindowId === 'number';
}
