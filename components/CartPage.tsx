// components/CartPage.tsx
"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { CartItem } from "./ProductDetail";
import { Loader2 } from "lucide-react";

function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID").format(n);
}

type Props = {
  onUpdateQuantity?: (id: string, quantity: number) => Promise<{ success: boolean }>;
  onRemoveItem?: (id: string) => Promise<{ success: boolean }>;
};

export default function CartPage({ onUpdateQuantity, onRemoveItem }: Props) {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // 🔥 PERBAIKAN: Get user terlebih dahulu, baru load cart
  useEffect(() => {
    async function initCart() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user?.id) {
        console.log("User belum login");
        return;
      }
      
      setUserId(user.id);
      localStorage.setItem("userId", user.id); // Simpan untuk navbar
      
      const storedCart = localStorage.getItem(`cart_${user.id}`);
      if (storedCart) {
        setItems(JSON.parse(storedCart));
      } else {
        setItems([]);
      }
    }

    initCart();
  }, []);

  const handleCheckout = async () => {
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user?.id) {
        alert("Silakan login terlebih dahulu");
        setLoading(false);
        router.push("/auth");
        return;
      }

      const cart = JSON.parse(localStorage.getItem(`cart_${user.id}`) || "[]");

      if (cart.length === 0) {
        alert("Keranjang kosong");
        setLoading(false);
        return;
      }

      // 🔥 PERBAIKAN: Tambahkan lebih banyak detail produk ke orders
      const orders = cart.map((item: any) => ({
        user_id: user.id,
        product_name: item.name,
        product_image: item.image || null,
        product_material: item.material || null,
        product_meter: item.meter || null,
        quantity: item.quantity || 1,
        price: Math.round(item.price || 0),
        total_price: Math.round((item.price || 0) * (item.quantity || 1)),
        category: item.category || "interior",      
        status: "Menunggu Konfirmasi",
        current_progress: 0,
        created_at: new Date().toISOString(),
      }));

      const { data, error } = await supabase
        .from("orders")
        .insert(orders)
        .select();

      console.log("HASIL INSERT:", data);

      if (error) {
        console.error("Insert error:", error);
        alert("Error saat membuat pesanan: " + error.message);
        setLoading(false);
        return;
      }

      if (!data || data.length === 0) {
        alert("Gagal membuat pesanan, silakan coba lagi");
        setLoading(false);
        return;
      }

      // Hapus cart
      localStorage.removeItem(`cart_${user.id}`);
      
      // Update navbar
      window.dispatchEvent(new Event("cartUpdated"));
      
      // 🔥 PERBAIKAN: Tambahkan delay kecil untuk memastikan data tersimpan
      setTimeout(() => {
        router.push("/pesanan");
      }, 500);

    } catch (err: any) {
      console.error("Checkout error:", err);
      alert("Gagal checkout: " + err.message);
      setLoading(false);
    }
  };

  const handleQuantityChange = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) return;

    const updatedItems = items.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );

    setItems(updatedItems);
    localStorage.setItem(`cart_${user.id}`, JSON.stringify(updatedItems));
    
    // Update navbar
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleRemove = async (id: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) return;

    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
    localStorage.setItem(`cart_${user.id}`, JSON.stringify(updatedItems));
    
    // Update navbar
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 6000000 ? 0 : 150000;
  const total = subtotal + shipping;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md bg-white rounded-3xl p-8 shadow-xl"
        >
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Keranjang Kosong</h2>
          <p className="text-gray-600 mb-6">Anda belum menambahkan produk. Yuk, lihat koleksi kami!</p>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Mulai Belanja
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Keranjang Belanja</h1>
                <p className="text-gray-500">{itemCount} item • {items.length} produk</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, x: -100 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex gap-4"
                >
                  <div className="relative w-28 h-28 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{item.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Material: <span className="font-medium text-gray-700">{item.material}</span>
                        </p>
                        {item.meter > 1 && (
                          <p className="text-sm text-gray-500">
                            Ukuran: <span className="font-medium text-gray-700">{item.meter} meter</span>
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-end justify-between mt-4">
                      <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={updatingId === item.id}
                          className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 text-gray-600 font-bold disabled:opacity-50"
                        >
                          −
                        </button>
                        <div className="w-12 h-10 flex items-center justify-center font-bold">
                          {updatingId === item.id ? (
                            <svg className="animate-spin w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            </svg>
                          ) : (
                            item.quantity
                          )}
                        </div>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          disabled={updatingId === item.id}
                          className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 text-gray-600 font-bold disabled:opacity-50"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="text-sm text-gray-500">IDR {formatRupiah(item.price)}</div>
                        <div className="text-xl font-bold text-blue-600">
                          IDR {formatRupiah(item.price * item.quantity)}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Free Shipping Notice */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-green-800 font-medium">
                  {subtotal >= 6000000 ? (
                    "🎉 Selamat! Anda mendapatkan GRATIS ONGKIR!"
                  ) : (
                    <>Tambah <span className="font-bold">IDR {formatRupiah(6000000 - subtotal)}</span> lagi untuk GRATIS ONGKIR!</>
                  )}
                </p>
                {subtotal < 6000000 && (
                  <div className="mt-2 h-2 bg-green-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((subtotal / 6000000) * 100, 100)}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Ringkasan Pesanan</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({itemCount} item)</span>
                  <span className="font-medium">IDR {formatRupiah(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Biaya Pengiriman</span>
                  <span className={shipping === 0 ? "text-green-600 font-bold" : "font-medium"}>
                    {shipping === 0 ? "GRATIS" : `IDR ${formatRupiah(shipping)}`}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-900 font-bold">Total Pembayaran</span>
                  <span className="text-2xl font-bold text-blue-600">IDR {formatRupiah(total)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5" />
                    Memproses...
                  </>
                ) : (
                  "Pesan Sekarang"
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Pembayaran Aman & Terverifikasi
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}