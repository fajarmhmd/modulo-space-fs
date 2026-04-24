// components/UserLayout.tsx
"use client";

import UserSidebar from "./UserSidebar";
import { useState, useEffect } from "react";
import { Menu, Bell, Search, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect untuk topbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close sidebar saat resize ke desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Lock body scroll saat mobile sidebar terbuka
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [sidebarOpen]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* DESKTOP SIDEBAR - Fixed */}
      <aside className="hidden md:block fixed left-0 top-0 h-screen w-72 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 shadow-xl z-40">
        <UserSidebar />
      </aside>

      {/* MOBILE SIDEBAR - Drawer dengan Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 md:hidden"
            />
            
            {/* Sidebar Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring" as const, damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-80 bg-white z-50 shadow-2xl md:hidden"
            >
              <UserSidebar 
                onClose={() => setSidebarOpen(false)} 
                mobile={true} 
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 md:ml-72 min-h-screen">
        {/* TOPBAR - Sticky dengan Glass Effect */}
        <header 
          className={`sticky top-0 z-30 transition-all duration-300 ${
            scrolled 
              ? "bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-200/50" 
              : "bg-transparent"
          }`}
        >
          <div className="flex items-center justify-between px-4 md:px-8 py-4">
            {/* Left - Hamburger & Title */}
            <div className="flex items-center gap-4">
              {/* HAMBURGER BUTTON - Mobile Only */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSidebarOpen(true)}
                className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-md border border-gray-100 text-gray-700 hover:text-blue-600 hover:border-blue-200 transition-all"
              >
                <Menu size={20} />
              </motion.button>

              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  ModuloSpace
                </h1>
                <p className="text-xs text-gray-500">Member Area</p>
              </div>
            </div>

            {/* Right - Actions */}

          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}