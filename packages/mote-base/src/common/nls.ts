import * as zhCNBundle from '@mote/base/languages/zh-cn.json' with { type: "json" };

let isPseudo = (typeof document !== 'undefined' && document.location && document.location.hash.indexOf('pseudo=true') >= 0);
const DEFAULT_TAG = 'i-default';

export interface ILocalizeInfo {
	key: string;
	comment: string[];
}

export interface ILocalizedString {
	original: string;
	value: string;
}

interface ILocalizeFunc {
	(info: ILocalizeInfo, message: string, ...args: (string | number | boolean | undefined | null)[]): string;
	(key: string, message: string, ...args: (string | number | boolean | undefined | null)[]): string;
}

interface ILocalize2Func {
	(info: ILocalizeInfo, message: string, ...args: (string | number | boolean | undefined | null)[]): ILocalizedString;
	(key: string, message: string, ...args: (string | number | boolean | undefined | null)[]): ILocalizedString;
}

interface IConsumerAPI {
	localize: ILocalizeFunc;
	localize2: ILocalize2Func;
	getConfiguredDefaultLocale(stringFromLocalizeCall: string): string | undefined;
}

interface IBundledStrings {
	[moduleId: string]: string[];
}

type Formatter = (message: string, args: (string | number | boolean | undefined | null)[]) => string;

class NLS implements IConsumerAPI {

    private locale: string = 'zh-cn';
    private bundles: Map<string, Record<string, string>> = new Map();

    constructor(
        private readonly format: Formatter
    ) {
        this.bundles.set(this.locale, zhCNBundle);
    }

	public register(locale: string, data: Record<string, string>): void {
		this.bundles.set(locale, data);
	}

    getConfiguredDefaultLocale(stringFromLocalizeCall: string): string | undefined {
        return this.locale;
    }

    localize(data: string, message: string, ...args: (string | number | boolean | undefined | null)[]): string;
    localize(data: ILocalizeInfo, message: string, ...args: (string | number | boolean | undefined | null)[]): string;
    public localize(data: ILocalizeInfo | string, message: string, ...args: (string | number | boolean | undefined | null)[]) {
        let key: string;
        if (typeof data === 'string') {
            key = data;
        } else {
            key = data.key;
        }

        const bundle = this.bundles.get(this.locale);
        if (bundle && bundle[key] !== undefined) {
            message = bundle[key];
        }
        return this.format(message, args);
    }

    localize2(info: ILocalizeInfo, message: string, ...args: (string | number | boolean | undefined | null)[]): ILocalizedString;
    localize2(key: string, message: string, ...args: (string | number | boolean | undefined | null)[]): ILocalizedString;
    localize2(data: ILocalizeInfo | string, message: string, ...args: (string | number | boolean | undefined | null)[]): ILocalizedString {
        const original = this.localize(data as any, message, args as any);
        return {
            value: original,
            original
        };
    }
}

function _format(message: string, args: (string | number | boolean | undefined | null)[]): string {
	let result: string;

	if (args.length === 0) {
		result = message;
	} else {
		result = message.replace(/\{(\d+)\}/g, (match, rest) => {
			const index = rest[0];
			const arg = args[index];
			let result = match;
			if (typeof arg === 'string') {
				result = arg;
			} else if (typeof arg === 'number' || typeof arg === 'boolean' || arg === void 0 || arg === null) {
				result = String(arg);
			}
			return result;
		});
	}

	if (isPseudo) {
		// FF3B and FF3D is the Unicode zenkaku representation for [ and ]
		result = '\uFF3B' + result.replace(/[aouei]/g, '$&$&') + '\uFF3D';
	}

	return result;
}

const NLSConsumer = new NLS(_format);

//#region Exports

/**
 * Marks a string to be localized. Returns the localized string.
 *
 * @param info The {@linkcode ILocalizeInfo} which describes the id and comments associated with the localized string.
 * @param message The string to localize
 * @param args The arguments to the string
 *
 * @note `message` can contain `{n}` notation where it is replaced by the nth value in `...args`
 * @example `localize({ key: 'sayHello', comment: ['Welcomes user'] }, 'hello {0}', name)`
 *
 * @returns string The localized string.
 */
export function localize(info: ILocalizeInfo, message: string, ...args: (string | number | boolean | undefined | null)[]): string;

/**
 * Marks a string to be localized. Returns the localized string.
 *
 * @param key The key to use for localizing the string
 * @param message The string to localize
 * @param args The arguments to the string
 *
 * @note `message` can contain `{n}` notation where it is replaced by the nth value in `...args`
 * @example For example, `localize('sayHello', 'hello {0}', name)`
 *
 * @returns string The localized string.
 */
export function localize(key: string, message: string, ...args: (string | number | boolean | undefined | null)[]): string;

/**
 * @skipMangle
 */
export function localize(data: ILocalizeInfo | string, message: string, ...args: (string | number | boolean | undefined | null)[]): string {
	return NLSConsumer.localize(data as any, message, ...args);
}

/**
 * Marks a string to be localized. Returns an {@linkcode ILocalizedString}
 * which contains the localized string and the original string.
 *
 * @param info The {@linkcode ILocalizeInfo} which describes the id and comments associated with the localized string.
 * @param message The string to localize
 * @param args The arguments to the string
 *
 * @note `message` can contain `{n}` notation where it is replaced by the nth value in `...args`
 * @example `localize2({ key: 'sayHello', comment: ['Welcomes user'] }, 'hello {0}', name)`
 *
 * @returns ILocalizedString which contains the localized string and the original string.
 */
export function localize2(info: ILocalizeInfo, message: string, ...args: (string | number | boolean | undefined | null)[]): ILocalizedString;

/**
 * Marks a string to be localized. Returns an {@linkcode ILocalizedString}
 * which contains the localized string and the original string.
 *
 * @param key The key to use for localizing the string
 * @param message The string to localize
 * @param args The arguments to the string
 *
 * @note `message` can contain `{n}` notation where it is replaced by the nth value in `...args`
 * @example `localize('sayHello', 'hello {0}', name)`
 *
 * @returns ILocalizedString which contains the localized string and the original string.
 */
export function localize2(key: string, message: string, ...args: (string | number | boolean | undefined | null)[]): ILocalizedString;

/**
 * @skipMangle
 */
export function localize2(data: ILocalizeInfo | string, message: string, ...args: (string | number | boolean | undefined | null)[]): ILocalizedString {
	return NLSConsumer.localize2(data as any, message, ...args);
}

/**
 *
 * @param stringFromLocalizeCall You must pass in a string that was returned from a `nls.localize()` call
 * in order to ensure the loader plugin has been initialized before this function is called.
 */
export function getConfiguredDefaultLocale(stringFromLocalizeCall: string): string | undefined;
/**
 * @skipMangle
 */
export function getConfiguredDefaultLocale(_: string): string | undefined {
	// This returns undefined because this implementation isn't used and is overwritten by the loader
	// when loaded.
	return NLSConsumer.getConfiguredDefaultLocale(_);
}

/**
 * Invoked in a built product at run-time
 * @skipMangle
 */
export function create(key: string, data: Record<string, string> ): IConsumerAPI {
	NLSConsumer.register(key, data);
	return NLSConsumer;
}

//#endregion