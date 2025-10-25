"use client";
import { useSegment } from "@/hooks/useSegment";
import { useEffect } from "react";

interface SuccessAnalyticsProps {
  children: React.ReactNode;
  sessionId?: string;
}

export default function SuccessAnalytics({
  children,
  sessionId,
}: SuccessAnalyticsProps) {
  const { track } = useSegment();

  useEffect(() => {
    if (sessionId) {
      track("Success Page Viewed", {
        plan: "Pro",
      });
    }
  }, [sessionId]);

  return <>{children}</>;
}
