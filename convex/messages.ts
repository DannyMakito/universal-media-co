import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

// Create message for an order
export const createMessage = mutation({
    args: {
        orderId: v.id("orders"),
        content: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error("Not authenticated")

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique()

        if (!user) throw new Error("User not found")

        const order = await ctx.db.get(args.orderId)
        if (!order) throw new Error("Order not found")

        // Check authorization
        const isAuthorized =
            user.role === "admin" ||
            order.clientId === user._id

        if (!isAuthorized) throw new Error("Not authorized")

        return await ctx.db.insert("messages", {
            orderId: args.orderId,
            senderId: user._id,
            content: args.content,
            createdAt: Date.now(),
        })
    },
})

// Get messages for an order
export const getOrderMessages = query({
    args: { orderId: v.id("orders") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) return []

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique()

        if (!user) return []

        const order = await ctx.db.get(args.orderId)
        if (!order) return []

        // Check authorization
        const isAuthorized =
            user.role === "admin" ||
            order.clientId === user._id

        if (!isAuthorized) return []

        const messages = await ctx.db
            .query("messages")
            .withIndex("by_orderId", (q) => q.eq("orderId", args.orderId))
            .collect()

        // Populate sender info
        return await Promise.all(
            messages.map(async (msg) => {
                const sender = await ctx.db.get(msg.senderId)
                return { ...msg, sender }
            })
        )
    },
})

// Delete message (only sender or admin)
export const deleteMessage = mutation({
    args: { messageId: v.id("messages") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error("Not authenticated")

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique()

        if (!user) throw new Error("User not found")

        const message = await ctx.db.get(args.messageId)
        if (!message) throw new Error("Message not found")

        // Only sender or admin can delete
        if (message.senderId !== user._id && user.role !== "admin") {
            throw new Error("Not authorized")
        }

        await ctx.db.delete(args.messageId)
    },
})
