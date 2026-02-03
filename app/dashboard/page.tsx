"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
    Download,
    DollarSign,
    Users,
    CreditCard,
    Activity,
    ArrowUpRight
} from "lucide-react"
import { getInitials } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function DashboardPage() {
    return (
        <div className="flex-1 space-y-4 w-full">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <div className="flex items-center space-x-2">
                    <Button>Download</Button>
                </div>
            </div>
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="bg-muted-foreground/30 p-1">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="reports">Reports</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="bg-card">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">$45,231.89</div>
                                <p className="text-xs text-green-500 font-medium">+20.1% from last month</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-card">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">+2350</div>
                                <p className="text-xs text-blue-500 font-medium">+180.1% from last month</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-card">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Sales</CardTitle>
                                <CreditCard className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">+12,234</div>
                                <p className="text-xs text-green-500 font-medium">+19% from last month</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-card">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Active Now</CardTitle>
                                <Activity className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">+573</div>
                                <p className="text-xs text-blue-500 font-medium">+201 since last hour</p>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4 bg-card">
                            <CardHeader>
                                <CardTitle>Overview</CardTitle>
                            </CardHeader>
                            <CardContent className="pl-2">
                                {/* Placeholder for Chart */}
                                <div className="h-[300px] w-full flex items-end gap-2 px-4 relative">
                                    {/* Y-Axis Labels */}
                                    <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[10px] text-muted-foreground pr-2 py-1">
                                        <span>$6000</span>
                                        <span>$4500</span>
                                        <span>$3000</span>
                                        <span>$1500</span>
                                        <span>$0</span>
                                    </div>
                                    <div className="flex-1 h-full flex items-end justify-around gap-2 ml-10">
                                        {[40, 60, 45, 90, 65, 30, 80, 50, 70, 85, 40, 60].map((h, i) => (
                                            <div
                                                key={i}
                                                className="w-full bg-white rounded-t hover:bg-white/80 transition-colors cursor-pointer"
                                                style={{ height: `${h}%` }}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="flex justify-around text-xs text-muted-foreground mt-2 ml-10">
                                    <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                                    <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="col-span-3 bg-card">
                            <CardHeader>
                                <CardTitle>Recent Sales</CardTitle>
                                <p className="text-sm text-muted-foreground">You made 265 sales this month.</p>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-8">
                                    <div className="flex items-center">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src="/avatars/01.png" alt="Avatar" />
                                            <AvatarFallback>{getInitials("Olivia Martin")}</AvatarFallback>
                                        </Avatar>
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">Olivia Martin</p>
                                            <p className="text-sm text-muted-foreground">olivia.martin@email.com</p>
                                        </div>
                                        <div className="ml-auto font-medium">+$1,999.00</div>
                                    </div>
                                    <div className="flex items-center">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src="/avatars/02.png" alt="Avatar" />
                                            <AvatarFallback>{getInitials("Jackson Lee")}</AvatarFallback>
                                        </Avatar>
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">Jackson Lee</p>
                                            <p className="text-sm text-muted-foreground">jackson.lee@email.com</p>
                                        </div>
                                        <div className="ml-auto font-medium">+$39.00</div>
                                    </div>
                                    <div className="flex items-center">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src="/avatars/03.png" alt="Avatar" />
                                            <AvatarFallback>{getInitials("Isabella Nguyen")}</AvatarFallback>
                                        </Avatar>
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">Isabella Nguyen</p>
                                            <p className="text-sm text-muted-foreground">isabella.nguyen@email.com</p>
                                        </div>
                                        <div className="ml-auto font-medium">+$299.00</div>
                                    </div>
                                    <div className="flex items-center">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src="/avatars/04.png" alt="Avatar" />
                                            <AvatarFallback>{getInitials("William Kim")}</AvatarFallback>
                                        </Avatar>
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">William Kim</p>
                                            <p className="text-sm text-muted-foreground">will@email.com</p>
                                        </div>
                                        <div className="ml-auto font-medium">+$99.00</div>
                                    </div>
                                    <div className="flex items-center">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src="/avatars/05.png" alt="Avatar" />
                                            <AvatarFallback>{getInitials("Sofia Davis")}</AvatarFallback>
                                        </Avatar>
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">Sofia Davis</p>
                                            <p className="text-sm text-muted-foreground">sofia.davis@email.com</p>
                                        </div>
                                        <div className="ml-auto font-medium">+$39.00</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

