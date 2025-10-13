"use client";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { Loader } from "lucide-react";

export default function SignOutButton() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onRequest: () => {
          setIsLoading(true);
        },
        onResponse: () => {
          setIsLoading(false);
        },
        onError: (error) => {
          toast.error("Error signing out:" + error);
        },
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={isLoading}
      className="flex items-center w-full"
    >
      <Loader
        className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : "hidden"}`}
      />
      {!isLoading && (
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
      )}
      {isLoading ? "Signing out..." : "Log out"}
    </button>
  );
}
