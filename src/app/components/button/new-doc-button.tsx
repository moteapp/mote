'use client';
import { useRouter } from "next/navigation";
import { Button } from "mote/app/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "mote/app/components/ui/tooltip"

import { useClientTranslation } from "mote/app/lib/i18nForClient";
import { selectSpace, selectUser } from "mote/app/store/features/auth/authSlice";
import { useAppSelector } from "mote/app/store/hooks";
import { generateUuid } from "mote/base/common/uuid";
import { ICommandService } from "mote/platform/commands/common/commands";
import { NEW_UNTITLED_PAGE_COMMAND_ID } from "mote/workbench/contrib/pages/browser/pageConstants";
import { instantiationService } from "mote/workbench/workbench.client.main";

export function NewDoc({collectionId}: {collectionId?: string}) {
    const router = useRouter();
    const { t } = useClientTranslation();
    const user = useAppSelector(selectUser)!;
    const space = useAppSelector(selectSpace)!;
    const handleClick = () => {
        const spaceId = space.id;
        const userId = user.id;
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
                <Button variant="outline" onClick={handleClick}>
                    {t('Create a document')}
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>Add a new document</p>
            </TooltipContent>
        </Tooltip>
        </TooltipProvider>
    )
}
