// components/OrderFlowSection.tsx

"use client";

import { motion } from "framer-motion";
import {
  PencilRuler,
  ScanLine,
  ReceiptText,
  Cog,
  Drill,
  BadgeCheck,
} from "lucide-react";

const steps = [
  { icon: PencilRuler, title: "Konsultasi desain" },
  { icon: ScanLine, title: "Survey pengukuran" },
  { icon: ReceiptText, title: "Pengajuan RAB" },
  { icon: Cog, title: "Produksi" },
  { icon: Drill, title: "Instalasi projek" },
  { icon: BadgeCheck, title: "Handover projek" },
];

export default function OrderFlowSection() {
  return (
<section className="relative w-full bg-gradient-to-b from-white to-gray-50 py-10 pt-10 sm:py-16 lg:py-15 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">

        {/* ===== HEADER ===== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto mb-10 sm:mb-14"
                  >
          <div className="text-sm sm:text-base tracking-[0.35em] uppercase text-gray-500 mb-4 font-semibold">
            Proses Kerja Kami
          </div>

          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
            Alur Pemesanan Profesional & Terstruktur
          </h2>

          <p className="mt-4 text-gray-500 text-sm sm:text-base leading-relaxed">
            Setiap tahap dirancang dengan sistem kerja yang rapi untuk menjaga
            kualitas, transparansi, dan hasil akhir terbaik.
          </p>
        </motion.div>

        {/* ===== CONNECTOR LINE (DESKTOP) ===== */}
        <div className="hidden lg:block absolute top-[58%] left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        {/* ===== STEPS ===== */}
        <div className="relative grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-12">

          {steps.map((step, i) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -8 }}
                className="group flex flex-col items-center text-center"
              >
                {/* ICON CONTAINER */}
                <div className="relative w-20 h-20 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center transition-all duration-500 group-hover:shadow-2xl group-hover:border-blue-600 group-hover:bg-blue-600">

                  {/* Elegant step number */}
                  <span className="absolute -top-3 -right-3 text-xs font-semibold text-gray-400 group-hover:text-blue-600 transition">
                    0{i + 1}
                  </span>

                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    transition={{ type: "spring" as const, stiffness: 300 }}
                  >
                    <Icon
                      size={30}
                      className="text-gray-800 group-hover:text-white transition"
                    />
                  </motion.div>
                </div>

                {/* TITLE */}
                <p className="mt-5 text-sm font-medium text-gray-800 group-hover:text-blue-700 transition">
                  {step.title}
                </p>
              </motion.div>
            );
          })}

        </div>

      </div>
    </section>
  );
}