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
    { id: "kitchen-set-1", name: "Kitchen Set Premium", image: "/cat-interior.png", size: "per meter", price: 3500000, originalPrice: 4200000, discount: 17, voucher: 5, badge: "Best Seller" },
    { id: "minibar-1", name: "Minibar Custom", image: "/cat-interior.png", size: "per meter", price: 2800000, originalPrice: 3300000, discount: 15, voucher: 4 },
    { id: "lemari-custom-1", name: "Lemari Pakaian Custom", image: "/cat-interior.png", size: "per meter", price: 2600000, originalPrice: 3100000, discount: 16, voucher: 6 },
    { id: "lemari-sliding-1", name: "Lemari Sliding Door", image: "/cat-interior.png", size: "per meter", price: 2750000, originalPrice: 3200000, discount: 14, voucher: 5, badge: "Populer" },
    { id: "backdrop-tv-1", name: "Wall Backdrop TV", image: "/cat-interior.png", size: "per meter", price: 2400000, originalPrice: 2900000, discount: 18, voucher: 5 },
    { id: "buffet-1", name: "Buffet Cabinet", image: "/cat-interior.png", size: "per meter", price: 2300000, originalPrice: 2700000, discount: 15, voucher: 4 },
    { id: "rak-tangga-1", name: "Rak Bawah Tangga", image: "/cat-interior.png", size: "per meter", price: 2100000, originalPrice: 2500000, discount: 16, voucher: 5 },
    { id: "nakas-1", name: "Nakas Gantung", image: "/cat-interior.png", size: "per unit", price: 950000, originalPrice: 1200000, discount: 20, voucher: 7, badge: "Hemat" },
    { id: "meja-rias-1", name: "Meja Rias Custom", image: "/cat-interior.png", size: "per unit", price: 1850000, originalPrice: 2200000, discount: 16, voucher: 5 },
    { id: "rak-buku-1", name: "Rak Buku Minimalis", image: "/cat-interior.png", size: "per meter", price: 1650000, originalPrice: 1950000, discount: 15, voucher: 4 },
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
    { id: "plafon-1", name: "Plafon Pvc", image: "/plafon-pvc.png", size: "/ m²", price: 850000, originalPrice: 990000, discount: 15, voucher: 4, badge: "Ruangan Lebih Estetik" },
    { id: "kitchenset-minimalis-1", name: "Kitchen Set Minimalis ", image: "/After-kitchenset.jpg", size: "per meter", price: 999000, originalPrice: 920000, discount: 15, voucher: 4 },
    { id: "pintu-teralis-1", name: "Canopy Plafon Pvc", image: "/canopy-exterior.jpg", size: "per unit", price: 699000, originalPrice: 1950000, discount: 15, voucher: 6 },
    { id: "pintu-aluminium-1", name: "Pintu Aluminium", image: "/cat-exterior.png", size: "per unit", price: 2100000, originalPrice: 2500000, discount: 16, voucher: 5, badge: "Premium" },
    { id: "kitchen-aluminium-1", name: "Kitchen Set Aluminium", image: "/cat-exterior.png", size: "per meter", price: 3200000, originalPrice: 3700000, discount: 13, voucher: 5 },
    { id: "pager-sliding-1", name: "Pagar Sliding", image: "/cat-exterior.png", size: "per meter", price: 1400000, originalPrice: 1650000, discount: 15, voucher: 5 },
    { id: "kanopi-glass-1", name: "Kanopi Kaca Tempered", image: "/cat-exterior.png", size: "per m²", price: 1250000, originalPrice: 1450000, discount: 14, voucher: 4, badge: "Elegan" },
    { id: "balkon-1", name: "Railing Balkon", image: "/cat-exterior.png", size: "per meter", price: 950000, originalPrice: 1100000, discount: 14, voucher: 5 },
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
    <div className="bg-white min-h-screen">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 border-b border-gray-200">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-100/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-purple-100/40 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-16">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-gray-900 transition">Beranda</Link>
            <span>/</span>
            <Link href="/kategori" className="hover:text-gray-900 transition">Kategori</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium capitalize">{slug}</span>
          </nav>

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
              {["Material Premium", "Custom Ukuran", "Garansi 2 Tahun", "Free Instalasi"].map((tag) => (
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
      <section className="max-w-7xl mx-auto px-4 py-12 md:py-20">
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