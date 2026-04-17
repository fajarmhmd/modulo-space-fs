// app/public/layout.tsx

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { ReactNode } from "react";

export default function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="pt-[112px] min-h-screen bg-white">
        {children}
      </main>
      <Footer />
    </>
  );
}