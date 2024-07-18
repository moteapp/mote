/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// This is a facade for the observable implementation. Only import from here!

export type {
	IObservable,
	IObserver,
	IReader,
	ISettable,
	ISettableObservable,
	ITransaction,
	IChangeContext,
	IChangeTracker,
} from '@mote/base/common/observableInternal/base';

export {
	observableValue,
	disposableObservableValue,
	transaction,
	subtransaction,
} from '@mote/base/common/observableInternal/base';
export {
	derived,
	derivedOpts,
	derivedHandleChanges,
	derivedWithStore,
} from '@mote/base/common/observableInternal/derived';
export {
	autorun,
	autorunDelta,
	autorunHandleChanges,
	autorunWithStore,
	autorunOpts,
	autorunWithStoreHandleChanges,
} from '@mote/base/common/observableInternal/autorun';
export type {
	IObservableSignal,
} from '@mote/base/common/observableInternal/utils';
export {
	constObservable,
	debouncedObservable,
	derivedObservableWithCache,
	derivedObservableWithWritableCache,
	keepObserved,
	recomputeInitiallyAndOnChange,
	observableFromEvent,
	observableFromPromise,
	observableSignal,
	observableSignalFromEvent,
	wasEventTriggeredRecently,
} from '@mote/base/common/observableInternal/utils';
export {
	ObservableLazy,
	ObservableLazyPromise,
	ObservablePromise,
	PromiseResult,
	waitForState,
	derivedWithCancellationToken,
} from '@mote/base/common/observableInternal/promise';
export {
	observableValueOpts
} from '@mote/base/common/observableInternal/api';

import { ConsoleObservableLogger, setLogger } from '@mote/base/common/observableInternal/logging';

// Remove "//" in the next line to enable logging
const enableLogging = false
	// || Boolean("true") // done "weirdly" so that a lint warning prevents you from pushing this
	;

if (enableLogging) {
	setLogger(new ConsoleObservableLogger());
}
