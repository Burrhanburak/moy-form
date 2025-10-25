"use client";
import { useEffect } from "react";

export function useSegment() {
  const track = (event: string, props?: Record<string, any>) => {
    if (typeof window !== "undefined" && window.analytics) {
      window.analytics.track(event, props);
    }
  };

  const identify = (userId: string, traits?: Record<string, any>) => {
    if (typeof window !== "undefined" && window.analytics) {
      window.analytics.identify(userId, traits);
    }
  };

  const page = (name?: string, properties?: Record<string, any>) => {
    if (typeof window !== "undefined" && window.analytics) {
      window.analytics.page(name, properties);
    }
  };

  return { track, identify, page };
}
