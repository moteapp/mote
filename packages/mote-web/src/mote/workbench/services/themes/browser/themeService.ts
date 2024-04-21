import { Color } from 'vs/base/common/color';
import { Event, Emitter } from 'vs/base/common/event';
import { IconContribution } from 'vs/platform/theme/common/iconRegistry';
import { ColorScheme } from 'vs/platform/theme/common/theme';
import { IColorTheme, IFileIconTheme, IProductIconTheme, IThemeService, ITokenStyle } from 'vs/platform/theme/common/themeService';

export class MockColorTheme implements IColorTheme {

	public readonly label = 'test';

	constructor(
		private colors: { [id: string]: string | undefined } = {},
		public type = ColorScheme.DARK,
		public readonly semanticHighlighting = false
	) { }

	getColor(color: string, useDefault?: boolean): Color | undefined {
		const value = this.colors[color];
		if (value) {
			return Color.fromHex(value);
		}
		return undefined;
	}

	defines(color: string): boolean {
		throw new Error('Method not implemented.');
	}

	getTokenStyleMetadata(type: string, modifiers: string[], modelLanguage: string): ITokenStyle | undefined {
		return undefined;
	}

	get tokenColorMap(): string[] {
		return [];
	}
}

class MockFileIconTheme implements IFileIconTheme {
	hasFileIcons = false;
	hasFolderIcons = false;
	hidesExplorerArrows = false;
}

class UnthemedProductIconTheme implements IProductIconTheme {
	getIcon(contribution: IconContribution) {
		return undefined;
	}
}

export class NullThemeService implements IThemeService {

	declare readonly _serviceBrand: undefined;
	_colorTheme: IColorTheme;
	_fileIconTheme: IFileIconTheme;
	_productIconTheme: IProductIconTheme;
	_onThemeChange = new Emitter<IColorTheme>();
	_onFileIconThemeChange = new Emitter<IFileIconTheme>();
	_onProductIconThemeChange = new Emitter<IProductIconTheme>();

	constructor(theme = new MockColorTheme(), fileIconTheme = new MockFileIconTheme(), productIconTheme = new UnthemedProductIconTheme()) {
		this._colorTheme = theme;
		this._fileIconTheme = fileIconTheme;
		this._productIconTheme = productIconTheme;
	}

	getColorTheme(): IColorTheme {
		return this._colorTheme;
	}

	setTheme(theme: IColorTheme) {
		this._colorTheme = theme;
		this.fireThemeChange();
	}

	fireThemeChange() {
		this._onThemeChange.fire(this._colorTheme);
	}

	public get onDidColorThemeChange(): Event<IColorTheme> {
		return this._onThemeChange.event;
	}

	getFileIconTheme(): IFileIconTheme {
		return this._fileIconTheme;
	}

	public get onDidFileIconThemeChange(): Event<IFileIconTheme> {
		return this._onFileIconThemeChange.event;
	}

	getProductIconTheme(): IProductIconTheme {
		return this._productIconTheme;
	}

	public get onDidProductIconThemeChange(): Event<IProductIconTheme> {
		return this._onProductIconThemeChange.event;
	}
}