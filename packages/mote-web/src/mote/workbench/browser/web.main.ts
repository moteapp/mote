import { Disposable, DisposableStore, toDisposable } from 'vs/base/common/lifecycle';

export class BrowserMain extends Disposable {

    constructor(
		private readonly domElement: HTMLElement,
		private readonly configuration: any
	) {
		super();

		this.init();
	}

    private init(): void {
        
    }
}