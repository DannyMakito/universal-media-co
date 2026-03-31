import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

// Get user by Clerk ID
export const getUserByClerkId = query({
    args: { clerkId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
            .unique()
    },
})

// Get user by email
export const getUserByEmail = query({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .unique()
    },
})

// Create a new user (called from webhook)
export const createUser = mutation({
    args: {
        clerkId: v.string(),
        email: v.string(),
        name: v.string(),
        role: v.union(v.literal("admin"), v.literal("client"), v.literal("editor")),
    },
    handler: async (ctx, args) => {
        const now = Date.now()
        const userId = await ctx.db.insert("users", {
            clerkId: args.clerkId,
            email: args.email,
            name: args.name,
            role: args.role,
            createdAt: now,
            updatedAt: now,
        })

        // If editor, create editor record too
        if (args.role === "editor") {
            await ctx.db.insert("editors", {
                userId: userId,
                specialties: [],
                isActive: true,
            })
        }

        return userId
    },
})

// Update user role (admin only)
export const updateUserRole = mutation({
    args: {
        userId: v.id("users"),
        role: v.union(v.literal("admin"), v.literal("client"), v.literal("editor")),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.userId, {
            role: args.role,
            updatedAt: Date.now(),
        })
    },
})

// Get current user with role
export const getCurrentUser = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) return null

        return await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique()
    },
})

// Get all editors
export const getAllEditors = query({
    args: {},
    handler: async (ctx) => {
        const editors = await ctx.db
            .query("editors")
            .filter((q) => q.eq(q.field("isActive"), true))
            .collect()

        const editorsWithUsers = await Promise.all(
            editors.map(async (editor) => {
                const user = await ctx.db.get(editor.userId)
                return { ...editor, user }
            })
        )

        return editorsWithUsers
    },
})

// Update user's Clerk ID (for pre-created editors)
export const updateUserClerkId = mutation({
    args: {
        userId: v.id("users"),
        clerkId: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.userId, {
            clerkId: args.clerkId,
            updatedAt: Date.now(),
        })
    },
})

// Update user info
export const updateUser = mutation({
    args: {
        userId: v.id("users"),
        name: v.optional(v.string()),
        email: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const updates: any = {
            updatedAt: Date.now(),
        }
        if (args.name) updates.name = args.name
        if (args.email) updates.email = args.email
        await ctx.db.patch(args.userId, updates)
    },
})

// Deactivate user (soft delete)
export const deactivateUser = mutation({
    args: {
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.userId, {
            updatedAt: Date.now(),
        })

        // Also deactivate editor record if exists
        const editor = await ctx.db
            .query("editors")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .unique()

        if (editor) {
            await ctx.db.patch(editor._id, {
                isActive: false,
            })
        }
    },
})
