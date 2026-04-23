// components/Navbar.tsx
// PERBAIKAN: Tambah Search Modal fungsional dengan semua produk

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Search, ShoppingCart, UserCircle, ClipboardList, LogOut, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

// ─── SEMUA PRODUK (dari kategori interior & exterior) ─────────────────────────
const ALL_PRODUCTS = [
  // Interior
  { id: "plafon-1", name: "Plafon Pvc modern / drop ceiling up ceiling", category: "Interior", price: 320000, image: "/plafon-pvc.png" },
  { id: "kitchenset-minibar", name: "Kitchen Set Custom Minimalis Modern + Mini bar/island", category: "Interior", price: 2699000, image: "/kitchenset-minibar.png" },
  { id: "lemari-custom-1", name: "Lemari Pakaian Custom Built-in / Wardrobe Full Plafon", category: "Interior", price: 2599000, image: "/lemari-samping.png" },
  { id: "mezzanine", name: "Mezzanine Custom / Lantai Tambahan Interior Modern", category: "Interior", price: 2750000, image: "/mejanin.png" },
  { id: "nakas-1", name: "Nakas Gantung / Bedside Table Floating Custom", category: "Interior", price: 590000, image: "/nakas-gantung.png" },
  { id: "rak-tangga-1", name: "Rak Bawah Tangga Custom / Storage Bawah Tangga", category: "Interior", price: 1690000, image: "/rak-tangga3.png" },
  { id: "backdrop-tv-1", name: "Wall Backdrop TV Custom / Panel TV Wall Premium", category: "Interior", price: 2199000, image: "/wallback-drop.png" },
  { id: "meja-kerja-1", name: "Meja Kerja Custom / Meja Komputer Sudut (L-shape)", category: "Interior", price: 1399000, image: "/meja-kerja.png" },
  // Exterior
  { id: "canopy-pvc-1", name: "Canopy + Plafon Pvc", category: "Exterior", price: 1099000, image: "/canopy-exterior.jpg" },
  { id: "pager-sliding-1", name: "Pagar Sliding / Swing", category: "Exterior", price: 849000, image: "/pagar-sliding.png" },
  { id: "railing-balkon-1", name: "Railing Balkon Aluminium / Besi Minimalis Modern", category: "Exterior", price: 799000, image: "/railing-balkon1.png" },
  { id: "canopy-sliding-1", name: "Canopy Kaca Buka Tutup / Skylight Retractable Sliding Roof", category: "Exterior", price: 2590000, image: "/canopy-sliding.jpg" },
];

function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID").format(n);
}

