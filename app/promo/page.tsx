// app/promo/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
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
  X,
  User,
  MessageSquare,
  Tag,
  ClipboardList,
  Send,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhyUsSection from "@/components/why-us-section";
import OrderFlowSection from "@/components/OrderFlowSection";

// ─── Types ───────────────────────────────────────────────────────────────────
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

// ─── Data ─────────────────────────────────────────────────────────────────────
const promos: Promo[] = [
  {
    id: 1,
    title: "Paket Interior Lengkap 1",
    category: "interior",
    discount: 25,
    originalPrice: 4599000,
    discountedPrice: 3599000,
    description:
      "Transformasi total ruang tamu, kamar tidur, dan dapur dengan desain modern minimalis",
    features: ["Dipan", "Wallback Drop Tv", "Lemari Pakaian", "Meja Rias"],
    validUntil: "2026-05-30",
    image: "/interior-lengkap.jpg",
    badge: "Best Seller",
    popular: true,
  },
  {
    id: 2,
    title: "Paket Interior Lengkap 2",
    category: "interior",
    discount: 25,
    originalPrice: 6599000,
    discountedPrice: 5599000,
    description:
      "Transformasi total ruang tamu, kamar tidur, dan dapur dengan desain modern minimalis",
    features: [
      "Dipan",
      "Wallback Drop Tv",
      "Lemari Pakaian",
      "Meja Rias",
      "Kitchen Set",
    ],
    validUntil: "2026-05-30",
    image: "/After-kitchenset.jpg",
    badge: "Best Seller",
    popular: true,
  },
  {
    id: 4,
    title: "Custom Furniture Premium",
    category: "interior",
    discount: 30,
    originalPrice: 3100000,
    discountedPrice: 2199000,
    description:
      "Furniture custom sesuai ukuran ruangan Anda dengan bahan pilihan",
    features: ["Anti Rayap", "Anti Air", "Anti Api", "Instalasi Gratis"],
    validUntil: "2026-05-20",
    image: "/cat-interior.png",
    badge: "Limited",
  },
  {
    id: 5,
    title: "Renovasi Total Rumah",
    category: "renovasi",
    discount: 35,
    originalPrice: 3700000,
    discountedPrice: 2449000,
    description:
      "Paket lengkap renovasi rumah dari A-Z dengan tim profesional berpengalaman",
    features: [
      "Konsultasi Gratis",
      "RAB Transparan",
      "Progress Update",
      "Tim Berpengalaman",
      "Garansi Hingga 1 Tahun",
    ],
    validUntil: "2026-06-30",
    image: "/renovasi-rumah.png",
    badge: "Hemat Besar",
    popular: true,
  },
  {
    id: 6,
    title: "Waterproofing & Perbaikan",
    category: "exterior",
    discount: 40,
    originalPrice: 549000,
    discountedPrice: 349000,
    description:
      "Solusi kebocoran dan perbaikan eksterior dengan teknologi waterproofing terbaru",
    features: [
      "Deteksi Kebocoran",
      "Waterproofing Coating",
      "Garansi Hingga 1 Tahun",
      "Emergency Service",
    ],
    validUntil: "2026-04-25",
    image: "/waterprofing.jpg",
    badge: "Urgent",
  },
];

const categories = [
  { id: "all", label: "Semua Promo", icon: Sparkles },
  { id: "interior", label: "Interior", icon: Home },
  { id: "exterior", label: "Eksterior", icon: Paintbrush },
  { id: "renovasi", label: "Renovasi", icon: Hammer },
];

const WA_NUMBER = "6289509478009";

// ─── Animation Variants ───────────────────────────────────────────────────────
const fadeInUp = {
  hidden: { opacity: 0, y: 32, filter: "blur(4px)" },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      delay: i * 0.1,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.88, filter: "blur(6px)" },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.55,
      delay: i * 0.08,
      ease: [0.34, 1.2, 0.64, 1],
    },
  }),
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      delay: i * 0.1,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
  exit: {
    opacity: 0,
    scale: 0.9,
    y: -20,
    transition: { duration: 0.3, ease: "easeIn" },
  },
};

