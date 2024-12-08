'use server';
import { Heading } from "mote/app/components/heading";
import { NavActions } from "mote/app/components/nav-actions";
import { NavTab, NavTabs } from "mote/app/components/nav-tabs";
import { PageLayout } from "mote/app/components/page-layout";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "mote/app/components/ui/breadcrumb";
import { getCollection } from "mote/app/lib/dal";
import { useI18n } from "mote/platform/i18n/common/i18n";

export default async function CollectionPageLayout({ 
    params, children 
}: { 
    params: Promise<{ id: string }>,
    children: React.ReactNode
}) {
    const collectionId = (await params).id;
    const collection = await getCollection(collectionId);
    const { t } = await useI18n();

    if (!collection) {
        return <div>Collection not found</div>;
    }

    const PageLeft = () => (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                <BreadcrumbPage className="line-clamp-1">
                    {collection?.name || 'Loading...'}
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
            
            <Heading className="mx-auto w-full max-w-4xl">{collection?.name}</Heading>
            
            <div className="mx-auto h-24 w-full max-w-4xl rounded-xl bg-muted/50" />
            <div className="mx-auto w-full max-w-4xl">
                <NavTabs >
                    <NavTab to={`/collection/${collectionId}`}>{t('Documents')}</NavTab>
                    <NavTab to={`/collection/${collectionId}/recent`}>{t('Recently updated')}</NavTab>
                    <NavTab to={`/collection/${collectionId}/published`}>{t('Recently published')}</NavTab>
                </NavTabs>
            </div>
            {children}
        </PageLayout>
    )
}