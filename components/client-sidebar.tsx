"use client"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
    LayoutDashboard,
    FolderKanban,
    Settings,
    LogOut,
    Building2
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { SignOutButton, useUser } from "@clerk/nextjs"

const menuItems = [
    { title: "Dashboard", url: "/client/dashboard", icon: LayoutDashboard },
    { title: "Projects", url: "/client/projects", icon: FolderKanban },
    { title: "Settings", url: "/client/settings", icon: Settings },
]

export function ClientSidebar() {
    const pathname = usePathname()
    const { user: clerkUser } = useUser()
    const user = useQuery(api.users.getCurrentUser)

    return (
        <Sidebar>
            <SidebarHeader className="border-b border-sidebar-border px-6 py-4">
                <div className="flex items-center gap-2">
                    <Building2 className="h-6 w-6 text-primary" />
                    <span className="font-semibold">Client Portal</span>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                                        <Link href={item.url}>
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border p-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <div className="flex items-center gap-3 px-3 py-2">
                            {user ? (
                                <>
                                    <Avatar className="h-9 w-9 border border-sidebar-border">
                                        <AvatarImage src={clerkUser?.imageUrl} alt={user.name} />
                                        <AvatarFallback className="bg-primary/10 text-primary">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-1 flex-col overflow-hidden">
                                        <span className="truncate text-sm font-medium leading-tight">
                                            {user.name}
                                        </span>
                                        <span className="truncate text-xs text-muted-foreground leading-tight">
                                            {user.email}
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Skeleton className="h-9 w-9 rounded-full" />
                                    <div className="flex flex-1 flex-col gap-1">
                                        <Skeleton className="h-3 w-20" />
                                        <Skeleton className="h-2 w-24" />
                                    </div>
                                </>
                            )}
                        </div>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SignOutButton redirectUrl="/login">
                            <SidebarMenuButton className="text-muted-foreground hover:text-foreground">
                                <LogOut className="h-4 w-4" />
                                <span>Log out</span>
                            </SidebarMenuButton>
                        </SignOutButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
