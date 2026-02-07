"use client"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { EditorSidebar } from "@/components/editor-sidebar"

export default function EditorLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SidebarProvider>
            <EditorSidebar />
            <SidebarInset>
                <main className="flex-1 p-6">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
