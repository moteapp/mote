import { getSingletonServiceDescriptors } from "vs/platform/instantiation/common/extensions";
import { IInstantiationService, ServiceIdentifier } from "vs/platform/instantiation/common/instantiation";
import { ServiceCollection } from "vs/platform/instantiation/common/serviceCollection";
import { InstantiationService } from 'vs/platform/instantiation/common/instantiationService';
import { DisposableStore, IDisposable } from "vs/base/common/lifecycle";
import { SyncDescriptor } from "vs/platform/instantiation/common/descriptors";
import { Emitter } from "vs/base/common/event";
import { RecordService } from "@mote/editor/common/services/recordService";
import { IRecordService } from "@mote/editor/common/services/record";

/**
 * We don't want to eagerly instantiate services because embedders get a one time chance
 * to override services when they create the first editor.
 */
export module StandaloneServices {
    const serviceCollection = new ServiceCollection();
	for (const [id, descriptor] of getSingletonServiceDescriptors()) {
		serviceCollection.set(id, descriptor);
	}

	const memory: Record<string, any> = {};
	const storageService: any = {
		get: (key: string) => memory[key],
		store: (key: string, value: string) => {
			console.log('set record', value)
			memory[key] = value;
		}
	}
	const recordService = new RecordService(storageService);
	serviceCollection.set(IRecordService, recordService);

	const instantiationService = new InstantiationService(serviceCollection, true);
	serviceCollection.set(IInstantiationService, instantiationService);

    export function get<T>(serviceId: ServiceIdentifier<T>): T {
		const r = serviceCollection.get(serviceId);
		if (!r) {
			throw new Error('Missing service ' + serviceId);
		}
		if (r instanceof SyncDescriptor) {
			return instantiationService.invokeFunction((accessor) => accessor.get(serviceId));
		} else {
			return r;
		}
	}

    let initialized = false;
	const onDidInitialize = new Emitter<void>();
    export function initialize(): IInstantiationService {
		if (initialized) {
			return instantiationService;
		}
		initialized = true;
        return instantiationService;
    }
    
    /**
	 * Executes callback once services are initialized.
	 */
	export function withServices(callback: () => IDisposable): IDisposable {
		if (initialized) {
			return callback();
		}

		const disposable = new DisposableStore();

		const listener = disposable.add(onDidInitialize.event(() => {
			listener.dispose();
			disposable.add(callback());
		}));

		return disposable;
	}
}