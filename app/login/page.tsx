"use client"

import { SignIn } from "@clerk/nextjs"

export default function LoginPage() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <SignIn 
                appearance={{
                    elements: {
                        rootBox: "mx-auto",
                        card: "shadow-lg",
                    }
                }}
                routing="hash"
                fallbackRedirectUrl="/dashboard"
                signUpUrl="/signup"
            />
        </div>
    )
}
