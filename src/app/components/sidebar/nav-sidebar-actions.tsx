'use client';
import { useClientTranslation } from "mote/app/lib/i18nForClient";
import { Icon } from "../icon";
import { SidebarGroupAction } from "mote/app/components/ui/sidebar";
import { useEffect, useState } from "react";
import { NewCollectionDialog } from "../collection/collection-dialog";

export function NavCollectionAction() {
    const { t } = useClientTranslation();
    const [open, setOpen] = useState(false);

    const onOpenChange = () => {
        setOpen(!open);
        console.log("onOpenChange force close", open);
    }

    return (
        <>
        <SidebarGroupAction title={t("Create a collection")} onClick={onOpenChange}>
            <Icon name="Plus"/>
            <span className="sr-only">{t("Create a collection")}</span>
        </SidebarGroupAction>
        <NewCollectionDialog open={open} onOpenChange={onOpenChange}/>
        </>
    )
}