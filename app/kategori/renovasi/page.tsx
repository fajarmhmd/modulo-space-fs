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
  Sparkles,
  Star,
  MapPin,
  X,
  User,
  MessageSquare,
  Send,
  Loader2,
  CheckCircle,
  CalendarDays,
  Clock3,
  HomeIcon,
  ClipboardList,
  Mail,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhyUsSection from "@/components/why-us-section";
import OrderFlowSection from "@/components/OrderFlowSection";

// ─── Config ────────────────────────────────────────────────────
const WA_NUMBER = "6289509478009";
const WA_LINK = `https://wa.me/${WA_NUMBER}`;

// ─── Helpers ───────────────────────────────────────────────────
function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID").format(n);
}

// ─── Types ──────────────────────────────────────────────────────
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

// ─── Data ───────────────────────────────────────────────────────
const renovasiPackages: RenovasiPackage[] = [
  {
    id: "renovasi-dapur",
    name: "Renovasi Dapur",
    subtitle: "Wujudkan dapur lebih modern, rapi, dan nyaman dengan material tahan lembab serta pengerjaan profesional.",
    price: 1599000,
    originalPrice: 2250000,
    duration: "10–14 hari",
    category: "interior",
    image: "/renovasi-dapur.png",
    badge: "Best Seller",
    popular: true,
    scope: [
      "Survey & pengukuran area dapur",
      "Pembongkaran area lama (jika diperlukan)",
      "Perapihan dinding & lantai",
      "Finishing backsplash & countertop",
      "Pengecekan akhir & serah terima",
    ],
    features: [
      "Material Tahan Lembab",
      "Hardware Berkualitas",
      "Finishing Rapi",
      "Konsultasi Gratis",
    ],
  },
  {
    id: "renovasi-kamar-tidur",
    name: "Renovasi Kamar Tidur",
    subtitle: "Ciptakan kamar tidur nyaman, elegan, dan fungsional dengan wardrobe custom serta pencahayaan modern.",
    price: 1599000,
    originalPrice: 2500000,
    duration: "7–10 hari",
    category: "interior",
    image: "/renovasi-kamar.png",
    scope: [
      "Survey & pengukuran area kamar",
      "Desain ulang layout ruangan",
      "Panel dinding dekoratif",
      "Instalasi lighting system",
      "Finishing & final checking",
    ],
    features: [
      "Hidden Lighting Modern",
      "Custom Storage System",
      "Finishing Rapi",
      "Soft Closing Hardware",
    ],
  },
  {
    id: "renovasi-ruang-tamu",
    name: "Renovasi Ruang Tamu",
    subtitle: "Wujudkan ruang tamu elegan dan nyaman dengan backdrop TV custom serta plafon modern berkelas.",
    price: 1749000,
    originalPrice: 2900000,
    duration: "6–9 hari",
    category: "interior",
    image: "/renovasi-ruangtamu.png",
    badge: "Hemat 15%",
    scope: [
      "Survey & pengukuran area ruang tamu",
      "Pengecatan dinding & finishing detail",
      "Instalasi lighting system",
      "Pembuatan plafon PVC modern",
      "Final checking & serah terima",
    ],
    features: [
      "Backdrop dengan storage",
      "Plafon drop ceiling",
      "Warm white lighting",
      "Wall panel accent",
    ],
  },
  {
    id: "renovasi-kamar-mandi",
    name: "Renovasi Kamar Mandi",
    subtitle: "Wujudkan kamar mandi bersih, modern, dan nyaman dengan sistem waterproofing serta sanitary berkualitas.",
    price: 1749000,
    originalPrice: 2650000,
    duration: "8–12 hari",
    category: "interior",
    image: "/renovasi-kamarmandi.png",
    scope: [
      "Survey & pengecekan area kamar mandi",
      "Pembongkaran keramik lama (jika diperlukan)",
      "Instalasi pipa & floor drain",
      "Pemasangan keramik dinding/lantai",
      "Final checking & serah terima",
    ],
    features: [
      "Waterproofing Premium",
      "Keramik 60x60 Premium",
      "Keramik Modern",
      "Finishing Rapi",
      "Garansi Pekerjaan",
    ],
  },
  {
    id: "renovasi-total-rumah",
    name: "Renovasi Total Rumah",
    subtitle: "Solusi renovasi rumah menyeluruh dari desain hingga finishing untuk hunian lebih nyaman, modern, dan bernilai tinggi.",
    price: 2449000,
    originalPrice: 3700000,
    duration: "4–6 minggu",
    category: "full",
    image: "/renovasi-rumah.png",
    badge: "All In One",
    popular: true,
    scope: [
      "Survey & konsultasi kebutuhan",
      "Desain konsep & perencanaan ruang",
      "Renovasi multi area / multi ruangan",
      "Pekerjaan sipil, plafon, lantai & finishing",
      "Instalasi listrik & plumbing",
      "Final checking & serah terima",
    ],
    features: [
      "Progress Update Berkala",
      "Penjadwalan Kerja Terstruktur",
      "Tim Profesional Berpengalaman",
      "Material Berkualitas",
      "Pengerjaan Bertahap",
    ],
  },
];

