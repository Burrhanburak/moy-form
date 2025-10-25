"use client";
import { useSegment } from "@/hooks/useSegment";
import { useEffect } from "react";

interface DashboardAnalyticsProps {
  children: React.ReactNode;
}

export default function DashboardAnalytics({
  children,
}: DashboardAnalyticsProps) {
  const { track } = useSegment();

  useEffect(() => {
    track("Dashboard Viewed", {
      user_id: "uuid",
      role: "user",
      plan: "Pro",
    });
  }, []);

  return <>{children}</>;
}
