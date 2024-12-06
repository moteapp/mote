'use server';
import { NavActions } from "mote/app/components/nav-actions";
import { Page } from "mote/app/components/page";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "mote/app/components/ui/breadcrumb";

export default async function DocPage({ params }: { params: { id: string } }) {
    const PageLeft = () => (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                <BreadcrumbPage className="line-clamp-1">
                    Project Management & Task Tracking
                </BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );

    return (
        <Page 
            left={<PageLeft />}
            actions={<NavActions />}
        >
            <div className="mx-auto h-24 w-full max-w-3xl rounded-xl bg-muted/50" />
            <div className="mx-auto h-full w-full max-w-3xl rounded-xl bg-muted/50" />
        </Page>
    )
}