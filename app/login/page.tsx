"use client"

import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck, User, PenTool } from "lucide-react"

export default function LoginPage() {
    const { login } = useAuth()

    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <Card className="w-[400px]">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Select Your Role</CardTitle>
                    <CardDescription>
                        Choose a role to enter the dashboard demo
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <Button
                        variant="outline"
                        className="h-16 justify-start gap-4 text-lg"
                        onClick={() => login("admin")}
                    >
                        <ShieldCheck className="h-6 w-6 text-primary" />
                        <div className="flex flex-col items-start">
                            <span>Admin</span>
                            <span className="text-xs text-muted-foreground font-normal">Full access to system controls</span>
                        </div>
                    </Button>
                    <Button
                        variant="outline"
                        className="h-16 justify-start gap-4 text-lg"
                        onClick={() => login("client")}
                    >
                        <User className="h-6 w-6 text-primary" />
                        <div className="flex flex-col items-start">
                            <span>Client</span>
                            <span className="text-xs text-muted-foreground font-normal">Manage your orders and account</span>
                        </div>
                    </Button>
                    <Button
                        variant="outline"
                        className="h-16 justify-start gap-4 text-lg"
                        onClick={() => login("editor")}
                    >
                        <PenTool className="h-6 w-6 text-primary" />
                        <div className="flex flex-col items-start">
                            <span>Editor</span>
                            <span className="text-xs text-muted-foreground font-normal">Access to content management</span>
                        </div>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
