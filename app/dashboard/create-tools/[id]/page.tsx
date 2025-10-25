import ToolDetailClient from "./_components/ToolDetailClient";
import { getToolById } from "@/app/action/create-tools-action";

export default async function ToolDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const toolResult = await getToolById(id);

  if (toolResult.error) {
    return <div>Error: {toolResult.error}</div>;
  }

  if (!toolResult.tool) {
    return <div>Tool not found</div>;
  }

  return <ToolDetailClient tool={toolResult.tool} />;
}
