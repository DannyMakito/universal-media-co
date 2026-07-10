"use client"

import React, { useEffect, useState, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react"

export default function PaymentSuccessPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const router = useRouter()
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
    
    const orderId = id as Id<"orders">
    const order = useQuery(api.orders.getOrderById, { orderId })
    const markOrderAsPaid = useMutation(api.orders.markOrderAsPaid)

    useEffect(() => {
        const confirmPayment = async () => {
            if (!order) return // Wait for order to load
            
            if (order.isPaid) {
                // Already paid
                setStatus("success")
                return
            }

            try {
                await markOrderAsPaid({ orderId })
                setStatus("success")
            } catch (error) {
                console.error("Failed to mark order as paid", error)
                setStatus("error")
            }
        }
        
        if (order) {
            confirmPayment()
        }
    }, [order, orderId, markOrderAsPaid])

    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="w-full max-w-md shadow-lg border-green-100">
                <CardContent className="flex flex-col items-center justify-center py-12 px-6 space-y-6">
                    {status === "loading" && (
                        <>
                            <Loader2 className="h-16 w-16 text-green-500 animate-spin" />
                            <h2 className="text-2xl font-bold text-center">Confirming Payment...</h2>
                            <p className="text-muted-foreground text-center">
                                Please wait while we verify your transaction.
                            </p>
                        </>
                    )}
                    
                    {status === "success" && (
                        <>
                            <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-2">
                                <CheckCircle2 className="h-12 w-12 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-center">Payment Successful!</h2>
                            <p className="text-muted-foreground text-center">
                                Thank you for your payment. Your order has been marked as paid and the production team will begin setting up your project.
                            </p>
                            <Link href={`/client/orders/${orderId}`} className="w-full mt-4">
                                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                                    Return to Order
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </>
                    )}

                    {status === "error" && (
                        <>
                            <div className="h-20 w-20 bg-red-100 rounded-full flex items-center justify-center mb-2">
                                <CheckCircle2 className="h-12 w-12 text-red-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-center">Verification Issue</h2>
                            <p className="text-muted-foreground text-center">
                                There was an issue verifying your payment. Please contact support.
                            </p>
                            <Link href={`/client/orders/${orderId}`} className="w-full mt-4">
                                <Button className="w-full" variant="outline">
                                    Return to Order
                                </Button>
                            </Link>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
