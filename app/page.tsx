import { redirect } from "next/navigation";

// Redirect the root URL to the main signup flow so we don't need middleware.

export default function Home() {
  redirect("/signup");
}
