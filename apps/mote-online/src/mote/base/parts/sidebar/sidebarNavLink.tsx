import { ReactNode } from "react";
import { NavLink } from "react-router-dom"

export interface ISidebarNavLinkProps {
    to: string;
    children?: ReactNode;
    activeStyle?: React.CSSProperties;
}

export const SidebarNavLink = ({
    to,
    activeStyle = {},
    ...rest
}: ISidebarNavLinkProps) => {

    return (
        <NavLink
            to={to}
            style={({ isActive }) => isActive ? activeStyle : {}}
            {...rest}
        />
    )
}