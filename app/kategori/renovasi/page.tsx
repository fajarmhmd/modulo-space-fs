// app/kategori/renovasi/page.tsx
"use client";


import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Shield,
  Users,
  Zap,
  Home,
  Paintbrush,
  Hammer,
  ChevronDown,
  ChevronUp,
  Phone,
  Calendar,
  BadgeCheck,
  TrendingUp,
  Wallet,
  Ruler,
  Sparkles
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Types
interface RenovasiPackage {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  duration: string;
  scope: string[];
  features: string[];
  image: string;
  badge?: string;
  popular?: boolean;
  category: "interior" | "exterior" | "full";
}

// Data Renovasi
const renovasiPackages: RenovasiPackage[] = [
  {
    id: "renovasi-dapur-premium",
    name: "Renovasi Dapur Premium",
    subtitle: "Transformasi dapur modern dengan material anti-rayap dan waterproof",
    price: 18500000,
    originalPrice: 22000000,
    duration: "10–14 hari",
    category: "interior",
    image: "/api/placeholder/800/600",
    badge: "Best Seller",
    popular: true,
    scope: [
      "Survey & pengukuran detail",
      "Pembongkaran struktur lama",
      "Instalasi kitchen set custom",
      "Plumbing & electrical baru",
      "Finishing premium & QC"
    ],
    features: [
      "Material plywood 18mm water resistant",
      "Hardware Hettich/Japan",
      "Granit countertop pilihan",
      "LED under cabinet included"
    ]
  },
  {
    id: "renovasi-kamar-tidur",
    name: "Renovasi Kamar Tidur",
    subtitle: "Desain nyaman dengan wardrobe custom dan sistem pencahayaan modern",
    price: 14500000,
    originalPrice: 17500000,
    duration: "7–10 hari",
    category: "interior",
    image: "/api/placeholder/800/600",
    scope: [
      "Desain ulang layout",
      "Panel dinding & wardrobe",
      "Instalasi lighting system",
      "Cat dinding & plafon",
      "Finishing detail trim"
    ],
    features: [
      "Wardrobe sliding full height",
      "Smart lighting ready",
      "Lantai vinyl/SPC",
      "Backdrop headboard"
    ]
  },
  {
    id: "renovasi-ruang-tamu",
    name: "Renovasi Ruang Tamu",
    subtitle: "Tampilan fresh dengan backdrop TV dan plafon gypsum elegan",
    price: 12500000,
    originalPrice: 15000000,
    duration: "6–9 hari",
    category: "interior",
    image: "/api/placeholder/800/600",
    badge: "Hemat 15%",
    scope: [
      "Backdrop TV custom design",
      "Plafon gypsum dengan corniche",
      "Cat tembok & woodwork",
      "Instalasi spotlights",
      "Detail trim & finishing"
    ],
    features: [
      "Backdrop dengan storage",
      "Plafon drop ceiling",
      "Warm white lighting",
      "Wall panel accent"
    ]
  },
  {
    id: "renovasi-kamar-mandi",
    name: "Renovasi Kamar Mandi",
    subtitle: "Waterproofing total dengan sanitary ware berkualitas",
    price: 16500000,
    originalPrice: 19500000,
    duration: "8–12 hari",
    category: "interior",
    image: "/api/placeholder/800/600",
    scope: [
      "Hacking & waterproofing",
      "Instalasi pipa baru",
      "Pemasangan keramik",
      "Sanitary & fixtures",
      "Glass partition"
    ],
    features: [
      "Waterproofing 10 tahun garansi",
      "Keramik 60x60 homogenous",
      "Shower set rain + handheld",
      "Exhaust fan + lighting"
    ]
  },
  {
    id: "renovasi-eksterior-fasad",
    name: "Renovasi Fasad & Taman",
    subtitle: "Percantik tampilan luar dengan cat weather shield dan landscape",
    price: 22000000,
    originalPrice: 26000000,
    duration: "12–16 hari",
    category: "exterior",
    image: "/api/placeholder/800/600",
    badge: "Eksterior",
    scope: [
      "Pembersihan & repair dinding",
      "Cat fasad weather shield",
      "Desain landscape taman",
      "Instalasi outdoor lighting",
      "Waterproofing dinding luar"
    ],
    features: [
      "Cat elastomeric 7 tahun",
      "Taman minimalis dengan koral",
      "Lampu taman LED solar",
      "Gutter & drainage repair"
    ]
  },
  {
    id: "renovasi-total-rumah",
    name: "Renovasi Total Rumah",
    subtitle: "Paket lengkap renovasi dari A-Z dengan project manager dedicated",
    price: 45000000,
    originalPrice: 55000000,
    duration: "4–6 minggu",
    category: "full",
    image: "/api/placeholder/800/600",
    badge: "All In One",
    popular: true,
    scope: [
      "Survey & desain arsitek",
      "Renovasi multi ruang",
      "Koordinasi tim profesional",
      "Manajemen proyek harian",
      "Final inspection & handover"
    ],
    features: [
      "Project manager dedicated",
      "Daily progress report",
      "Material berkualitas grade A",
      "5 tahun garansi struktur",
      "Free maintenance 6 bulan"
    ]
  }
];

