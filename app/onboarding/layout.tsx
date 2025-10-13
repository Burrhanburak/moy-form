import React from "react";

function OnboardingLayout({ children }: { children: React.ReactNode }) {
  // Session check is handled by middleware
  return <>{children}</>;
}

export default OnboardingLayout;
