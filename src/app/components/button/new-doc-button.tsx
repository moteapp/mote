'use client';
import { useRouter } from "next/navigation";
import { Button } from "mote/app/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "mote/app/components/ui/tooltip"

import { generateUuid } from "mote/base/common/uuid";
import { ICommandService } from "mote/platform/commands/common/commands";
import { NEW_UNTITLED_PAGE_COMMAND_ID } from "mote/workbench/contrib/pages/browser/pageConstants";
import { instantiationService } from "mote/workbench/workbench.client.main";

export function NewDoc() {
    const router = useRouter();
    const handleClick = () => {
        const spaceId = '43c5d11b-6bdf-459b-8544-5afc65a9947d';
        const userId = '43c5d10b-6bdf-459b-8544-5afc65a9947d';
        const collectionId = null;
        const rootId = generateUuid();
        instantiationService.invokeFunction(async (accessor) => {
            const commandService = accessor.get(ICommandService);
            await commandService.executeCommand(NEW_UNTITLED_PAGE_COMMAND_ID, {rootId, spaceId, userId, collectionId});
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
