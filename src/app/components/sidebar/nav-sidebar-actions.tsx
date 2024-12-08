'use client';
import { useEffect, useState } from "react";
import { SidebarGroupAction } from "mote/app/components/ui/sidebar";
import { useClientTranslation } from "mote/app/lib/i18nForClient";
import { NewCollectionDialog } from "../collection/collection-dialog";
import { Icon } from "../icons";

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