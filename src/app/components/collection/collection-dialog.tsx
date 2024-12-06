import { useClientTranslation } from "mote/app/lib/i18nForClient";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { CollectionForm } from "../collection";
import { Button } from "../ui/button";
import { ICollectionSchema } from "mote/platform/request/common/collection";
import { createCollectionAction } from "mote/app/actions/actions";
import { requestService } from "mote/platform/request/common/requestService";
import { redirect } from "next/navigation";

export type NewCollectionDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function NewCollectionDialog({
    open,
    onOpenChange,
} : NewCollectionDialogProps) {
    const { t } = useClientTranslation();

    const handleOpenChange = (open: boolean) => {
        console.log("open", open);
        onOpenChange(false);
    }

    const handleSubmit = async (values: ICollectionSchema) => {
        //await createCollectionAction(values);
        const collection = await requestService.createCollection(values);
        onOpenChange(false);
        redirect(`/collection/${collection.id}`);
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{t("Create a collection")}</DialogTitle>
                    <DialogDescription>
                        {t("Collections are used to group documents and choose permissions")}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <CollectionForm
                        onSubmitAction={handleSubmit}
                        submitButton={
                            <DialogFooter>
                                <Button type="submit">Save changes</Button>
                            </DialogFooter>
                            }
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}