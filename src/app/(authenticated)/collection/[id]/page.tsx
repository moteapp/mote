'use server';
import { NavActions } from "mote/app/components/nav-actions";
import { PageLayout } from "mote/app/components/page-layout";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "mote/app/components/ui/breadcrumb";

export default async function CollectionPage({ params }: { params: Promise<{ id: string }> }) {
    const collectionId = (await params).id;
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
        <PageLayout 
            left={<PageLeft />}
            actions={<NavActions />}
        >
            <div className="mx-auto h-24 w-full max-w-3xl rounded-xl bg-muted/50" />
            <div className="mx-auto h-full w-full max-w-3xl rounded-xl bg-muted/50" />
        </PageLayout>
    )
}