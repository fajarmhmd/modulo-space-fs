// app/promo/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Paintbrush,
  Hammer,
  Calendar,
  Clock,
  Percent,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  Phone,
  MapPin,
  ChevronDown,
  Filter,
  X
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Types
interface Promo {
  id: number;
  title: string;
  category: "interior" | "exterior" | "renovasi";
  discount: number;
  originalPrice: number;
  discountedPrice: number;
  description: string;
  features: string[];
  validUntil: string;
  image: string;
  badge?: string;
  popular?: boolean;
}

// Data Promo
const promos: Promo[] = [
  {
    id: 1,
    title: "Paket Interior Lengkap",
    category: "interior",
    discount: 25,
    originalPrice: 15000000,
    discountedPrice: 11250000,
    description: "Transformasi total ruang tamu, kamar tidur, dan dapur dengan desain modern minimalis",
    features: ["Desain 3D Rendering", "Material Premium", "Konsultasi Gratis", "Garansi 2 Tahun"],
    validUntil: "2026-05-30",
    image: "/api/placeholder/600/400",
    badge: "Best Seller",
    popular: true
  },
  {
    id: 2,
    title: "Renovasi Cepat 7 Hari",
    category: "renovasi",
    discount: 15,
    originalPrice: 8000000,
    discountedPrice: 6800000,
    description: "Renovasi kilat untuk kamar mandi atau dapur dengan timeline yang jelas",
    features: ["Selesai 7 Hari", "Material Siap Pakai", "Tidak Perlu Pindah", "Free Pembersihan"],
    validUntil: "2026-04-30",
    image: "/api/placeholder/600/400",
    badge: "Flash Sale"
  },
  {
    id: 3,
    title: "Eksterior Taman & Fasad",
    category: "exterior",
    discount: 20,
    originalPrice: 12000000,
    discountedPrice: 9600000,
    description: "Percantik tampilan luar rumah dengan landscape profesional dan cat fasad premium",
    features: ["Desain Landscape", "Cat Weather Shield", "Pencahayaan Outdoor", "Perawatan 6 Bulan"],
    validUntil: "2026-05-15",
    image: "/api/placeholder/600/400"
  },
  {
    id: 4,
    title: "Custom Furniture Premium",
    category: "interior",
    discount: 30,
    originalPrice: 5000000,
    discountedPrice: 3500000,
    description: "Furniture custom sesuai ukuran ruangan Anda dengan bahan pilihan",
    features: ["Ukuran Custom", "Bahan Jati/Besi", "Finishing Premium", "Instalasi Gratis"],
    validUntil: "2026-05-20",
    image: "/api/placeholder/600/400",
    badge: "Limited"
  },
  {
    id: 5,
    title: "Renovasi Total Rumah",
    category: "renovasi",
    discount: 35,
    originalPrice: 50000000,
    discountedPrice: 32500000,
    description: "Paket lengkap renovasi rumah dari A-Z dengan tim profesional berpengalaman",
    features: ["Survey Detail", "Desain Arsitek", "Izin Bangunan", "Project Manager", "Garansi 5 Tahun"],
    validUntil: "2026-06-30",
    image: "/api/placeholder/600/400",
    badge: "Hemat Besar",
    popular: true
  },
  {
    id: 6,
    title: "Waterproofing & Perbaikan",
    category: "exterior",
    discount: 40,
    originalPrice: 3500000,
    discountedPrice: 2100000,
    description: "Solusi kebocoran dan perbaikan eksterior dengan teknologi waterproofing terbaru",
    features: ["Deteksi Kebocoran", "Waterproofing Coating", "Garansi 10 Tahun", "Emergency Service"],
    validUntil: "2026-04-25",
    image: "/api/placeholder/600/400",
    badge: "Urgent"
  }
];

const categories = [
  { id: "all", label: "Semua Promo", icon: Sparkles },
  { id: "interior", label: "Interior", icon: Home },
  { id: "exterior", label: "Eksterior", icon: Paintbrush },
  { id: "renovasi", label: "Renovasi", icon: Hammer },
];

