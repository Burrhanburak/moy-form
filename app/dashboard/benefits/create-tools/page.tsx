

import { getTools } from "@/app/action/create-tools-action";
import CreateToolsClient from "./_components/CreateToolsClient";

export default async function CreateToolsPage() {
  const tools = await getTools();

  return <CreateToolsClient tools={tools} />;
}