// ─── Countdown Timer ──────────────────────────────────────────────────────────
const CountdownTimer = ({ targetDate }: { targetDate: string }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculate = () => {
      const diff = new Date(targetDate).getTime() - new Date().getTime();
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    };
    calculate();
    const t = setInterval(calculate, 1000);
    return () => clearInterval(t);
  }, [targetDate]);

  return (
    <div className="flex gap-1.5 text-center">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div
          key={unit}
          className="bg-white/20 backdrop-blur-sm rounded-lg px-1.5 py-1 min-w-[34px]"
        >
          <div className="text-sm font-bold text-white leading-tight">
            {String(value).padStart(2, "0")}
          </div>
          <div className="text-[9px] uppercase text-white/70 leading-tight">{unit[0]}</div>
        </div>
      ))}
    </div>
  );
};

// ─── Shared Field Component ───────────────────────────────────────────────────
const Field = ({
  label,
  required,
  optional,
  icon: Icon,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
  icon: React.ElementType;
  error?: string;
  children: React.ReactNode;
}) => (
  <div className="group">
    <label className="flex items-center gap-1.5 text-[12px] font-bold text-gray-900 mb-1.5 tracking-wide uppercase">
      <Icon size={12} className="text-blue-500" />
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
      {optional && (
        <span className="text-gray-400 font-normal normal-case tracking-normal ml-1 text-xs">
          (opsional)
        </span>
      )}
    </label>
    {children}
    {error && (
      <motion.p
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-red-500 text-xs mt-1.5 flex items-center gap-1"
      >
        <span className="w-1 h-1 rounded-full bg-red-500 inline-block" />
        {error}
      </motion.p>
    )}
  </div>
);

const inputCls = (err?: string) =>
  `w-full px-3.5 py-3 rounded-xl text-sm font-medium text-gray-900 placeholder-gray-400 border-2 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:bg-blue-50/30 bg-gray-50 ${
    err
      ? "border-red-400 bg-red-50/40 focus:border-red-400 focus:bg-red-50/30"
      : "border-gray-200 hover:border-gray-300"
  }`;

// ─── Promo Form Modal ─────────────────────────────────────────────────────────
interface PromoFormProps {
  promo: Promo;
  onClose: () => void;
}

