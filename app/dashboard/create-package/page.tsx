

import { getPackages } from "@/app/action/create-package-action";
import CreatePackageClient from "./_components/CreatePackageClient";

export default async function CreatePackagePage() {
  const packages = await getPackages();

  return <CreatePackageClient packages={packages} />;
}
