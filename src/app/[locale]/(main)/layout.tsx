import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeartbeatProvider from "@/components/HeartbeatProvider";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HeartbeatProvider />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
