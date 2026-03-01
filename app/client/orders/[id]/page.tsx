"use client"

import { useEffect, useState } from "react"
import React from "react"
import Link from "next/link"
import { ArrowLeft, Download, MessageSquare, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { getOrderById, getOrderMessages, createMessage, formatDate, formatDateTime, Order, Message } from "@/lib/order-service"
import { useAuth } from "@/hooks/use-auth"

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params)
    const { user } = useAuth()
    const [order, setOrder] = useState<Order | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [message, setMessage] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [isSending, setIsSending] = useState(false)

    useEffect(() => {
        const loadOrder = getOrderById(id)
        if (loadOrder) {
            setOrder(loadOrder)
            const orderMessages = getOrderMessages(id)
            setMessages(orderMessages)
        }
        setIsLoading(false)
    }, [id])

    const handleSendMessage = async () => {
        if (!message.trim() || !user || !order) return

        setIsSending(true)
        try {
            createMessage({
                orderId: order.id,
                sender: "client",
                senderName: user.name || "Client",
                senderEmail: user.email || "client@example.com",
                content: message,
            })

            // Refresh messages
            const updatedMessages = getOrderMessages(id)
            setMessages(updatedMessages)
            setMessage("")
        } catch (error) {
            console.error("Error sending message:", error)
        } finally {
            setIsSending(false)
        }
    }

    if (isLoading) {
        return <div className="text-center py-8">Loading order...</div>
    }

    if (!order) {
        return (
            <div className="space-y-6">
                <Link
                    href="/client/orders"
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition w-fit"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Orders
                </Link>
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <p className="text-lg font-semibold">Order not found</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const getStatusConfig = (status: string) => {
        switch (status) {
            case "awaiting-quote":
                return {
                    label: "Awaiting Quote",
                    color: "bg-yellow-100 text-yellow-800",
                }
            case "quoted":
                return {
                    label: "Quoted",
                    color: "bg-blue-100 text-blue-800",
                }
            case "in-progress":
                return {
                    label: "In Progress",
                    color: "bg-blue-100 text-blue-800",
                }
            case "completed":
                return {
                    label: "Completed",
                    color: "bg-green-100 text-green-800",
                }
            default:
                return {
                    label: "Pending",
                    color: "bg-gray-100 text-gray-800",
                }
        }
    }

    const statusConfig = getStatusConfig(order.status)

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <Link
                href="/client/orders"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition w-fit"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Orders
            </Link>

            {/* Header */}
            <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            {order.title}
                        </h1>
                        <p className="text-muted-foreground mt-1">Order #{order.id}</p>
                    </div>
                    <div className={`px-4 py-2 rounded-full text-sm font-semibold ${statusConfig.color}`}>
                        {statusConfig.label}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="details" className="w-full">
                <TabsList>
                    <TabsTrigger value="details">Order Details</TabsTrigger>
                    <TabsTrigger value="quote">
                        {order.quote ? "Quote" : "Awaiting Quote"}
                    </TabsTrigger>
                    <TabsTrigger value="messages">Messages</TabsTrigger>
                </TabsList>

                {/* Details Tab */}
                <TabsContent value="details" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Project Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm font-semibold text-muted-foreground mb-2">
                                        SERVICE TYPE
                                    </p>
                                    <p className="text-base">{order.service.toUpperCase().replace(/-/g, " ")}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-muted-foreground mb-2">
                                        PROJECT HEADLINE
                                    </p>
                                    <p className="text-base">{order.projectHeadline}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-muted-foreground mb-2">
                                    CORE REQUIREMENTS
                                </p>
                                <p className="text-base text-gray-700">
                                    {order.requirements}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm font-semibold text-muted-foreground mb-2">
                                        TARGET PLATFORMS
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {order.targetPlatforms.map((platform) => (
                                            <Badge key={platform}>{platform}</Badge>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-muted-foreground mb-2">
                                        STYLE PRESET
                                    </p>
                                    <p className="text-base">{order.stylePreset.toUpperCase()}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
                                <div>
                                    <p className="text-sm font-semibold text-muted-foreground mb-2">
                                        CREATED
                                    </p>
                                    <p className="text-base">{formatDate(order.createdAt)}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-muted-foreground mb-2">
                                        DUE DATE
                                    </p>
                                    <p className="text-base">{order.dueDate ? formatDate(order.dueDate) : "Not set"}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Quote Tab */}
                <TabsContent value="quote">
                    {order.quote ? (
                        <Card>
                            <CardHeader>
                                <CardTitle>Quote Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-4 bg-blue-50 rounded-lg">
                                        <p className="text-sm font-semibold text-muted-foreground mb-2">
                                            ESTIMATED PRICE
                                        </p>
                                        <p className="text-3xl font-bold text-blue-600">
                                            ${order.quote.price}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-blue-50 rounded-lg">
                                        <p className="text-sm font-semibold text-muted-foreground mb-2">
                                            ESTIMATED TIMELINE
                                        </p>
                                        <p className="text-3xl font-bold text-blue-600">
                                            {order.quote.estimatedDays} Days
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-muted-foreground mb-2">
                                        QUOTE DESCRIPTION
                                    </p>
                                    <p className="text-base">
                                        {order.quote.description}
                                    </p>
                                </div>
                                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                                    <Download className="mr-2 h-4 w-4" />
                                    Download Quote PDF
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <p className="text-lg font-semibold mb-2">Quote Pending</p>
                                <p className="text-muted-foreground text-center">
                                    Our team is reviewing your order. You&apos;ll receive a
                                    detailed quote within 24 hours.
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                {/* Messages Tab */}
                <TabsContent value="messages">
                    <Card>
                        <CardHeader>
                            <CardTitle>Communication</CardTitle>
                            <CardDescription>
                                Message with our team about this order
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto border rounded-lg p-4 bg-gray-50">
                                {messages.length > 0 ? (
                                    messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`p-4 rounded-lg ${
                                                msg.sender === "admin"
                                                    ? "bg-white border border-gray-200"
                                                    : "bg-blue-50 border border-blue-200 ml-8"
                                            }`}
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <p className="font-semibold">{msg.senderName}</p>
                                                <span className="text-xs text-muted-foreground">
                                                    {formatDateTime(msg.createdAt)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-700">{msg.content}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        No messages yet
                                    </p>
                                )}
                            </div>

                            <div className="space-y-3 border-t pt-6">
                                <label className="text-sm font-semibold">
                                    Send a Message
                                </label>
                                <Textarea
                                    placeholder="Type your message here..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="min-h-24"
                                    disabled={isSending}
                                />
                                <Button
                                    className="bg-orange-500 hover:bg-orange-600 text-white"
                                    onClick={handleSendMessage}
                                    disabled={isSending || !message.trim()}
                                >
                                    <Send className="mr-2 h-4 w-4" />
                                    {isSending ? "Sending..." : "Send Message"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
