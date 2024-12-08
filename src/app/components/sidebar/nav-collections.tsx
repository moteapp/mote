'use server';
import { ChevronRightIcon, DotsHorizontalIcon, PlusIcon } from "@radix-ui/react-icons"
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "mote/app/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "mote/app/components/ui/sidebar"
import { getCollections } from "mote/app/lib/dal";
import { useI18n } from "mote/platform/i18n/common/i18n";
import { NavCollectionAction } from "./nav-sidebar-actions";

export async function NavCollectionsSkeleton() {
    const { t } = await useI18n();

    return (
        <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroup>
                <SidebarGroupLabel asChild>
                    <CollapsibleTrigger>
                        {t("Collections")}
                    </CollapsibleTrigger>
                </SidebarGroupLabel>
                <NavCollectionAction />
                <CollapsibleContent>
                    <SidebarGroupContent>
                        <SidebarMenuSkeleton />
                        <SidebarMenuSkeleton />
                        <SidebarMenuSkeleton />
                        <SidebarMenuSkeleton />
                        <SidebarMenuSkeleton />
                    </SidebarGroupContent>
                </CollapsibleContent>
            </SidebarGroup>
        </Collapsible>
    )
}

export async function NavCollections() {
    const { t } = await useI18n();
    const collections = await getCollections() || [];
    return (
        <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroup>
                <SidebarGroupLabel asChild>
                    <CollapsibleTrigger>
                        {t("Collections")}
                    </CollapsibleTrigger>
                </SidebarGroupLabel>
                <NavCollectionAction />
                <CollapsibleContent>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {collections.map((collection) => (
                            <Collapsible key={collection.id}>
                                <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href={`/collection/${collection.id}`}>
                                        <span>{collection.icon || "📔"}</span>
                                        <span>{collection.name}</span>
                                    </Link>
                                </SidebarMenuButton>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuAction
                                    className="left-2 bg-sidebar-accent text-sidebar-accent-foreground data-[state=open]:rotate-90"
                                    showOnHover
                                    >
                                    <ChevronRightIcon />
                                    </SidebarMenuAction>
                                </CollapsibleTrigger>
                                <SidebarMenuAction showOnHover>
                                    <PlusIcon />
                                </SidebarMenuAction>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                    {/*collection.pages.map((page) => (
                                        <SidebarMenuSubItem key={page.name}>
                                        <SidebarMenuSubButton asChild>
                                            <a href="#">
                                            <span>{page.emoji}</span>
                                            <span>{page.name}</span>
                                            </a>
                                        </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    ))*/}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                            ))}
                            <SidebarMenuItem>
                                <SidebarMenuButton className="text-sidebar-foreground/70">
                                    <DotsHorizontalIcon />
                                    <span>More</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </CollapsibleContent>
            </SidebarGroup>
        </Collapsible>
    )
}
