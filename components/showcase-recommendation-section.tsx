// components/showcase-recommendation-section.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Truck,
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
  Sparkles,
  Home,
  Ruler,
  Calendar,
  Clock,
  ClipboardList,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID").format(n);
}

const WHATSAPP_NUMBER = "6289509478009";

// ─── Data ─────────────────────────────────────────────────────────────────────
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
    price: 2699000,
    originalPrice: 3500000,
  },
  {
    id: "lemari-custom-1",
    name: "Lemari Pakaian Custom Built-in / Wardrobe Full Tinggi Plafon",
    image: "/lemari-samping.png",
    size: "/ m²",
    price: 2599000,
    originalPrice: 5300000,
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
    price: 2199000,
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

// ─── Animation Variants ───────────────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 100, damping: 15, duration: 0.6 },
  },
};

const cardHoverVariants = {
  rest: { y: 0, scale: 1 },
  hover: {
    y: -12,
    scale: 1.02,
    transition: { type: "spring" as const, stiffness: 400, damping: 25 },
  },
};

// ─── Shared Input Style Helper ────────────────────────────────────────────────
const inputBase =
  "w-full px-4 py-3.5 rounded-2xl text-sm font-medium text-gray-900 placeholder-gray-400 bg-slate-50 border-2 border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:bg-blue-50/20 focus:outline-none transition-all duration-200";

const inputError =
  "border-red-400 bg-red-50/40 hover:border-red-400 focus:border-red-500 focus:bg-red-50/20";

const cls = (err?: string) => `${inputBase} ${err ? inputError : ""}`;

// ─── Field Label Component ────────────────────────────────────────────────────
function FieldLabel({
  icon: Icon,
  label,
  required,
  optional,
}: {
  icon: React.ElementType;
  label: string;
  required?: boolean;
  optional?: boolean;
}) {
  return (
    <label className="flex items-center gap-1.5 text-[11px] font-extrabold text-slate-800 mb-2 uppercase tracking-widest">
      <Icon size={11} className="text-blue-500" />
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
      {optional && (
        <span className="text-slate-400 font-normal normal-case tracking-normal ml-1 text-xs">
          (opsional)
        </span>
      )}
    </label>
  );
}

// ─── Error Message ────────────────────────────────────────────────────────────
function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-red-500 text-xs mt-1.5 flex items-center gap-1.5"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block flex-shrink-0" />
      {msg}
    </motion.p>
  );
}

// ─── Renovasi Form Modal ──────────────────────────────────────────────────────
type RenovasiForm = {
  nama: string;
  whatsapp: string;
  alamat: string;
  jenisRenovasi: string;
  luasBangunan: string;
  tanggalSurvey: string;
  waktuSurvey: string;
  budget: string;
  pesan: string;
};

const jenisOptions = [
  "Renovasi Total Rumah",
  "Renovasi Dapur / Kitchen Set",
  "Renovasi Kamar Tidur",
  "Renovasi Kamar Mandi",
  "Renovasi Ruang Tamu",
  "Renovasi Eksterior / Fasad",
  "Renovasi Plafon & Lantai",
  "Lainnya",
];

const budgetOptions = [
  "< Rp 10.000.000",
  "Rp 10.000.000 – Rp 30.000.000",
  "Rp 30.000.000 – Rp 75.000.000",
  "Rp 75.000.000 – Rp 150.000.000",
  "> Rp 150.000.000",
  "Fleksibel / Sesuai Rekomendasi",
];

const timeSlots = [
  "08:00 – 10:00",
  "10:00 – 12:00",
  "13:00 – 15:00",
  "15:00 – 17:00",
];

const STEPS = ["Data Diri", "Proyek", "Jadwal"];

