"use client";

export function trackEvent(name: string, props?: Record<string, unknown>) {
  if (
    typeof window !== "undefined" &&
    (
      window as unknown as {
        analytics?: {
          track: (name: string, props?: Record<string, unknown>) => void;
        };
      }
    ).analytics
  ) {
    (
      window as unknown as {
        analytics: {
          track: (name: string, props?: Record<string, unknown>) => void;
        };
      }
    ).analytics.track(name, props);
  }
}
