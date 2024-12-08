'use client';

import { useEffect } from "react";
import { LocalStorageDatabaseProvider } from "mote/platform/record/browser/localStorageDatabaseProvider";
import { IRecordService } from "mote/platform/record/common/record";
import { ITransactionService } from "mote/platform/record/common/transaction";
import { instantiationService } from "mote/workbench/workbench.client.main";

/**
 * The Initializer component used for init service for every router.
 * @returns 
 */
export default function Initializer() {
    const userId = '43c5d10b-6bdf-459b-8544-5afc65a9947d';
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