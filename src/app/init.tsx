'use client';

import { LocalStorageDatabaseProvider } from "mote/platform/record/browser/localStorageDatabaseProvider";
import { IRecordService } from "mote/platform/record/common/record";
import { ITransactionService } from "mote/platform/record/common/transaction";
import { instantiationService } from "mote/workbench/workbench.client.main";
import { useEffect } from "react";

/**
 * The Initializer component used for init service for every router.
 * @returns 
 */
export default function Initializer() {
    const userId = 'user';
    useEffect(() => {
        instantiationService.invokeFunction((accessor) => {
            console.log('[Initializer] start up');
            const recordService = accessor.get(IRecordService);
            const transactionService = accessor.get(ITransactionService);
            const localStorageProvider = new LocalStorageDatabaseProvider(transactionService);
            recordService.registerProvider('block', localStorageProvider);
            transactionService.initialize(userId);
        });
    });

    return <></>
}