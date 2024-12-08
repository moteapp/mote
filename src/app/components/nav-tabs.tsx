'use client';
import { UrlObject } from "url";
import { LayoutGroup, m } from 'framer-motion';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { transparentize } from "polished";
import { PropsWithChildren } from "react";
import styled from "styled-components";
import { s } from "../style/css";

export type NavTabsProps = PropsWithChildren<{
    className?: string;
}>;

export function NavTabs({ children, className }: NavTabsProps) {
    return (
        <LayoutGroup>
            <Sticky className={className}>
                <Nav>{children}</Nav>
            </Sticky>
        </LayoutGroup>
    );
}

export type TabProps = PropsWithChildren & {
    to: string;
};

export function NavTab({ to, children }: TabProps) {
    const currentPath = usePathname();
    const match = currentPath === to;
    return (
        <TabLink href={to} className={ match ? "text-slate-700" : "text-slate-400"}>
            {(match, location) => (
                <>
                    {children}
                    {match && <Active className="bg-slate-700"/>}
                </>
            )}
        </TabLink>
    );
}

const Nav = styled.nav<{ $shadowVisible?: boolean }>`
    border-bottom: 1px solid hsl(var(--border));
    margin: 12px 0;
    overflow-y: auto;
    white-space: nowrap;

    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
        display: none;
    }
    &:after {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        width: 50px;
        height: 100%;
        pointer-events: none;
        background: ${(props) =>
            props.$shadowVisible
                ? `linear-gradient(
      90deg,
      ${transparentize(1, props.theme.background)} 0%,
      ${props.theme.background} 100%
    )`
                : `transparent`};
    }
`;

// When sticky we need extra background coverage around the sides otherwise
// items that scroll past can "stick out" the sides of the heading
const Sticky = styled.div`
    position: sticky;
    top: 54px;
    margin: 0 -8px;
    padding: 0 8px;
    background: ${s('background')};
    transition: ${s('backgroundTransition')};
    z-index: 1;
`;

const TabLink = styled(NavLink)`
    position: relative;
    display: inline-flex;
    align-items: center;
    font-weight: 500;
    font-size: 14px;
    cursor: var(--pointer);
    color: ${s('textTertiary')};
    user-select: none;
    margin-right: 24px;
    padding: 6px 0;
`;

const Active = styled(m.div)`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    width: 100%;
    border-radius: 3px;
    background: ${s('textSecondary')};
`;

type Url = string | UrlObject;

type NavLinkProps = {
    href: Url;
    className?: string;
    children?: (match: boolean, currentPath: string) => React.ReactNode;
};

export function NavLink({ children, ...props }: NavLinkProps) {
    const currentPath = usePathname();
    const match = currentPath === props.href;
    return <Link {...props}>{children ? children(match, currentPath) : null}</Link>;
}
