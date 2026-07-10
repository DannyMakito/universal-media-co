"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Inbox, Clock, CheckCircle } from "lucide-react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { formatDate } from "@/lib/order-service"
import { formatRand } from "@/lib/utils"

export default function AdminRequestsPage() {
    const user = useQuery(api.users.getCurrentUser)
    const pendingOrders = useQuery(api.orders.getPendingOrders)
    const quotedOrders = useQuery(api.orders.getQuotedOrders)
    const allOrders = useQuery(api.orders.getAllOrders)

    if (pendingOrders === undefined || quotedOrders === undefined || user === undefined) {
        return <div className="text-center py-8">Loading incoming requests...</div>
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Incoming Requests</h1>
                <p className="text-muted-foreground">
                    Review client order requests, provide quotes, and track quoted orders.
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
                                <p className="text-3xl font-bold">{pendingOrders.length}</p>
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
                                    QUOTED / WAITING
                                </p>
                                <p className="text-3xl font-bold">{quotedOrders.length}</p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-blue-500" />
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
                                <p className="text-3xl font-bold">{(allOrders || []).length}</p>
                            </div>
                            <Inbox className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="awaiting-quote" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="awaiting-quote">
                        Awaiting Quote
                        {pendingOrders.length > 0 && (
                            <Badge variant="secondary" className="ml-2 bg-orange-100 text-orange-800">
                                {pendingOrders.length}
                            </Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="quoted">
                        Quoted
                        {quotedOrders.length > 0 && (
                            <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800">
                                {quotedOrders.length}
                            </Badge>
                        )}
                    </TabsTrigger>
                </TabsList>

                {/* AWAITING QUOTES TAB */}
                <TabsContent value="awaiting-quote" className="space-y-4">
                    {pendingOrders.length > 0 ? (
                        <div className="grid gap-4">
                            {pendingOrders.map((order) => (
                                <Card key={order._id} className="hover:bg-gray-50/50 transition-colors">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <h3 className="text-lg font-semibold">
                                                        {order.title}
                                                    </h3>
                                                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
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
                                                            {order.client?.name || "Unknown Client"}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {order.client?.email || "No Email"}
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

                                                <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
                                                    <div>
                                                        <span className="font-medium">Requested:</span>{" "}
                                                        {formatDate(order.createdAt)}
                                                    </div>
                                                </div>
                                            </div>

                                            <Link href={`/admin/requests/${order._id}`}>
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
                                    There are currently no orders waiting for a quote.
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                {/* QUOTED TAB */}
                <TabsContent value="quoted" className="space-y-4">
                    {quotedOrders.length > 0 ? (
                        <div className="grid gap-4">
                            {quotedOrders.map((order) => (
                                <Card key={order._id} className="hover:bg-gray-50/50 transition-colors">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <h3 className="text-lg font-semibold">
                                                        {order.title}
                                                    </h3>
                                                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                                        <CheckCircle className="mr-1 h-3 w-3" />
                                                        Quoted
                                                    </Badge>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                    <div>
                                                        <p className="text-xs font-semibold text-muted-foreground mb-1">
                                                            CLIENT
                                                        </p>
                                                        <p className="text-sm font-medium">
                                                            {order.client?.name || "Unknown Client"}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {order.client?.email || "No Email"}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-semibold text-muted-foreground mb-1">
                                                            QUOTED AMOUNT
                                                        </p>
                                                        <p className="text-sm font-medium text-green-600">
                                                            {order.quote?.price ? formatRand(order.quote.price) : "Pending"}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
                                                    <div>
                                                        <span className="font-medium">Requested:</span>{" "}
                                                        {formatDate(order.createdAt)}
                                                    </div>
                                                </div>
                                            </div>

                                            <Link href={`/admin/requests/${order._id}`}>
                                                <Button variant="outline">
                                                    View Details
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
                                <h3 className="text-lg font-semibold mb-2">No Quoted Orders</h3>
                                <p className="text-muted-foreground text-center">
                                    There are currently no orders that have been quoted.
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}
