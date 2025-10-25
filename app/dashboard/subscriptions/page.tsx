import SubscriptionsClient from "./_components/SubscriptionsClient";
import { getSubscriptions } from "@/app/action/subscriptions-action";

export default async function SubscriptionsPage() {
  const result = await getSubscriptions();

  // Check if there's an error
  if (result.error) {
    return <div>Error loading subscriptions: {result.error}</div>;
  }

  return (
    <SubscriptionsClient
      subscriptions={result.subscriptions || []}
      // cancelAction={cancelSubscription}
      // reactivateAction={reactivateSubscription}
    />
  );
}
