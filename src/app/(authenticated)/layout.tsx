import { AppSidebar } from '../components/app-sidebar';
import { SidebarLayout, SidebarTrigger } from '../components/ui/sidebar';

export default function AuthenticatedLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SidebarLayout
          defaultOpen={true}
        >
          <AppSidebar />
          <main className="flex flex-1 flex-col p-2 transition-all duration-300 ease-in-out">
            <div className="h-full rounded-md border-2 border-dashed p-2">
              <SidebarTrigger />
            </div>
            {children}
          </main>
        </SidebarLayout>
      )
}
