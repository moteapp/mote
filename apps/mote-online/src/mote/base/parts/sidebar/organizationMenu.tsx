import { MenuButton, Dialog, useMenuStore } from "@ariakit/react";
import { ContextMenu } from "mote/base/components/menu/contextMenu";
import { IMenuItem, Template } from "mote/base/components/menu/template";
import { ReactNode } from "react";

export interface IOrganizationMenuProps {
    children?: ReactNode;
}

export const OrganizationMenu = ({
    children
}: IOrganizationMenuProps) => {

    const menuStore = useMenuStore({
        placement: "bottom-start",
    });

    const actions: IMenuItem[] = [
        {
            type: "button" as any,
            title: "Create organization",
            onClick: () => {
                console.log("Create organization");
            }
        },
        {
            type: "button" as any,
            title: "Join organization",
            onClick: () => {
                console.log("Join organization");
            }
        }
    ];

    return (
        <>
            <MenuButton store={menuStore}>
                {children}
            </MenuButton>
            <ContextMenu >
                <Template actions={actions}/>
            </ContextMenu>
        </>
    )
}