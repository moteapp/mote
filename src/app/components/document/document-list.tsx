'use server';
import Link from "next/link";
import { IBaseBlock } from "mote/base/parts/storage/common/schema";
import { SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { NavDocumentActions } from "./document-actions";

export type NavDocumentsProps = {
    documents: IBaseBlock[];
}

export async function DocumentList({
    documents
} : NavDocumentsProps) {
    return (
        <SidebarMenu>
            {documents.map((document) => (
                <SidebarMenuItem key={document.id}>
                    <SidebarMenuButton className="-ml-2" size="xl" asChild>
                        <Link href={`/collection/${document.id}`}>
                            <div className="flex flex-col">
                                <h3 className="text-xl mb-1.5">{"无标题"}</h3>
                                <div className="text-slate-400">
                                    <span>你保存了5个月</span>
                                </div>
                            </div>
                            <NavDocumentActions />
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
        </SidebarMenu>
    )
}