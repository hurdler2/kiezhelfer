import "@/app/globals.css";
import SessionProvider from "@/components/providers/SessionProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body className="antialiased bg-gray-50 text-gray-900 min-h-screen flex flex-col">
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