// Components
const CountdownTimer = ({ targetDate }: { targetDate: string }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex gap-2 text-center">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1 min-w-[40px]">
          <div className="text-lg font-bold text-white">{String(value).padStart(2, '0')}</div>
          <div className="text-[10px] uppercase text-white/80">{unit}</div>
        </div>
      ))}
    </div>
  );
};

const PromoCard = ({ promo, index }: { promo: Promo; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 ${
        promo.popular ? 'ring-2 ring-[#C6A969] ring-offset-2' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badge */}
      {promo.badge && (
        <div className={`absolute top-4 left-4 z-20 px-3 py-1 rounded-full text-xs font-bold text-white ${
          promo.badge === "Flash Sale" ? "bg-red-500 animate-pulse" :
          promo.badge === "Limited" ? "bg-purple-500" :
          promo.badge === "Best Seller" ? "bg-[#C6A969]" :
          "bg-blue-600"
        }`}>
          {promo.badge}
        </div>
      )}

      {/* Discount Badge */}
      <div className="absolute top-4 right-4 z-20 bg-black text-white px-3 py-1 rounded-full text-sm font-bold">
        -{promo.discount}%
      </div>

      {/* Image Container */}
      <div className="relative h-56 overflow-hidden">
        <Image
          src={promo.image}
          alt={promo.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Category Label */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-800 capitalize">
            {promo.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{promo.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{promo.description}</p>

        {/* Price */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#C6A969]">
              Rp {promo.discountedPrice.toLocaleString('id-ID')}
            </span>
            <span className="text-sm text-gray-400 line-through">
              Rp {promo.originalPrice.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-2 mb-6">
          {promo.features.slice(0, 3).map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle2 size={14} className="text-green-500 flex-shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        {/* Countdown */}
        <div className="mb-4 p-3 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white/80 text-xs">
              <Clock size={14} />
              <span>Berlaku hingga</span>
            </div>
            <CountdownTimer targetDate={promo.validUntil} />
          </div>
        </div>

        {/* CTA Button */}
        <Link href={`/promo/${promo.id}`}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-black hover:bg-gray-800 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors group/btn"
          >
            <span>Ambil Promo</span>
            <ArrowRight size={18} className="transition-transform group-hover/btn:translate-x-1" />
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
};

const HeroSection = () => (
  <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
    {/* Background Pattern */}
    <div className="absolute inset-0 opacity-20">
      <div className="absolute inset-0" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />
    </div>

    {/* Floating Elements */}
    <motion.div
      animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-20 left-10 w-20 h-20 bg-[#C6A969]/20 rounded-full blur-xl"
    />
    <motion.div
      animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      className="absolute bottom-20 right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-xl"
    />

    <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-[#C6A969] text-sm font-medium mb-6 border border-white/20">
          <Sparkles className="inline-block w-4 h-4 mr-2" />
          Penawaran Terbatas
        </span> */}
        
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Promo Layanan{" "}
          <span className="bg-gradient-to-r from-[#C6A969] via-yellow-200 to-[#C6A969] bg-clip-text text-transparent">
            Interior & Renovasi
          </span>
        </h1>
        
        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
          Hemat hingga <span className="text-[#C6A969] font-bold">40%</span> untuk layanan interior, eksterior, dan renovasi rumah. 
          Konsultasi gratis dan garansi hingga 5 tahun.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {[
            { value: "40%", label: "Diskon Maksimal", icon: Percent },
            { value: "500+", label: "Proyek Selesai", icon: CheckCircle2 },
            { value: "5 Tahun", label: "Garansi", icon: Shield },
            { value: "24/7", label: "Support", icon: Phone },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + idx * 0.1 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4"
            >
              <stat.icon className="w-6 h-6 text-[#C6A969] mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>

    {/* Scroll Indicator */}
    <motion.div
      animate={{ y: [0, 10, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50"
    >
      <ChevronDown size={32} />
    </motion.div>
  </section>
);

const WhyChooseSection = () => (
  <section className="py-20 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Mengapa Memilih Promo Kami?
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Kami memberikan layanan terbaik dengan harga terjangkau dan jaminan kualitas
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            icon: Zap,
            title: "Proses Cepat",
            description: "Timeline jelas dan tepat waktu. Renovasi kilat selesai dalam 7 hari.",
            color: "bg-yellow-100 text-yellow-600"
          },
          {
            icon: Shield,
            title: "Garansi Resmi",
            description: "Garansi pekerjaan hingga 5 tahun dan garansi material dari supplier.",
            color: "bg-blue-100 text-blue-600"
          },
          {
            icon: CheckCircle2,
            title: "Transparan",
            description: "Harga fixed tanpa hidden cost. RAB detail sebelum memulai proyek.",
            color: "bg-green-100 text-green-600"
          }
        ].map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.2 }}
            className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mb-6`}>
              <item.icon size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
            <p className="text-gray-600 leading-relaxed">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const CTASection = () => (
  <section className="py-20 bg-black text-white">
    <div className="max-w-5xl mx-auto px-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 md:p-16 border border-gray-700 relative overflow-hidden"
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C6A969]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Masih Ragu? Konsultasi Gratis!
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Tim ahli kami siap membantu mewujudkan hunian impian Anda. 
            Dapatkan penawaran khusus dan desain 3D gratis.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/custom-interior">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-[#C6A969] hover:bg-[#B59855] text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <Calendar size={20} />
                Jadwalkan Konsultasi
              </motion.button>
            </Link>
            <Link href="https://wa.me/6281234567890">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors border border-white/20"
              >
                <Phone size={20} />
                Hubungi WhatsApp
              </motion.button>
            </Link>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <MapPin size={16} />
              Jakarta, Surabaya, Bandung
            </span>
            <span className="w-1 h-1 bg-gray-500 rounded-full" />
            <span>Respons dalam 1 jam</span>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

// Main Page Component
export default function PromoPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [filteredPromos, setFilteredPromos] = useState(promos);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  useEffect(() => {
    if (activeCategory === "all") {
      setFilteredPromos(promos);
    } else {
      setFilteredPromos(promos.filter(p => p.category === activeCategory));
    }
  }, [activeCategory]);

  return (
    <>
    <Navbar />
    
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <HeroSection />

      {/* Filter Section */}
      <section className="sticky top-16 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4">
          {/* Desktop Filter */}
          <div className="hidden md:flex items-center justify-center gap-2">
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                  activeCategory === cat.id
                    ? "bg-black text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <cat.icon size={18} />
                {cat.label}
              </motion.button>
            ))}
          </div>

          {/* Mobile Filter */}
          <div className="md:hidden">
            <button
              onClick={() => setShowMobileFilter(!showMobileFilter)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-100 rounded-xl font-medium"
            >
              <span className="flex items-center gap-2">
                <Filter size={18} />
                {categories.find(c => c.id === activeCategory)?.label}
              </span>
              <ChevronDown 
                size={20} 
                className={`transition-transform ${showMobileFilter ? 'rotate-180' : ''}`} 
              />
            </button>

            <AnimatePresence>
              {showMobileFilter && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-2 grid grid-cols-2 gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setActiveCategory(cat.id);
                          setShowMobileFilter(false);
                        }}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                          activeCategory === cat.id
                            ? "bg-black text-white"
                            : "bg-gray-50 text-gray-600"
                        }`}
                      >
                        <cat.icon size={16} />
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Promo Grid */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            layout
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredPromos.map((promo, index) => (
                <PromoCard key={promo.id} promo={promo} index={index} />
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredPromos.length === 0 && (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter size={40} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Tidak ada promo dalam kategori ini
              </h3>
              <p className="text-gray-600">Coba pilih kategori lain</p>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <WhyChooseSection />

      {/* CTA */}
      <CTASection />
    </main>

    <Footer />
    </>
  );
}