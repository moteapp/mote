"use server";

import { type LucideIcon } from "lucide-react"

import Link from "next/link"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "mote/app/components/ui/sidebar"
import { useI18n } from "mote/platform/i18n/common/i18n";
import { useClientTranslation } from "../lib/i18nForClient"

export async function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
  }[]
}) {
    const { t } = await useI18n();
    return (
        <SidebarMenu>
        {items.map((item) => (
            <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={item.isActive}>
                    <Link href={item.url}>
                        <item.icon />
                        <span>{t(item.title)}</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        ))}
        </SidebarMenu>
    )
}