const PromoFormModal = ({ promo, onClose }: PromoFormProps) => {
  const [form, setForm] = useState({ name: "", phone: "", address: "", notes: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Nama wajib diisi";
    if (!form.phone.trim()) e.phone = "No. HP wajib diisi";
    else if (!/^[0-9+\-\s]{8,15}$/.test(form.phone)) e.phone = "Format nomor tidak valid";
    if (!form.address.trim()) e.address = "Alamat wajib diisi";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const harga = `Rp ${promo.discountedPrice.toLocaleString("id-ID")}`;
    const msg =
      `*AMBIL PROMO - ModuloSpace*\n\n` +
      `📦 *Produk:* ${promo.title}\n` +
      `🏷️ *Diskon:* ${promo.discount}%\n` +
      `💰 *Harga Promo:* ${harga}\n\n` +
      `👤 *Nama:* ${form.name}\n` +
      `📞 *No. HP:* ${form.phone}\n` +
      `📍 *Alamat:* ${form.address}\n` +
      (form.notes ? `📝 *Catatan:* ${form.notes}\n` : "") +
      `\nSaya ingin mengambil promo ini. Mohon konfirmasi ketersediaannya. Terima kasih!`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, y: 80, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 60, scale: 0.95 }}
        transition={{ type: "spring", damping: 30, stiffness: 340, mass: 0.8 }}
        className="bg-white w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden"
      >
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        <div className="relative px-5 pt-4 pb-5 bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 overflow-hidden">
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full" />
          <div className="absolute -bottom-10 -left-6 w-24 h-24 bg-white/5 rounded-full" />
          <div className="relative flex items-start justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-2.5 py-1 mb-2.5">
                <Tag size={10} className="text-blue-100" />
                <span className="text-blue-100 text-[10px] font-bold uppercase tracking-widest">Ambil Promo</span>
              </div>
              <h2 className="text-white font-extrabold text-lg leading-tight">{promo.title}</h2>
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                <span className="bg-white text-blue-700 text-xs px-2.5 py-1 rounded-full font-extrabold shadow-sm">
                  -{promo.discount}%
                </span>
                <span className="text-white font-bold text-sm">
                  Rp {promo.discountedPrice.toLocaleString("id-ID")}
                </span>
                <span className="text-blue-200 text-xs line-through">
                  Rp {promo.originalPrice.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors flex-shrink-0 mt-1"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        <div className="px-5 pt-4 pb-2 space-y-3.5 max-h-[55vh] overflow-y-auto">
          <p className="text-gray-700 text-xs font-medium bg-blue-50 border border-blue-100 rounded-xl px-3.5 py-2.5">
            📋 Lengkapi data di bawah — pesan akan dikirim otomatis ke WhatsApp kami.
          </p>

          <Field label="Nama Lengkap" required icon={User} error={errors.name}>
            <input
              type="text"
              placeholder="Contoh: Budi Santoso"
              value={form.name}
              onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: "" }); }}
              className={inputCls(errors.name)}
            />
          </Field>

          <Field label="No. WhatsApp / HP" required icon={Phone} error={errors.phone}>
            <input
              type="tel"
              placeholder="Contoh: 08123456789"
              value={form.phone}
              onChange={(e) => { setForm({ ...form, phone: e.target.value }); setErrors({ ...errors, phone: "" }); }}
              className={inputCls(errors.phone)}
            />
          </Field>

          <Field label="Alamat Lengkap" required icon={MapPin} error={errors.address}>
            <textarea
              placeholder="Jalan, nomor rumah, kota..."
              rows={3}
              value={form.address}
              onChange={(e) => { setForm({ ...form, address: e.target.value }); setErrors({ ...errors, address: "" }); }}
              className={`${inputCls(errors.address)} resize-none`}
            />
          </Field>

          <Field label="Catatan" optional icon={MessageSquare}>
            <textarea
              placeholder="Warna favorit, ukuran ruangan, referensi desain..."
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className={`${inputCls()} resize-none`}
            />
          </Field>
        </div>

        <div className="px-5 py-4 flex gap-3 border-t border-gray-100 bg-white">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Batal
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSubmit}
            className="flex-[2] py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-green-200 hover:shadow-green-300 transition-all"
          >
            <Send size={14} />
            Lanjut ke WhatsApp
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

