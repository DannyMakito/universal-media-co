"use client"

import { SidebarInset } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin-sidebar"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <AdminSidebar />
            <SidebarInset>
                <main className="flex-1 p-6">
                    {children}
                </main>
            </SidebarInset>
        </>
    )
}
