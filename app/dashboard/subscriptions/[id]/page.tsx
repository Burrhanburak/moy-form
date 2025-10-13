import SubscriptionDetailClient from "./_components/SubscriptionDetailClient";
import { getSubscriptionById } from "@/app/action/subscriptions-action";

export default async function SubscriptionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const subscriptionResult = await getSubscriptionById(id);

  if (subscriptionResult.error) {
    return <div>Error: {subscriptionResult.error}</div>;
  }

  if (!subscriptionResult.subscription) {
    return <div>Subscription not found</div>;
  }

  return <SubscriptionDetailClient subscription={subscriptionResult.subscription} />;
}
