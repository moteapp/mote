'use server';
import Link from "next/link";
import { IBaseBlock, ICollection } from "mote/base/parts/storage/common/schema";
import { SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { NavDocumentActions } from "./document-actions";
import { Trans } from "react-i18next/TransWithoutContext";
import { NewDoc } from "../button/new-doc-button";
import { I18N } from "mote/platform/i18n/common/i18n";
import { format, formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import { IPageBlock } from "mote/editor/common/blockCommon";

const dateLocales = {
    "zh-CN": zhCN,
};

export type NavDocumentsProps = {
    i18n: I18N;
    collection?: ICollection | null;
    documents: IPageBlock[];
}

async function DocumentMetadata({
    i18n,
    document
}: { document: IBaseBlock, i18n: I18N }) {
    const hasUpdatedAt = document.createdAt.getTime() != document.updatedAt.getTime();
    const time = hasUpdatedAt ? document.updatedAt : document.createdAt;
    const timeToNow = formatDistanceToNow(time, { addSuffix: true, locale: (dateLocales as any)[i18n.i18n.language] });
    const action = hasUpdatedAt ? "Updated" : "Created";
    const dateTime = format(time, "yyyy-MM-dd'T'HH:mm:ss");
    return (
        <div className="text-slate-400">
            <span>
                <Trans 
                    i18n={i18n.i18n}
                    defaults={`${action} at <time dateTime={{ dateTime }}>{{ content }}</time>`}
                    values={{ dateTime, content: timeToNow }}
                    components={{ time: <time /> }}
                />
            </span>
        </div>
    )
}

export async function NavDocumentList({
    i18n,
    collection,
    documents
} : NavDocumentsProps) {
    
    if (!documents || documents.length === 0) {
        return (
            <div className="mx-auto w-full max-w-4xl">
                <p className="mb-4">
                    <Trans 
                        i18n={i18n.i18n}
                        defaults="<em>{{ collectionName }}</em> doesn’t contain any documents yet."
                        values={{ collectionName: collection?.name }}
                        components={{ em: <strong /> }}
                    />
                    <br />
                    <Trans i18n={i18n.i18n}>Get started by creating a new one!</Trans>
                </p>
                <NewDoc collectionId={collection?.id}/>
            </div>
        )
    }
    
    return (
        <SidebarMenu>
            {documents.map((document) => (
                <SidebarMenuItem key={document.id}>
                    <SidebarMenuButton className="-ml-2" size="xl" asChild>
                        <Link href={`/doc/${document.id}`}>
                            <div className="flex flex-col">
                                <h3 className="text-xl mb-1.5">{document.content?.title || i18n.t("Untitled")}</h3>
                                <DocumentMetadata i18n={i18n} document={document} />
                            </div>
                            <NavDocumentActions />
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
        </SidebarMenu>
    )
}