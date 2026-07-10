"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, FolderKanban, TrendingUp, Activity, DollarSign, Calendar } from "lucide-react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { formatRand } from "@/lib/utils"
import { formatDate } from "@/lib/order-service"

export default function AdminDashboardPage() {
    const paidOrders = useQuery(api.orders.getPaidOrders)

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                <p className="text-muted-foreground">
                    Overview of your organization&apos;s activity
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">128</div>
                        <p className="text-xs text-muted-foreground">+12 from last month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                        <FolderKanban className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">24</div>
                        <p className="text-xs text-muted-foreground">+3 new this week</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">89%</div>
                        <p className="text-xs text-muted-foreground">+2.5% from last month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Now</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">42</div>
                        <p className="text-xs text-muted-foreground">Users currently online</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest actions across the platform</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[
                            { user: "John Doe", action: "Created new project", time: "2 min ago", badge: "Project" },
                            { user: "Jane Smith", action: "Completed task review", time: "15 min ago", badge: "Task" },
                            { user: "Mike Johnson", action: "Uploaded media files", time: "1 hour ago", badge: "Upload" },
                            { user: "Sarah Wilson", action: "Added new team member", time: "2 hours ago", badge: "Team" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">{item.user}</p>
                                    <p className="text-sm text-muted-foreground">{item.action}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge variant="secondary">{item.badge}</Badge>
                                    <span className="text-xs text-muted-foreground">{item.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        Recently Paid Projects
                    </CardTitle>
                    <CardDescription>Clients who have successfully paid for their quoted orders.</CardDescription>
                </CardHeader>
                <CardContent>
                    {paidOrders === undefined ? (
                        <div className="py-4 text-center text-sm text-muted-foreground">Loading payments...</div>
                    ) : paidOrders.length === 0 ? (
                        <div className="py-8 text-center text-sm text-muted-foreground">
                            No paid orders found.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {paidOrders.map((order) => (
                                <div key={order._id} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">{order.title}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {order.client?.name || "Unknown Client"}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <div className="flex items-center gap-2">
                                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none">Paid</Badge>
                                            <span className="font-bold text-green-600">
                                                {formatRand(order.paymentAmount || order.quote?.price || 0)}
                                            </span>
                                        </div>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {order.paymentDate ? formatDate(order.paymentDate) : "Unknown Date"}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
