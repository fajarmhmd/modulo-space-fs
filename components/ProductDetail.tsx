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
  Star
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
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
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
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40 backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600 transition-colors flex items-center gap-1">
              Beranda
            </Link>
            <ChevronRight size={14} />
            <Link href={`/kategori/${product.category}`} className="hover:text-blue-600 transition-colors capitalize">
              {product.category}
            </Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-medium truncate max-w-[150px] sm:max-w-xs">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button Mobile */}
        <button 
          onClick={() => router.back()}
          className="lg:hidden mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Kembali</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* LEFT: Image Gallery - 7 cols */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 space-y-4"
          >
            {/* Main Image */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 group">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              
              {/* Discount Badge */}
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
                Hemat {product.discount}%
              </div>

              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button 
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all"
                >
                  <Heart 
                    size={20} 
                    className={`transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                  />
                </button>
                <button className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all">
                  <Share2 size={20} className="text-gray-600" />
                </button>
              </div>

              {/* Navigation Arrows */}
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

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === idx
                      ? "border-blue-600 ring-2 ring-blue-100"
                      : "border-gray-200 hover:border-gray-300"
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
            className="lg:col-span-5 space-y-6"
          >
            {/* Category Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold uppercase tracking-wide">
              <Star size={12} className="fill-blue-700" />
              {product.subtitle}
            </div>

            {/* Title */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>
              <p className="text-gray-500 mt-2 text-sm">
                SKU: {product.id.toUpperCase()} • Tersedia
              </p>
            </div>

            {/* Price Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
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

            {/* Material Selection */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Package size={18} className="text-gray-400" />
                Pilih Material
              </label>
              
              <div className="relative">
                <button
                  onClick={() => setShowMaterialDropdown(!showMaterialDropdown)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between ${
                    selectedMaterial
                      ? "border-blue-600 bg-blue-50/50"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {selectedMaterial ? (
                      <>
                        <div
                          className="w-10 h-10 rounded-lg shadow-sm border border-gray-200"
                          style={{ backgroundColor: selectedMaterial.color }}
                        />
                        <div>
                          <div className="font-semibold text-gray-900">{selectedMaterial.name}</div>
                          <div className="text-xs text-gray-500">{selectedMaterial.description}</div>
                        </div>
                      </>
                    ) : (
                      <span className="text-gray-500">Pilih material...</span>
                    )}
                  </div>
                  <ChevronRight 
                    size={20} 
                    className={`text-gray-400 transition-transform ${showMaterialDropdown ? 'rotate-90' : ''}`} 
                  />
                </button>

                {/* Dropdown */}
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
                          onClick={() => {
                            setSelectedMaterial(material);
                            setShowMaterialDropdown(false);
                          }}
                          className={`w-full p-4 text-left hover:bg-gray-50 transition flex items-center gap-3 border-b border-gray-50 last:border-0 ${
                            selectedMaterial?.id === material.id ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div
                            className="w-10 h-10 rounded-lg shadow-sm border border-gray-200 flex-shrink-0"
                            style={{ backgroundColor: material.color }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900">{material.name}</div>
                            <div className="text-xs text-gray-500 truncate">{material.description}</div>
                          </div>
                          <div className="text-sm font-semibold text-blue-600">
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

            {/* Meter Input */}
            {product.hasMeterInput && (
              <div className="space-y-3">
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
                        if (val === "") {
                          setMeter("" as any);
                          return;
                        }
                        const num = Number(val);
                        if (!isNaN(num)) setMeter(num);
                      }}
                      onBlur={() => {
                        if (!meter || meter < (product.minMeter || 1)) {
                          setMeter(product.minMeter || 1);
                        }
                      }}
                      className="w-20 h-12 text-center font-semibold text-lg text-gray-900 focus:outline-none"
                    />
                    <button
                      onClick={() => handleMeterChange(meter + 1)}
                      className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 transition text-gray-600"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    Min: {product.minMeter || 1}m • Max: {product.maxMeter || 100}m
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              {/* Total */}
              <div className="flex justify-between items-center py-3 border-t border-gray-200">
                <span className="text-gray-600">Total Harga:</span>
                <span className="text-2xl font-bold text-gray-900">IDR {formatRupiah(totalPrice)}</span>
              </div>

              {/* Buttons */}
              <button
                onClick={handleBuyNow}
                disabled={isLoading}
                className="w-full py-4 rounded-xl font-bold text-white bg-gray-900 hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ShoppingCart size={20} />
                Beli Sekarang
              </button>

              <button
                onClick={() => handleAddToCart(false)}
                disabled={!selectedMaterial || isLoading}
                className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 border-2 ${
                  !selectedMaterial
                    ? "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50"
                    : isAdded
                    ? "border-green-500 text-green-600 bg-green-50"
                    : "border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white"
                }`}
              >
                {isLoading ? (
                  <span className="animate-pulse">Menyimpan...</span>
                ) : isAdded ? (
                  <>
                    <Check size={20} />
                    Ditambahkan
                  </>
                ) : (
                  <>
                    <Plus size={20} />
                    Tambah ke Keranjang
                  </>
                )}
              </button>

              {!selectedMaterial && (
                <p className="text-center text-sm text-red-500">
                  * Silakan pilih material terlebih dahulu
                </p>
              )}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3 pt-4">
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Truck size={20} className="text-green-600" />
                </div>
                <div className="text-xs">
                  <p className="font-semibold text-gray-900">Gratis Ongkir</p>
                  <p className="text-gray-500">Bogor & Tangerang</p>
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

        {/* Tabs Section */}
        <div className="mt-16 lg:mt-24">
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
              className="py-8"
            >
              {activeTab === "deskripsi" ? (
                <div className="max-w-4xl space-y-8">
                  <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
                    {product.description}
                  </div>

                  {/* Features Grid */}
                  <div className="bg-gray-50 rounded-2xl p-6 md:p-8">
                    <h3 className="font-bold text-gray-900 mb-6 text-lg">Keunggulan Produk</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
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

                  {/* Suitable For */}
                  <div>
                    <h3 className="font-bold text-gray-900 mb-4 text-lg">Cocok Untuk</h3>
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
                        <div className="sm:w-1/3 font-semibold text-gray-900 mb-1 sm:mb-0">
                          {spec.label}
                        </div>
                        <div className="sm:w-2/3 text-gray-600">
                          {spec.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Recommended Products */}
        {recommendedProducts.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center justify-between mb-8">
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
              {recommendedProducts.slice(0, 4).map((recProduct) => (
                <Link key={recProduct.id} href={`/produk/${recProduct.id}`}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group"
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={recProduct.images[0]}
                        alt={recProduct.name}
                        fill
                        className="object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        {recProduct.discount}%
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 group-hover:text-blue-600 transition">
                        {recProduct.name}
                      </h3>
                      <div className="flex items-baseline gap-2">
                        <span className="font-bold text-gray-900">
                          IDR {formatRupiah(recProduct.basePrice)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}