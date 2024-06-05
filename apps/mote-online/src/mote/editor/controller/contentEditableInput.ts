import './editable.css';
import * as DOM from '@mote/base/browser/dom';
import * as ranges from '@mote/base/common/ranges';
import { DomEmitter } from '@mote/base/browser/event';
import { IKeyboardEvent, StandardKeyboardEvent } from '@mote/base/browser/keyboardEvent';
import { Event, Emitter } from '@mote/base/common/event';
import { Disposable } from '@mote/base/common/lifecycle';
import { inputLatency } from '@mote/base/browser/performance';
import { OperatingSystem } from '@mote/base/common/platform';
import { IContentEditableWrapper } from './contentEditableState';
import { KeyCode } from '@mote/base/common/keyCodes';

export namespace ContentEditableSyntethicEvents {
	export const Tap = '-mote-contenteditable-synthetic-tap';
}

export interface ICompleteContentEditableWrapper extends IContentEditableWrapper {
    readonly onInput: Event<InputEvent>;
	readonly onKeyDown: Event<KeyboardEvent>;
}

export interface ITypeData {
	text: string;
	replacePrevCharCnt: number;
	replaceNextCharCnt: number;
	positionDelta: number;
}

export interface IBrowser {
	isAndroid: boolean;
	isFirefox: boolean;
	isChrome: boolean;
	isSafari: boolean;
}

class CompositionContext {

	private _lastTypeTextLength: number;

	constructor() {
		this._lastTypeTextLength = 0;
	}

	public handleCompositionUpdate(text: string | null | undefined): ITypeData {
		text = text || '';
		const typeInput: ITypeData = {
			text: text,
			replacePrevCharCnt: this._lastTypeTextLength,
			replaceNextCharCnt: 0,
			positionDelta: 0
		};
		this._lastTypeTextLength = text.length;
		return typeInput;
	}
}

export class ContentEditableInput extends Disposable {

    private _onFocus = this._register(new Emitter<void>());
	public readonly onFocus: Event<void> = this._onFocus.event;

    private _onBlur = this._register(new Emitter<void>());
	public readonly onBlur: Event<void> = this._onBlur.event;

	private _onKeyDown = this._register(new Emitter<IKeyboardEvent>());
	public readonly onKeyDown: Event<IKeyboardEvent> = this._onKeyDown.event;

	private _onKeyUp = this._register(new Emitter<IKeyboardEvent>());
	public readonly onKeyUp: Event<IKeyboardEvent> = this._onKeyUp.event;

	private _onCut = this._register(new Emitter<void>());
	public readonly onCut: Event<void> = this._onCut.event;

	private _onType = this._register(new Emitter<ITypeData>());
	public readonly onType: Event<ITypeData> = this._onType.event;

	private _currentComposition: CompositionContext | null = null;

    constructor(
        private readonly contentEditable: ICompleteContentEditableWrapper,
		private readonly _OS: OperatingSystem,
		private readonly _browser: IBrowser,
    ) {
        super();
		
		this._register(this.contentEditable.onInput((e)=>{
			this._onType.fire({
				text: e.data!,
				replacePrevCharCnt: 0,
				replaceNextCharCnt: 0,
				positionDelta: 1
			});
		}));

		let lastKeyDown: IKeyboardEvent | null = null;

		this._register(this.contentEditable.onKeyDown((_e)=>{
			const e = new StandardKeyboardEvent(_e);
			if (e.keyCode === KeyCode.KEY_IN_COMPOSITION
				|| (this._currentComposition && e.keyCode === KeyCode.Backspace)) {
				// Stop propagation for keyDown events if the IME is processing key input
				e.stopPropagation();
			}

			if (e.equals(KeyCode.Escape)) {
				// Prevent default always for `Esc`, otherwise it will generate a keypress
				// See https://msdn.microsoft.com/en-us/library/ie/ms536939(v=vs.85).aspx
				e.preventDefault();
			}

			lastKeyDown = e;
			this._onKeyDown.fire(e);
		}));
    }

	public setValue(value: string): void {
		this.contentEditable.setValue('', value);
	}
}

export class ContentEditableWrapper extends Disposable implements ICompleteContentEditableWrapper {

    public readonly onKeyDown = this._register(new DomEmitter(this._actual, 'keydown')).event;
	public readonly onKeyPress = this._register(new DomEmitter(this._actual, 'keypress')).event;
	public readonly onKeyUp = this._register(new DomEmitter(this._actual, 'keyup')).event;
    public readonly onBeforeInput = this._register(new DomEmitter(this._actual, 'beforeinput')).event;
    public readonly onInput = <Event<InputEvent>>this._register(new DomEmitter(this._actual, 'input')).event;
	
    private _onSyntheticTap = this._register(new Emitter<void>());
	public readonly onSyntheticTap: Event<void> = this._onSyntheticTap.event;

    private _ignoreSelectionChangeTime: number = 0;

    constructor(
		private readonly _actual: HTMLDivElement | HTMLHeadElement
	) {
        super();

		this._register(this.onKeyDown(() => inputLatency.onKeyDown()));
		this._register(this.onBeforeInput(() => inputLatency.onBeforeInput()));
		this._register(this.onInput(() => inputLatency.onInput()));
		this._register(this.onKeyUp(() => inputLatency.onKeyUp()));

        this._register(DOM.addDisposableListener(this._actual, ContentEditableSyntethicEvents.Tap, () => this._onSyntheticTap.fire()));

		this.registerPlaceholderListeners();
    }

	private registerPlaceholderListeners(): void {
		this._actual.style.webkitTextFillColor = 'var(--mote-input-placeholderForeground)';

		// placeholder style
		this._register(this.onInput((e)=>{
			const value = this.getValue();
			if (value) {
				this._actual.style.webkitTextFillColor = '';
			} else {
				this._actual.style.webkitTextFillColor = 'var(--mote-input-placeholderForeground)';
			}
		}));
	}

    public get ownerDocument(): Document {
		return this._actual.ownerDocument;
	}

    public hasFocus(): boolean {
		const shadowRoot = DOM.getShadowRoot(this._actual);
		if (shadowRoot) {
			return shadowRoot.activeElement === this._actual;
		} else if (this._actual.isConnected) {
			return DOM.getActiveElement() === this._actual;
		} else {
			return false;
		}
	}

    public setIgnoreSelectionChangeTime(reason: string): void {
		this._ignoreSelectionChangeTime = Date.now();
	}

	public getIgnoreSelectionChangeTime(): number {
		return this._ignoreSelectionChangeTime;
	}

	public resetSelectionChangeTime(): void {
		this._ignoreSelectionChangeTime = 0;
	}

	public getValue(): string {
		// console.log('current value: ' + this._textArea.value);
		return this._actual.textContent!;
	}

    public setValue(reason: string, value: string): void {
        // console.log('set value: ' + value);
        this._actual.textContent = value;
    }

    public getSelectionStart(): number {
        const range = ranges.get();
		return range?.startOffset || 1;
	}

	public getSelectionEnd(): number {
		const range = ranges.get();
		return range?.endOffset || 1;
	}

    public setSelectionRange(reason: string, selectionStart: number, selectionEnd: number): void {
        const range = document.createRange();
        range.setStart(this._actual.firstChild!, selectionStart);
        range.setEnd(this._actual.firstChild!, selectionEnd);
        ranges.set(range);
    }
}