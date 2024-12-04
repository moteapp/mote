import { NavActions } from "./nav-actions";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "./ui/breadcrumb";
import { Separator } from "./ui/separator";
import { SidebarInset, SidebarTrigger } from "./ui/sidebar";

export type PageProps = {
    children: React.ReactNode;
    left?: React.ReactNode;
    actions?: React.ReactNode;
}

export function Page({
    children,
    left,
    actions
} : PageProps ) {
    return (
        <SidebarInset>
            <header className="flex h-14 shrink-0 items-center gap-2">
                <div className="flex flex-1 items-center gap-2 px-3">
                    <SidebarTrigger />
                    {left && (
                        <>
                            <Separator orientation="vertical" className="mr-2 h-4" />
                            {left}
                        </>
                    )}
                </div>
                <div className="ml-auto px-3">
                    {actions}
                </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 px-4 py-10">
                {children}
            </div>
        </SidebarInset>
    )
}