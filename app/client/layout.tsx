"use client"

import { SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <AppSidebar />
            <SidebarInset>
                <main className="flex-1 p-6">
                    {children}
                </main>
            </SidebarInset>
        </>
    )
}
