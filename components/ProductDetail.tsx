// components/ProductDetail.tsx
"use client";

import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Heart,
  Share2,
  ChevronRight,
  Minus,
  Plus,
  Check,
  Truck,
  Shield,
  Ruler,
  Package,
  ArrowLeft,
  Star,
  ArrowRight,
  X
} from "lucide-react";

function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID").format(n);
}

export type ProductVariant = {
  id: string;
  name: string;
  price: number;
  dimensions: string;
};

export type ProductSpec = {
  label: string;
  value: string;
};

export type MaterialOption = {
  id: string;
  name: string;
  description: string;
  priceMultiplier: number;
  color: string;
};

export type ProductDetailType = {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  basePrice: number;
  originalPrice: number;
  discount: number;
  images: string[];
  description: string;
  specs: ProductSpec[];
  features: string[];
  suitableFor: string[];
  materials: MaterialOption[];
  hasMeterInput?: boolean;
  minMeter?: number;
  maxMeter?: number;
};

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  material: string;
  meter: number;
  price: number;
  quantity: number;
  image: string;
};

type Props = {
  product: ProductDetailType;
  initialCart?: CartItem[];
  onAddToCart?: (item: CartItem) => Promise<{ success: boolean }>;
  recommendedProducts?: ProductDetailType[];
};

