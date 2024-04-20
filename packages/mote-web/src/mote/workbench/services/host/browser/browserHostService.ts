import { Disposable } from 'vs/base/common/lifecycle';
import { IHostService } from './host';
import { IOpenEmptyWindowOptions, IWindowOpenable, IOpenWindowOptions, IPoint, IRectangle, IFileToOpen } from 'mote/platform/window/common/window';
import { Emitter, Event } from 'vs/base/common/event';
import { EventType, addDisposableListener, addDisposableThrottledListener, detectFullscreen, disposableWindowInterval, getActiveDocument, getWindowId, onDidRegisterWindow, trackFocus } from 'mote/base/browser/dom';
import { isAuxiliaryWindow, mainWindow } from 'mote/base/browser/window';
import { memoize } from 'vs/base/common/decorators';
import { isIOS, isMacintosh } from 'vs/base/common/platform';
import { DomEmitter } from 'vs/base/browser/event';
import { InstantiationType, registerSingleton } from 'vs/platform/instantiation/common/extensions';
import { IWorkspace } from 'mote/workbench/browser/web.api';

enum HostShutdownReason {

	/**
	 * An unknown shutdown reason.
	 */
	Unknown = 1,

	/**
	 * A shutdown that was potentially triggered by keyboard use.
	 */
	Keyboard = 2,

	/**
	 * An explicit shutdown via code.
	 */
	Api = 3
}

export class BrowserHostService extends Disposable implements IHostService {
    _serviceBrand: undefined;

    hadLastFocus(): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
    focus(targetWindow: Window, options?: { force: boolean; } | undefined): Promise<void> {
        throw new Error('Method not implemented.');
    }

    toggleFullScreen(targetWindow: Window): Promise<void> {
        throw new Error('Method not implemented.');
    }
    moveTop(targetWindow: Window): Promise<void> {
        throw new Error('Method not implemented.');
    }
    getCursorScreenPoint(): Promise<{ readonly point: IPoint; readonly display: IRectangle; } | undefined> {
        throw new Error('Method not implemented.');
    }
    restart(): Promise<void> {
        throw new Error('Method not implemented.');
    }
    reload(options?: { disableExtensions?: boolean | undefined; } | undefined): Promise<void> {
        throw new Error('Method not implemented.');
    }
    close(): Promise<void> {
        throw new Error('Method not implemented.');
    }
    withExpectedShutdown<T>(expectedShutdownTask: () => Promise<T>): Promise<T> {
        throw new Error('Method not implemented.');
    }

    //#region Focus

    @memoize
	get onDidChangeFocus(): Event<boolean> {
		const emitter = this._register(new Emitter<boolean>());

		this._register(Event.runAndSubscribe(onDidRegisterWindow, ({ window, disposables }) => {
			const focusTracker = disposables.add(trackFocus(window));
			const visibilityTracker = disposables.add(new DomEmitter(window.document, 'visibilitychange'));

			Event.any(
				Event.map(focusTracker.onDidFocus, () => this.hasFocus, disposables),
				Event.map(focusTracker.onDidBlur, () => this.hasFocus, disposables),
				Event.map(visibilityTracker.event, () => this.hasFocus, disposables),
				Event.map(this.onDidChangeActiveWindow, () => this.hasFocus, disposables),
			)(focus => emitter.fire(focus));
		}, { window: mainWindow, disposables: this._store }));

		return Event.latch(emitter.event, undefined, this._store);
	}

	get hasFocus(): boolean {
		return getActiveDocument().hasFocus();
	}

    //#endregion

    //#region Window

    @memoize
	get onDidChangeActiveWindow(): Event<number> {
		const emitter = this._register(new Emitter<number>());

		this._register(Event.runAndSubscribe(onDidRegisterWindow, ({ window, disposables }) => {
			const windowId = getWindowId(window);

			// Emit via focus tracking
			const focusTracker = disposables.add(trackFocus(window));
			disposables.add(focusTracker.onDidFocus(() => emitter.fire(windowId)));

			// Emit via interval: immediately when opening an auxiliary window,
			// it is possible that document focus has not yet changed, so we
			// poll for a while to ensure we catch the event.
			if (isAuxiliaryWindow(window)) {
				disposables.add(disposableWindowInterval(window, () => {
					const hasFocus = window.document.hasFocus();
					if (hasFocus) {
						emitter.fire(windowId);
					}

					return hasFocus;
				}, 100, 20));
			}
		}, { window: mainWindow, disposables: this._store }));

		return Event.latch(emitter.event, undefined, this._store);
	}

    @memoize
	get onDidChangeFullScreen(): Event<{ windowId: number; fullscreen: boolean }> {
		const emitter = this._register(new Emitter<{ windowId: number; fullscreen: boolean }>());

		this._register(Event.runAndSubscribe(onDidRegisterWindow, ({ window, disposables }) => {
			const windowId = getWindowId(window);
			const viewport = isIOS && window.visualViewport ? window.visualViewport /** Visual viewport */ : window /** Layout viewport */;

			// Fullscreen (Browser)
			for (const event of [EventType.FULLSCREEN_CHANGE, EventType.WK_FULLSCREEN_CHANGE]) {
				disposables.add(addDisposableListener(window.document, event, () => emitter.fire({ windowId, fullscreen: !!detectFullscreen(window) })));
			}

			// Fullscreen (Native)
			disposables.add(addDisposableThrottledListener(viewport, EventType.RESIZE, () => emitter.fire({ windowId, fullscreen: !!detectFullscreen(window) }), undefined, isMacintosh ? 2000 /* adjust for macOS animation */ : 800 /* can be throttled */));
		}, { window: mainWindow, disposables: this._store }));

		return emitter.event;
	}

	openWindow(options?: IOpenEmptyWindowOptions): Promise<void>;
	openWindow(toOpen: IWindowOpenable[], options?: IOpenWindowOptions): Promise<void>;
	openWindow(arg1?: IOpenEmptyWindowOptions | IWindowOpenable[], arg2?: IOpenWindowOptions): Promise<void> {
		if (Array.isArray(arg1)) {
			return this.doOpenWindow(arg1, arg2);
		}

		return this.doOpenEmptyWindow(arg1);
	}

	private async doOpenWindow(toOpen: IWindowOpenable[], options?: IOpenWindowOptions): Promise<void> {
		const payload = this.preservePayload(false /* not an empty window */);
		const fileOpenables: IFileToOpen[] = [];
	}

	private async doOpenEmptyWindow(options?: IOpenEmptyWindowOptions): Promise<void> {
		return this.doOpen(undefined, {
			reuse: options?.forceReuseWindow,
			payload: this.preservePayload(true /* empty window */)
		});
	}

	private async doOpen(workspace: IWorkspace, options?: { reuse?: boolean; payload?: object }): Promise<void> {
		
	}

	private preservePayload(isEmptyWindow: boolean): Array<unknown> | undefined {
		// Selectively copy payload: for now only extension debugging properties are considered
		const newPayload: Array<unknown> = new Array([]);

		return newPayload.length ? newPayload : undefined;
	}

    //#endregion
}


registerSingleton(IHostService, BrowserHostService, InstantiationType.Delayed);
