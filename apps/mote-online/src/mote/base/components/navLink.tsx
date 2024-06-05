import { forwardRef } from "react";
import { Location } from 'history';
import { matchPath, Route, NavLink as RouteNavLink } from "react-router-dom";

type INavLinkProps = React.ComponentProps<typeof RouteNavLink> & {
    children?: React.ReactNode;
    /**
     * If true, the tab will only be active if the path matches exactly.
     */
    exact?: boolean;
    /**
     * CSS properties to apply to the link when it is active.
     */
    activeStyle?: React.CSSProperties;
    /**
     * The path to match against the current location.
     */
    to: Location | string;
};

export const NavLink = forwardRef<HTMLAnchorElement, INavLinkProps>(
    function _NavLink(
        { to, exact = false, children, activeStyle, ...rest }: INavLinkProps,
        ref: React.Ref<HTMLAnchorElement>
    ) {
        return (
            <RouteNavLink {...rest} to={to} ref={ref}
                style={({ isActive }) => isActive ? activeStyle : {}}
            >
                {children}
            </RouteNavLink>
        );
    }
);