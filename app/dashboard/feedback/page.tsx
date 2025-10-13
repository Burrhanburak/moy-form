import { getAllFeedbacks } from "@/app/action/feedback-action";
import FeedbackClient from "./_components/FeedbackClient";

export default async function FeedbackPage() {
  const feedbacks = await getAllFeedbacks();

  return <FeedbackClient feedbacks={feedbacks} />;
}
