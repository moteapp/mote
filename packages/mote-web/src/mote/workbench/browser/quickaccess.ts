import { localize } from 'vs/nls';
import { ContextKeyExpr, RawContextKey } from 'vs/platform/contextkey/common/contextkey';

export const inQuickPickContextKeyValue = 'inQuickOpen';
export const InQuickPickContextKey = new RawContextKey<boolean>(inQuickPickContextKeyValue, false, localize('inQuickOpen', "Whether keyboard focus is inside the quick open control"));
export const inQuickPickContext = ContextKeyExpr.has(inQuickPickContextKeyValue);


export interface IWorkbenchQuickAccessConfiguration {
	readonly workbench: {
		readonly commandPalette: {
			readonly history: number;
			readonly preserveInput: boolean;
			readonly experimental: {
				readonly suggestCommands: boolean;
				readonly enableNaturalLanguageSearch: boolean;
				readonly askChatLocation: 'quickChat' | 'chatView';
			};
		};
		readonly quickOpen: {
			readonly enableExperimentalNewVersion: boolean;
			readonly preserveInput: boolean;
		};
	};
}