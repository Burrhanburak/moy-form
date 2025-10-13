"use client";

export function trackEvent(name: string, props?: Record<string, unknown>) {
  if (typeof window !== "undefined" && (window as any).analytics) {
    (window as any).analytics.track(name, props);
  }
}