function RenovasiModal({ onClose }: { onClose: () => void }) {
  const today = new Date().toISOString().split("T")[0];
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [form, setForm] = useState<RenovasiForm>({
    nama: "",
    whatsapp: "",
    alamat: "",
    jenisRenovasi: "",
    luasBangunan: "",
    tanggalSurvey: "",
    waktuSurvey: "",
    budget: "",
    pesan: "",
  });

  const [errors, setErrors] = useState<Partial<RenovasiForm>>({});

  const set = (key: keyof RenovasiForm, val: string) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  // Per-step validation
  const validateStep = (s: number): boolean => {
    const e: Partial<RenovasiForm> = {};

    if (s === 0) {
      if (!form.nama.trim()) e.nama = "Nama wajib diisi";
      if (!form.whatsapp.trim()) e.whatsapp = "No. WhatsApp wajib diisi";
      else if (!/^[0-9+\-\s]{8,16}$/.test(form.whatsapp))
        e.whatsapp = "Format nomor tidak valid";
      if (!form.alamat.trim()) e.alamat = "Alamat wajib diisi";
    }

    if (s === 1) {
      if (!form.jenisRenovasi) e.jenisRenovasi = "Pilih jenis renovasi";
      if (!form.budget) e.budget = "Pilih estimasi budget";
    }

    if (s === 2) {
      if (!form.tanggalSurvey) e.tanggalSurvey = "Tanggal wajib dipilih";
      if (!form.waktuSurvey) e.waktuSurvey = "Waktu wajib dipilih";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) setStep((s) => s + 1);
  };

  const handleBack = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    if (!validateStep(2)) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    const tanggalFormatted = form.tanggalSurvey
      ? new Date(form.tanggalSurvey).toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "-";

    const msg =
      `*KONSULTASI & SURVEY RENOVASI*\n` +
      `*ModuloSpace*\n\n` +
      `━━━━━━━━━━━━━━━━━━━\n` +
      `👤 *DATA DIRI*\n` +
      `━━━━━━━━━━━━━━━━━━━\n` +
      `• Nama       : ${form.nama}\n` +
      `• WhatsApp   : ${form.whatsapp}\n` +
      `• Alamat     : ${form.alamat}\n\n` +
      `━━━━━━━━━━━━━━━━━━━\n` +
      `🏠 *DETAIL PROYEK*\n` +
      `━━━━━━━━━━━━━━━━━━━\n` +
      `• Jenis Renovasi  : ${form.jenisRenovasi}\n` +
      `• Luas Bangunan   : ${form.luasBangunan ? form.luasBangunan + " m²" : "Belum diisi"}\n` +
      `• Estimasi Budget : ${form.budget}\n` +
      (form.pesan ? `• Keterangan      : ${form.pesan}\n` : "") +
      `\n━━━━━━━━━━━━━━━━━━━\n` +
      `📅 *JADWAL SURVEY*\n` +
      `━━━━━━━━━━━━━━━━━━━\n` +
      `• Tanggal : ${tanggalFormatted}\n` +
      `• Waktu   : ${form.waktuSurvey} WIB\n\n` +
      `Mohon konfirmasi jadwal survey. Terima kasih! 🙏`;

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );

    setIsLoading(false);
    setShowSuccess(true);

    setTimeout(() => {
      onClose();
      setShowSuccess(false);
      setStep(0);
      setForm({
        nama: "", whatsapp: "", alamat: "", jenisRenovasi: "",
        luasBangunan: "", tanggalSurvey: "", waktuSurvey: "", budget: "", pesan: "",
      });
    }, 2200);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 80 }}
        transition={{ type: "spring" as const, damping: 28, stiffness: 300 }}
        className="bg-white w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pill handle (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-slate-300 rounded-full" />
        </div>

        {!showSuccess ? (
          <>
            {/* ── Header ── */}
            <div className="relative px-6 pt-5 pb-6 bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 overflow-hidden">
              {/* Decorative blobs */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
              <div className="absolute -bottom-12 -left-8 w-32 h-32 bg-white/5 rounded-full" />

              <div className="relative flex items-start justify-between mb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 mb-3">
                    <Home size={11} className="text-blue-100" />
                    <span className="text-blue-100 text-[10px] font-extrabold uppercase tracking-widest">
                      Konsultasi & Survey
                    </span>
                  </div>
                  <h2 className="text-white font-extrabold text-xl leading-snug">
                    Program Renovasi Hunian
                  </h2>
                  <p className="text-blue-200 text-xs mt-1 font-medium">
                    Tim kami siap hadir ke lokasi Anda
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors flex-shrink-0"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Step Indicator */}
              <div className="flex items-center gap-0">
                {STEPS.map((s, i) => (
                  <div key={s} className="flex items-center flex-1">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold transition-all duration-300 ${
                          i < step
                            ? "bg-green-400 text-white"
                            : i === step
                            ? "bg-white text-blue-700 shadow-lg"
                            : "bg-white/25 text-white/70"
                        }`}
                      >
                        {i < step ? <CheckCircle size={14} /> : i + 1}
                      </div>
                      <span
                        className={`text-[11px] font-bold whitespace-nowrap transition-colors duration-300 ${
                          i === step ? "text-white" : "text-white/60"
                        }`}
                      >
                        {s}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className="flex-1 h-px bg-white/25 mx-2" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* ── Form Body ── */}
            <div className="px-6 pt-5 pb-3 max-h-[52vh] overflow-y-auto space-y-4">
              <AnimatePresence mode="wait">
                {/* ── Step 0: Data Diri ── */}
                {step === 0 && (
                  <motion.div
                    key="step0"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                  >
                    <p className="text-slate-900 text-sm font-semibold bg-blue-50 border border-blue-100 rounded-2xl px-4 py-2.5">
                      📋 Lengkapi data diri Anda untuk memulai proses konsultasi.
                    </p>

                    {/* Nama */}
                    <div>
                      <FieldLabel icon={User} label="Nama Lengkap" required />
                      <input
                        type="text"
                        placeholder="Contoh: Budi Santoso"
                        value={form.nama}
                        onChange={(e) => set("nama", e.target.value)}
                        className={cls(errors.nama)}
                      />
                      <FieldError msg={errors.nama} />
                    </div>

                    {/* WhatsApp */}
                    <div>
                      <FieldLabel icon={Phone} label="No. WhatsApp / HP" required />
                      <input
                        type="tel"
                        placeholder="Contoh: 08123456789"
                        value={form.whatsapp}
                        onChange={(e) => set("whatsapp", e.target.value)}
                        className={cls(errors.whatsapp)}
                      />
                      <FieldError msg={errors.whatsapp} />
                    </div>

                    {/* Alamat */}
                    <div>
                      <FieldLabel icon={MapPin} label="Alamat Lokasi Proyek" required />
                      <textarea
                        placeholder="Jalan, nomor, RT/RW, kelurahan, kota..."
                        rows={3}
                        value={form.alamat}
                        onChange={(e) => set("alamat", e.target.value)}
                        className={`${cls(errors.alamat)} resize-none`}
                      />
                      <FieldError msg={errors.alamat} />
                    </div>
                  </motion.div>
                )}

                {/* ── Step 1: Detail Proyek ── */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                  >
                    <p className="text-slate-900 text-sm font-semibold bg-blue-50 border border-blue-100 rounded-2xl px-4 py-2.5">
                      🏠 Ceritakan sedikit tentang proyek renovasi Anda.
                    </p>

                    {/* Jenis Renovasi */}
                    <div>
                      <FieldLabel icon={ClipboardList} label="Jenis Renovasi" required />
                      <div className="relative">
                        <select
                          value={form.jenisRenovasi}
                          onChange={(e) => set("jenisRenovasi", e.target.value)}
                          className={`${cls(errors.jenisRenovasi)} appearance-none pr-10 text-gray-900`}
                        >
                          <option value="">-- Pilih jenis renovasi --</option>
                          {jenisOptions.map((o) => (
                            <option key={o} value={o}>{o}</option>
                          ))}
                        </select>
                        <ChevronDown
                          size={16}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                        />
                      </div>
                      <FieldError msg={errors.jenisRenovasi} />
                    </div>

                    {/* Luas Bangunan */}
                    <div>
                      <FieldLabel icon={Ruler} label="Estimasi Luas Bangunan" optional />
                      <div className="relative">
                        <input
                          type="number"
                          placeholder="Contoh: 36"
                          value={form.luasBangunan}
                          onChange={(e) => set("luasBangunan", e.target.value)}
                          className={`${cls()} pr-14`}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-bold">
                          m²
                        </span>
                      </div>
                    </div>

                    {/* Budget */}
                    <div>
                      <FieldLabel icon={ClipboardList} label="Estimasi Budget" required />
                      <div className="relative">
                        <select
                          value={form.budget}
                          onChange={(e) => set("budget", e.target.value)}
                          className={`${cls(errors.budget)} appearance-none pr-10 text-gray-900`}
                        >
                          <option value="">-- Pilih kisaran budget --</option>
                          {budgetOptions.map((o) => (
                            <option key={o} value={o}>{o}</option>
                          ))}
                        </select>
                        <ChevronDown
                          size={16}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                        />
                      </div>
                      <FieldError msg={errors.budget} />
                    </div>

                    {/* Keterangan */}
                    <div>
                      <FieldLabel icon={MessageSquare} label="Keterangan Tambahan" optional />
                      <textarea
                        placeholder="Ceritakan kondisi atau kebutuhan khusus renovasi Anda..."
                        rows={3}
                        value={form.pesan}
                        onChange={(e) => set("pesan", e.target.value)}
                        className={`${cls()} resize-none`}
                      />
                    </div>
                  </motion.div>
                )}

                {/* ── Step 2: Jadwal Survey ── */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                  >
                    <p className="text-slate-900 text-sm font-semibold bg-blue-50 border border-blue-100 rounded-2xl px-4 py-2.5">
                      📅 Pilih jadwal yang nyaman untuk kunjungan tim surveyor kami.
                    </p>

                    {/* Tanggal */}
                    <div>
                      <FieldLabel icon={Calendar} label="Tanggal Survey" required />
                      <input
                        type="date"
                        min={today}
                        value={form.tanggalSurvey}
                        onChange={(e) => set("tanggalSurvey", e.target.value)}
                        className={`${cls(errors.tanggalSurvey)} text-slate-900`}
                      />
                      <FieldError msg={errors.tanggalSurvey} />
                    </div>

                    {/* Waktu — grid pill buttons */}
                    <div>
                      <FieldLabel icon={Clock} label="Waktu Survey" required />
                      <div className="grid grid-cols-2 gap-2.5">
                        {timeSlots.map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => set("waktuSurvey", t)}
                            className={`py-3 rounded-2xl text-sm font-bold border-2 transition-all duration-200 ${
                              form.waktuSurvey === t
                                ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200"
                                : "bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50"
                            }`}
                          >
                            {t} WIB
                          </button>
                        ))}
                      </div>
                      <FieldError msg={errors.waktuSurvey} />
                    </div>

                    {/* Summary card */}
                    {(form.nama || form.jenisRenovasi) && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-2xl border-2 border-blue-100 bg-blue-50/60 p-4 space-y-1.5"
                      >
                        <p className="text-[11px] font-extrabold text-blue-600 uppercase tracking-widest mb-2">
                          Ringkasan Pesanan
                        </p>
                        {form.nama && (
                          <div className="flex gap-2 text-sm">
                            <span className="text-slate-500 w-24 flex-shrink-0">Nama</span>
                            <span className="text-slate-900 font-semibold">: {form.nama}</span>
                          </div>
                        )}
                        {form.jenisRenovasi && (
                          <div className="flex gap-2 text-sm">
                            <span className="text-slate-500 w-24 flex-shrink-0">Renovasi</span>
                            <span className="text-slate-900 font-semibold">: {form.jenisRenovasi}</span>
                          </div>
                        )}
                        {form.luasBangunan && (
                          <div className="flex gap-2 text-sm">
                            <span className="text-slate-500 w-24 flex-shrink-0">Luas</span>
                            <span className="text-slate-900 font-semibold">: {form.luasBangunan} m²</span>
                          </div>
                        )}
                        {form.budget && (
                          <div className="flex gap-2 text-sm">
                            <span className="text-slate-500 w-24 flex-shrink-0">Budget</span>
                            <span className="text-slate-900 font-semibold">: {form.budget}</span>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Footer Navigation ── */}
            <div className="px-6 py-4 border-t border-slate-100 bg-white flex gap-3">
              {step > 0 ? (
                <button
                  onClick={handleBack}
                  className="flex-1 py-3.5 rounded-2xl text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  ← Kembali
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="flex-1 py-3.5 rounded-2xl text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Batal
                </button>
              )}

              {step < 2 ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleNext}
                  className="flex-[2] py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition-all"
                >
                  Lanjut →
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex-[2] py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-green-200 disabled:opacity-60 transition-all"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      Kirim ke WhatsApp
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </>
        ) : (
          /* ── Success Screen ── */
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring" as const, stiffness: 200 }}
            className="text-center py-14 px-8"
          >
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-300/50"
            >
              <CheckCircle className="w-12 h-12 text-white" />
            </motion.div>
            <h3 className="text-2xl font-extrabold text-slate-900 mb-2">
              Berhasil Dikirim!
            </h3>
            <p className="text-slate-500 text-sm">
              Data Anda sedang diarahkan ke WhatsApp kami. Tim akan segera menghubungi Anda.
            </p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ShowcaseRecommendationSection() {
  const [page, setPage] = useState(0);
  const [lock, setLock] = useState(false);
  const [perView, setPerView] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const timer = useRef<NodeJS.Timeout | null>(null);

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
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [pages]);

  const translate = `-${page * 100}%`;

  return (
<section className="w-full bg-gradient-to-b from-white via-slate-50/50 to-white py-8 sm:py-12 lg:py-16 relative overflow-visible">
      {/* Background blobs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-0 w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.15, 0.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 left-0 w-[400px] h-[400px] bg-indigo-200/20 rounded-full blur-3xl"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 sm:mb-10 text-center"
                  >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring" as const, stiffness: 200, damping: 15, delay: 0.2 }}
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
            Rekomendasi{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Produk
            </span>
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
          {/* ── Renovasi Card ── */}
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
                <motion.div variants={cardHoverVariants} className="w-full h-full">
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
                  transition={{ delay: 0.5, type: "spring" as const }}
                  className="absolute top-5 left-5"
                >
                  <span className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold rounded-full shadow-lg shadow-blue-600/30">
                    BEST DEAL
                  </span>
                </motion.div>
              </div>

              <div className="p-6 sm:p-8 flex flex-col flex-1">
                <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3">
                  Penawaran Renovasi
                </div>

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
                      transition={{ delay: 0.4 + i * 0.1 }}
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
                    onClick={() => setIsModalOpen(true)}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 group/btn text-sm sm:text-base"
                  >
                    Konsultasi & Survey
                    <ArrowRight size={18} className="transition-transform group-hover/btn:translate-x-1" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* ── Slider ── */}
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

            {/* Slider Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-between mt-6 sm:mt-8 pb-4"
                          >
              <div className="flex gap-3">
                <motion.button
                  // whileHover={{ scale: 1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={prev}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white text-blue-600 border-2 border-blue-100 hover:border-blue-300 hover:bg-blue-50 flex items-center justify-center shadow-lg transition-all duration-300"
                >
                  <ChevronLeft size={24} />
                </motion.button>
                <motion.button
                  // whileHover={{ scale: 1 }}
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

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && <RenovasiModal onClose={() => setIsModalOpen(false)} />}
      </AnimatePresence>
    </section>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCardV3({
  id, name, image, size, price, originalPrice, index,
}: {
  id: string; name: string; image: string; size: string;
  price: number; originalPrice: number; index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, type: "spring" as const, stiffness: 100, damping: 15 }}
    >
      <Link href={`/produk/${id}`} className="group block h-full">
        <motion.div
          whileHover={{ y: -8 }}
          transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
          className="bg-white rounded-2xl sm:rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-blue-200/20 transition-shadow duration-500 overflow-hidden flex flex-col h-full"
        >
          <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-100">
            <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.6 }} className="w-full h-full">
              <Image src={image} alt={name} fill className="object-cover" />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          <div className="p-5 sm:p-6 flex flex-col flex-1">
            <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-snug mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
              {name}
            </h3>

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

            <div className="flex items-center gap-2 mb-5 px-3 py-2 bg-green-50 rounded-xl border border-green-100">
              <Truck size={16} className="text-green-600 flex-shrink-0" />
              <span className="text-xs sm:text-sm text-green-700 font-semibold">Gratis Ongkir Jabodetabek</span>
            </div>

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