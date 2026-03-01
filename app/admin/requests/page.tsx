"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Inbox, Clock } from "lucide-react"
import { getAdminIncomingOrders, formatDate, Order } from "@/lib/order-service"

export default function AdminRequestsPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const incomingOrders = getAdminIncomingOrders()
        setOrders(incomingOrders)
        setIsLoading(false)
    }, [])

    if (isLoading) {
        return <div className="text-center py-8">Loading incoming requests...</div>
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Incoming Requests</h1>
                <p className="text-muted-foreground">
                    Review client order requests and provide quotes
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-semibold text-muted-foreground mb-1">
                                    AWAITING QUOTES
                                </p>
                                <p className="text-3xl font-bold">{orders.length}</p>
                            </div>
                            <Clock className="h-8 w-8 text-orange-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-semibold text-muted-foreground mb-1">
                                    TOTAL REQUESTS
                                </p>
                                <p className="text-3xl font-bold">{orders.length}</p>
                            </div>
                            <Inbox className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-semibold text-muted-foreground mb-1">
                                    THIS WEEK
                                </p>
                                <p className="text-3xl font-bold">
                                    {orders.filter((order) => {
                                        const createdDate = new Date(order.createdAt)
                                        const oneWeekAgo = new Date()
                                        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
                                        return createdDate > oneWeekAgo
                                    }).length}
                                </p>
                            </div>
                            <Clock className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Requests List */}
            {orders.length > 0 ? (
                <div className="grid gap-4">
                    {orders.map((order) => (
                        <Card key={order.id} className="hover:bg-gray-50/50 transition-colors">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <h3 className="text-lg font-semibold">
                                                {order.title}
                                            </h3>
                                            <Badge variant="secondary">
                                                <Clock className="mr-1 h-3 w-3" />
                                                Awaiting Quote
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <p className="text-xs font-semibold text-muted-foreground mb-1">
                                                    CLIENT
                                                </p>
                                                <p className="text-sm font-medium">
                                                    {order.clientName}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {order.clientEmail}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-muted-foreground mb-1">
                                                    SERVICE TYPE
                                                </p>
                                                <p className="text-sm font-medium">
                                                    {order.service.toUpperCase().replace(/-/g, " ")}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <p className="text-xs font-semibold text-muted-foreground mb-1">
                                                REQUIREMENTS
                                            </p>
                                            <p className="text-sm text-gray-700 line-clamp-2">
                                                {order.requirements}
                                            </p>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
                                            <div>
                                                <span className="font-medium">Platforms:</span>{" "}
                                                {order.targetPlatforms.join(", ")}
                                            </div>
                                            <div>
                                                <span className="font-medium">Style:</span>{" "}
                                                {order.stylePreset}
                                            </div>
                                            <div>
                                                <span className="font-medium">Requested:</span>{" "}
                                                {formatDate(order.createdAt)}
                                            </div>
                                        </div>
                                    </div>

                                    <Link href={`/admin/requests/${order.id}`}>
                                        <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                                            Review & Quote
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Incoming Requests</h3>
                        <p className="text-muted-foreground text-center">
                            All client orders have been quoted. Check back later for new requests.
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
