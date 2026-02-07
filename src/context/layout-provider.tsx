"use client"

import * as React from "react"

type LayoutVariant = "default" | "compact" | "expanded"

interface LayoutContextType {
    sidebarVariant: LayoutVariant
    setSidebarVariant: (variant: LayoutVariant) => void
    sidebarCollapsed: boolean
    setSidebarCollapsed: (collapsed: boolean) => void
    toggleSidebar: () => void
}

const LayoutContext = React.createContext<LayoutContextType | undefined>(undefined)

export function LayoutProvider({ children }: { children: React.ReactNode }) {
    const [sidebarVariant, setSidebarVariant] = React.useState<LayoutVariant>("default")
    const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)

    const toggleSidebar = React.useCallback(() => {
        setSidebarCollapsed((prev) => !prev)
    }, [])

    const value = React.useMemo(
        () => ({
            sidebarVariant,
            setSidebarVariant,
            sidebarCollapsed,
            setSidebarCollapsed,
            toggleSidebar,
        }),
        [sidebarVariant, sidebarCollapsed, toggleSidebar]
    )

    return (
        <LayoutContext.Provider value={value}>
            {children}
        </LayoutContext.Provider>
    )
}

export function useLayout() {
    const context = React.useContext(LayoutContext)
    if (context === undefined) {
        throw new Error("useLayout must be used within a LayoutProvider")
    }
    return context
}
