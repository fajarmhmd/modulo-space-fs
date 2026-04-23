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
  Users,
  UserCog,
  UserPlus,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { getUserRole } from "@/lib/getUserRole";

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

  useEffect(() => {
    const checkRole = async () => {
      const role = await getUserRole();
      if (role !== "admin") {
        router.replace("/");
      }
    };
    checkRole();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/auth");
  };

  const toggleSubMenu = (menuName: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedMenus((prev) =>
      prev.includes(menuName)
        ? prev.filter((name) => name !== menuName)
        : [...prev, menuName]
    );
  };

  const isMenuActive = (item: MenuItem) => {
    if (pathname === item.href) return true;
    if (item.subMenu) {
      return item.subMenu.some((sub) => pathname === sub.href);
    }
    return false;
  };

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
      ],
    },
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

  useEffect(() => {
    menu.forEach((item) => {
      if (item.subMenu && item.subMenu.some((sub) => pathname === sub.href)) {
        if (!expandedMenus.includes(item.name)) {
          setExpandedMenus((prev) => [...prev, item.name]);
        }
      }
    });
  }, [pathname]);

  const SIDEBAR_EXPANDED = 280;
  const SIDEBAR_COLLAPSED = 72;

  return (
    /*
      ROOT: h-screen + overflow-hidden → locks the viewport.
      Scrolling happens ONLY inside <main>, not the whole page.
    */
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50">
      {/* ───── Mobile Overlay ───── */}
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

      {/* ───── Sidebar ───── */}
      {/*
        DESKTOP: fixed to left edge, full viewport height, never scrolls.
        A hidden spacer <div> reserves the same width so <main> is pushed right.

        MOBILE: fixed overlay that slides in/out.
      */}

      {/* Spacer — desktop only, pushes main content right */}
      <motion.div
        aria-hidden
        animate={{ width: isSidebarCollapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden md:block flex-shrink-0 h-screen"
      />

      <motion.aside
        animate={{ width: isSidebarCollapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`
          fixed top-0 left-0
          z-50
          h-screen
          flex-shrink-0
          bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900
          text-white flex flex-col shadow-2xl overflow-hidden
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          transition-transform duration-300 md:transition-none
        `}
        style={
          /* On mobile: always full expanded width regardless of collapse state */
          typeof window !== "undefined" && window.innerWidth < 768
            ? { width: SIDEBAR_EXPANDED }
            : undefined
        }
      >
        <style>{`
          @media (max-width: 767px) {
            aside { width: ${SIDEBAR_EXPANDED}px !important; }
          }
        `}</style>

        {/* Logo */}
        <div className="p-5 border-b border-slate-700/50 flex-shrink-0">
          <div className="flex items-center justify-between gap-2">
            <AnimatePresence initial={false}>
              {!isSidebarCollapsed && (
                <motion.h1
                  key="logo-text"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-xl font-bold whitespace-nowrap overflow-hidden"
                >
                  Modulo<span className="text-blue-400">Space</span>
                </motion.h1>
              )}
            </AnimatePresence>

            {/* Desktop collapse toggle */}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden md:flex flex-shrink-0 p-2 rounded-lg hover:bg-slate-700/50 transition-colors ml-auto"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Mobile close */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden flex-shrink-0 p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto overflow-x-hidden">
          {menu.map((item) => {
            const Icon = item.icon;
            const isActive = isMenuActive(item);
            const isExpanded = expandedMenus.includes(item.name);
            const hasSubMenu = item.subMenu && item.subMenu.length > 0;

            return (
              <div key={item.name}>
                {/* Main item */}
                {hasSubMenu ? (
                  <div
                    onClick={(e) => {
                      // On collapsed sidebar, expand first
                      if (isSidebarCollapsed) {
                        setIsSidebarCollapsed(false);
                        return;
                      }
                      toggleSubMenu(item.name, e);
                    }}
                    className={`
                      group flex items-center gap-3 px-3 py-2.5 rounded-xl
                      transition-all duration-200 cursor-pointer select-none
                      ${isActive
                        ? "bg-gradient-to-r from-blue-600/50 to-blue-500/30 border border-blue-500/30"
                        : "hover:bg-slate-700/50"
                      }
                    `}
                  >
                    <div className={`
                      flex-shrink-0 p-2 rounded-lg transition-colors
                      ${isActive ? "bg-blue-500/30" : "bg-slate-700/30 group-hover:bg-slate-600/30"}
                    `}>
                      <Icon className="w-5 h-5" />
                    </div>

                    {!isSidebarCollapsed && (
                      <>
                        <span className="flex-1 font-medium whitespace-nowrap text-sm">
                          {item.name}
                        </span>
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex-shrink-0"
                        >
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        </motion.div>
                      </>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      group flex items-center gap-3 px-3 py-2.5 rounded-xl
                      transition-all duration-200
                      ${isActive
                        ? "bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg shadow-blue-500/25"
                        : "hover:bg-slate-700/50"
                      }
                    `}
                  >
                    <div className={`
                      flex-shrink-0 p-2 rounded-lg transition-colors
                      ${isActive ? "bg-white/20" : "bg-slate-700/30 group-hover:bg-slate-600/30"}
                    `}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {!isSidebarCollapsed && (
                      <span className="font-medium whitespace-nowrap text-sm">
                        {item.name}
                      </span>
                    )}
                  </Link>
                )}

                {/* Submenu */}
                <AnimatePresence>
                  {hasSubMenu && isExpanded && !isSidebarCollapsed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="ml-5 mt-1 space-y-0.5 border-l-2 border-slate-700/50 pl-3">
                        {item.subMenu?.map((subItem) => {
                          const SubIcon = subItem.icon;
                          const isSubActive = pathname === subItem.href;
                          return (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={`
                                flex items-center gap-3 px-3 py-2 rounded-lg
                                transition-all duration-200 text-sm
                                ${isSubActive
                                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                                  : "text-slate-400 hover:text-white hover:bg-slate-700/30"
                                }
                              `}
                            >
                              <SubIcon className="w-4 h-4 flex-shrink-0" />
                              <span className="font-medium">{subItem.name}</span>
                              {isSubActive && (
                                <div className="ml-auto w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0" />
                              )}
                            </Link>
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

        {/* Logout */}
        <div className="p-3 border-t border-slate-700/50 flex-shrink-0">
          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
              transition-all duration-200
              hover:bg-gradient-to-r hover:from-red-600/20 hover:to-red-500/20
              text-red-400 hover:text-red-300
              border border-transparent hover:border-red-500/30
              ${isSidebarCollapsed ? "justify-center" : ""}
            `}
          >
            <div className="flex-shrink-0 p-2 rounded-lg bg-red-500/10">
              <LogOut className="w-5 h-5" />
            </div>
            {!isSidebarCollapsed && (
              <span className="font-medium whitespace-nowrap text-sm">Logout</span>
            )}
          </button>
        </div>
      </motion.aside>

      {/* ───── Main Content ───── */}
      {/*
        flex-1 + h-screen + overflow-y-auto → this is the ONLY scroll container.
        The sidebar never moves because it is fixed + outside this scroll area.
      */}
      <main className="flex-1 h-screen min-w-0 overflow-x-hidden overflow-y-auto">
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
        <div className="p-4 md:p-6 lg:p-8 w-full">{children}</div>
      </main>
    </div>
  );
}