import { MenuButton, Dialog, DialogHeading, useMenuStore } from "@ariakit/react";
import { ReactNode } from "react";

export interface IAccountMenuProps {
    children?: ReactNode;
}

export const AccountMenu = ({
    children
}:IAccountMenuProps) => {

    const menuStore = useMenuStore({
        placement: "bottom-end",
    });
    
    return (
        <>
            <MenuButton store={menuStore}>
                {children}
            </MenuButton>
        </>
    )
}