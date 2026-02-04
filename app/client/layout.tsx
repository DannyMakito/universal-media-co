"use client"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { ClientSidebar } from "@/components/client-sidebar"

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SidebarProvider>
            <ClientSidebar />
            <SidebarInset>
                <main className="flex-1 p-6">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
