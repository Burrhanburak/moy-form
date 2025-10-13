import { getPackageById } from "@/app/action/create-package-action";
import PackageDetailClient from "./_components/PackageDetailClient";

export default async function PackageDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { package: packageData, error } = await getPackageById(id);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!packageData) {
    return <div>Package not found</div>;
  }

  return <PackageDetailClient package={packageData} />;
}
