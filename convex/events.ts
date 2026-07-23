import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

// Generate upload URL for media
export const generateUploadUrl = mutation({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error("Not authenticated")

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique()

        if (!user || user.role !== "admin") throw new Error("Only admins can upload event media")

        return await ctx.storage.generateUploadUrl()
    },
})

// Create event
export const createEvent = mutation({
    args: {
        title: v.string(),
        description: v.string(),
        mediaUrl: v.optional(v.string()),
        mediaStorageId: v.optional(v.id("_storage")),
        startDate: v.number(),
        endDate: v.number(),
        amountPerEntry: v.number(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error("Not authenticated")

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique()

        if (!user || user.role !== "admin") throw new Error("Only admins can create events")

        const now = Date.now()
        return await ctx.db.insert("events", {
            ...args,
            status: "active",
            winners: [],
            createdAt: now,
            updatedAt: now,
        })
    },
})

// Get events (active and completed)
export const getEvents = query({
    args: {},
    handler: async (ctx) => {
        const events = await ctx.db.query("events").order("desc").collect()
        
        // Add media URLs if they exist as storage IDs
        return await Promise.all(
            events.map(async (event) => {
                let finalMediaUrl = event.mediaUrl
                if (event.mediaStorageId) {
                    finalMediaUrl = await ctx.storage.getUrl(event.mediaStorageId) || undefined
                }
                return { ...event, mediaUrl: finalMediaUrl }
            })
        )
    },
})

// Get event stats (Client side)
export const getEventStats = query({
    args: { eventId: v.id("events") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error("Not authenticated")

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique()

        if (!user) throw new Error("User not found")

        const event = await ctx.db.get(args.eventId)
        if (!event) throw new Error("Event not found")

        // Find all paid orders within timeframe
        const paidOrders = await ctx.db
            .query("orders")
            .filter((q) => q.eq(q.field("isPaid"), true))
            .collect()

        const eligibleOrders = paidOrders.filter((o) => {
            const payDate = o.paymentDate || o.updatedAt
            return payDate >= event.startDate && payDate <= event.endDate
        })

        // Total entries
        let totalEntries = 0
        let yourEntries = 0

        // Calculate entries by user
        const entriesByClient: Record<string, number> = {}

        for (const order of eligibleOrders) {
            const amount = order.paymentAmount || (order.quote ? order.quote.price : 0)
            if (!entriesByClient[order.clientId]) {
                entriesByClient[order.clientId] = 0
            }
            entriesByClient[order.clientId] += amount
        }

        // Convert sums to entries (floor)
        for (const [clientId, totalPaid] of Object.entries(entriesByClient)) {
            const entries = Math.floor(totalPaid / event.amountPerEntry)
            totalEntries += entries
            if (clientId === user._id) {
                yourEntries = entries
            }
        }

        const now = Date.now()
        const daysLeft = Math.max(0, Math.ceil((event.endDate - now) / (1000 * 60 * 60 * 24)))

        return {
            totalEntries,
            yourEntries,
            daysLeft: event.status === "completed" ? 0 : daysLeft,
        }
    },
})

// Generate winner
export const generateWinner = mutation({
    args: { eventId: v.id("events") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error("Not authenticated")

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique()

        if (!user || user.role !== "admin") throw new Error("Only admins can generate winners")

        const event = await ctx.db.get(args.eventId)
        if (!event) throw new Error("Event not found")

        // Find all paid orders within timeframe
        const paidOrders = await ctx.db
            .query("orders")
            .filter((q) => q.eq(q.field("isPaid"), true))
            .collect()

        const eligibleOrders = paidOrders.filter((o) => {
            const payDate = o.paymentDate || o.updatedAt
            return payDate >= event.startDate && payDate <= event.endDate
        })

        const entriesByClient: Record<string, number> = {}

        for (const order of eligibleOrders) {
            const amount = order.paymentAmount || (order.quote ? order.quote.price : 0)
            if (!entriesByClient[order.clientId]) {
                entriesByClient[order.clientId] = 0
            }
            entriesByClient[order.clientId] += amount
        }

        const pool: string[] = []
        for (const [clientId, totalPaid] of Object.entries(entriesByClient)) {
            const entries = Math.floor(totalPaid / event.amountPerEntry)
            for (let i = 0; i < entries; i++) {
                pool.push(clientId)
            }
        }

        if (pool.length === 0) {
            throw new Error("No eligible entries found")
        }

        const randomIndex = Math.floor(Math.random() * pool.length)
        const winnerId = pool[randomIndex] as import("./_generated/dataModel").Id<"users">

        const winners = event.winners || []
        winners.push({
            clientId: winnerId,
            generatedAt: Date.now(),
        })

        await ctx.db.patch(args.eventId, { winners })

        const winner = await ctx.db.get(winnerId)
        return winner
    },
})

// Get winners info for an event (Admin)
export const getEventWinners = query({
    args: { eventId: v.id("events") },
    handler: async (ctx, args) => {
        const event = await ctx.db.get(args.eventId)
        if (!event || !event.winners) return []

        return await Promise.all(
            event.winners.map(async (w) => {
                const client = await ctx.db.get(w.clientId)
                return { ...w, client }
            })
        )
    }
})

// Update event status
export const updateEventStatus = mutation({
    args: {
        eventId: v.id("events"),
        status: v.union(v.literal("active"), v.literal("completed"))
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error("Not authenticated")

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique()

        if (!user || user.role !== "admin") throw new Error("Only admins can update events")

        await ctx.db.patch(args.eventId, {
            status: args.status,
            updatedAt: Date.now()
        })
    }
})

// Get event participants (Admin)
export const getEventParticipants = query({
    args: { eventId: v.id("events") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error("Not authenticated")

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique()

        if (!user || user.role !== "admin") throw new Error("Only admins can view participants")

        const event = await ctx.db.get(args.eventId)
        if (!event) throw new Error("Event not found")

        const paidOrders = await ctx.db
            .query("orders")
            .filter((q) => q.eq(q.field("isPaid"), true))
            .collect()

        const eligibleOrders = paidOrders.filter((o) => {
            const payDate = o.paymentDate || o.updatedAt
            return payDate >= event.startDate && payDate <= event.endDate
        })

        const entriesByClient: Record<string, number> = {}

        for (const order of eligibleOrders) {
            const amount = order.paymentAmount || (order.quote ? order.quote.price : 0)
            if (!entriesByClient[order.clientId]) {
                entriesByClient[order.clientId] = 0
            }
            entriesByClient[order.clientId] += amount
        }

        const participants = []
        for (const [clientId, totalPaid] of Object.entries(entriesByClient)) {
            const entries = Math.floor(totalPaid / event.amountPerEntry)
            if (entries > 0) {
                const clientInfo = await ctx.db.get(clientId as import("./_generated/dataModel").Id<"users">)
                if (clientInfo) {
                    participants.push({
                        client: clientInfo,
                        entries,
                        totalPaid
                    })
                }
            }
        }

        return participants.sort((a, b) => b.entries - a.entries)
    }
})
