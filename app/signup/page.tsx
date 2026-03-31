"use client"

import { SignUp } from "@clerk/nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Info } from "lucide-react"

export default function SignupPage() {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
            <div className="flex flex-col gap-4">
                <Card className="max-w-md border-muted-foreground/20">
                    <CardHeader className="text-center pb-2">
                        <CardTitle className="text-xl">Create Client Account</CardTitle>
                        <CardDescription>
                            Sign up to submit orders and manage your projects
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-start gap-2 rounded-lg bg-muted p-3 text-sm text-muted-foreground mb-4">
                            <Info className="h-4 w-4 mt-0.5 shrink-0" />
                            <p>
                                <strong>Editor accounts</strong> are created by the admin team. 
                                If you're an editor, please contact your administrator for access.
                            </p>
                        </div>
                    </CardContent>
                </Card>
                
                <SignUp 
                    appearance={{
                        elements: {
                            rootBox: "mx-auto",
                            card: "shadow-lg",
                        }
                    }}
                    routing="hash"
                    fallbackRedirectUrl="/dashboard"
                    signInUrl="/login"
                />
            </div>
        </div>
    )
}
