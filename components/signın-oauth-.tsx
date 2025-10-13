

import { Button } from "@/components/ui/button";
import { Mail, Github, Twitter, Facebook } from "lucide-react";
import { signIn } from "@/lib/auth-client";
import { useState } from "react";
import { toast } from "sonner"

interface SignInOauthProps {
    provider: string;
    signUp: boolean;
}

export const SignInOauth = ({
    provider,
    signUp,
}: SignInOauthProps) => {
    const [isLoading, setIsLoading] = useState(false);


    const handleSignIn = async () => {
       await signIn.social({    
        provider,
        callbackURL: "/dashboard",
        newUserCallbackURL: "/",
        errorCallbackURL: "/",
        disableRedirect: false,
        idToken: undefined,
        scopes: undefined,
        requestSignUp: false,
        loginHint: undefined,
        fetchOptions: {
            onRequest: (request) => {
                setIsLoading(true);
            },
            onResponse: (response) => {
                setIsLoading(false);
                toast.success("Sign in successful");
            },
            onError: (error) => {
                setIsLoading(false);
                toast.error(error.error);
            },
        },
       });
       setIsLoading(false);
    }
    const action = signUp ? "Sign Up" : "Sign In";
    const providerName = signUp ? "github" : "email";
  return (
    <div className="flex flex-col gap-4">
      <Button variant="outline" onClick={() => handleSignIn()} disabled={isLoading}>
        <Mail className="w-4 h-4" />
       Sign  {action} with {providerName}
      </Button>
      <Button variant="outline" onClick={() => handleSignIn()} disabled={isLoading}>
        <Github className="w-4 h-4" />
        Sign {action} with {providerName}
      </Button>
    </div>
  );
};