// ─── SEARCH MODAL ──────────────────────────────────────────────────────────────
function SearchModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    inputRef.current?.focus();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const results = query.trim().length >= 2
    ? ALL_PRODUCTS.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const popular = ALL_PRODUCTS.slice(0, 4);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
            <Search size={20} className="text-gray-400 flex-shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari produk... misal: kitchen set, canopy, wardrobe"
              className="flex-1 text-base text-gray-900 placeholder-gray-400 outline-none bg-transparent"
            />
            {query && (
              <button onClick={() => setQuery("")} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            )}
            <button
              onClick={onClose}
              className="ml-1 text-xs text-gray-500 border border-gray-200 rounded-lg px-2 py-1 hover:bg-gray-50 transition"
            >
              ESC
            </button>
          </div>

          {/* Results / Popular */}
          <div className="max-h-[420px] overflow-y-auto">
            {query.trim().length >= 2 ? (
              results.length > 0 ? (
                <div className="p-3">
                  <p className="text-xs text-gray-400 font-medium px-2 mb-2">
                    {results.length} produk ditemukan
                  </p>
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      href={`/produk/${product.id}`}
                      onClick={onClose}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition group"
                    >
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 relative">
                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition">
                          {product.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-gray-400">{product.category}</span>
                          <span className="text-xs font-bold text-blue-600">
                            Rp {formatRupiah(product.price)}
                          </span>
                        </div>
                      </div>
                      <ArrowRight size={16} className="text-gray-300 group-hover:text-blue-500 transition" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-14 text-center">
                  <p className="text-gray-400 text-sm">Produk <span className="font-semibold text-gray-600">"{query}"</span> tidak ditemukan.</p>
                  <p className="text-gray-400 text-xs mt-1">Coba kata kunci lain, contoh: kitchen, lemari, canopy</p>
                </div>
              )
            ) : (
              <div className="p-3">
                <p className="text-xs text-gray-400 font-medium px-2 mb-2">Produk Populer</p>
                {popular.map((product) => (
                  <Link
                    key={product.id}
                    href={`/produk/${product.id}`}
                    onClick={onClose}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition group"
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 relative">
                      <Image src={product.image} alt={product.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition">
                        {product.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-400">{product.category}</span>
                        <span className="text-xs font-bold text-blue-600">
                          Rp {formatRupiah(product.price)}
                        </span>
                      </div>
                    </div>
                    <ArrowRight size={16} className="text-gray-300 group-hover:text-blue-500 transition" />
                  </Link>
                ))}

                {/* Shortcut lihat semua */}
                <div className="flex gap-2 mt-3 px-2">
                  <Link
                    href="/kategori/interior"
                    onClick={onClose}
                    className="flex-1 text-center text-xs font-semibold py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                  >
                    Semua Interior
                  </Link>
                  <Link
                    href="/kategori/exterior"
                    onClick={onClose}
                    className="flex-1 text-center text-xs font-semibold py-2 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 transition"
                  >
                    Semua Exterior
                  </Link>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── NAVBAR UTAMA ──────────────────────────────────────────────────────────────
export default function Navbar() {
  const [profile, setProfile] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false); // ← BARU
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const isCustomPage = pathname.startsWith("/custom-interior");

  const defaultLinks = [
    { name: "Custom Layanan", href: "/custom-interior" },
    { name: "Promo Layanan", href: "/promo" },
    { name: "Kategori Layanan", href: "/#kategori" },
    { name: "Lokasi Marketing", href: "/#footer" },
    { name: "Tentang Kami", href: "/tentang" },
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
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
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

  useEffect(() => {
    const updateCartCount = () => {
      const userId = localStorage.getItem("userId");
      const cart = JSON.parse(localStorage.getItem(`cart_${userId}`) || "[]");
      const total = cart.reduce((acc: number, i: any) => acc + i.quantity, 0);
      setCartCount(total);
    };

    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);
    return () => window.removeEventListener("cartUpdated", updateCartCount);
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
      {/* ── SEARCH MODAL ── */}
      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}

      <header className="fixed top-0 left-0 w-full z-50" style={{ transform: 'none', willChange: 'auto' }}>
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
              <Link href="/" className="flex items-center gap-1.5">
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
                {/* ── SEARCH BUTTON (fungsional sekarang) ── */}
                <button
  onClick={() => setSearchOpen(true)}
  className="w-9 h-9 flex items-center justify-center text-gray-800 hover:bg-gray-100 rounded-md transition"
  aria-label="Cari produk"
>
  <Search size={20} />
</button>

                {/* CART */}
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
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.18 }}
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
                              onClick={() => {
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
                                onClick={() => {
                                  router.push("/profile");
                                  setDropdownOpen(false);
                                }}
                                className="w-full text-black text-left px-4 py-2.5 hover:bg-gray-50 rounded-xl transition"
                              >
                                Profil
                              </button>
                              <button
                                onClick={() => {
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
                    className="hidden lg:inline-flex bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
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
              className="fixed right-0 top-0 h-full w-72 bg-white z-50 p-6 shadow-xl flex flex-col"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-1.5">
                  <Image src="/logo-inisial.png" alt="Logo" width={36} height={36} />
                  <Image src="/logo-full.png" alt="Logo Full" width={120} height={30} />
                </div>
                <button onClick={() => setOpen(false)} className="text-gray-800">
                  <X size={22} />
                </button>
              </div>

              {/* ── Search bar di mobile drawer ── */}
              <button
                onClick={() => {
                  setOpen(false);
                  setTimeout(() => setSearchOpen(true), 200);
                }}
                className="flex items-center gap-2 w-full px-4 py-3 mb-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-400 text-sm hover:bg-gray-100 transition"
              >
                <Search size={16} />
                Cari produk...
              </button>

              {/* Menu Navigasi */}
              <nav className="flex flex-col gap-5 text-gray-800 font-semibold mb-6">
                {(isCustomPage ? customLinks : defaultLinks).map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="hover:text-[#C6A969] transition"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              {/* User Menu Mobile */}
              {user && (
                <div className="border-t pt-6 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center font-semibold text-white">
                      {profile?.full_name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Signed in as</p>
                      <p className="font-medium text-gray-900 text-sm truncate">
                        {profile?.full_name || user?.email}
                      </p>
                    </div>
                  </div>

                  {profile?.role === "user" && (
                    <div className="flex flex-col gap-2 mb-4">
                      <button
                        onClick={() => {
                          router.push("/profile");
                          setOpen(false);
                        }}
                        className="flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-gray-50 rounded-xl transition text-gray-800"
                      >
                        <UserCircle size={20} className="text-blue-600" />
                        <span className="font-medium">Profil</span>
                      </button>
                      <button
                        onClick={() => {
                          router.push("/pesanan");
                          setOpen(false);
                        }}
                        className="flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-gray-50 rounded-xl transition text-gray-800"
                      >
                        <ClipboardList size={20} className="text-blue-600" />
                        <span className="font-medium">Pesanan Saya</span>
                      </button>
                    </div>
                  )}

                  {profile?.role === "admin" && (
                    <button
                      onClick={() => {
                        router.push("/admin");
                        setOpen(false);
                      }}
                      className="flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-gray-50 rounded-xl transition text-blue-600 mb-4"
                    >
                      <UserCircle size={20} />
                      <span className="font-medium">Admin Panel</span>
                    </button>
                  )}
                </div>
              )}

              {/* Auth Buttons */}
              <div className="mt-auto pt-6 border-t">
                {user ? (
                  <button
                    onClick={() => {
                      handleLogout();
                      setOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 py-3 rounded-xl font-semibold transition hover:bg-red-100"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                ) : (
                  <Link
                    href="/auth"
                    onClick={() => setOpen(false)}
                    className="w-full bg-blue-600 hover:bg-blue-800 text-white py-3 rounded-xl font-semibold transition block text-center"
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