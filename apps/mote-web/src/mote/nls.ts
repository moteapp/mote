import zhCNBundle from 'extensions/languages/zh-cn.json';

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

type Formatter = (message: string, args: (string | number | boolean | undefined | null)[]) => string;

export class NLS implements IConsumerAPI {

    private locale: string = 'zh-cn';
    private bundles: Map<string, Record<string, string>> = new Map();

    constructor(
        private readonly format: Formatter
    ) {
        this.bundles.set(this.locale, zhCNBundle);
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