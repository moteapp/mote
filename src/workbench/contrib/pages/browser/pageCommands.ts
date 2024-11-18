import { newPage, NewPageOptions } from "mote/editor/browser/coreCommands";
import { CommandsRegistry } from "mote/platform/commands/common/commands";
import { IRecordService, Pointer } from "mote/platform/record/common/record";
import { ITransactionService } from "mote/platform/record/common/transaction";
import { NEW_UNTITLED_PAGE_COMMAND_ID } from "./pageConstants";


CommandsRegistry.registerCommand({
    id: NEW_UNTITLED_PAGE_COMMAND_ID,
    handler:  (accessor, options: Omit<NewPageOptions, 'recordService'>) => {
        const recordService = accessor.get(IRecordService);
        const transactionService = accessor.get(ITransactionService);
        const operations = newPage({...options, recordService});
        console.log('operations', operations);
        transactionService.createAndCommit(options.userId, async tx => await tx.addOperations(operations));
    }
});