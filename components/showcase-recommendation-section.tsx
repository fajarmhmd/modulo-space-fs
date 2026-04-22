// components/showcase-recommendation-section.tsx
// PERBAIKAN: Animasi modern, card clean, harga tercoret, responsive

"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ChevronLeft, 
  ChevronRight, 
  Truck, 
  Star, 
  ArrowRight, 
  ShieldCheck,
  X,
  User,
  Phone,
  MapPin,
  MessageSquare,
  Send,
  Loader2,
  CheckCircle,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID").format(n);
}

// Nomor WhatsApp tujuan
const WHATSAPP_NUMBER = "6289509478009";

const renovasi = {
  title: "Program Renovasi Hunian",
  subtitle:
    "Upgrade dapur, kamar, ruang tamu, dan area utama dengan sistem kerja profesional, material berkualitas.",
  price: 3799000,
  originalPrice: 4500000,
  image: "/cat-renovasi.png",
  bullets: [
    "Survey & pengukuran lokasi gratis",
    "RAB & timeline transparan",
    "Material standard / premium tersedia",
    "Quality control setiap tahap pengerjaan",
  ],
};

const products = [
  {
    id: "kitchenset-minibar",  
    name: "Kitchen Set Custom Minimalis Modern + Mini bar/island",
    image: "/kitchenset-minibar.png",
    size: "/ m²",
    price: 1999000,
    originalPrice: 2500000,
  },
  {
    id: "lemari-custom-1",
    name: "Lemari Pakaian Custom Built-in / Wardrobe Full Tinggi Plafon",
    image: "/lemari-samping.png",
    size: "/ m²",
    price: 1799000,
    originalPrice: 2300000,
  },
  {
    id: "railing-balkon-1",
    name: "Railing balkon aluminium / besi minimalis modern",
    image: "/railing-balkon1.png",
    size: "/ m²",
    price: 799000,
    originalPrice: 1500000,
  },
  {
    id: "pager-sliding-1",
    name: "Pager Sliding / Swing",
    image: "/pagar-sliding.png",
    size: "/ m²",
    price: 2100000,
    originalPrice: 2500000,
  },
  {
    id: "backdrop-tv-1",
    name: "Wall Backdrop TV Custom / Panel TV Wall Premium",
    image: "/wallback-drop.png",
    size: "/ m²",
    price: 2490000,
    originalPrice: 2900000,
  },
  {
    id: "nakas-1",
    name: "Nakas gantung / Bedside table floating custom",
    image: "/nakas-gantung.png",
    size: "/ m²",
    price: 599000,
    originalPrice: 950000,
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      duration: 0.6,
    },
  },
};

const cardHoverVariants = {
  rest: { y: 0, scale: 1 },
  hover: { 
    y: -12, 
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    }
  }
};

