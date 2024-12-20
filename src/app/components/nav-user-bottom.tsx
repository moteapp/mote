'use client';

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
} from "lucide-react";

import { MouseEventHandler } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "mote/app/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "mote/app/components/ui/dropdown-menu";
import { logoutAction } from "../actions/authActions";
import { useClientTranslation } from "../lib/i18nForClient";
import { logout, selectUser } from "../store/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";

export function NavUser() {
    const { t } = useClientTranslation();
    const user = useAppSelector(selectUser);
    const dispatch = useAppDispatch();
    if (!user) {
        return null;
    }

    const handleLogout: MouseEventHandler = (e) => {
        e.preventDefault();
        // clear redux store
        dispatch(logout());
        // clear cookie
        logoutAction();
    };

    return (
        <DropdownMenu>
        <DropdownMenuTrigger className="w-full rounded-md outline-none ring-ring hover:bg-accent focus-visible:ring-2 data-[state=open]:bg-accent">
            <div className="flex items-center gap-2 px-2 py-1.5 text-left text-sm transition-all">
            <Avatar className="h-7 w-7 rounded-md border">
                <AvatarImage
                src={user.avatar ?? undefined}
                alt={user.name}
                className="animate-in fade-in-50 zoom-in-90"
                />
                <AvatarFallback className="rounded-md">CN</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 leading-none">
                <div className="font-medium">{user.name}</div>
                <div className="overflow-hidden text-xs text-muted-foreground">
                <div className="line-clamp-1">{user.email}</div>
                </div>
            </div>
            <ChevronsUpDown className="ml-auto mr-0.5 h-4 w-4 text-muted-foreground/50" />
            </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
            className="w-56"
            align="end"
            side="right"
            sideOffset={4}
        >
            <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm transition-all">
                <Avatar className="h-7 w-7 rounded-md">
                <AvatarImage src={user.avatar ?? undefined } alt={user.name} />
                <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1">
                <div className="font-medium">{user.name}</div>
                <div className="overflow-hidden text-xs text-muted-foreground">
                    <div className="line-clamp-1">{user.email}</div>
                </div>
                </div>
            </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
            <DropdownMenuItem className="gap-2">
                <BadgeCheck className="h-4 w-4 text-muted-foreground" />
                Account
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                Billing
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                Notifications
            </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2" onClick={handleLogout}>
                <LogOut className="h-4 w-4 text-muted-foreground"/>
                {t("Log out")}
            </DropdownMenuItem>
        </DropdownMenuContent>
        </DropdownMenu>
    )
}