const stats = [
  { value: "500+", label: "Proyek Selesai", icon: Home },
  { value: "98%", label: "Kepuasan Klien", icon: BadgeCheck },
  { value: "5 Tahun", label: "Garansi", icon: Shield },
  { value: "7 Hari", label: "Renovasi Cepat", icon: Zap },
];

const whyChooseUs = [
  {
    icon: Clock,
    title: "Tepat Waktu",
    desc: "Komitmen timeline jelas dengan daily progress report",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: Shield,
    title: "Garansi Resmi",
    desc: "Garansi pekerjaan hingga 5 tahun & material original",
    color: "from-green-500 to-green-600"
  },
  {
    icon: Wallet,
    title: "Transparan",
    desc: "RAB detail tanpa hidden cost, pembayaran bertahap",
    color: "from-purple-500 to-purple-600"
  },
  {
    icon: Users,
    title: "Tim Ahli",
    desc: "Tukang berpengalaman 10+ tahun dengan sertifikasi",
    color: "from-orange-500 to-orange-600"
  }
];

const processSteps = [
  {
    step: "01",
    title: "Konsultasi Gratis",
    desc: "Survey lokasi & diskusi kebutuhan dengan tim ahli",
    icon: Phone
  },
  {
    step: "02",
    title: "Desain & RAB",
    desc: "Presentasi 3D & detail anggaran biaya transparan",
    icon: Ruler
  },
  {
    step: "03",
    title: "Eksekusi",
    desc: "Pengerjaan profesional dengan project manager",
    icon: Hammer
  },
  {
    step: "04",
    title: "Handover",
    desc: "QC ketat & garansi resmi untuk kenyamanan Anda",
    icon: BadgeCheck
  }
];

// Components
const PriceTag = ({ price, originalPrice }: { price: number; originalPrice?: number }) => (
  <div className="flex flex-col">
    {originalPrice && (
      <span className="text-sm text-gray-400 line-through mb-1">
        Rp {originalPrice.toLocaleString('id-ID')}
      </span>
    )}
    <span className="text-2xl md:text-3xl font-bold text-gray-900">
      Rp {(price / 1000000).toFixed(0)}jt
    </span>
    <span className="text-xs text-gray-500">mulai dari</span>
  </div>
);

