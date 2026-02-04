"use client"

import * as React from "react"
import Link from "next/link"
import {
    BadgeCheck,
    Bell,
    ChevronRight,
    ChevronsUpDown,
    Command,
    CreditCard,
    LogOut,
    MoreHorizontal,
    Settings2,
    Sparkles,
    LayoutDashboard,
    CheckSquare,
    Box,
    MessageSquare,
    Users,
    Lock,
    FileText,
    AlertTriangle,
    Settings,
    HelpCircle,
    ShieldAlert
} from "lucide-react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarProvider,
    SidebarRail,
} from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/use-auth"
import { getInitials } from "@/lib/utils"
import { usePathname } from "next/navigation"

// Menu items for Admin
const adminData = {
    user: {
        name: "satnaing",
        email: "satnaingdev@gmail.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        {
            title: "General",
            items: [
                {
                    title: "Dashboard",
                    url: "/dashboard",
                    icon: LayoutDashboard,
                    isActive: true,
                },
                {
                    title: "Tasks",
                    url: "/dashboard/tasks",
                    icon: CheckSquare,
                },
                {
                    title: "Apps",
                    url: "/dashboard/apps",
                    icon: Box,
                },
                {
                    title: "Chats",
                    url: "/dashboard/chats",
                    icon: MessageSquare,
                    badge: "3",
                },
                {
                    title: "Users",
                    url: "/dashboard/users",
                    icon: Users,
                },
                {
                    title: "Secured by Clerk",
                    url: "#",
                    icon: Lock,
                    items: [
                        { title: "Settings", url: "#" },
                        { title: "Profile", url: "#" },
                    ],
                },
            ],
        },
        {
            title: "Pages",
            items: [
                {
                    title: "Auth",
                    url: "#",
                    icon: ShieldAlert,
                    items: [
                        { title: "Login", url: "#" },
                        { title: "Register", url: "#" },
                    ],
                },
                {
                    title: "Errors",
                    url: "#",
                    icon: AlertTriangle,
                    items: [
                        { title: "404", url: "#" },
                        { title: "500", url: "#" },
                    ],
                },
            ],
        },
        {
            title: "Other",
            items: [
                {
                    title: "Settings",
                    url: "#",
                    icon: Settings,
                    items: [
                        { title: "General", url: "#" },
                        { title: "Security", url: "#" },
                    ],
                },
                {
                    title: "Help Center",
                    url: "#",
                    icon: HelpCircle,
                },
            ],
        },
    ],
}

// Menu items for Client
const clientData = {
    user: {
        name: "Client User",
        email: "client@example.com",
        avatar: "/avatars/02.png",
    },
    navMain: [
        {
            title: "Navigation",
            items: [
                {
                    title: "My Dashboard",
                    url: "/dashboard",
                    icon: LayoutDashboard,
                    isActive: true,
                },
                {
                    title: "Orders",
                    url: "#",
                    icon: Box,
                    badge: "2",
                },
                {
                    title: "Tickets",
                    url: "#",
                    icon: MessageSquare,
                },
            ],
        },
        {
            title: "Other",
            items: [
                {
                    title: "Account Settings",
                    url: "#",
                    icon: Settings,
                },
                {
                    title: "Help & Support",
                    url: "#",
                    icon: HelpCircle,
                },
            ],
        },
    ],
}

