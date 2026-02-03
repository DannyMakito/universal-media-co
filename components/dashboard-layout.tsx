"use client"

import { useAuth } from "@/hooks/use-auth"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb"
import { Input } from "@/components/ui/input"
import { Search, Moon, Bell, Grid, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, role, loading } = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login")
        }
    }, [user, loading, router])

    if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>
    if (!user) return null

    return (
        <div className="flex min-h-screen w-full">
            <AppSidebar />
            <SidebarInset className="flex-1 w-full flex flex-col">
                <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-4 border-b w-full">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <div className="hidden md:flex items-center gap-6 px-4">
                            <Link href="/dashboard" className={`text-sm font-medium cursor-pointer ${pathname === '/dashboard' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>Overview</Link>
                            <Link href="#" className="text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground">Customers</Link>
                            <Link href="#" className="text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground">Products</Link>
                            <Link href="#" className="text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground">Settings</Link>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative hidden lg:block w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search..."
                                className="w-full bg-background pl-8 h-9 text-sm"
                            />
                            <span className="absolute right-2 top-2 h-5 w-8 rounded border bg-muted flex items-center justify-center text-[10px] text-muted-foreground">
                                ⌘ K
                            </span>
                        </div>
                        <div className="flex items-center gap-3 mr-2">
                            <Moon className="h-5 w-5 text-muted-foreground cursor-pointer hover:text-foreground" />
                            <Settings className="h-5 w-5 text-muted-foreground cursor-pointer hover:text-foreground" />
                            <Avatar className="h-8 w-8 ml-2 border cursor-pointer">
                                <AvatarImage src="/avatars/01.png" alt="@shadcn" />
                                <AvatarFallback>SN</AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-auto p-6 bg-background/95">
                    {children}
                </main>
            </SidebarInset>
        </div>
    )
}

function Settings(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    )
}
