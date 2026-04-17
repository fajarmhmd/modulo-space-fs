// components/UserSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  User, 
  LogOut, 
  X,
  ChevronRight,
  Home,
  Settings,
  HelpCircle,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";

interface UserSidebarProps {
  onClose?: () => void;
  mobile?: boolean;
}

export default function UserSidebar({ onClose, mobile = false }: UserSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const mainMenus = [
    // { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Profil Saya", href: "/profile", icon: User },
    { name: "Pesanan Saya", href: "/pesanan", icon: Package },
  ];

  const otherMenus = [
    { name: "Beranda", href: "/", icon: Home },
    // { name: "Bantuan", href: "/help", icon: HelpCircle },
    // { name: "Pengaturan", href: "/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
    router.refresh();
  };

  const handleLinkClick = () => {
    if (mobile && onClose) {
      onClose();
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <Sparkles className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ModuloSpace
              </h1>
              <p className="text-xs text-gray-500">Member Area</p>
            </div>
          </Link>
          
          {mobile && (
            <button 
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
            >
              <X size={24} className="text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Main Menu */}
      <div className="flex-1 overflow-y-auto py-6 px-4">
        <div className="mb-6">
          <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Menu Utama
          </p>
          <div className="space-y-1">
            {mainMenus.map((menu, idx) => {
              const Icon = menu.icon;
              const active = pathname === menu.href || pathname.startsWith(menu.href + '/');

              return (
                <motion.div
                  key={menu.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link
                    href={menu.href}
                    onClick={handleLinkClick}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-xl font-medium transition-all duration-300 group ${
                      active
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25"
                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={20} className={active ? "text-white" : "text-gray-500 group-hover:text-blue-600"} />
                      <span>{menu.name}</span>
                    </div>
                    {active && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="w-2 h-2 bg-white rounded-full"
                      />
                    )}
                    {!active && (
                      <ChevronRight size={16} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Other Menu */}
        <div className="mb-6">
          <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Lainnya
          </p>
          <div className="space-y-1">
            {otherMenus.map((menu, idx) => {
              const Icon = menu.icon;
              const active = pathname === menu.href;

              return (
                <motion.div
                  key={menu.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (idx + 3) * 0.1 }}
                >
                  <Link
                    href={menu.href}
                    onClick={handleLinkClick}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                      active
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon size={18} />
                    <span>{menu.name}</span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer - Logout */}
      <div className="p-4 border-t border-gray-100">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-red-600 font-semibold hover:bg-red-50 transition-all group"
        >
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
            <LogOut size={18} />
          </div>
          <span>Keluar Akun</span>
        </motion.button>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400">
            © 2024 ModuloSpace
          </p>
        </div>
      </div>
    </div>
  );
}