// Menu items for Editor
const editorData = {
    user: {
        name: "Editor User",
        email: "editor@example.com",
        avatar: "/avatars/03.png",
    },
    navMain: [
        {
            title: "Content",
            items: [
                {
                    title: "Dashboard",
                    url: "/dashboard",
                    icon: LayoutDashboard,
                    isActive: true,
                },
                {
                    title: "Articles",
                    url: "#",
                    icon: FileText,
                },
                {
                    title: "Media Library",
                    url: "#",
                    icon: Box,
                },
            ],
        },
        {
            title: "Pages",
            items: [
                {
                    title: "Manage Site",
                    url: "#",
                    icon: Settings2,
                },
            ],
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { role, logout } = useAuth()
    const pathname = usePathname()

    const data = React.useMemo(() => {
        switch (role) {
            case "client": return clientData
            case "editor": return editorData
            default: return adminData
        }
    }, [role])

    return (
        <Sidebar variant="sidebar" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                    <Command className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        {role === 'admin' ? 'Shadcn Admin' : role === 'client' ? 'Client Portal' : 'Editor Dashboard'}
                                    </span>
                                    <span className="truncate text-xs text-muted-foreground">Universal Media Co</span>
                                </div>
                                <ChevronsUpDown className="ml-auto size-4 opacity-50" />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                {data.navMain.map((group) => (
                    <div key={group.title} className="mb-6 px-2">
                        <div className="px-4 py-2 text-[11px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                            {group.title}
                        </div>
                        <SidebarMenu>
                            {group.items.map((item) => {
                                const isActive = pathname === item.url || (item.items?.some(sub => pathname === sub.url))
                                return (
                                    <React.Fragment key={item.title}>
                                        {item.items ? (
                                            <Collapsible asChild defaultOpen={isActive} className="group/collapsible">
                                                <SidebarMenuItem>
                                                    <CollapsibleTrigger asChild>
                                                        <SidebarMenuButton
                                                            tooltip={item.title}
                                                            isActive={isActive}
                                                            className="hover:bg-accent hover:text-accent-foreground data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
                                                        >
                                                            {item.icon && <item.icon className="h-4 w-4" />}
                                                            <span className="font-medium">{item.title}</span>
                                                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                        </SidebarMenuButton>
                                                    </CollapsibleTrigger>
                                                    <CollapsibleContent>
                                                        <SidebarMenuSub>
                                                            {item.items?.map((subItem) => (
                                                                <SidebarMenuSubItem key={subItem.title}>
                                                                    <SidebarMenuSubButton asChild isActive={pathname === subItem.url}>
                                                                        <Link href={subItem.url}>
                                                                            <span className={pathname === subItem.url ? "font-semibold" : ""}>{subItem.title}</span>
                                                                        </Link>
                                                                    </SidebarMenuSubButton>
                                                                </SidebarMenuSubItem>
                                                            ))}
                                                        </SidebarMenuSub>
                                                    </CollapsibleContent>
                                                </SidebarMenuItem>
                                            </Collapsible>
                                        ) : (
                                            <SidebarMenuItem>
                                                <SidebarMenuButton
                                                    asChild
                                                    isActive={pathname === item.url}
                                                    className="hover:bg-accent hover:text-accent-foreground data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
                                                >
                                                    <Link href={item.url}>
                                                        {item.icon && <item.icon className="h-4 w-4" />}
                                                        <span className="font-medium">{item.title}</span>
                                                        {item.badge && (
                                                            <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
                                                                {item.badge}
                                                            </span>
                                                        )}
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        )}
                                    </React.Fragment>
                                )
                            })}
                        </SidebarMenu>
                    </div>
                ))}
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                >
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarImage src={data.user.avatar} alt={data.user.name} />
                                        <AvatarFallback className="rounded-lg">{getInitials(data.user.name)}</AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">{data.user.name}</span>
                                        <span className="truncate text-xs">{data.user.email}</span>
                                    </div>
                                    <ChevronsUpDown className="ml-auto size-4 opacity-50" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                                side="right"
                                align="end"
                                sideOffset={4}
                            >
                                <DropdownMenuLabel className="p-0 font-normal">
                                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                        <Avatar className="h-8 w-8 rounded-lg">
                                            <AvatarImage src={data.user.avatar} alt={data.user.name} />
                                            <AvatarFallback className="rounded-lg">{getInitials(data.user.name)}</AvatarFallback>
                                        </Avatar>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-semibold">{data.user.name}</span>
                                            <span className="truncate text-xs">{data.user.email}</span>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem>
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        Upgrade to Pro
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem>
                                        <BadgeCheck className="mr-2 h-4 w-4" />
                                        Account
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <CreditCard className="mr-2 h-4 w-4" />
                                        Billing
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Bell className="mr-2 h-4 w-4" />
                                        Notifications
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={logout}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
