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
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
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
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                  Dashboard
                </h2>
                <p className="text-xs md:text-sm text-gray-500 hidden sm:block">
                  Selamat datang kembali
                </p>
              </div>
            </div>

            {/* Right - Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Search - Desktop */}
              <div className="hidden md:flex items-center bg-gray-100 rounded-xl px-4 py-2.5 w-64">
                <Search size={18} className="text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Cari pesanan..."
                  className="bg-transparent border-none outline-none ml-2 text-sm w-full placeholder:text-gray-400"
                />
              </div>

              {/* Search Icon - Mobile */}
              <button className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-md border border-gray-100 text-gray-600">
                <Search size={18} />
              </button>

              {/* Notifications */}
              <button className="relative w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-xl bg-white shadow-md border border-gray-100 text-gray-600 hover:text-blue-600 hover:border-blue-200 transition-all">
                <Bell size={18} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              </button>

              {/* Profile Dropdown Trigger */}
              <button className="flex items-center gap-3 pl-2 pr-4 py-2 rounded-xl bg-white shadow-md border border-gray-100 hover:border-blue-200 transition-all">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                  U
                </div>
                <span className="hidden md:block font-medium text-gray-700 text-sm">
                  User Name
                </span>
                <ChevronDown size={16} className="text-gray-400 hidden md:block" />
              </button>
            </div>
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