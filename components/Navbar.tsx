// components/Navbar.tsx
// PERBAIKAN: Tambah cart count yang reactive

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Search, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [profile, setProfile] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0); // State untuk cart count
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const isCustomPage = pathname.startsWith("/custom-interior");

  const defaultLinks = [
    { name: "Custom Layanan", href: "/custom-interior" },
    { name: "Promo Layanan", href: "/promo" },
    { name: "Kategori Layanan", href: "/#kategori" },
    { name: "Lokasi Marketing", href: "/#footer" },
  ];

  const customLinks = [
    { name: "Home", href: "/" },
    { name: "Custom Layanan", href: "/custom-interior" },
    { name: "Cara Kerja", href: "/custom-interior#cara-kerja" },
    { name: "Layanan Kami", href: "/custom-interior#layanan" },
    { name: "Tentang Kami", href: "/tentang" },
  ];

useEffect(() => {
  if (user?.id) {
    localStorage.setItem("userId", user.id);
  }
}, [user]);
  

  useEffect(() => {
    const getUser = async () => {
      const { data:{ user } } = await supabase.auth.getUser();
      setUser(user);
      if(user){
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        setProfile(data);
      }
    };
    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // PERBAIKAN: Listen untuk perubahan cart
  useEffect(() => {
const updateCartCount = () => {
const userId = localStorage.getItem("userId");
const cart = JSON.parse(localStorage.getItem(`cart_${userId}`) || "[]");
  const total = cart.reduce((acc: number, i: any) => acc + i.quantity, 0);
  setCartCount(total);
};

    updateCartCount();
    window.addEventListener('cartUpdated', updateCartCount);
    return () => window.removeEventListener('cartUpdated', updateCartCount);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50">
        {/* PROMO BAR */}
        <div className="w-full bg-red-600 text-white">
          <div className="hidden sm:flex justify-center items-center py-2 text-sm font-medium">
            Dapatkan penawaran khusus interior pertamamu —
            <span className="ml-2 font-semibold underline cursor-pointer">
              Konsultasi Gratis
            </span>
          </div>
          <div className="sm:hidden overflow-hidden whitespace-nowrap py-2 text-xs">
            <div className="animate-marquee inline-block px-4">
              Dapatkan penawaran khusus interior pertamamu — Konsultasi Gratis →
            </div>
          </div>
        </div>

        {/* MAIN NAV */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* LOGO */}
              <Link href="/" className="flex items-center gap-2">
                <Image src="/logo-inisial.png" alt="Logo" width={55} height={35} />
                <Image src="/logo-full.png" alt="Logo Full" width={130} height={48} />
              </Link>

              {/* DESKTOP MENU */}
              <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-800">
                {(isCustomPage ? customLinks : defaultLinks).map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`transition ${
                      pathname === link.href ? "text-[#C6A969]" : "hover:text-[#C6A969]"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              {/* RIGHT SIDE */}
              <div className="flex items-center gap-3">
                <button className="w-9 h-9 flex items-center justify-center text-gray-800 hover:bg-gray-100 rounded-md transition">
                  <Search size={20} />
                </button>

                {/* PERBAIKAN: Cart dengan count yang reactive */}
                <Link href="/keranjang">
                  <button className="w-9 h-9 flex items-center justify-center text-gray-800 hover:bg-gray-100 rounded-md transition relative">
                    <ShoppingCart size={20} />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 text-[10px] bg-blue-700 text-white rounded-full px-1.5 min-w-[18px] h-[18px] flex items-center justify-center font-bold animate-bounce">
                        {cartCount}
                      </span>
                    )}
                  </button>
                </Link>

                {/* DESKTOP AUTH */}
                {user ? (
                  <div className="relative hidden lg:block" ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center font-semibold text-white shadow-md hover:shadow-lg transition"
                    >
                      {profile?.full_name?.charAt(0).toUpperCase()}
                    </button>

                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-3 w-56 bg-white shadow-2xl rounded-2xl p-2 text-sm z-[9999] border border-gray-100"
                        >
                          <div className="px-4 py-3 border-b border-gray-100 mb-2">
                            <p className="text-xs text-gray-500">Signed in as</p>
                            <p className="font-medium text-gray-900 truncate">
                              {profile?.full_name || user?.email}
                            </p>
                          </div>

                          {profile?.role === "admin" && (
                            <button
                              onClick={()=>{
                                router.push("/admin");
                                setDropdownOpen(false);
                              }}
                              className="w-full text-left px-4 py-2.5 hover:bg-gray-50 rounded-xl transition text-blue-600"
                            >
                              Admin Panel
                            </button>
                          )}

                          {profile?.role === "user" && (
                            <>
                              <button
                                onClick={()=>{
                                  router.push("/profile");
                                  setDropdownOpen(false);
                                }}
                                className="w-full text-black text-left px-4 py-2.5 hover:bg-gray-50 rounded-xl transition"
                              >
                                Profil
                              </button>
                              <button
                                onClick={()=>{
                                  router.push("/pesanan");
                                  setDropdownOpen(false);
                                }}
                                className="w-full text-black text-left px-4 py-2.5 hover:bg-gray-50 rounded-xl transition"
                              >
                                Pesanan Saya
                              </button>
                            </>
                          )}

                          <div className="border-t border-gray-100 mt-2 pt-2">
                            <button
                              onClick={handleLogout}
                              className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-red-600 rounded-xl transition flex items-center gap-2"
                            >
                              <span>Logout</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    href="/auth"
                    className="hidden lg:inline-flex bg-black hover:bg-neutral-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                  >
                    Masuk / Daftar
                  </Link>
                )}

                {/* MOBILE MENU */}
                <button
                  className="lg:hidden w-9 h-9 flex items-center justify-center text-gray-800 hover:bg-gray-100 rounded-md transition"
                  onClick={() => setOpen(true)}
                >
                  <Menu size={22} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black z-40"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3 }}
              className="fixed right-0 top-0 h-full w-72 bg-white z-50 p-6 shadow-xl"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Image src="/logo-inisial.png" alt="Logo" width={24} height={24} />
                  <Image src="/logo-full.png" alt="Logo Full" width={95} height={24} />
                </div>
                <button onClick={() => setOpen(false)} className="text-gray-800">
                  <X size={22} />
                </button>
              </div>

              <nav className="flex flex-col gap-5 text-gray-800 font-semibold">
                {(isCustomPage ? customLinks : defaultLinks).map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.href} 
                    onClick={() => setOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              <div className="mt-8 pt-6 border-t">
                {user ? (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-500">Signed in as</p>
                    <p className="font-medium text-gray-900 truncate">
                      {profile?.full_name || user?.email}
                    </p>
                    <button
                      onClick={() => {
                        handleLogout();
                        setOpen(false);
                      }}
                      className="w-full bg-red-50 text-red-600 py-3 rounded-lg font-semibold transition"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/auth"
                    onClick={() => setOpen(false)}
                    className="w-full bg-black hover:bg-neutral-800 text-white py-3 rounded-lg font-semibold transition block text-center"
                  >
                    Masuk / Daftar
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}