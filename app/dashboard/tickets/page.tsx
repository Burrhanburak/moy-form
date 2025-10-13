
import SupportTicketClient from "./_components/SupportTicketClient";
import { getAllSupportTickets } from "@/app/action/support-ticket-action";

export default async function FeedbackPage() {
  const supportTickets = await getAllSupportTickets();

  return <SupportTicketClient supportTickets={supportTickets} />;
}
