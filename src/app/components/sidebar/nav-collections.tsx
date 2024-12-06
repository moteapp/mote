'use server';
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "mote/app/components/ui/sidebar"
import { ChevronRightIcon, DotsHorizontalIcon, PlusIcon } from "@radix-ui/react-icons"
import { useI18n } from "mote/platform/i18n/common/i18n";
import { NavCollectionAction } from "./nav-sidebar-actions";


export type NavCollection = {
    name: string
    emoji: React.ReactNode
    pages: {
        name: string
        emoji: React.ReactNode
    }[]
}

export type NavCollectionsProps = {
    collections: NavCollection[];
}

export async function NavCollections({
  collections,
}: NavCollectionsProps) {
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
                        <SidebarMenu>
                            {collections.map((collection) => (
                            <Collapsible key={collection.name}>
                                <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <a href="#">
                                    <span>{collection.emoji}</span>
                                    <span>{collection.name}</span>
                                    </a>
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
                                    {collection.pages.map((page) => (
                                        <SidebarMenuSubItem key={page.name}>
                                        <SidebarMenuSubButton asChild>
                                            <a href="#">
                                            <span>{page.emoji}</span>
                                            <span>{page.name}</span>
                                            </a>
                                        </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    ))}
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
