// app/layout.tsx

import type { ReactNode } from "react";
import "./globals.css";
import Navbar from "@/components/Navbar";


export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-white text-gray-900 antialiased">
          {/* <Navbar /> */}
        {children}
      </body>
    </html>
  );
}