// ─── Survey Schedule Modal ────────────────────────────────────────────────────
const SurveyFormModal = ({ onClose }: { onClose: () => void }) => {
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({ name: "", phone: "", address: "", serviceType: "", date: "", time: "", notes: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const serviceOptions = ["Interior Design", "Eksterior & Fasad", "Renovasi Total", "Kitchen Set", "Furniture Custom", "Waterproofing", "Lainnya"];
  const timeSlots = ["08:00 - 10:00", "10:00 - 12:00", "13:00 - 15:00", "15:00 - 17:00"];

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Nama wajib diisi";
    if (!form.phone.trim()) e.phone = "No. HP wajib diisi";
    else if (!/^[0-9+\-\s]{8,15}$/.test(form.phone)) e.phone = "Format nomor tidak valid";
    if (!form.address.trim()) e.address = "Alamat wajib diisi";
    if (!form.serviceType) e.serviceType = "Pilih jenis layanan";
    if (!form.date) e.date = "Tanggal wajib dipilih";
    if (!form.time) e.time = "Waktu wajib dipilih";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const msg =
      `*JADWALKAN SURVEY - ModuloSpace*\n\n` +
      `👤 *Nama:* ${form.name}\n` +
      `📞 *No. HP:* ${form.phone}\n` +
      `📍 *Alamat:* ${form.address}\n` +
      `🏠 *Jenis Layanan:* ${form.serviceType}\n` +
      `📅 *Tanggal Survey:* ${new Date(form.date).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}\n` +
      `⏰ *Waktu Survey:* ${form.time} WIB\n` +
      (form.notes ? `📝 *Catatan:* ${form.notes}\n` : "") +
      `\nMohon konfirmasi jadwal survey. Terima kasih!`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, y: 80, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 60, scale: 0.95 }}
        transition={{ type: "spring", damping: 30, stiffness: 340, mass: 0.8 }}
        className="bg-white w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden"
      >
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        <div className="relative px-5 pt-4 pb-5 bg-gradient-to-br from-indigo-600 via-blue-600 to-blue-700 overflow-hidden">
          <div className="absolute -top-6 -right-6 w-28 h-28 bg-white/10 rounded-full" />
          <div className="absolute -bottom-8 -left-4 w-20 h-20 bg-white/5 rounded-full" />
          <div className="relative flex items-start justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-2.5 py-1 mb-2.5">
                <ClipboardList size={10} className="text-blue-100" />
                <span className="text-blue-100 text-[10px] font-bold uppercase tracking-widest">Jadwalkan Survey</span>
              </div>
              <h2 className="text-white font-extrabold text-lg">Formulir Jadwal Survey</h2>
              <p className="text-blue-100 text-xs mt-1 font-medium">Tim kami konfirmasi dalam 1 jam kerja</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors flex-shrink-0 mt-1"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-0 px-5 py-2.5 bg-gray-50 border-b border-gray-100">
          {["Data Diri", "Layanan", "Jadwal"].map((step, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className={`flex items-center gap-1.5 ${i === 0 ? "text-blue-600" : i === 1 ? "text-blue-500" : "text-blue-400"}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold ${i === 0 ? "bg-blue-600 text-white" : i === 1 ? "bg-blue-500 text-white" : "bg-blue-400 text-white"}`}>
                  {i + 1}
                </div>
                <span className="text-[10px] font-bold text-gray-900 whitespace-nowrap">{step}</span>
              </div>
              {i < 2 && <div className="flex-1 h-px bg-gray-300 mx-2" />}
            </div>
          ))}
        </div>

        <div className="px-5 pt-4 pb-2 space-y-3 max-h-[50vh] overflow-y-auto">
          <div className="space-y-3">
            <p className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest flex items-center gap-1.5">
              <User size={10} /> Data Diri
            </p>
            <Field label="Nama Lengkap" required icon={User} error={errors.name}>
              <input type="text" placeholder="Contoh: Budi Santoso" value={form.name}
                onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: "" }); }}
                className={inputCls(errors.name)} />
            </Field>
            <Field label="No. WhatsApp / HP" required icon={Phone} error={errors.phone}>
              <input type="tel" placeholder="Contoh: 08123456789" value={form.phone}
                onChange={(e) => { setForm({ ...form, phone: e.target.value }); setErrors({ ...errors, phone: "" }); }}
                className={inputCls(errors.phone)} />
            </Field>
            <Field label="Alamat Lokasi Survey" required icon={MapPin} error={errors.address}>
              <textarea placeholder="Jalan, nomor rumah, RT/RW, kelurahan, kota..." rows={3} value={form.address}
                onChange={(e) => { setForm({ ...form, address: e.target.value }); setErrors({ ...errors, address: "" }); }}
                className={`${inputCls(errors.address)} resize-none`} />
            </Field>
          </div>

          <div className="pt-1">
            <p className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest flex items-center gap-1.5 mb-2.5">
              <ClipboardList size={10} /> Jenis Layanan
            </p>
            <Field label="Pilih Layanan" required icon={ClipboardList} error={errors.serviceType}>
              <select value={form.serviceType}
                onChange={(e) => { setForm({ ...form, serviceType: e.target.value }); setErrors({ ...errors, serviceType: "" }); }}
                className={`${inputCls(errors.serviceType)} bg-gray-50 text-gray-900`}>
                <option value="">-- Pilih jenis layanan --</option>
                {serviceOptions.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
          </div>

          <div className="pt-1">
            <p className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest flex items-center gap-1.5 mb-2.5">
              <Calendar size={10} /> Jadwal Survey
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <Field label="Tanggal" required icon={Calendar} error={errors.date}>
                <input type="date" min={today} value={form.date}
                  onChange={(e) => { setForm({ ...form, date: e.target.value }); setErrors({ ...errors, date: "" }); }}
                  className={`${inputCls(errors.date)} text-gray-900`} />
              </Field>
              <Field label="Waktu" required icon={Clock} error={errors.time}>
                <select value={form.time}
                  onChange={(e) => { setForm({ ...form, time: e.target.value }); setErrors({ ...errors, time: "" }); }}
                  className={`${inputCls(errors.time)} bg-gray-50 text-gray-900`}>
                  <option value="">-- Pilih --</option>
                  {timeSlots.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>
            </div>
          </div>

          <Field label="Catatan" optional icon={MessageSquare}>
            <textarea placeholder="Informasi tambahan untuk tim surveyor kami..." rows={2} value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className={`${inputCls()} resize-none`} />
          </Field>
        </div>

        <div className="px-5 py-4 flex gap-3 border-t border-gray-100 bg-white">
          <button onClick={onClose}
            className="flex-1 py-3 rounded-xl text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">
            Batal
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSubmit}
            className="flex-[2] py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-green-200 hover:shadow-green-300 transition-all">
            <Send size={14} />
            Konfirmasi via WA
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

// ─── Promo Card ───────────────────────────────────────────────────────────────
const PromoCard = ({
  promo,
  index,
  onAmbilPromo,
}: {
  promo: Promo;
  index: number;
  onAmbilPromo: (promo: Promo) => void;
}) => {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      custom={index}
      layout
      className={`group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-500 ${
        promo.popular ? "ring-2 ring-[#C6A969] ring-offset-2" : ""
      }`}
    >
      {promo.badge && (
        <div
          className={`absolute top-3 left-3 z-20 px-2.5 py-1 rounded-full text-xs font-bold text-white ${
            promo.badge === "Flash Sale"
              ? "bg-red-500 animate-pulse"
              : promo.badge === "Limited"
              ? "bg-purple-500"
              : promo.badge === "Best Seller"
              ? "bg-[#C6A969]"
              : "bg-blue-600"
          }`}
        >
          {promo.badge}
        </div>
      )}

      <div className="absolute top-3 right-3 z-20 bg-blue-600 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-md">
        -{promo.discount}%
      </div>

      {/* Image */}
      <div className="relative h-48 md:h-52 overflow-hidden">
        <Image
          src={promo.image}
          alt={promo.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3">
          <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-800 capitalize">
            {promo.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-5">
        <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1.5 line-clamp-1">
          {promo.title}
        </h3>
        <p className="text-gray-500 text-xs md:text-sm mb-3 line-clamp-2 leading-relaxed">
          {promo.description}
        </p>

        {/* Price */}
        <div className="mb-3">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-lg md:text-xl font-bold text-[#C6A969]">
              Rp {promo.discountedPrice.toLocaleString("id-ID")}
            </span>
            <span className="text-xs text-gray-400 line-through">
              Rp {promo.originalPrice.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-1.5 mb-4">
          {promo.features.slice(0, 4).map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
              <CheckCircle2 size={12} className="text-green-500 flex-shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        {/* Countdown */}
        <div className="mb-3.5 p-2.5 bg-gradient-to-r from-blue-700 to-blue-800 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-white/80 text-xs">
              <Clock size={12} />
              <span className="text-[11px]">Berlaku hingga</span>
            </div>
            <CountdownTimer targetDate={promo.validUntil} />
          </div>
        </div>

        {/* CTA Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onAmbilPromo(promo)}
          className="w-full py-2.5 md:py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all group/btn shadow-md shadow-blue-100"
        >
          <span>Ambil Promo</span>
          <ArrowRight
            size={16}
            className="transition-transform group-hover/btn:translate-x-1"
          />
        </motion.button>
      </div>
    </motion.div>
  );
};

// ─── Hero Section ─────────────────────────────────────────────────────────────
const HeroSection = () => {
  const staggerContainer = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  };

  return (
    <section className="relative min-h-[65vh] md:min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Animated blobs */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-16 left-8 w-16 h-16 md:w-24 md:h-24 bg-[#C6A969]/20 rounded-full blur-xl"
      />
      <motion.div
        animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-16 right-8 w-24 h-24 md:w-36 md:h-36 bg-blue-500/20 rounded-full blur-xl"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-1/2 left-1/4 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center w-full">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeInUp}>
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight px-2">
              Promo Layanan{" "}
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-[#C6A969] via-yellow-200 to-[#C6A969] bg-clip-text text-transparent">
                Interior & Exterior
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#C6A969] via-yellow-200 to-[#C6A969] bg-clip-text text-transparent">
                & Renovasi
              </span>
            </h1>
          </motion.div>

          <motion.p
            variants={fadeInUp}
            className="text-sm sm:text-base md:text-xl text-gray-300 max-w-xl mx-auto mb-8 md:mb-10 px-4"
          >
            Hemat hingga{" "}
            <span className="text-[#C6A969] font-bold">40%</span> untuk layanan
            interior, eksterior, dan renovasi rumah. Konsultasi gratis dan garansi
            hingga 1 tahun.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-xs sm:max-w-lg md:max-w-3xl mx-auto px-4"
          >
            {[
              { value: "40%", label: "Diskon Maksimal", icon: Percent },
              { value: "50+", label: "Proyek Selesai", icon: CheckCircle2 },
              { value: "3-12 Bln", label: "Garansi", icon: Shield },
              { value: "24/7", label: "Support", icon: Phone },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                variants={scaleIn}
                custom={idx}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-3 md:p-4"
              >
                <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-[#C6A969] mx-auto mb-1.5" />
                <div className="text-lg md:text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-[10px] md:text-xs text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50"
      >
        <ChevronDown size={28} />
      </motion.div>
    </section>
  );
};

// ─── Why Choose Section ───────────────────────────────────────────────────────
const WhyChooseSection = () => (
  <section className="py-10 md:py-14 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4">
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="text-center mb-10 md:mb-14"
      >
        <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
          Mengapa Memilih Promo Kami?
        </h2>
        <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
          Kami memberikan layanan terbaik dengan harga terjangkau dan jaminan kualitas
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-5 md:gap-8">
        {[
          {
            icon: Zap,
            title: "Proses Cepat",
            description: "Timeline jelas dan tepat waktu. Renovasi kilat selesai dalam 7 hari.",
            color: "bg-yellow-100 text-yellow-600",
          },
          {
            icon: Shield,
            title: "Garansi Resmi",
            description: "Garansi pekerjaan hingga 5 tahun dan garansi material dari supplier.",
            color: "bg-blue-100 text-blue-600",
          },
          {
            icon: CheckCircle2,
            title: "Transparan",
            description: "Harga fixed tanpa hidden cost. RAB detail sebelum memulai proyek.",
            color: "bg-green-100 text-green-600",
          },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            custom={idx}
            className="bg-white rounded-2xl p-6 md:p-8 shadow-md hover:shadow-lg transition-shadow"
          >
            <div className={`w-12 h-12 md:w-14 md:h-14 ${item.color} rounded-2xl flex items-center justify-center mb-5`}>
              <item.icon size={24} />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">{item.title}</h3>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// ─── CTA Section ──────────────────────────────────────────────────────────────
const CTASection = ({ onOpenSurvey }: { onOpenSurvey: () => void }) => (
  <section className="py-10 md:py-14 bg-white">
    <div className="max-w-5xl mx-auto px-4 text-center">
      <motion.div
        variants={scaleIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e293b] rounded-3xl p-6 md:p-16 border border-gray-700 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C6A969]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6">
            Masih Ragu? Konsultasi Gratis!
          </h2>
          <p className="text-gray-400 text-sm md:text-lg mb-6 md:mb-8 max-w-2xl mx-auto">
            Tim ahli kami siap membantu mewujudkan hunian impian Anda. Dapatkan
            penawaran khusus dan desain 3D gratis.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenSurvey}
              className="px-6 md:px-8 py-3.5 md:py-4 bg-[#C6A969] hover:bg-[#B59855] text-black text-sm md:text-base font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Calendar size={18} />
              Jadwalkan Survey
            </motion.button>

            <a
              href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
                "Halo ModuloSpace, saya ingin konsultasi mengenai layanan interior/exterior/renovasi. Bisa dibantu?"
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-6 md:px-8 py-3.5 md:py-4 bg-white/10 hover:bg-white/20 text-white text-sm md:text-base font-bold rounded-xl flex items-center justify-center gap-2 transition-colors border border-white/20"
              >
                <Phone size={18} />
                Hubungi WhatsApp
              </motion.button>
            </a>
          </div>

          <div className="mt-6 md:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-xs md:text-sm text-gray-500">
            <span className="flex items-center gap-2 text-center">
              <MapPin size={14} className="flex-shrink-0" />
              <span>Pajajaran XI No.66, Parung Panjang, Kab.Bogor</span>
            </span>
            <span className="hidden sm:block w-1 h-1 bg-gray-500 rounded-full" />
            <span>Respons dalam 1 jam</span>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

// ─── Main Page Component ──────────────────────────────────────────────────────
export default function PromoPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [filteredPromos, setFilteredPromos] = useState(promos);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState<Promo | null>(null);
  const [showSurveyForm, setShowSurveyForm] = useState(false);

  useEffect(() => {
    setFilteredPromos(
      activeCategory === "all"
        ? promos
        : promos.filter((p) => p.category === activeCategory)
    );
  }, [activeCategory]);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white pt-16 md:pt-20">
        {/* Hero */}
        <HeroSection />

        {/* ── Filter Section ── REDUCED py for tighter spacing ── */}
        <section className="sticky top-16 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 py-2.5 md:py-3">
          <div className="max-w-7xl mx-auto px-4">
            {/* Desktop */}
            <div className="hidden md:flex items-center justify-center gap-2">
              {categories.map((cat) => (
                <motion.button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  layout
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                    activeCategory === cat.id
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105"
                      : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                  }`}
                >
                  <cat.icon size={16} />
                  {cat.label}
                </motion.button>
              ))}
            </div>

            {/* Mobile */}
            <div className="md:hidden">
              <button
                onClick={() => setShowMobileFilter(!showMobileFilter)}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-blue-50 rounded-xl text-sm font-medium text-blue-700"
              >
                <span className="flex items-center gap-2">
                  <Filter size={16} />
                  {categories.find((c) => c.id === activeCategory)?.label}
                </span>
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-300 ${
                    showMobileFilter ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {showMobileFilter && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
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
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                            activeCategory === cat.id
                              ? "bg-blue-600 text-white"
                              : "bg-blue-50 text-blue-600"
                          }`}
                        >
                          <cat.icon size={15} />
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

        {/* ── Promo Grid ── REDUCED top padding for tighter gap after filter bar ── */}
        <section className="pt-6 pb-10 md:pt-8 md:pb-16">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredPromos.map((promo, index) => (
                  <PromoCard
                    key={`${promo.id}-${activeCategory}`}
                    promo={promo}
                    index={index}
                    onAmbilPromo={(p) => setSelectedPromo(p)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            {filteredPromos.length === 0 && (
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="text-center py-16"
              >
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter size={36} className="text-gray-400" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                  Tidak ada promo dalam kategori ini
                </h3>
                <p className="text-sm md:text-base text-gray-600">Coba pilih kategori lain</p>
              </motion.div>
            )}
          </div>
        </section>

        <OrderFlowSection />
        <WhyUsSection />
        <CTASection onOpenSurvey={() => setShowSurveyForm(true)} />
      </main>

      <Footer />

      {/* Modals */}
      <AnimatePresence>
        {selectedPromo && (
          <PromoFormModal
            promo={selectedPromo}
            onClose={() => setSelectedPromo(null)}
          />
        )}
        {showSurveyForm && (
          <SurveyFormModal onClose={() => setShowSurveyForm(false)} />
        )}
      </AnimatePresence>
    </>
  );
}