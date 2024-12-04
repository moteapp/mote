import { AppSidebar } from '../components/app-sidebar';
import { NewDoc } from '../components/button/new-doc-button';
import { NavActions } from '../components/nav-actions';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from '../components/ui/breadcrumb';
import { Separator } from '../components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '../components/ui/sidebar';
import { getUser } from '../lib/dal';

export default async function AuthenticatedLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // Auth check from DAL level.
    const user = await getUser();
    return (
        <SidebarProvider>
            <AppSidebar />
            {children}
        </SidebarProvider>
      )
}
