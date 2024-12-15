'use server';
import { NavActions } from "mote/app/components/nav-actions";
import { NavTab, NavTabs } from "mote/app/components/nav-tabs";
import { PageLayout } from "mote/app/components/page-layout";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "mote/app/components/ui/breadcrumb";
import { getCollection, getDocument } from "mote/app/lib/dal";
import { EditorView } from "mote/editor/browser/editorView";
import { useI18n } from "mote/platform/i18n/common/i18n";

export default async function DocumentPage({ 
    params 
}: { 
    params: Promise<{ id: string }>,
}) {
    const { t } = await useI18n();
    const rootId = (await params).id;
    const document = await getDocument(rootId);

    const PageLeft = () => (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                <BreadcrumbPage className="line-clamp-1">
                    {document.content?.title || t("Untitled")}
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
            <EditorView rootId={rootId} />
        </PageLayout>
    )
}