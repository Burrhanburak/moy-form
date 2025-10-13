
import { getUserProfile } from "@/app/action/user-action";
import SettingsClient from "./_components/SettingsClient";

export default async function UserSettingsPage() {
  const user = await getUserProfile();

  return <SettingsClient user={user} />;
}
