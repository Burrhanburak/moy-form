import { createAuthClient } from "better-auth/react"
import { emailOTPClient, magicLinkClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
    plugins: [
        emailOTPClient(),
        magicLinkClient()
    ]
})


// Export commonly used methods
export const { 
    signIn, 
    signUp, 
    signOut, 
    useSession,
    resetPassword,
    forgetPassword,
    verifyEmail,
    sendVerificationEmail,
    emailOtp,
} = authClient