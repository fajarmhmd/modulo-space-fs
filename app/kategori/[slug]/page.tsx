// app/kategori/[slug]/page.tsx
// Untuk Interior dan Exterior - Layout Card Grid

import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import OrderFlowSection from "@/components/OrderFlowSection";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ================= DATA INTERIOR =================
const interiorData = {
  title: "Interior Collection",
  subtitle: "Solusi furniture custom interior dengan desain modern dan fungsional",
  description: "Temukan berbagai pilihan furniture interior custom yang dirancang sesuai kebutuhan ruangan Anda. Dari kitchen set hingga wardrobe, semua menggunakan material berkualitas dengan finishing premium.",
  layout: "card",
  image: "/cat-interior.png",
  products: [
    { id: "plafon-1", name: "Plafon Pvc modern / drop ceiling up ceiling", image: "/plafon-pvc.png", size: "/m²", price: 320000, originalPrice: 575000, discount: 15, voucher: 4, badge: "Ruangan Lebih Estetik" },
    { id: "kitchenset-minibar", name: "Kitchen Set Custom Minimalis Modern + Mini bar/island", image: "/kitchenset-minibar.png", size: "/m²", price: 2699000, originalPrice: 3500000, discount: 15, voucher: 4 },
    { id: "lemari-custom-1", name: "Lemari Pakaian Custom Built-in / Wardrobe Full Plafon", image: "/lemari-samping.png", size: "/m²", price: 2599000, originalPrice: 5300000, discount: 16, voucher: 6 },
    { id: "mezzanine", name: "Mezzanine Custom / Lantai Tambahan Interior Modern", image: "/mejanin.png", size: "/m²", price: 2750000, originalPrice: 3200000, discount: 14, voucher: 5, badge: "Populer" },
    { id: "nakas-1", name: "Nakas Gantung / Bedside Table Floating Custom", image: "/nakas-gantung.png", size: "/m²", price: 590000, originalPrice: 950000, discount: 20, voucher: 7, badge: "Hemat" },
    { id: "rak-tangga-1", name: "Rak Bawah Tangga Custom / Storage Bawah Tangga", image: "/rak-tangga3.png", size: "/m²", price: 1690000, originalPrice: 2100000, discount: 16, voucher: 5 },
    { id: "backdrop-tv-1", name: "Wall Backdrop TV Custom / Panel TV Wall Premium", image: "/wallback-drop.png", size: "/m²", price: 2199000, originalPrice: 2900000, discount: 18, voucher: 5 },
    { id: "meja-kerja-1", name: "Meja Kerja Custom / Meja Komputer Sudut (L-shape)", image: "/meja-kerja.png", size: "/m²", price: 1399000, originalPrice: 2100000, discount: 16, voucher: 5 },
  ],
};

// ================= DATA EXTERIOR =================
const exteriorData = {
  title: "Exterior Works",
  subtitle: "Konstruksi & furniture area luar tahan cuaca",
  description: "Solusi eksterior berkualitas tinggi untuk area luar rumah Anda. Dari canopy hingga pagar besi, semua dirancang tahan cuaca dan estetis.",
  layout: "card",
  image: "/cat-exterior.png",
  products: [
    { id: "canopy-pvc-1", name: "Canopy + Plafon Pvc", image: "/canopy-exterior.jpg", size: "/m² ", price: 1099000, originalPrice: 2490000, discount: 15, voucher: 6 },
    { id: "pager-sliding-1", name: "Pagar Sliding / Swing", image: "/pagar-sliding.png", size: " /m²", price: 849000, originalPrice: 1500000, discount: 15, voucher: 5 },
    { id: "railing-balkon-1", name: "railing balkon aluminium / besi minimalis modern", image: "/railing-balkon1.png", size: "per meter", price: 799000, originalPrice: 1500000, discount: 14, voucher: 5 },
    { id: "canopy-sliding-1", name: "Canopy kaca buka tutup / skylight retractable sliding roof", image: "/canopy-sliding.jpg", size: "per /m", price: 2590000, originalPrice: 3500000, discount: 16, voucher: 5, badge: "Premium" },
  ],
};

const dataMap: Record<string, typeof interiorData> = {
  interior: interiorData,
  exterior: exteriorData,
};

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = dataMap[slug.toLowerCase()];

  if (!cat) {
    notFound();
  }

  return (
    <>
    <Navbar />
    <div className="bg-white min-h-screen pt-20">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 border-b border-gray-200">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-100/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-purple-100/40 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-16">

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="max-w-2xl">

              
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
                {cat.title}
              </h1>
              
              <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                {cat.description}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {["Material Premium", "Custom Ukuran", "Garansi Hingga 1 Tahun", "Free Instalasi"].map((tag) => (
                <span 
                  key={tag}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 shadow-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <div className="flex items-center justify-between mb-8">
          {/* <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            Semua Produk <span className="text-gray-400 font-normal">({cat.products.length})</span>
          </h2> */}
          
          {/* Filter Dropdown (Visual Only) */}
          {/* <div className="flex gap-2">
            <select className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Urutkan: Populer</option>
              <option>Harga: Rendah ke Tinggi</option>
              <option>Harga: Tinggi ke Rendah</option>
              <option>Diskon Terbesar</option>
            </select>
          </div> */}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
          {cat.products.map((product, index) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              image={product.image}
              price={product.price}
              originalPrice={product.originalPrice}
              discount={product.discount}
              voucher={product.voucher}
              size={product.size}
              badge={product.badge}
              index={index}
            />
          ))}
        </div>

        {/* Empty State (if needed) */}
        {cat.products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500">Tidak ada produk dalam kategori ini</p>
          </div>
        )}
      </section>

      <OrderFlowSection />
    </div>
    
    <Footer />
    </>
  );
}