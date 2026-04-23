// components/why-us-section.tsx

"use client";

import { motion } from "framer-motion";
import {
  Wallet,
  MessageCircle,
  Truck,
  BadgeCheck,
  Sparkles,
} from "lucide-react";

const items = [
  {
    icon: Wallet,
    title: "Harga Sesuai Budget",
    desc: "Pilihan material dan paket kerja fleksibel menyesuaikan anggaran proyek Anda.",
  },
  {
    icon: MessageCircle,
    title: "Konsultasi Gratis",
    desc: "Diskusi kebutuhan, konsep desain, dan estimasi awal tanpa biaya.",
  },
  {
    icon: Truck,
    title: "Gratis Ongkir Area Tertentu",
    desc: "Gratis biaya pengiriman untuk area layanan utama kami.",
  },
  {
    icon: BadgeCheck,
    title: "Harga Transparan",
    desc: "Semua biaya dijelaskan dengan jelas sejak awal tanpa biaya tersembunyi.",
  },
  {
    icon: Sparkles,
    title: "Desain Interior Kekinian",
    desc: "Kombinasi estetika, fungsi, dan tren terkini yang berpadu harmonis.",
  },
];

export default function WhyUsSection() {
  return (
    <section className="w-full bg-white py-10 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ================= HEADER ================= */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 1,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          {/* SUB TITLE (LEBIH BESAR & TEGAS) */}
          <div className="text-lg sm:text-xl font-semibold tracking-[0.4em] text-neutral-800 uppercase mb-6">
            Kenapa Harus Pilih Modulo Space?
          </div>

          {/* TITLE */}
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 leading-tight">
            Alasan Klien Mempercayakan
            <span className="block">Proyek Interior & Renovasi</span>
          </h2>

          <p className="mt-6 text-neutral-700 text-sm sm:text-base leading-relaxed">
            Kami menggabungkan kualitas pengerjaan, transparansi biaya,
            dan pendekatan desain modern untuk menghasilkan ruang yang
            fungsional dan bernilai jangka panjang.
          </p>
        </motion.div>

        {/* ================= ICON ROW ================= */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          className="flex gap-6 overflow-x-auto pb-2 lg:overflow-visible"
        >
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex-shrink-0 w-[240px] sm:w-[260px] lg:flex-1"
              >
                <div className="h-full flex flex-col items-center text-center px-6 py-8 rounded-2xl border border-neutral-300 bg-white hover:border-neutral-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

                  {/* ICON */}
                  <div className="w-12 h-12 flex items-center justify-center rounded-full border border-neutral-400 text-neutral-800 group-hover:bg-neutral-900 group-hover:text-white transition-all duration-300">
                    <Icon size={22} strokeWidth={1.8} />
                  </div>

                  {/* TITLE */}
                  <h3 className="mt-5 text-sm font-semibold text-neutral-900">
                    {item.title}
                  </h3>

                  {/* DESC */}
                  <p className="mt-3 text-xs text-neutral-600 leading-relaxed">
                    {item.desc}
                  </p>

                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}