const stats = [
  { value: "50+", label: "Proyek Selesai", icon: Home },
  { value: "99%", label: "Kepuasan Klien", icon: BadgeCheck },
  { value: "3 - 12 Bulan", label: "Garansi", icon: Shield },
  { value: "14 Hari", label: "Estimasi Renovasi Cepat", icon: Zap },
];

const whyChooseUs = [
  {
    icon: Clock,
    title: "Tepat Waktu",
    desc: "Komitmen timeline jelas dengan daily progress report tanpa delay",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: Shield,
    title: "Garansi Resmi",
    desc: "Garansi pekerjaan hingga 5 tahun & material original bersertifikat",
    color: "from-emerald-500 to-green-600",
  },
  {
    icon: Wallet,
    title: "Harga Transparan",
    desc: "RAB detail tanpa hidden cost, pembayaran bertahap sesuai progress",
    color: "from-violet-500 to-purple-600",
  },
  {
    icon: Users,
    title: "Tim Berpengalaman",
    desc: "Tukang ahli 10+ tahun, berpengalaman di wilayah Bogor & Jabodetabek",
    color: "from-orange-500 to-rose-500",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Konsultasi Gratis",
    desc: "Survey lokasi & diskusi kebutuhan langsung di rumah Anda",
    icon: Phone,
  },
  {
    step: "02",
    title: "Desain & RAB",
    desc: "Presentasi 3D & detail anggaran biaya transparan",
    icon: Ruler,
  },
  {
    step: "03",
    title: "Eksekusi",
    desc: "Pengerjaan profesional dengan project manager dedicated",
    icon: Hammer,
  },
  {
    step: "04",
    title: "Handover",
    desc: "QC ketat & garansi resmi untuk kenyamanan Anda",
    icon: BadgeCheck,
  },
];

// ─── Animation Variants ─────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