const PackageCard = ({ pkg, index }: { pkg: RenovasiPackage; index: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={`group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 ${
        pkg.popular ? 'ring-2 ring-[#C6A969] ring-offset-4' : ''
      }`}
    >
      {/* Badge */}
      {pkg.badge && (
        <div className={`absolute top-4 left-4 z-20 px-4 py-1.5 rounded-full text-xs font-bold text-white ${
          pkg.popular 
            ? "bg-gradient-to-r from-[#C6A969] to-[#B59855]" 
            : "bg-gray-900"
        }`}>
          {pkg.badge}
        </div>
      )}

      {/* Image */}
      <div className="relative h-56 md:h-64 overflow-hidden">
        <Image
          src={pkg.image}
          alt={pkg.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Duration Badge */}
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2 text-sm font-medium text-gray-800">
          <Clock size={14} />
          {pkg.duration}
        </div>

        {/* Category */}
        <div className="absolute bottom-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium text-white capitalize ${
            pkg.category === "interior" ? "bg-blue-500" :
            pkg.category === "exterior" ? "bg-green-500" :
            "bg-purple-500"
          }`}>
            {pkg.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
        <p className="text-gray-600 text-sm mb-6 line-clamp-2">{pkg.subtitle}</p>

        {/* Price */}
        <div className="flex items-end justify-between mb-6 pb-6 border-b border-gray-100">
          <PriceTag price={pkg.price} originalPrice={pkg.originalPrice} />
          {pkg.originalPrice && (
            <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-bold">
              Hemat {Math.round((1 - pkg.price/pkg.originalPrice) * 100)}%
            </span>
          )}
        </div>

        {/* Scope Preview */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#C6A969]" />
            Scope Pekerjaan:
          </h4>
          <ul className="space-y-2">
            {pkg.scope.slice(0, isExpanded ? pkg.scope.length : 3).map((item, idx) => (
              <motion.li 
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-start gap-3 text-sm text-gray-600"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#C6A969] mt-2 flex-shrink-0" />
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
          {pkg.scope.length > 3 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-3 text-sm font-medium text-[#C6A969] hover:text-[#B59855] flex items-center gap-1 transition-colors"
            >
              {isExpanded ? (
                <>Lebih sedikit <ChevronUp size={16} /></>
              ) : (
                <>Lihat semua {pkg.scope.length} item <ChevronDown size={16} /></>
              )}
            </button>
          )}
        </div>

        {/* Features Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {pkg.features.slice(0, 2).map((feature, idx) => (
            <span 
              key={idx}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
            >
              {feature}
            </span>
          ))}
          {pkg.features.length > 2 && (
            <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-medium">
              +{pkg.features.length - 2} lainnya
            </span>
          )}
        </div>

        {/* CTA */}
        <Link href={`/renovasi/${pkg.id}`}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
              pkg.popular
                ? "bg-black text-white hover:bg-gray-800 shadow-lg shadow-black/20"
                : "bg-gray-100 text-gray-900 hover:bg-gray-200"
            }`}
          >
            <span>Konsultasi Sekarang</span>
            <ArrowRight size={18} />
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
};

