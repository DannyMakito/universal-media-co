import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const isPublicRoute = createRouteMatcher([
    "/",
    "/login",
    "/signup",
    "/api/webhooks/clerk",
])

const isAdminRoute = createRouteMatcher([
    "/admin(.*)",
])

const isClientRoute = createRouteMatcher([
    "/client(.*)",
])

const isEditorRoute = createRouteMatcher([
    "/editor(.*)",
])

export default clerkMiddleware(async (auth, req) => {
    const { userId, sessionClaims } = await auth()

    // Allow public routes
    if (isPublicRoute(req)) {
        return NextResponse.next()
    }

    // Redirect unauthenticated users to login
    if (!userId) {
        return NextResponse.redirect(new URL("/login", req.url))
    }

    // Get user role from session claims (set by webhook)
    const role = sessionClaims?.role as string | undefined

    // Role-based access control
    if (isAdminRoute(req) && role !== "admin") {
        // Redirect non-admin users trying to access admin routes
        if (role === "client") {
            return NextResponse.redirect(new URL("/dashboard", req.url))
        }
        if (role === "editor") {
            return NextResponse.redirect(new URL("/editor/dashboard", req.url))
        }
    }

    if (isEditorRoute(req) && role !== "editor") {
        // Redirect non-editor users trying to access editor routes
        if (role === "admin" || role === "client") {
            return NextResponse.redirect(new URL("/dashboard", req.url))
        }
    }

    // Client routes are accessible by both clients and admins
    if (isClientRoute(req) && role !== "client" && role !== "admin") {
        // Redirect editors to their dashboard
        if (role === "editor") {
            return NextResponse.redirect(new URL("/editor/dashboard", req.url))
        }
    }

    return NextResponse.next()
})

export const config = {
    matcher: [
        // Skip Next.js internals and all static files
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
}