// ─── SurveyModal Component ──────────────────────────────────────
function SurveyModal({
  isOpen,
  onClose,
  selectedPackage,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage?: RenovasiPackage;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [surveyForm, setSurveyForm] = useState({
    nama: "",
    whatsapp: "",
    alamat: "",
    tanggal: "",
    waktu: "",
    luasBangunan: "",
    catatan: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSurveyForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSurveySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const packageInfo = selectedPackage
      ? `*Paket:* ${selectedPackage.name} (Rp ${formatRupiah(selectedPackage.price)}/m²)%0A`
      : "";

    const message =
      `*JADWAL SURVEY BARU* 📋%0A%0A` +
      packageInfo +
      `*Nama:* ${surveyForm.nama}%0A` +
      `*WhatsApp:* ${surveyForm.whatsapp}%0A` +
      `*Alamat:* ${surveyForm.alamat}%0A` +
      `*Tanggal Survey:* ${surveyForm.tanggal}%0A` +
      `*Waktu Survey:* ${surveyForm.waktu}%0A` +
      `*Luas Bangunan:* ${surveyForm.luasBangunan || "-"}%0A%0A` +
      `*Catatan Tambahan:*%0A${surveyForm.catatan || "-"}%0A%0A` +
      `Mohon konfirmasi jadwal survey saya. Terima kasih.`;

    window.open(`https://wa.me/${WA_NUMBER}?text=${message}`, "_blank");

    setIsLoading(false);
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
      setSurveyForm({
        nama: "",
        whatsapp: "",
        alamat: "",
        tanggal: "",
        waktu: "",
        luasBangunan: "",
        catatan: "",
      });
      onClose();
    }, 2000);
  };

  const waktuOptions = [
    "08:00 - 10:00",
    "10:00 - 12:00",
    "13:00 - 15:00",
    "15:00 - 17:00",
    "17:00 - 19:00",
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
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
                      className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30"
                    >
                      <CalendarDays className="w-7 h-7 text-white" />
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        Jadwalkan Survey
                      </h3>
                      <p className="text-sm text-slate-500">
                        {selectedPackage
                          ? selectedPackage.name
                          : "Renovasi Rumah"}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-600" />
                  </motion.button>
                </div>

                <form className="space-y-5" onSubmit={handleSurveySubmit}>
                  {/* Nama */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Nama Lengkap *
                    </label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                      <input
                        type="text"
                        name="nama"
                        value={surveyForm.nama}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-0 focus:border-emerald-500 outline-none transition-all text-slate-900 placeholder:text-slate-400 text-sm sm:text-base"
                        placeholder="Masukkan nama lengkap"
                        required
                      />
                    </div>
                  </motion.div>

                  {/* WhatsApp - numeric only */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Nomor WhatsApp *
                    </label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                      <input
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        name="whatsapp"
                        value={surveyForm.whatsapp}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-0 focus:border-emerald-500 outline-none transition-all text-slate-900 placeholder:text-slate-400 text-sm sm:text-base"
                        placeholder="08xxxxxxxxxx"
                        required
                      />
                    </div>
                  </motion.div>

                  {/* Alamat */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Alamat Lengkap Proyek *
                    </label>
                    <div className="relative group">
                      <MapPin className="absolute left-4 top-4 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                      <textarea
                        name="alamat"
                        value={surveyForm.alamat}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-0 focus:border-emerald-500 outline-none transition-all resize-none h-20 text-slate-900 placeholder:text-slate-400 text-sm sm:text-base"
                        placeholder="Alamat lengkap lokasi renovasi..."
                        required
                      />
                    </div>
                  </motion.div>

                  {/* Tanggal & Waktu */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 }}
                    >
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Tanggal Survey *
                      </label>
                      <div className="relative group">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                        <input
                          type="date"
                          name="tanggal"
                          value={surveyForm.tanggal}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-0 focus:border-emerald-500 outline-none transition-all text-slate-900 text-sm sm:text-base"
                          required
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Waktu Survey *
                      </label>
                      <div className="relative group">
                        <Clock3 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                        <select
                          name="waktu"
                          value={surveyForm.waktu}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-0 focus:border-emerald-500 outline-none transition-all text-slate-900 text-sm sm:text-base appearance-none"
                          required
                        >
                          <option value="">Pilih waktu</option>
                          {waktuOptions.map((w) => (
                            <option key={w} value={w}>
                              {w} WIB
                            </option>
                          ))}
                        </select>
                      </div>
                    </motion.div>
                  </div>

                  {/* Luas Bangunan */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Luas Bangunan (m²)
                    </label>
                    <div className="relative group">
                      <HomeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        name="luasBangunan"
                        value={surveyForm.luasBangunan}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-0 focus:border-emerald-500 outline-none transition-all text-slate-900 placeholder:text-slate-400 text-sm sm:text-base"
                        placeholder="Contoh: 120"
                      />
                    </div>
                  </motion.div>

                  {/* Catatan */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Catatan / Keperluan Khusus
                    </label>
                    <div className="relative group">
                      <ClipboardList className="absolute left-4 top-4 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                      <textarea
                        name="catatan"
                        value={surveyForm.catatan}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-0 focus:border-emerald-500 outline-none transition-all resize-none h-24 text-slate-900 placeholder:text-slate-400 text-sm sm:text-base"
                        placeholder="Jelaskan kebutuhan khusus atau pertanyaan Anda..."
                      />
                    </div>
                  </motion.div>

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 disabled:opacity-70 text-sm sm:text-base"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Kirim & Jadwalkan Survey
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
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Berhasil!
                </h3>
                <p className="text-slate-500">
                  Jadwal survey Anda telah dikirim ke WhatsApp.
                </p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Chat WhatsApp Helper ───────────────────────────────────────
function openWhatsApp(pkg?: RenovasiPackage) {
  const packageInfo = pkg
    ? `Saya tertarik dengan paket *${pkg.name}* (mulai Rp ${formatRupiah(pkg.price)}). `
    : "Saya ingin konsultasi renovasi rumah. ";

  const message = encodeURIComponent(
    `Halo, ${packageInfo}Bisa bantu info lebih lanjut?`
  );

  window.open(`${WA_LINK}?text=${message}`, "_blank");
}

// ─── PackageCard ────────────────────────────────────────────────
const PackageCard = ({
  pkg,
  index,
  onSurvey,
}: {
  pkg: RenovasiPackage;
  index: number;
  onSurvey: (pkg: RenovasiPackage) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const categoryColor =
    pkg.category === "interior"
      ? "bg-blue-500"
      : pkg.category === "exterior"
      ? "bg-emerald-500"
      : "bg-violet-500";

  return (
    <motion.div variants={cardVariants} layout>
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`bg-white rounded-2xl sm:rounded-3xl border shadow-lg shadow-slate-200/60 hover:shadow-xl hover:shadow-blue-200/25 transition-shadow duration-500 overflow-hidden flex flex-col h-full group ${
          pkg.popular
            ? "border-[#C6A969] ring-2 ring-[#C6A969]/25"
            : "border-slate-100"
        }`}
      >
        {/* Image */}
        <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-100 flex-shrink-0">
          <motion.div
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.6 }}
            className="w-full h-full"
          >
            <Image
              src={pkg.image}
              alt={pkg.name}
              fill
              className="object-cover"
            />
          </motion.div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {pkg.badge && (
            <div
              className={`absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-xs font-bold text-white shadow-md ${
                pkg.popular
                  ? "bg-gradient-to-r from-[#C6A969] to-[#B59855]"
                  : "bg-slate-900"
              }`}
            >
              {pkg.badge}
            </div>
          )}

          <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1.5 text-xs font-semibold text-gray-800 shadow">
            <Clock size={11} />
            {pkg.duration}
          </div>

          <div className="absolute bottom-3 left-3">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold text-white capitalize ${categoryColor}`}
            >
              {pkg.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 flex flex-col flex-1">
          <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-snug mb-1.5 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
            {pkg.name}
          </h3>
          <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed">
            {pkg.subtitle}
          </p>

          {/* Price */}
          <div className="mb-4">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Rp {formatRupiah(pkg.price)}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                mulai dari
              </span>
            </div>
            {pkg.originalPrice && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400 line-through">
                  Rp {formatRupiah(pkg.originalPrice)}
                </span>
              </div>
            )}
          </div>

          {/* Gratis Design 3D & Survey */}
          <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-blue-50 rounded-xl border border-blue-100">
            <Sparkles
              size={14}
              className="text-blue-600 flex-shrink-0"
            />
            <span className="text-xs sm:text-sm text-blue-700 font-semibold">
              Gratis Design 3D & Survey Lokasi
            </span>
          </div>

          {/* Scope pekerjaan */}
          <div className="mb-4 flex-1">
            <h4 className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-[#C6A969]" />
              Scope Pekerjaan:
            </h4>
            <ul className="space-y-1.5">
              {pkg.scope
                .slice(0, isExpanded ? pkg.scope.length : 3)
                .map((item, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="flex items-start gap-2 text-xs text-slate-600"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C6A969] mt-1.5 flex-shrink-0" />
                    <span>{item}</span>
                  </motion.li>
                ))}
            </ul>
            {pkg.scope.length > 3 && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setIsExpanded(!isExpanded);
                }}
                className="mt-2 text-xs font-semibold text-[#C6A969] hover:text-[#B59855] flex items-center gap-1 transition-colors"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp size={13} /> Lebih sedikit
                  </>
                ) : (
                  <>
                    <ChevronDown size={13} /> Lihat {pkg.scope.length} item
                  </>
                )}
              </button>
            )}
          </div>

          {/* Feature tags */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {pkg.features.slice(0, 2).map((f, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium"
              >
                {f}
              </span>
            ))}
            {pkg.features.length > 2 && (
              <span className="px-2.5 py-1 bg-slate-100 text-slate-400 rounded-full text-xs font-medium">
                +{pkg.features.length - 2} lainnya
              </span>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="mt-auto flex flex-col gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => openWhatsApp(pkg)}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 group-hover:shadow-blue-600/30 transition-all duration-300 cursor-pointer"
            >
              Konsultasi Sekarang
              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-1"
              />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSurvey(pkg)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 hover:bg-slate-100 transition-all duration-200 cursor-pointer"
            >
              <Calendar size={13} className="text-[#C6A969]" />
              Jadwalkan Survey Gratis
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── HeroSection ────────────────────────────────────────────────
const HeroSection = () => (
  <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
    <div
      className="absolute inset-0 opacity-20"
      style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(198,169,105,0.4) 1px, transparent 0)`,
        backgroundSize: "44px 44px",
      }}
    />

    <motion.div
      animate={{ y: [0, -25, 0], scale: [1, 1.1, 1] }}
      transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-16 left-12 w-72 h-72 bg-[#C6A969]/15 rounded-full blur-3xl pointer-events-none"
    />
    <motion.div
      animate={{ y: [0, 20, 0], scale: [1, 1.05, 1] }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      className="absolute bottom-16 right-16 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"
    />

    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-42 pb-20">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight">
            Renovasi Rumah{" "}
            <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
              Impian Anda
            </span>{" "}
            Dimulai Di Sini
          </h1>

          <p className="text-base md:text-lg text-slate-300 mb-8 max-w-lg leading-relaxed">
            Dari konsep hingga handover, kami tangani semua. Garansi Hingga 1
            tahun, timeline transparan, tim berpengalaman di wilayah Bogor &
            Jabodetabek.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-12">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => openWhatsApp()}
              className="px-7 py-4 bg-gradient-to-r from-[#C6A969] to-[#B59855] text-slate-900 font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#C6A969]/25 cursor-pointer text-sm"
            >
              <Phone size={18} />
              Chat WhatsApp
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                const el = document.getElementById("paket");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-7 py-4 bg-white/10 hover:bg-white/18 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all border border-white/20 backdrop-blur-sm cursor-pointer text-sm"
            >
              <Calendar size={18} />
              Lihat Paket Renovasi
            </motion.button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="bg-white/6 backdrop-blur-sm border border-white/10 rounded-2xl p-3.5 text-center hover:bg-white/10 transition-colors"
              >
                <stat.icon className="w-5 h-5 text-[#C6A969] mx-auto mb-1.5" />
                <div className="text-lg md:text-xl font-extrabold text-white">
                  {stat.value}
                </div>
                <div className="text-xs text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="relative hidden lg:block"
        >
          <div className="relative h-[580px]">
            <div className="absolute top-0 right-0 w-72 h-88 rounded-3xl overflow-hidden shadow-2xl shadow-black/40 transform rotate-2 hover:rotate-0 transition-transform duration-700">
              <Image
                src="/cat-interior.png"
                alt="Renovasi Interior"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 w-64 h-72 rounded-3xl overflow-hidden shadow-2xl shadow-black/40 transform -rotate-2 hover:rotate-0 transition-transform duration-700">
              <Image
                src="/cat-exterior.png"
                alt="Renovasi Eksterior"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>

            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-sm rounded-2xl px-5 py-4 shadow-2xl z-10 border border-white/60"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                  <BadgeCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-extrabold text-slate-900 text-sm">
                    Design & RAB
                  </div>
                  <div className="text-xs text-slate-500">Gratis</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

// ─── WhyChooseSection ───────────────────────────────────────────
const WhyChooseSection = () => (
  <section className="py-20 bg-slate-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-xs font-bold tracking-widest text-[#C6A969] uppercase mb-3">
            Keunggulan Kami
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
            Mengapa Memilih Kami?
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto leading-relaxed">
            Kami mengutamakan kualitas, transparansi, dan kepuasan klien di
            setiap proyek
          </p>
        </motion.div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {whyChooseUs.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: idx * 0.1,
              type: "spring",
              stiffness: 100,
              damping: 15,
            }}
            whileHover={{ y: -6 }}
            className="group bg-white rounded-2xl sm:rounded-3xl p-7 shadow-md shadow-slate-200/60 hover:shadow-xl hover:shadow-blue-100/40 transition-all duration-300 border border-slate-100"
          >
            <div
              className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
            >
              <item.icon className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 mb-2">
              {item.title}
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              {item.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// ─── ProcessSection ─────────────────────────────────────────────
const ProcessSection = () => (
  <section className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-xs font-bold tracking-widest text-[#C6A969] uppercase mb-3">
            Cara Kerja
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
            4 Langkah Mudah
          </h2>
          <p className="text-slate-500">
            Wujudkan hunian impian Anda bersama kami
          </p>
        </motion.div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {processSteps.map((step, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.12 }}
            className="relative"
          >
            <div className="bg-slate-50 rounded-2xl sm:rounded-3xl p-7 h-full hover:bg-slate-100 transition-colors border border-slate-100 group">
              <div className="text-5xl font-black text-slate-200 mb-4 leading-none">
                {step.step}
              </div>
              <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-md shadow-blue-600/20">
                <step.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 mb-2">
                {step.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                {step.desc}
              </p>
            </div>
            {idx < 3 && (
              <div className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 z-10">
                <ArrowRight className="w-5 h-5 text-slate-300" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// ─── PackagesSection ────────────────────────────────────────────
const PackagesSection = ({
  onSurvey,
}: {
  onSurvey: (pkg: RenovasiPackage) => void;
}) => {
  const [filter, setFilter] = useState<"all" | "interior" | "exterior" | "full">(
    "all"
  );

  const filteredPackages =
    filter === "all"
      ? renovasiPackages
      : renovasiPackages.filter((p) => p.category === filter);

  const filterOptions = [
    { id: "all", label: "Semua Paket", icon: Home },
    { id: "interior", label: "Interior", icon: Paintbrush },
    { id: "full", label: "Total Renovasi", icon: TrendingUp },
  ];

  return (
    <section id="paket" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs font-bold tracking-widest text-[#C6A969] uppercase mb-3">
              Paket Renovasi
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
              Pilih Paket Sesuai Kebutuhan
            </h2>
            <p className="text-slate-500 mb-8 max-w-xl mx-auto">
              Harga kompetitif untuk wilayah Bogor & Jabodetabek, garansi
              kualitas terjamin
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-2"
          >
            {filterOptions.map((cat) => (
              <motion.button
                key={cat.id}
                onClick={() => setFilter(cat.id as any)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  filter === cat.id
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <cat.icon size={15} />
                {cat.label}
              </motion.button>
            ))}
          </motion.div>
        </div>

        <AnimatePresence mode="popLayout">
          <motion.div
            key={filter}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7"
          >
            {filteredPackages.map((pkg, index) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                index={index}
                onSurvey={onSurvey}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

// ─── CTASection ─────────────────────────────────────────────────
const CTASection = () => (
  <section className="py-20 bg-white">
    <div className="max-w-5xl mx-auto px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 100, damping: 18 }}
        className="relative rounded-3xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900" />
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(198,169,105,0.5) 1px, transparent 0)`,
            backgroundSize: "36px 36px",
          }}
        />
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#C6A969]/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="relative z-10 p-8 md:p-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#C6A969]/15 border border-[#C6A969]/30 rounded-full text-[#C6A969] text-sm font-semibold mb-6">
            <Sparkles size={14} />
            Promo Bulan Ini — Diskon 15%
          </div>

          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-5 leading-tight">
            Siap Mulai Renovasi
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
              Rumah Impian Anda?
            </span>
          </h2>

          <p className="text-slate-400 text-base md:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Dapatkan konsultasi GRATIS, desain 3D preview, dan survey lokasi
            langsung ke rumah Anda di wilayah Bogor & Jabodetabek.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openWhatsApp()}
              className="px-8 py-4 bg-gradient-to-r from-[#C6A969] to-[#B59855] hover:from-[#d4b87a] hover:to-[#C6A969] text-slate-900 font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#C6A969]/20 text-sm cursor-pointer"
            >
              <Phone size={18} />
              Chat WhatsApp Sekarang
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const el = document.getElementById("paket");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-8 py-4 bg-white/10 hover:bg-white/18 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all border border-white/20 text-sm cursor-pointer"
            >
              <Calendar size={18} />
              Lihat Paket & Jadwalkan Survey
            </motion.button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Shield size={13} className="text-[#C6A969]" /> Garansi Hingga 1
              Tahun
            </span>
            <span className="flex items-center gap-1.5">
              <Zap size={13} className="text-[#C6A969]" /> Respons &lt; 1 Jam
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={13} className="text-[#C6A969]" /> Bogor &
              Jabodetabek
            </span>
            <span className="flex items-center gap-1.5">
              <BadgeCheck size={13} className="text-[#C6A969]" /> RAB
              Transparan
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

// ─── Main Page ──────────────────────────────────────────────────
export default function RenovasiPage() {
  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<
    RenovasiPackage | undefined
  >(undefined);

  const handleSurvey = (pkg?: RenovasiPackage) => {
    setSelectedPackage(pkg);
    setIsSurveyModalOpen(true);
  };

  const handleCloseSurveyModal = () => {
    setIsSurveyModalOpen(false);
    setSelectedPackage(undefined);
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <PackagesSection onSurvey={handleSurvey} />
      <OrderFlowSection />
      <WhyUsSection />
      <CTASection />
      <Footer />

      <SurveyModal
        isOpen={isSurveyModalOpen}
        onClose={handleCloseSurveyModal}
        selectedPackage={selectedPackage}
      />
    </main>
  );
}