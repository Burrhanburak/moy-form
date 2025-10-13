
import OrderClient from "./_components/OrderClient";
import { getOrders } from "@/app/action/order-action";

export default async function OrdersPage() {
  const orders = await getOrders();

  return <OrderClient orders={orders} />;
}