const HeroSection = () => (
  <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
    {/* Background Pattern */}
    <div className="absolute inset-0 opacity-30">
      <div className="absolute inset-0" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(198,169,105,0.3) 1px, transparent 0)`,
        backgroundSize: '48px 48px'
      }} />
    </div>

    {/* Decorative Elements */}
    <motion.div
      animate={{ y: [0, -30, 0], rotate: [0, 5, 0] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-20 left-10 w-32 h-32 bg-[#C6A969]/20 rounded-full blur-3xl"
    />
    <motion.div
      animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      className="absolute bottom-20 right-20 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl"
    />

    <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-[#C6A969] text-sm font-medium mb-6 border border-white/20">
            <Sparkles size={16} />
            <span>Layanan Professional 2024</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            Renovasi Rumah{" "}
            <span className="bg-gradient-to-r from-[#C6A969] via-yellow-200 to-[#C6A969] bg-clip-text text-transparent">
              Tanpa Ribet
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl leading-relaxed">
            Dari konsep hingga handover, kami menangani semua. 
            Garansi 5 tahun, timeline jelas, dan tim ahli berpengalaman.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link href="#paket">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-[#C6A969] hover:bg-[#B59855] text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <span>Lihat Paket</span>
                <ArrowRight size={20} />
              </motion.button>
            </Link>
            <Link href="https://wa.me/6281234567890">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors border border-white/20 backdrop-blur-sm"
              >
                <Phone size={20} />
                <span>Hubungi Kami</span>
              </motion.button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center"
              >
                <stat.icon className="w-6 h-6 text-[#C6A969] mx-auto mb-2" />
                <div className="text-xl md:text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Content - Image Grid */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative hidden lg:block"
        >
          <div className="relative h-[600px]">
            {/* Main Image */}
            <div className="absolute top-0 right-0 w-80 h-96 rounded-3xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <Image
                src="/cat-interior.png"
                alt="Renovasi Interior"
                fill
                className="object-cover"
              />
            </div>
            {/* Secondary Image */}
            <div className="absolute bottom-0 left-0 w-72 h-80 rounded-3xl overflow-hidden shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500">
              <Image
                src="/cat-exterior.png"
                alt="Renovasi Dapur"
                fill
                className="object-cover"
              />
            </div>
            {/* Floating Card */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-4 shadow-2xl z-10"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <BadgeCheck className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">500+ Proyek</div>
                  <div className="text-sm text-gray-500">Selesai Tepat Waktu</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

const WhyChooseSection = () => (
  <section className="py-20 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
        >
          Mengapa Memilih Kami?
        </motion.h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Kami mengutamakan kualitas, transparansi, dan kepuasan klien dalam setiap proyek
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {whyChooseUs.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
          >
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <item.icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
            <p className="text-gray-600 leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const ProcessSection = () => (
  <section className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Proses Kerja Simpel
        </h2>
        <p className="text-gray-600">4 langkah mudah mewujudkan hunian impian Anda</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {processSteps.map((step, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="relative"
          >
            <div className="bg-gray-50 rounded-3xl p-8 h-full hover:bg-gray-100 transition-colors">
              <div className="text-5xl font-bold text-gray-200 mb-4">{step.step}</div>
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mb-4">
                <step.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600 text-sm">{step.desc}</p>
            </div>
            {idx < 3 && (
              <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                <ArrowRight className="w-6 h-6 text-gray-300" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const PackagesSection = () => {
  const [filter, setFilter] = useState<"all" | "interior" | "exterior" | "full">("all");

  const filteredPackages = filter === "all" 
    ? renovasiPackages 
    : renovasiPackages.filter(p => p.category === filter);

  return (
    <section id="paket" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Pilih Paket Renovasi
          </h2>
          <p className="text-gray-600 mb-8">Solusi lengkap untuk setiap kebutuhan ruang Anda</p>

          {/* Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { id: "all", label: "Semua Paket", icon: Home },
              { id: "interior", label: "Interior", icon: Paintbrush },
              { id: "exterior", label: "Eksterior", icon: Hammer },
              { id: "full", label: "Total Renovasi", icon: TrendingUp },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                  filter === cat.id
                    ? "bg-black text-white shadow-lg"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                <cat.icon size={18} />
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <motion.div 
          layout
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredPackages.map((pkg, index) => (
              <PackageCard key={pkg.id} pkg={pkg} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

const TestimonialSection = () => (
  <section className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Apa Kata Klien Kami?
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            name: "Budi Santoso",
            role: "Renovasi Dapur",
            text: "Proses sangat profesional, dari desain hingga finishing. Dapur saya kini jadi favorit keluarga!",
            rating: 5
          },
          {
            name: "Dewi Lestari",
            role: "Renovasi Total",
            text: "Tim sangat komunikatif dan tepat waktu. Hasil melebihi ekspektasi dengan budget yang transparan.",
            rating: 5
          },
          {
            name: "Ahmad Rizki",
            role: "Renovasi Kamar",
            text: "7 hari kerja sesuai janji. Kualitas material premium dan pengerjaan rapi. Highly recommended!",
            rating: 5
          }
        ].map((testi, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="bg-gray-50 rounded-3xl p-8 hover:shadow-xl transition-shadow"
          >
            <div className="flex gap-1 mb-4">
              {[...Array(testi.rating)].map((_, i) => (
                <Sparkles key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <p className="text-gray-700 mb-6 leading-relaxed">"{testi.text}"</p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#C6A969] to-[#B59855] rounded-full flex items-center justify-center text-white font-bold">
                {testi.name[0]}
              </div>
              <div>
                <div className="font-bold text-gray-900">{testi.name}</div>
                <div className="text-sm text-gray-500">{testi.role}</div>
              </div>
            </div>
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
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C6A969]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Siap Renovasi Rumah Anda?
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Dapatkan konsultasi GRATIS dan desain 3D preview. 
            Promo diskon 15% untuk booking bulan ini.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/custom-interior">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-[#C6A969] hover:bg-[#B59855] text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <Calendar size={20} />
                Jadwalkan Survey
              </motion.button>
            </Link>
            <Link href="https://wa.me/6281234567890">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors border border-white/20"
              >
                <Phone size={20} />
                Chat WhatsApp
              </motion.button>
            </Link>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500">
            <Shield size={16} />
            <span>Garansi 5 tahun • Respons 1 jam • RAB Transparan</span>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

// Main Page
export default function RenovasiPage() {
  return (
    <main className="min-h-screen bg-white">
      <HeroSection />
      <WhyChooseSection />
      <ProcessSection />
      <PackagesSection />
      <TestimonialSection />
      <CTASection />
    </main>
  );
}