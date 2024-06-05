import { getSingletonServiceDescriptors } from "vs/platform/instantiation/common/extensions";
import { IInstantiationService, ServiceIdentifier, createDecorator } from "vs/platform/instantiation/common/instantiation";
import { ServiceCollection } from "vs/platform/instantiation/common/serviceCollection";
import { InstantiationService } from 'vs/platform/instantiation/common/instantiationService';
import { DisposableStore, IDisposable } from "vs/base/common/lifecycle";
import { SyncDescriptor } from "vs/platform/instantiation/common/descriptors";
import { Emitter } from "vs/base/common/event";
import { RecordService } from "@mote/editor/common/services/recordService";
import { IRecordService } from "@mote/editor/common/services/record";

export interface IEditorOverrideServices {
	[index: string]: any;
}

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
    export function initialize(overrides: IEditorOverrideServices): IInstantiationService {
		if (initialized) {
			return instantiationService;
		}
		initialized = true;

		// Add singletons that were registered after this module loaded
		for (const [id, descriptor] of getSingletonServiceDescriptors()) {
			if (!serviceCollection.get(id)) {
				serviceCollection.set(id, descriptor);
			}
		}

		// Initialize the service collection with the overrides, but only if the
		// service was not instantiated in the meantime.
		for (const serviceId in overrides) {
			if (overrides.hasOwnProperty(serviceId)) {
				const serviceIdentifier = createDecorator(serviceId);
				const r = serviceCollection.get(serviceIdentifier);
				if (r instanceof SyncDescriptor) {
					serviceCollection.set(serviceIdentifier, overrides[serviceId]);
				}
			}
		}

		onDidInitialize.fire();
		
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