import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeartbeatProvider from "@/components/HeartbeatProvider";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if ((session?.user as any)?.role === "ADMIN") {
    redirect("/admin");
  }

  return (
    <>
      <HeartbeatProvider />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