export default function ProductDetail({
  product,
  initialCart = [],
  onAddToCart,
  recommendedProducts = []
}: Props) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialOption | null>(null);
  const [showMaterialDropdown, setShowMaterialDropdown] = useState(false);
  const [meter, setMeter] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"deskripsi" | "spesifikasi">("deskripsi");
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cartCount, setCartCount] = useState(initialCart.length);
  const [isWishlisted, setIsWishlisted] = useState(false);
  // Toast notification state
  const [showToast, setShowToast] = useState(false);

  const basePrice = selectedMaterial
    ? product.basePrice * selectedMaterial.priceMultiplier
    : product.basePrice;

  const pricePerUnit = basePrice * meter;
  const totalPrice = pricePerUnit;

  const handleMeterChange = (value: number) => {
    if (value < 1) return;
    setMeter(value);
  };

  const handleAddToCart = async (redirectToCart: boolean = false) => {
    if (!selectedMaterial) {
      setShowMaterialDropdown(true);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;

    if (!userId) {
      alert("Silakan login terlebih dahulu");
      return;
    }

    const cartItem: CartItem = {
      id: `${product.id}-${selectedMaterial.id}-${meter}`,
      productId: product.id,
      name: product.name,
      material: selectedMaterial.name,
      meter: product.hasMeterInput ? meter : 1,
      price: pricePerUnit,
      quantity: 1,
      image: product.images[0],
    };

    try {
      const existingCart = JSON.parse(
        localStorage.getItem(`cart_${userId}`) || "[]"
      );

      const index = existingCart.findIndex(
        (item: CartItem) => item.id === cartItem.id
      );

      if (index !== -1) {
        existingCart[index].quantity += 1;
      } else {
        existingCart.push(cartItem);
      }

      localStorage.setItem(`cart_${userId}`, JSON.stringify(existingCart));
      window.dispatchEvent(new Event("cartUpdated"));

      const total = existingCart.reduce(
        (acc: number, item: CartItem) => acc + item.quantity,
        0
      );

      setCartCount(total);

      if (redirectToCart) {
        router.push("/keranjang");
      } else {
        // Tampilkan toast "Berhasil ditambahkan"
        setIsAdded(true);
        setShowToast(true);
        setTimeout(() => {
          setIsAdded(false);
          setShowToast(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart(true);
  };

  const savings = product.originalPrice * (selectedMaterial?.priceMultiplier || 1) * (product.hasMeterInput ? meter : 1) - totalPrice;

  return (
    <div className="min-h-screen bg-gray-50 pt-28 md:pt-25">

      {/* ── Toast Notification ── */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -60, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -60, x: "-50%" }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed top-24 left-1/2 z-[9999] bg-white rounded-2xl shadow-2xl border border-gray-100 px-5 py-4 flex items-center gap-4 min-w-[300px] max-w-[90vw]"
          >
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Check size={20} className="text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-sm">Berhasil ditambahkan!</p>
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{product.name}</p>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <button
                onClick={() => setShowToast(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={16} />
              </button>
              <button
                onClick={() => router.push("/keranjang")}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 whitespace-nowrap flex items-center gap-1"
              >
                Cek Keranjang
                <ArrowRight size={12} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── MOBILE LAYOUT ── */}
        <div className="lg:hidden">
          {/* 1. Judul paling atas */}
          <div className="mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold uppercase tracking-wide mb-2">
              <Star size={12} className="fill-blue-700" />
              {product.subtitle}
            </div>
            <h1 className="text-xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>
            <p className="text-gray-500 mt-1 text-xs">
              SKU: {product.id.toUpperCase()} • Tersedia
            </p>
          </div>

          {/* 2. Gambar produk */}
          <div className="mb-4">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 group">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage(prev => prev === 0 ? product.images.length - 1 : prev - 1)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg"
                  >
                    <ChevronRight size={18} className="rotate-180 text-gray-700" />
                  </button>
                  <button
                    onClick={() => setSelectedImage(prev => prev === product.images.length - 1 ? 0 : prev + 1)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg"
                  >
                    <ChevronRight size={18} className="text-gray-700" />
                  </button>
                </>
              )}
            </div>
            {/* Thumbnails */}
            <div className="flex gap-2 mt-2 overflow-x-auto pb-1 scrollbar-hide">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === idx ? "border-blue-600 ring-2 ring-blue-100" : "border-gray-200"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* 3. Harga — diperkecil untuk mobile */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
            <div className="flex items-baseline gap-2 flex-wrap mb-1">
              <span className="text-xl font-bold text-gray-900">
                IDR {formatRupiah(pricePerUnit)}
              </span>
              <span className="text-sm text-gray-400 line-through">
                IDR {formatRupiah(product.originalPrice * (selectedMaterial?.priceMultiplier || 1) * (product.hasMeterInput ? meter : 1))}
              </span>
            </div>
            {savings > 0 && (
              <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-2.5 py-1 rounded-full text-xs font-medium mb-1">
                <Check size={12} />
                Hemat IDR {formatRupiah(savings)}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Harga per {product.hasMeterInput ? `${meter} meter` : 'unit'}
              {selectedMaterial && ` • Material ${selectedMaterial.name}`}
            </p>
          </div>

          {/* 4. Material Selection */}
          <div className="mb-4">
            <label className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-2">
              <Package size={16} className="text-gray-400" />
              Pilih Material
            </label>
            <div className="relative">
              <button
                onClick={() => setShowMaterialDropdown(!showMaterialDropdown)}
                className={`w-full p-3.5 rounded-xl border-2 text-left transition-all flex items-center justify-between ${
                  selectedMaterial ? "border-blue-600 bg-blue-50/50" : "border-gray-200 bg-white"
                }`}
              >
                <div className="flex items-center gap-2">
                  {selectedMaterial ? (
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{selectedMaterial.name}</div>
                      <div className="text-xs text-gray-500">{selectedMaterial.description}</div>
                    </div>
                  ) : (
                    <span className="text-gray-500 text-sm">Pilih material...</span>
                  )}
                </div>
                <ChevronRight size={18} className={`text-gray-400 transition-transform ${showMaterialDropdown ? 'rotate-90' : ''}`} />
              </button>
              <AnimatePresence>
                {showMaterialDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute z-50 left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
                  >
                    {product.materials.map((material) => (
                      <button
                        key={material.id}
                        onClick={() => { setSelectedMaterial(material); setShowMaterialDropdown(false); }}
                        className={`w-full p-3.5 text-left hover:bg-gray-50 transition flex items-center justify-between border-b border-gray-50 last:border-0 ${
                          selectedMaterial?.id === material.id ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{material.name}</div>
                          <div className="text-xs text-gray-500">{material.description}</div>
                        </div>
                        <div className="text-xs font-semibold text-blue-600 flex-shrink-0 ml-2">
                          {material.priceMultiplier === 1 ? 'Std' :
                           material.priceMultiplier > 1 ? `+${Math.round((material.priceMultiplier - 1) * 100)}%` :
                           `-${Math.round((1 - material.priceMultiplier) * 100)}%`}
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* 5. Meter Input — tanpa batasan min/max */}
          {product.hasMeterInput && (
            <div className="mb-4">
              <label className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-2">
                <Ruler size={16} className="text-gray-400" />
                Jumlah Meter
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border-2 border-gray-200 rounded-xl bg-white overflow-hidden">
                  <button
                    onClick={() => handleMeterChange(meter - 1)}
                    className="w-11 h-11 flex items-center justify-center hover:bg-gray-50 transition text-gray-600"
                  >
                    <Minus size={16} />
                  </button>
                  <input
                    type="number"
                    value={meter}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "") { setMeter("" as any); return; }
                      const num = Number(val);
                      if (!isNaN(num)) setMeter(num);
                    }}
                    onBlur={() => { if (!meter || meter < 1) setMeter(1); }}
                    className="w-16 h-11 text-center font-semibold text-base text-gray-900 focus:outline-none"
                  />
                  <button
                    onClick={() => handleMeterChange(meter + 1)}
                    className="w-11 h-11 flex items-center justify-center hover:bg-gray-50 transition text-gray-600"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 6. Action Buttons */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center py-3 border-t border-gray-200">
              <span className="text-gray-600 text-sm">Total Harga:</span>
              <span className="text-lg font-bold text-gray-900">IDR {formatRupiah(totalPrice)}</span>
            </div>

            {/* Beli Sekarang — biru */}
            <button
              onClick={handleBuyNow}
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <ShoppingCart size={18} />
              Beli Sekarang
            </button>

            {/* Tambah ke Keranjang — biru outline */}
            <button
              onClick={() => handleAddToCart(false)}
              disabled={!selectedMaterial || isLoading}
              className={`w-full py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 border-2 ${
                !selectedMaterial
                  ? "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50"
                  : isAdded
                  ? "border-green-500 text-green-600 bg-green-50"
                  : "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
              }`}
            >
              {isLoading ? (
                <span className="animate-pulse">Menyimpan...</span>
              ) : isAdded ? (
                <><Check size={18} />Ditambahkan</>
              ) : (
                <><Plus size={18} /> Keranjang</>
              )}
            </button>

            {!selectedMaterial && (
              <p className="text-center text-xs text-red-500">
                * Silakan pilih material terlebih dahulu
              </p>
            )}
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-gray-100">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Truck size={16} className="text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-xs">Gratis Ongkir</p>
                <p className="text-gray-500 text-xs">Bogor & Tangerang</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-gray-100">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield size={16} className="text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-xs">Garansi 1 Tahun</p>
                <p className="text-gray-500 text-xs">Produk & Pengerjaan</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── DESKTOP LAYOUT ── */}
        <div className="hidden lg:grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* LEFT: Image Gallery - 7 cols */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 space-y-4"
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 group">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage(prev => prev === 0 ? product.images.length - 1 : prev - 1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                  >
                    <ChevronRight size={24} className="rotate-180 text-gray-700" />
                  </button>
                  <button
                    onClick={() => setSelectedImage(prev => prev === product.images.length - 1 ? 0 : prev + 1)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                  >
                    <ChevronRight size={24} className="text-gray-700" />
                  </button>
                </>
              )}
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === idx ? "border-blue-600 ring-2 ring-blue-100" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* RIGHT: Product Info - 5 cols */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-5 space-y-5"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold uppercase tracking-wide">
              <Star size={12} className="fill-blue-700" />
              {product.subtitle}
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>
              <p className="text-gray-500 mt-1 text-sm">
                SKU: {product.id.toUpperCase()} • Tersedia
              </p>
            </div>

            {/* Price Card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-3">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl font-bold text-gray-900">
                  IDR {formatRupiah(pricePerUnit)}
                </span>
                <span className="text-lg text-gray-400 line-through">
                  IDR {formatRupiah(product.originalPrice * (selectedMaterial?.priceMultiplier || 1) * (product.hasMeterInput ? meter : 1))}
                </span>
              </div>
              {savings > 0 && (
                <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium">
                  <Check size={14} />
                  Hemat IDR {formatRupiah(savings)}
                </div>
              )}
              <p className="text-sm text-gray-500">
                Harga per {product.hasMeterInput ? `${meter} meter` : 'unit'}
                {selectedMaterial && ` • Material ${selectedMaterial.name}`}
              </p>
            </div>

            {/* Material Selection — tanpa kotak warna */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Package size={18} className="text-gray-400" />
                Pilih Material
              </label>
              <div className="relative">
                <button
                  onClick={() => setShowMaterialDropdown(!showMaterialDropdown)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between ${
                    selectedMaterial ? "border-blue-600 bg-blue-50/50" : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div>
                    {selectedMaterial ? (
                      <>
                        <div className="font-semibold text-gray-900">{selectedMaterial.name}</div>
                        <div className="text-xs text-gray-500">{selectedMaterial.description}</div>
                      </>
                    ) : (
                      <span className="text-gray-500">Pilih material...</span>
                    )}
                  </div>
                  <ChevronRight size={20} className={`text-gray-400 transition-transform flex-shrink-0 ${showMaterialDropdown ? 'rotate-90' : ''}`} />
                </button>
                <AnimatePresence>
                  {showMaterialDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-50 left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
                    >
                      {product.materials.map((material) => (
                        <button
                          key={material.id}
                          onClick={() => { setSelectedMaterial(material); setShowMaterialDropdown(false); }}
                          className={`w-full p-4 text-left hover:bg-gray-50 transition flex items-center justify-between border-b border-gray-50 last:border-0 ${
                            selectedMaterial?.id === material.id ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div>
                            <div className="font-medium text-gray-900">{material.name}</div>
                            <div className="text-xs text-gray-500">{material.description}</div>
                          </div>
                          <div className="text-sm font-semibold text-blue-600 flex-shrink-0 ml-4">
                            {material.priceMultiplier === 1 ? 'Std' :
                             material.priceMultiplier > 1 ? `+${Math.round((material.priceMultiplier - 1) * 100)}%` :
                             `-${Math.round((1 - material.priceMultiplier) * 100)}%`}
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Meter Input — tanpa batasan min/max */}
            {product.hasMeterInput && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <Ruler size={18} className="text-gray-400" />
                  Jumlah Meter
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-gray-200 rounded-xl bg-white overflow-hidden">
                    <button
                      onClick={() => handleMeterChange(meter - 1)}
                      className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 transition text-gray-600"
                    >
                      <Minus size={18} />
                    </button>
                    <input
                      type="number"
                      value={meter}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "") { setMeter("" as any); return; }
                        const num = Number(val);
                        if (!isNaN(num)) setMeter(num);
                      }}
                      onBlur={() => { if (!meter || meter < 1) setMeter(1); }}
                      className="w-20 h-12 text-center font-semibold text-lg text-gray-900 focus:outline-none"
                    />
                    <button
                      onClick={() => handleMeterChange(meter + 1)}
                      className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 transition text-gray-600"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center py-3 border-t border-gray-200">
                <span className="text-gray-600">Total Harga:</span>
                <span className="text-2xl font-bold text-gray-900">IDR {formatRupiah(totalPrice)}</span>
              </div>

              {/* Beli Sekarang — biru */}
              <button
                onClick={handleBuyNow}
                disabled={isLoading}
                className="w-full py-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ShoppingCart size={20} />
                Beli Sekarang
              </button>

              {/* Tambah ke Keranjang — biru outline */}
              <button
                onClick={() => handleAddToCart(false)}
                disabled={!selectedMaterial || isLoading}
                className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 border-2 ${
                  !selectedMaterial
                    ? "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50"
                    : isAdded
                    ? "border-green-500 text-green-600 bg-green-50"
                    : "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                }`}
              >
                {isLoading ? (
                  <span className="animate-pulse">Menyimpan...</span>
                ) : isAdded ? (
                  <><Check size={20} />Ditambahkan</>
                ) : (
                  <><Plus size={20} /> Keranjang</>
                )}
              </button>

              {!selectedMaterial && (
                <p className="text-center text-sm text-red-500">
                  * Silakan pilih material terlebih dahulu
                </p>
              )}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Truck size={20} className="text-green-600" />
                </div>
                <div className="text-xs">
                  <p className="font-semibold text-gray-900">Gratis Ongkir</p>
                  <p className="text-gray-500">Jabodetabek</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield size={20} className="text-blue-600" />
                </div>
                <div className="text-xs">
                  <p className="font-semibold text-gray-900">Garansi 1 Tahun</p>
                  <p className="text-gray-500">Produk & Pengerjaan</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── TABS SECTION (desktop & mobile shared) ── */}
        <div className="mt-10 lg:mt-16">
          <div className="border-b border-gray-200">
            <div className="flex gap-8">
              {["deskripsi", "spesifikasi"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`pb-4 text-sm font-semibold capitalize transition relative ${
                    activeTab === tab ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="py-6"
            >
              {activeTab === "deskripsi" ? (
                <div className="max-w-4xl space-y-6">
                  <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
                    {product.description}
                  </div>

                  {/* Features Grid — jarak diperkecil */}
                  <div className="bg-gray-50 rounded-2xl p-5">
                    <h3 className="font-bold text-gray-900 mb-4 text-lg">Keunggulan Produk</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {product.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3 bg-white p-4 rounded-xl shadow-sm">
                          <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">
                            {idx + 1}
                          </div>
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cocok Untuk — jarak diperkecil */}
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3 text-lg">Cocok Untuk</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.suitableFor.map((item, idx) => (
                        <span key={idx} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-full text-sm font-medium shadow-sm">
                          ✓ {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="max-w-3xl">
                  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    {product.specs.map((spec, idx) => (
                      <div
                        key={idx}
                        className={`flex flex-col sm:flex-row p-4 sm:p-5 ${
                          idx !== product.specs.length - 1 ? 'border-b border-gray-100' : ''
                        }`}
                      >
                        <div className="sm:w-1/3 font-semibold text-gray-900 mb-1 sm:mb-0">{spec.label}</div>
                        <div className="sm:w-2/3 text-gray-600">{spec.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── PRODUK SERUPA — card disamakan dengan ProductCard.tsx ── */}
        {recommendedProducts.length > 0 && (
          <div className="mt-2 pb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Produk Serupa</h2>
              <Link
                href={`/kategori/${product.category}`}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                Lihat Semua
                <ChevronRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {recommendedProducts.slice(0, 4).map((recProduct, index) => (
                <motion.div
                  key={recProduct.id}
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                  }}
                >
                  <Link href={`/produk/${recProduct.id}`} className="group block h-full">
                    <motion.div
                      whileHover={{ y: -8 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="bg-white rounded-2xl sm:rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-blue-200/20 transition-shadow duration-500 overflow-hidden flex flex-col h-full"
                    >
                      {/* Image */}
                      <div className="relative h-36 sm:h-44 overflow-hidden bg-slate-100 flex-shrink-0">
                        <Image
                          src={recProduct.images[0]}
                          alt={recProduct.name}
                          fill
                          className="object-cover group-hover:scale-105 transition duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        {recProduct.discount > 0 && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                            {recProduct.discount}%
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-3 sm:p-4 flex flex-col flex-1">
                        <h3 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                          {recProduct.name}
                        </h3>

                        {/* Price */}
                        <div className="mb-3">
                          <span className="text-base sm:text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                            IDR {formatRupiah(recProduct.basePrice)}
                          </span>
                          {recProduct.originalPrice > recProduct.basePrice && (
                            <div className="text-xs text-slate-400 line-through mt-0.5">
                              IDR {formatRupiah(recProduct.originalPrice)}
                            </div>
                          )}
                        </div>

                        {/* Gratis Design 3D */}
                        <div className="flex items-center gap-1.5 mb-2 px-2 py-1.5 bg-blue-50 rounded-lg border border-blue-100">
                          <svg className="w-3 h-3 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          <span className="text-xs text-blue-700 font-semibold leading-tight">
                            Gratis Design 3D & Survey
                          </span>
                        </div>

                        {/* Gratis Ongkir */}
                        <div className="flex items-center gap-1.5 mb-3 px-2 py-1.5 bg-green-50 rounded-lg border border-green-100">
                          <Truck size={12} className="text-green-600 flex-shrink-0" />
                          <span className="text-xs text-green-700 font-semibold">
                            Gratis Ongkir Jabodetabek
                          </span>
                        </div>

                        {/* CTA */}
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="mt-auto w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-xl font-bold text-xs transition-all duration-300 flex items-center justify-center gap-1.5 shadow-lg shadow-blue-600/20"
                        >
                          Lihat Detail
                          <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                        </motion.div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}