// app/admin/layout.tsx

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ClipboardList,
  CheckCircle,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Home,
  Building2,
  Hammer,
  RefreshCw,
  BarChart3,
  Users,
  UserCog,
  Shield,
  UserPlus
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { getUserRole } from "@/lib/getUserRole";

// Interface untuk menu item dengan submenu
interface SubMenuItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

interface MenuItem {
  name: string;
  href: string;
  icon: React.ElementType;
  subMenu?: SubMenuItem[];
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // 🔐 PROTEKSI ADMIN
  useEffect(() => {
    const checkRole = async () => {
      const role = await getUserRole();
      if (role !== "admin") {
        router.replace("/");
      }
    };
    checkRole();
  }, []);

  // 🚪 LOGOUT FUNCTION
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/auth");
  };

  // Toggle submenu expand/collapse
  const toggleSubMenu = (menuName: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedMenus((prev) =>
      prev.includes(menuName)
        ? prev.filter((name) => name !== menuName)
        : [...prev, menuName]
    );
  };

  // Check if a menu is active (including its submenu items)
  const isMenuActive = (item: MenuItem) => {
    if (pathname === item.href) return true;
    if (item.subMenu) {
      return item.subMenu.some((sub) => pathname === sub.href);
    }
    return false;
  };

  // Menu configuration dengan submenu
  const menu: MenuItem[] = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    {
      name: "Order",
      href: "/admin/orders",
      icon: ClipboardList,
      subMenu: [
        { name: "Interior", href: "/admin/orders/interior", icon: Home },
        { name: "Exterior", href: "/admin/orders/exterior", icon: Building2 },
        { name: "Renovasi", href: "/admin/orders/renovasi", icon: Hammer },
                // { name: "Update Progres", href: "/admin/orders/detail", icon: BarChart3 },
      ],
    },
    // {
    //   name: "Update",
    //   href: "/admin/update",
    //   icon: RefreshCw,
    //   subMenu: [
    //   ],
    // },
    { name: "Pesanan Selesai", href: "/admin/completed", icon: CheckCircle },
    {
      name: "Kelola Akun",
      href: "/admin/accounts",
      icon: UserCog,
      subMenu: [
        { name: "Data User", href: "/admin/users", icon: Users },
        { name: "Tambah Akun", href: "/admin/users/create", icon: UserPlus },
      ],
    },
  ];

  // Auto-expand menu jika submenu-nya aktif
  useEffect(() => {
    menu.forEach((item) => {
      if (item.subMenu && item.subMenu.some((sub) => pathname === sub.href)) {
        if (!expandedMenus.includes(item.name)) {
          setExpandedMenus((prev) => [...prev, item.name]);
        }
      }
    });
  }, [pathname]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isSidebarCollapsed ? 80 : 280,
        }}
        className={`fixed md:relative z-50 h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col shadow-2xl transition-all duration-300 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <motion.div
              animate={{ opacity: isSidebarCollapsed ? 0 : 1, width: isSidebarCollapsed ? 0 : "auto" }}
              className="overflow-hidden"
            >
              <h1 className="text-2xl font-bold whitespace-nowrap">
                Modulo<span className="text-blue-400">Space</span>
              </h1>
            </motion.div>
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden md:flex p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menu.map((item) => {
            const Icon = item.icon;
            const isActive = isMenuActive(item);
            const isExpanded = expandedMenus.includes(item.name);
            const hasSubMenu = item.subMenu && item.subMenu.length > 0;

            return (
              <div key={item.name}>
                {/* Main Menu Item */}
                {hasSubMenu ? (
                  // Menu dengan submenu
                  <div
                    onClick={(e) => toggleSubMenu(item.name, e)}
                    className={`
                      group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer
                      ${isActive
                        ? "bg-gradient-to-r from-blue-600/50 to-blue-500/30 border border-blue-500/30"
                        : "hover:bg-slate-700/50"
                      }
                    `}
                  >
                    <div
                      className={`
                        p-2 rounded-lg transition-colors
                        ${isActive ? "bg-blue-500/30" : "bg-slate-700/30 group-hover:bg-slate-600/30"}
                      `}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <motion.span
                      animate={{ opacity: isSidebarCollapsed ? 0 : 1 }}
                      className="flex-1 font-medium whitespace-nowrap overflow-hidden"
                    >
                      {item.name}
                    </motion.span>
                    <motion.div
                      animate={{
                        opacity: isSidebarCollapsed ? 0 : 1,
                        rotate: isExpanded ? 180 : 0,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    </motion.div>
                  </div>
                ) : (
                  // Menu tanpa submenu - Dashboard, Pesanan Selesai
                  <Link
                    href={item.href}
                    className={`
                      group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                      ${isActive
                        ? "bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg shadow-blue-500/25"
                        : "hover:bg-slate-700/50"
                      }
                    `}
                  >
                    <div
                      className={`
                        p-2 rounded-lg transition-colors
                        ${isActive ? "bg-white/20" : "bg-slate-700/30 group-hover:bg-slate-600/30"}
                      `}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <motion.span
                      animate={{ opacity: isSidebarCollapsed ? 0 : 1 }}
                      className="font-medium whitespace-nowrap overflow-hidden"
                    >
                      {item.name}
                    </motion.span>
                  </Link>
                )}

                {/* Submenu */}
                <AnimatePresence>
                  {hasSubMenu && isExpanded && !isSidebarCollapsed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="ml-6 mt-2 space-y-1 border-l-2 border-slate-700/50 pl-4">
                        {item.subMenu?.map((subItem) => {
                          const SubIcon = subItem.icon;
                          const isSubActive = pathname === subItem.href;

                          return (
                            <motion.div
                              key={subItem.name}
                              initial={{ x: -10, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Link
                                href={subItem.href}
                                className={`
                                  flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200
                                  ${isSubActive
                                    ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                                    : "text-slate-400 hover:text-white hover:bg-slate-700/30"
                                  }
                                `}
                              >
                                <SubIcon className="w-4 h-4" />
                                <span className="text-sm font-medium">{subItem.name}</span>
                                {isSubActive && (
                                  <motion.div
                                    layoutId="activeIndicator"
                                    className="ml-auto w-1.5 h-1.5 bg-blue-400 rounded-full"
                                  />
                                )}
                              </Link>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t border-slate-700/50">
          <button
            onClick={handleLogout}
            className="
              w-full flex items-center gap-3 px-4 py-3 rounded-xl
              transition-all duration-300
              hover:bg-gradient-to-r hover:from-red-600/20 hover:to-red-500/20
              text-red-400 hover:text-red-300
              border border-transparent hover:border-red-500/30
            "
          >
            <div className="p-2 rounded-lg bg-red-500/10">
              <LogOut className="w-5 h-5" />
            </div>
            <motion.span
              animate={{ opacity: isSidebarCollapsed ? 0 : 1 }}
              className="font-medium whitespace-nowrap overflow-hidden"
            >
              Logout
            </motion.span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen overflow-auto">
        {/* Mobile Header */}
        <div className="md:hidden bg-white/80 backdrop-blur-md border-b border-gray-200/50 p-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">
              Modulo<span className="text-blue-500">Space</span>
            </h1>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}