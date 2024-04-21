/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from 'vs/nls';

import * as types from 'vs/base/common/types';
import * as resources from 'vs/base/common/resources';
import { ExtensionData, IThemeExtensionPoint, VS_LIGHT_THEME, VS_DARK_THEME, VS_HC_THEME, VS_HC_LIGHT_THEME } from 'mote/workbench/services/themes/common/workbenchThemeService';

import { Event, Emitter } from 'vs/base/common/event';
import { URI } from 'vs/base/common/uri';
import { Disposable, IDisposable } from 'vs/base/common/lifecycle';


export function registerColorThemeExtensionPoint() {
}
export function registerFileIconThemeExtensionPoint() {
	
}

export function registerProductIconThemeExtensionPoint() {

}

export interface ThemeChangeEvent<T> {
	themes: T[];
	added: T[];
	removed: T[];
}

export interface IThemeData {
	id: string;
	settingsId: string | null;
	location?: URI;
}

export class ThemeRegistry<T extends IThemeData> implements IDisposable {

	private extensionThemes: T[];

	private readonly onDidChangeEmitter = new Emitter<ThemeChangeEvent<T>>();
	public readonly onDidChange: Event<ThemeChangeEvent<T>> = this.onDidChangeEmitter.event;

	constructor(
		private create: (theme: IThemeExtensionPoint, themeLocation: URI, extensionData: ExtensionData) => T,
		private idRequired = false,
		private builtInTheme: T | undefined = undefined
	) {
		this.extensionThemes = [];
		this.initialize();
	}

	dispose() {
	
	}

	private initialize() {

	}

	public findThemeById(themeId: string): T | undefined {
		if (this.builtInTheme && this.builtInTheme.id === themeId) {
			return this.builtInTheme;
		}
		const allThemes = this.getThemes();
		for (const t of allThemes) {
			if (t.id === themeId) {
				return t;
			}
		}
		return undefined;
	}

	public findThemeBySettingsId(settingsId: string | null, defaultSettingsId?: string): T | undefined {
		if (this.builtInTheme && this.builtInTheme.settingsId === settingsId) {
			return this.builtInTheme;
		}
		const allThemes = this.getThemes();
		let defaultTheme: T | undefined = undefined;
		for (const t of allThemes) {
			if (t.settingsId === settingsId) {
				return t;
			}
			if (t.settingsId === defaultSettingsId) {
				defaultTheme = t;
			}
		}
		return defaultTheme;
	}

	public findThemeByExtensionLocation(extLocation: URI | undefined): T[] {
		if (extLocation) {
			return this.getThemes().filter(t => t.location && resources.isEqualOrParent(t.location, extLocation));
		}
		return [];
	}

	public getThemes(): T[] {
		return this.extensionThemes;
	}
}
