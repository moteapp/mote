'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UrlObject } from "url";

type Url = string | UrlObject;

type NavLinkProps = {
    href: Url;
    children?: (match: boolean, currentPath: string) => React.ReactNode;
};

export function NavLink({ children, ...props }: NavLinkProps) {
    const currentPath = usePathname();
    const match = currentPath === props.href;
    return <Link {...props}>{children ? children(match, currentPath) : null}</Link>;
}
