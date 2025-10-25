import { getUserProfile } from "@/app/action/user-action";
import Preferences from "./_components/Preferences";

export default async function PreferencesPage() {
  const user = await getUserProfile();

  // user.provider örneğin: "google" | "email"
  return <Preferences user={user} />;
}
