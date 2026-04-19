"use client"

import { SignUp } from "@clerk/nextjs"
export default function SignupPage() {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
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
    )
}
