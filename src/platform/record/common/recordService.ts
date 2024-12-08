import { Promises } from "mote/base/common/async";
import { Event, Emitter } from "mote/base/common/event";
import { Disposable, DisposableStore, dispose, IDisposable, toDisposable } from "mote/base/common/lifecycle";
import { IDatabaseProvider, IDatabaseProviderActivationEvent, IRecord, IRecordService, Pointer, RecordChangeEvent } from "./record";

export class RecordService extends Disposable implements IRecordService {
    readonly _serviceBrand: undefined;

    private _onDidRecordChange = new Emitter<RecordChangeEvent>();
    public readonly onDidRecordChange: Event<RecordChangeEvent> = this._onDidRecordChange.event;

    private readonly providers = new Map<string, IDatabaseProvider>();

    public constructor() {
        super();
    }

    /**
     * This method only works for the records that are already loaded in the memory.
     * @param pointer 
     * @returns 
     */
    public retriveRecord<T extends IRecord>(pointer: Pointer): T | null {
        const provider = this.getProvider(pointer.table);
        if (!provider) {
            throw new Error(`No provider for ${pointer.table}`);
        }
        const record = provider.get(pointer);
        return record as T;
    }
    
    public async retriveRecordAsync<T extends IRecord>(pointer: Pointer): Promise<T|null> {
        const provider = await this.withReadProvider(pointer);
        const record = await provider.getAsync(pointer);
        if (!record) {
            console.warn(`Record not found: ${pointer.table}/${pointer.id}`);
        }
        return record as T;
    }

    public async updateRecord<T extends IRecord>(pointer: Pointer, record: T): Promise<void> {
        const provider = await this.withProvider(pointer);
        return provider.set(pointer, record);
    }

    public watch(pointer: Pointer) {
        const disposables = new DisposableStore();

		// Forward watch request to provider and wire in disposables
		let watchDisposed = false;
		let disposeWatch = () => { watchDisposed = true; };
		disposables.add(toDisposable(() => disposeWatch()));

		// Watch and wire in disposable which is async but
		// check if we got disposed meanwhile and forward
		(async () => {
			try {
				const disposable = await this.doWatch(pointer);
				if (watchDisposed) {
					dispose(disposable);
				} else {
					disposeWatch = () => dispose(disposable);
				}
			} catch (error) {
                // todo: log error with logger
				console.error(error);
			}
		})();
    }

    private async doWatch(pointer: Pointer): Promise<IDisposable> {
        const provider = await this.withProvider(pointer);
        return null as any;
    }

    //#region Database Provider

    private readonly _onWillActivateDatabaseProvider = this._register(new Emitter<IDatabaseProviderActivationEvent>());
	readonly onWillActivateDatabaseProvider = this._onWillActivateDatabaseProvider.event;

    
    registerProvider(scheme: string, provider: IDatabaseProvider): IDisposable {
        const providerDisposables = new DisposableStore();
        this.providers.set(scheme, provider);

        // Forward events from provider
        providerDisposables.add(provider.onDidChange(e => this._onDidRecordChange.fire(e)));

        return toDisposable(() => {
            this.providers.delete(scheme);
            dispose(providerDisposables);
        });
    }

    getProvider(scheme: string): IDatabaseProvider | undefined {
        return this.providers.get(scheme);
    }

    public async activateProvider(scheme: string): Promise<void> {
        // Emit an event that we are about to activate a provider with the given scheme.
		// Listeners can participate in the activation by registering a provider for it.
		const joiners: Promise<void>[] = [];
		this._onWillActivateDatabaseProvider.fire({
			scheme,
			join(promise) {
				joiners.push(promise);
			},
		});

		if (this.providers.has(scheme)) {
			return; // provider is already here so we can return directly
		}

		// If the provider is not yet there, make sure to join on the listeners assuming
		// that it takes a bit longer to register the file system provider.
		await Promises.settled(joiners);
    }

    private async withReadProvider(pointer: Pointer): Promise<IDatabaseProvider> {
        // todo: check if the provider is readonly
        return this.withProvider(pointer);
    }

    private async withProvider(pointer: Pointer): Promise<IDatabaseProvider> {
        const provider = this.getProvider(pointer.table);
        if (!provider) {
            throw new Error(`No provider for ${pointer.table}`);
        }
        // Activate provider
		await this.activateProvider(pointer.table);

        return provider;
    }

    //#endregion
}
