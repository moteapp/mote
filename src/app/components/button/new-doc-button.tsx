'use client';
import { useRouter } from "next/navigation";
import { Button } from "mote/app/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "mote/app/components/ui/tooltip"
import { newPage } from "mote/app/store/features/block/blockSlice";
import { useAppDispatch } from "mote/app/store/hooks";
import { generateUuid } from "mote/base/common/uuid";
import { EditorCommands } from "mote/editor/browser/coreCommands";
import { BlockStore } from "mote/editor/common/model/blockStore";
import { Transaction } from "mote/platform/editor/common/transaction";

export function NewDoc() {
    const router = useRouter();
    const handleClick = () => {
        const spaceId = 'space';
        const userId = 'user';
        const collectionId = null;
        const rootId = generateUuid();
        const store = BlockStore.Default;
        Transaction.createAndCommit(userId, store, (tx) => {
            EditorCommands.newPage({rootId, spaceId, userId, collectionId, store, tx});
            router.push(`/doc/${rootId}`);
        });
    };

    return (
        <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <Button variant="outline" onClick={handleClick}>New Doc</Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>Add a new document</p>
            </TooltipContent>
        </Tooltip>
        </TooltipProvider>
    )
}