export default function ShowcaseRecommendationSection() {
  const [page, setPage] = useState(0);
  const [lock, setLock] = useState(false);
  const [perView, setPerView] = useState(1);
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const [consultForm, setConsultForm] = useState({
    nama: "",
    whatsapp: "",
    alamat: "",
    pesan: ""
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) setPerView(3);
      else if (window.innerWidth >= 768) setPerView(2);
      else setPerView(1);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const pages = Math.ceil(products.length / perView);

  const next = () => {
    if (lock) return;
    setLock(true);
    setPage((p) => (p + 1) % pages);
  };

  const prev = () => {
    if (lock) return;
    setLock(true);
    setPage((p) => (p - 1 + pages) % pages);
  };

  useEffect(() => {
    const t = setTimeout(() => setLock(false), 600);
    return () => clearTimeout(t);
  }, [page]);

  useEffect(() => {
    timer.current = setInterval(next, 5000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [pages]);

  const translate = `-${page * 100}%`;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setConsultForm(prev => ({ ...prev, [name]: value }));
  };

  const handleConsultSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const message = `*KONSULTASI & SURVEY BARU*%0A%0A` +
      `*Layanan:* Program Renovasi Hunian%0A` +
      `*Nama:* ${consultForm.nama}%0A` +
      `*WhatsApp:* ${consultForm.whatsapp}%0A` +
      `*Alamat:* ${consultForm.alamat}%0A%0A` +
      `*Pesan:*%0A${consultForm.pesan}%0A%0A` +
      `Mohon jadwalkan survey. Terima kasih.`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
    
    setIsLoading(false);
    setShowSuccess(true);
    
    setTimeout(() => {
      setIsConsultModalOpen(false);
      setShowSuccess(false);
      setConsultForm({ nama: "", whatsapp: "", alamat: "", pesan: "" });
    }, 2000);
  };

  return (
    <section className="w-full bg-gradient-to-b from-white via-slate-50/50 to-white py-16 sm:py-20 lg:py-28 relative overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-0 w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-3xl"
      />
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 left-0 w-[400px] h-[400px] bg-indigo-200/20 rounded-full blur-3xl"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ===== HEADER ===== */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 text-center"
        >
          <motion.div 
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-600 rounded-full text-xs sm:text-sm font-semibold tracking-wide uppercase mb-6 border border-blue-100"
          >
            <Sparkles size={16} className="text-blue-500" />
            Highlight Penawaran
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-slate-900 tracking-tight mb-5 leading-tight"
          >
            Rekomendasi <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Produk</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-slate-500 max-w-2xl mx-auto text-base sm:text-lg lg:text-xl leading-relaxed"
          >
            Temukan solusi terbaik untuk kebutuhan interior dan renovasi hunian Anda dengan kualitas premium.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {/* ===== RENOVASI CARD ===== */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="lg:col-span-1"
          >
            <motion.div
              variants={itemVariants}
              whileHover="hover"
              initial="rest"
              animate="rest"
              className="group rounded-3xl bg-white shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-blue-200/30 transition-shadow duration-500 flex flex-col overflow-hidden border border-slate-100 h-full"
            >
              <div className="relative h-56 sm:h-64 lg:h-72 overflow-hidden">
                <motion.div
                  variants={cardHoverVariants}
                  className="w-full h-full"
                >
                  <Image
                    src={renovasi.image}
                    alt="Renovasi"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="absolute top-5 left-5"
                >
                  <span className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold rounded-full shadow-lg shadow-blue-600/30">
                    BEST DEAL
                  </span>
                </motion.div>
              </div>

              <div className="p-6 sm:p-8 flex flex-col flex-1">
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3"
                >
                  Penawaran Renovasi
                </motion.div>

                <h3 className="font-bold text-xl sm:text-2xl text-slate-900 tracking-tight mb-3 leading-snug">
                  {renovasi.title}
                </h3>

                <p className="text-sm sm:text-base text-slate-500 leading-relaxed mb-6">
                  {renovasi.subtitle}
                </p>

                <div className="space-y-3 text-sm text-slate-600 mb-8">
                  {renovasi.bullets.map((b, i) => (
                    <motion.div 
                      key={b} 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + (i * 0.1) }}
                      className="flex gap-3 items-start"
                    >
                      <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <ShieldCheck size={14} className="text-blue-600" />
                      </div>
                      <span className="leading-relaxed">{b}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-auto">
                  <div className="mb-1">
                    <span className="text-xs text-slate-400 font-medium">Harga Normal</span>
                  </div>
                  <div className="text-lg text-slate-400 line-through mb-1">
                    Rp {formatRupiah(renovasi.originalPrice)}
                  </div>
                  
                  <div className="mb-1">
                    <span className="text-xs text-blue-600 font-semibold">Harga Promo</span>
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-1">
                    Rp {formatRupiah(renovasi.price)}
                  </div>
                  <div className="text-xs text-slate-400 mb-6">/m² - Termasuk material & jasa</div>

                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsConsultModalOpen(true)}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 group/btn text-sm sm:text-base"
                  >
                    Konsultasi & Survey
                    <ArrowRight size={18} className="transition-transform group-hover/btn:translate-x-1" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* ===== SLIDER ===== */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-2 overflow-hidden"
          >
            <div
              className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ transform: `translateX(${translate})` }}
            >
              {Array.from({ length: pages }).map((_, pageIndex) => (
                <div
                  key={pageIndex}
                  className="min-w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6"
                >
                  {products
                    .slice(pageIndex * perView, pageIndex * perView + perView)
                    .map((p, i) => (
                      <ProductCardV3 key={p.id} {...p} index={i} />
                    ))}
                </div>
              ))}
            </div>

            {/* Controls */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-between mt-8 sm:mt-10"
            >
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={prev}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white text-blue-600 border-2 border-blue-100 hover:border-blue-300 hover:bg-blue-50 flex items-center justify-center shadow-lg transition-all duration-300"
                >
                  <ChevronLeft size={24} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={next}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center shadow-lg shadow-blue-600/30 transition-all duration-300"
                >
                  <ChevronRight size={24} />
                </motion.button>
              </div>

              <div className="flex gap-2">
                {Array.from({ length: pages }).map((_, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.2 }}
                    onClick={() => setPage(i)}
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      i === page ? "w-10 bg-blue-600" : "w-2.5 bg-slate-300 hover:bg-slate-400"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* MODAL KONSULTASI & SURVEY */}
      <AnimatePresence>
        {isConsultModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md"
            onClick={() => setIsConsultModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {!showSuccess ? (
                <>
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.2 }}
                        className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30"
                      >
                        <MessageSquare className="w-7 h-7 text-white" />
                      </motion.div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">Konsultasi & Survey</h3>
                        <p className="text-sm text-slate-500">Program Renovasi Hunian</p>
                      </div>
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsConsultModalOpen(false)}
                      className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors"
                    >
                      <X className="w-5 h-5 text-slate-600" />
                    </motion.button>
                  </div>

                  <form className="space-y-5" onSubmit={handleConsultSubmit}>
                    {[
                      { name: "nama", label: "Nama Lengkap", icon: User, type: "text", placeholder: "Masukkan nama Anda" },
                      { name: "whatsapp", label: "Nomor WhatsApp", icon: Phone, type: "tel", placeholder: "08xxxxxxxxxx" },
                    ].map((field, i) => (
                      <motion.div
                        key={field.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * i }}
                      >
                        <label className="block text-sm font-semibold text-slate-700 mb-2">{field.label} *</label>
                        <div className="relative group">
                          <field.icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                          <input 
                            type={field.type}
                            name={field.name}
                            value={consultForm[field.name as keyof typeof consultForm]}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-0 focus:border-blue-500 outline-none transition-all text-slate-900 placeholder:text-slate-400 text-sm sm:text-base"
                            placeholder={field.placeholder}
                            required
                          />
                        </div>
                      </motion.div>
                    ))}

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Alamat Lengkap *</label>
                      <div className="relative group">
                        <MapPin className="absolute left-4 top-4 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        <textarea 
                          name="alamat"
                          value={consultForm.alamat}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-0 focus:border-blue-500 outline-none transition-all resize-none h-24 text-slate-900 placeholder:text-slate-400 text-sm sm:text-base"
                          placeholder="Masukkan alamat lengkap proyek..."
                          required
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Pesan / Keperluan *</label>
                      <textarea 
                        name="pesan"
                        value={consultForm.pesan}
                        onChange={handleInputChange}
                        className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-0 focus:border-blue-500 outline-none transition-all resize-none h-28 text-slate-900 placeholder:text-slate-400 text-sm sm:text-base"
                        placeholder="Jelaskan kebutuhan renovasi Anda..."
                        required
                      />
                    </motion.div>

                    <motion.button 
                      type="submit"
                      disabled={isLoading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 disabled:opacity-70 text-sm sm:text-base"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Mengirim...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Kirim ke WhatsApp
                        </>
                      )}
                    </motion.button>
                  </form>
                </>
              ) : (
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="text-center py-10"
                >
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5 }}
                    className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30"
                  >
                    <CheckCircle className="w-12 h-12 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Berhasil!</h3>
                  <p className="text-slate-500">Data Anda telah dikirim ke WhatsApp.</p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// Product Card V3 - Clean Design
