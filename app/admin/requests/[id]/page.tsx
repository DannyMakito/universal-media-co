"use client"

import { useEffect, useState } from "react"
import React from "react"
import Link from "next/link"
import { ArrowLeft, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getOrderById, getOrderMessages, createMessage, updateOrder, formatDate, formatDateTime, Order, Message } from "@/lib/order-service"

export default function AdminRequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params)
    const [order, setOrder] = useState<Order | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [message, setMessage] = useState("")
    const [isLoadingOrder, setIsLoadingOrder] = useState(true)
    const [isSending, setIsSending] = useState(false)

    // Quote form state
    const [quotePrice, setQuotePrice] = useState("")
    const [quoteDays, setQuoteDays] = useState("")
    const [quoteDescription, setQuoteDescription] = useState("")
    const [isSubmittingQuote, setIsSubmittingQuote] = useState(false)

    useEffect(() => {
        const loadOrder = getOrderById(id)
        if (loadOrder) {
            setOrder(loadOrder)
            const orderMessages = getOrderMessages(id)
            setMessages(orderMessages)
        }
        setIsLoadingOrder(false)
    }, [id])

    const handleSendMessage = async () => {
        if (!message.trim() || !order) return

        setIsSending(true)
        try {
            createMessage({
                orderId: order.id,
                sender: "admin",
                senderName: "Admin Team",
                senderEmail: "admin@universalmedia.com",
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

    const handleSubmitQuote = async () => {
        if (!quotePrice || !quoteDays || !quoteDescription || !order) return

        setIsSubmittingQuote(true)
        try {
            const updatedOrder = updateOrder(order.id, {
                quote: {
                    price: parseFloat(quotePrice),
                    estimatedDays: parseInt(quoteDays),
                    description: quoteDescription,
                },
                status: "quoted",
            })

            if (updatedOrder) {
                setOrder(updatedOrder)

                // Send a message to client about the quote
                createMessage({
                    orderId: order.id,
                    sender: "admin",
                    senderName: "Admin Team",
                    senderEmail: "admin@universalmedia.com",
                    content: `We've prepared your quote! The estimated cost is $${quotePrice} and will take approximately ${quoteDays} days. Check the quote tab for more details.`,
                })

                const updatedMessages = getOrderMessages(id)
                setMessages(updatedMessages)

                // Reset form
                setQuotePrice("")
                setQuoteDays("")
                setQuoteDescription("")
            }
        } catch (error) {
            console.error("Error submitting quote:", error)
        } finally {
            setIsSubmittingQuote(false)
        }
    }

    if (isLoadingOrder) {
        return <div className="text-center py-8">Loading request...</div>
    }

    if (!order) {
        return (
            <div className="space-y-6">
                <Link
                    href="/admin/requests"
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition w-fit"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Requests
                </Link>
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <p className="text-lg font-semibold">Request not found</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <Link
                href="/admin/requests"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition w-fit"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Requests
            </Link>

            {/* Header */}
            <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            {order.title}
                        </h1>
                        <p className="text-muted-foreground mt-1">Order #{order.id}</p>
                        <p className="text-sm text-muted-foreground mt-2">
                            From: <span className="font-medium">{order.clientName}</span> ({order.clientEmail})
                        </p>
                    </div>
                    <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        order.status === 'quoted'
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                    }`}>
                        {order.status === 'quoted' ? 'Quoted' : 'Awaiting Quote'}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="details" className="w-full">
                <TabsList>
                    <TabsTrigger value="details">Request Details</TabsTrigger>
                    <TabsTrigger value="quote">
                        {order.quote ? "Update Quote" : "Create Quote"}
                    </TabsTrigger>
                    <TabsTrigger value="messages">Messages</TabsTrigger>
                </TabsList>

                {/* Details Tab */}
                <TabsContent value="details" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Request Information</CardTitle>
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

                            {order.rawAssetsLink && (
                                <div>
                                    <p className="text-sm font-semibold text-muted-foreground mb-2">
                                        RAW ASSETS LINK
                                    </p>
                                    <a
                                        href={order.rawAssetsLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        {order.rawAssetsLink}
                                    </a>
                                </div>
                            )}

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
                                        REQUESTED
                                    </p>
                                    <p className="text-base">{formatDate(order.createdAt)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Quote Tab */}
                <TabsContent value="quote">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {order.quote ? "Update Quote" : "Create Quote"}
                            </CardTitle>
                            <CardDescription>
                                Provide pricing and timeline for this project
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Estimated Price ($)</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        placeholder="5000"
                                        value={quotePrice}
                                        onChange={(e) => setQuotePrice(e.target.value)}
                                        step="100"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="days">Estimated Timeline (Days)</Label>
                                    <Input
                                        id="days"
                                        type="number"
                                        placeholder="14"
                                        value={quoteDays}
                                        onChange={(e) => setQuoteDays(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Quote Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Describe what's included in this quote, deliverables, revisions, etc..."
                                    value={quoteDescription}
                                    onChange={(e) => setQuoteDescription(e.target.value)}
                                    className="min-h-32"
                                />
                            </div>

                            <Button
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                                onClick={handleSubmitQuote}
                                disabled={isSubmittingQuote || !quotePrice || !quoteDays || !quoteDescription}
                            >
                                {isSubmittingQuote ? "Submitting..." : "Submit Quote"}
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Messages Tab */}
                <TabsContent value="messages">
                    <Card>
                        <CardHeader>
                            <CardTitle>Communication</CardTitle>
                            <CardDescription>
                                Communicate with the client about this order
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
