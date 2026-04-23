// components/ProcessSection.tsx

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

const steps = [
  {
    title: "Konsultasi Layanan",
    desc: "Kami memulai dengan memahami kebutuhan dan preferensi Anda secara mendalam untuk memastikan solusi interior yang personal dan tepat sasaran.",
    image: "/process/step1.png",
  },
  {
    title: "Survey Pengukuran",
    desc: "Tim profesional melakukan pengukuran langsung di lokasi untuk menjamin presisi dimensi dan kesesuaian teknis.",
    image: "/process/step2.png",
  },
  {
    title: "Pengajuan RAB",
    desc: "Rencana Anggaran Biaya disusun transparan dan detail agar Anda memiliki gambaran investasi sejak awal.",
    image: "/process/step3.png",
  },
  {
    title: "Produksi",
    desc: "Proses produksi dilakukan dengan material pilihan dan standar pengerjaan premium.",
    image: "/process/step4.png",
  },
  {
    title: "Instalasi",
    desc: "Pemasangan dilakukan secara presisi oleh tim berpengalaman untuk hasil yang rapi dan maksimal.",
    image: "/process/step5.png",
  },
  {
    title: "Handover Project",
    desc: "Tahap akhir berupa serah terima proyek dengan pengecekan menyeluruh untuk memastikan kualitas terbaik.",
    image: "/process/step6.png",
  },
];

export default function ProcessSection() {
  const [active, setActive] = useState<number | null>(0);

  const toggle = (index: number) => {
    setActive(active === index ? null : index);
  };

  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Dari Konsultasi Hingga
            <span className="block text-blue-600">
              Ruang Impianmu Terwujud
            </span>
          </h2>
          <p className="mt-4 text-gray-800 max-w-2xl mx-auto text-sm sm:text-base">
            Proses kerja profesional dan terstruktur untuk memastikan
            setiap detail ruang Anda tercipta dengan presisi dan kualitas terbaik.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* ================= LEFT LIST ================= */}
          <div className="space-y-5">

            {steps.map((step, index) => {
              const isOpen = active === index;

              return (
                <div
                  key={index}
                  className="border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg"
                >
                  <button
                    onClick={() => toggle(index)}
                    className="w-full flex justify-between items-center p-6 text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>

                      <span className="font-semibold text-base text-gray-900">
                        {step.title}
                      </span>
                    </div>

                    <ChevronDown
                      className={`transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-blue-600" : "text-gray-800"
                      }`}
                      size={20}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="px-6 pb-6"
                      >
                        <p className="text-gray-900 text-sm sm:text-base mb-6 leading-relaxed">
                          {step.desc}
                        </p>

                        {/* ===== MOBILE IMAGE (MUNCUL DI DALAM ITEM) ===== */}
                        <div className="lg:hidden relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                          <Image
                            src={step.image}
                            alt={step.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

          </div>

          {/* ================= RIGHT IMAGE (DESKTOP ONLY) ================= */}
          <div className="hidden lg:block relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">

            <AnimatePresence mode="wait">
              {active !== null && (
                <motion.div
                  key={steps[active].image}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={steps[active].image}
                    alt="Process Image"
                    fill
                    className="object-cover"
                  />
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>
      </div>
    </section>
  );
}