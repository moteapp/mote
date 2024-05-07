import zhCNBundle from 'extensions/i18n/zh-cn.json';

export interface ILocalizedString {
	original: string;
	value: string;
}

export interface ILocalizeInfo {
	key: string;
	comment: string[];
}

let isPseudo = (typeof document !== 'undefined' && document.location && document.location.hash.indexOf('pseudo=true') >= 0);

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

class NLS {

    static INSTANCE: NLS = new NLS();

    private locale: string = 'zh-cn';
    private bundles: Map<string, Record<string, string>> = new Map();

    constructor() {
        this.bundles.set(this.locale, zhCNBundle);
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
        return _format(message, args);
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
export function localize(key: string, message: string, ...args: (string | number | boolean | undefined | null)[]): string {
    return NLS.INSTANCE.localize(key, message, ...args);
}
