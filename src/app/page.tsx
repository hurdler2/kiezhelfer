import { redirect } from "next/navigation";

// Redirect root "/" to the default locale "/de"
export default function RootPage() {
  redirect("/de");
}
