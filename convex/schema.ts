import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
    // Users table - synced from Clerk
    users: defineTable({
        clerkId: v.string(),
        email: v.string(),
        name: v.string(),
        role: v.union(v.literal("admin"), v.literal("client"), v.literal("editor")),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_clerkId", ["clerkId"])
        .index("by_email", ["email"])
        .index("by_role", ["role"]),

    // Editors table - additional editor-specific data
    editors: defineTable({
        userId: v.id("users"),
        specialties: v.array(v.string()),
        currentlyEditing: v.optional(v.string()),
        isActive: v.boolean(),
    })
        .index("by_userId", ["userId"]),

    // Orders table - client orders
    orders: defineTable({
        clientId: v.id("users"),
        title: v.string(),
        service: v.string(),
        requirements: v.string(),
        dueDate: v.optional(v.string()),
        rawAssetsLink: v.optional(v.string()),
        status: v.union(
            v.literal("awaiting-quote"),
            v.literal("quoted"),
            v.literal("approved"),
            v.literal("completed"),
            v.literal("cancelled")
        ),
        quote: v.optional(
            v.object({
                price: v.number(),
                estimatedDays: v.number(),
                description: v.string(),
            })
        ),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_clientId", ["clientId"])
        .index("by_status", ["status"]),

    // Projects table - production projects linked to orders
    projects: defineTable({
        orderId: v.optional(v.id("orders")),
        title: v.string(),
        description: v.string(),
        clientId: v.id("users"),
        dealValue: v.number(),
        status: v.union(
            v.literal("todo"),
            v.literal("in-progress"),
            v.literal("in-review"),
            v.literal("done")
        ),
        assigneeIds: v.array(v.id("users")),
        progress: v.number(),
        dueDate: v.optional(v.string()),
        driveLinks: v.object({
            raw: v.string(),
            working: v.string(),
        }),
        mediaSpecs: v.object({
            duration: v.string(),
            ratio: v.union(v.literal("9:16"), v.literal("16:9")),
        }),
        internalNotes: v.array(v.string()),
        statusLine: v.string(),
        readyForClient: v.boolean(),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_orderId", ["orderId"])
        .index("by_clientId", ["clientId"])
        .index("by_status", ["status"]),

    // Messages table - order communications
    messages: defineTable({
        orderId: v.id("orders"),
        senderId: v.id("users"),
        content: v.string(),
        createdAt: v.number(),
    })
        .index("by_orderId", ["orderId"]),
})