function ProductCardV3({
  id,
  name,
  image,
  size,
  price,
  originalPrice,
  index,
}: {
  id: string;
  name: string;
  image: string;
  size: string;
  price: number;
  originalPrice: number;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ 
        delay: index * 0.1, 
        type: "spring",
        stiffness: 100,
        damping: 15 
      }}
    >
      <Link href={`/produk/${id}`} className="group block h-full">
        <motion.div
          whileHover={{ y: -8 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="bg-white rounded-2xl sm:rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-blue-200/20 transition-shadow duration-500 overflow-hidden flex flex-col h-full"
        >
          {/* Image Container - Clean, no badges */}
          <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-100">
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="w-full h-full"
            >
              <Image
                src={image}
                alt={name}
                fill
                className="object-cover"
              />
            </motion.div>
            
            {/* Subtle gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          {/* Content */}
          <div className="p-5 sm:p-6 flex flex-col flex-1">
            <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-snug mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
              {name}
            </h3>

            {/* Price Section */}
            <div className="mb-4">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Rp {formatRupiah(price)}
                </span>
                <span className="text-xs text-slate-400 font-medium">{size}</span>
              </div>
              <div className="text-sm text-slate-400 line-through">
                Rp {formatRupiah(originalPrice)} {size}
              </div>
            </div>

            {/* Gratis Ongkir Jabodetabek */}
            <div className="flex items-center gap-2 mb-5 px-3 py-2 bg-green-50 rounded-xl border border-green-100">
              <Truck size={16} className="text-green-600 flex-shrink-0" />
              <span className="text-xs sm:text-sm text-green-700 font-semibold">Gratis Ongkir Jabodetabek</span>
            </div>

            {/* Button */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-auto w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 group-hover:shadow-blue-600/30"
            >
              Lihat Detail
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </motion.div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}