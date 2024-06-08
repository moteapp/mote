import { ReactNode } from "react";
import { MenuItem } from "./menuItem";

export type MenuSeparator = {
    type: "separator";
    visible?: boolean;
};

export type MenuHeading = {
    type: "heading";
    visible?: boolean;
    title: ReactNode;
};

export type MenuItemButton = {
    type: "button";
    title: ReactNode;
    onClick: () => void;
    visible?: boolean;
};

export type IMenuItem = 
    | MenuSeparator
    | MenuHeading
    | MenuItemButton;

export interface ITemplateProps {
    actions?: (IMenuItem)[];
}

export function filterTemplateItems(items: IMenuItem[]) {
    return items
        .filter((item) => item);

}

export const Template = ({
    actions
}: ITemplateProps) => {
    const menus = filterTemplateItems(actions || []);

    return (
        <>
            {menus.map((menu, index) => {
                if (menu.type === "separator") {
                    return (
                        <div key={index} />
                    );
                }

                if (menu.type === "heading") {
                    return (
                        <div key={index}>
                            {menu.title}
                        </div>
                    );
                }

                if (menu.type === "button") {
                    return (
                        <MenuItem key={index}>
                            {menu.title}
                        </MenuItem>
                    );
                }

                return null;
            })}
        </>
    )
}