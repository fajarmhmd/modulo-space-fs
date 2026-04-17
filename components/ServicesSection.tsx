// components/ServicesSection.tsx

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { 
  ChevronDown, 
  ArrowRight, 
  Home, 
  Building2, 
  Paintbrush, 
  TreePine,
  CheckCircle2,
  X
} from "lucide-react";

/* ============================= */
/* DATA */
/* ============================= */

const layananData = [
  {
    id: "renovasi-rumah",
    title: "Renovasi Rumah",
    subtitle: "Hunian Lebih Nyaman & Modern",
    image: "/services/renovasi-rumah.png",
    icon: Home,
    description:
      "Transformasi total hunian Anda dengan solusi renovasi menyeluruh. Dari perbaikan struktural hingga sentuhan estetika modern.",
    features: [
      "Perbaikan & pembongkaran tembok",
      "Perapihan drainase air bersih & kotor",
      "Finishing cat interior & exterior",
      "Perbaikan struktur & plafon",
      "Upgrade instalasi listrik & plumbing",
    ],
    offer: {
      title: "Paket Hemat Renovasi",
      items: [
        "Survey & konsultasi GRATIS",
        "Desain 3D interior",
        "Garansi pekerjaan 1 tahun",
        "Cicilan 0% tenor 12 bulan"
      ]
    }
  },
  {
    id: "renovasi-gedung",
    title: "Renovasi Gedung",
    subtitle: "Solusi Komersial Profesional",
    image: "/services/renovasi-gedung.png",
    icon: Building2,
    description:
      "Renovasi profesional untuk gedung komersial, kantor, dan bangunan skala besar dengan minimal downtime operasional.",
    features: [
      "Peremajaan fasad & lobby",
      "Re-layout ruang kerja",
      "Perbaikan struktur & waterproofing",
      "Upgrade sistem elektrikal",
      "Finishing premium sesuai brand identity",
    ],
    offer: {
      title: "Paket Bisnis",
      items: [
        "Project manager dedicated",
        "Pengerjaan after office hours",
        "Sertifikasi standar industri",
        "Maintenance periodik"
      ]
    }
  },
  {
    id: "interior",
    title: "Interior Design",
    subtitle: "Elegansi & Fungsionalitas",
    image: "/services/interior.png",
    icon: Paintbrush,
    description:
      "Desain dan pengerjaan interior custom yang menggabungkan estetika elegan dengan fungsionalitas maksimal untuk setiap ruang.",
    features: [
      "Kitchen set & custom furniture",
      "Built-in wardrobe & kabinet",
      "Wallpanel & dekoratif panel",
      "Plafon modern & hidden lighting",
      "Finishing premium (HPL, Duco, Veneer)",
    ],
    offer: {
      title: "Paket Interior Lengkap",
      items: [
        "Konsultasi desainer interior",
        "Material sample gratis",
        "Instalasi profesional",
        "After-sales service 6 bulan"
      ]
    }
  },
  {
    id: "exterior",
    title: "Exterior Design",
    subtitle: "Tampilan Luar yang Eksklusif",
    image: "/services/exterior.png",
    icon: TreePine,
    description:
      "Penataan dan renovasi tampilan luar bangunan yang menciptakan first impression yang kuat dan tahan terhadap cuaca ekstrem.",
    features: [
      "Canopy & pagar minimalis",
      "Teralis & railing custom",
      "Finishing fasad modern",
      "Pengecatan & coating tahan cuaca",
      "Landscape & area taman",
    ],
    offer: {
      title: "Paket Curb Appeal",
      items: [
        "Desain konsep eksterior",
        "Material weather-resistant",
        "Pengerjaan cepat 7-14 hari",
        "Garansi cat 3 tahun"
      ]
    }
  },
];

/* MATERIAL */
const material = [
  { title: "Plywood", image: "/materials/plywood.jpg", desc: "Kokoh & tahan lama" },
  { title: "MDF", image: "/materials/mdf.jpg", desc: "Permukaan halus" },
  { title: "PVC Board", image: "/materials/pvc-board.jpg", desc: "Anti air & rayap" },
  { title: "Blockboard", image: "/materials/blockboard.jpg", desc: "Ringan & ekonomis" },
];

const finishing = [
  { title: "Duco", image: "/materials/duco.jpg", desc: "Finish mengkilap premium" },
  { title: "HPL", image: "/materials/hpl.jpg", desc: "Tahan gores & panas" },
  { title: "PVC Sheet", image: "/materials/pvc-sheet.jpg", desc: "Fleksibel & waterproof" },
  { title: "Veneer", image: "/materials/veneer.jpg", desc: "Serat kayu alami" },
];

/* ============================= */
/* COMPONENT */
/* ============================= */

export default function ServicesSection() {
  const [activeTab, setActiveTab] = useState<"layanan" | "material">("layanan");
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const activeService = layananData.find(s => s.id === selectedService);

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full mb-4">
            Layanan Kami
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Solusi Profesional <span className="text-blue-600">Interior & Renovasi</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Kami menghadirkan layanan berkualitas dengan pendekatan modern untuk memenuhi kebutuhan renovasi dan desain Anda.
          </p>
        </motion.div>

        {/* TAB NAVIGATION */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-200/80 p-1.5 rounded-full flex gap-1">
            {[
              { id: "layanan", label: "Layanan" },
              { id: "material", label: "Material & Finishing" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as "layanan" | "material");
                  setSelectedService(null);
                }}
                className={`px-6 sm:px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-white text-blue-600 shadow-lg"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ======================= */}
        {/* LAYANAN SECTION - NEW DESIGN */}
        {/* ======================= */}

        <AnimatePresence mode="wait">
          {activeTab === "layanan" && (
            <motion.div
              key="layanan"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
            >
              {layananData.map((service, index) => {
                const Icon = service.icon;
                const isSelected = selectedService === service.id;
                
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedService(isSelected ? null : service.id)}
                    className={`group relative cursor-pointer rounded-3xl overflow-hidden transition-all duration-500 ${
                      isSelected 
                        ? "ring-4 ring-blue-500 ring-offset-4" 
                        : "hover:shadow-2xl"
                    }`}
                  >
                    {/* Background Image */}
                    <div className="relative h-80 sm:h-96">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className={`absolute inset-0 transition-all duration-500 ${
                        isSelected 
                          ? "bg-gradient-to-t from-blue-900/95 via-blue-900/70 to-blue-900/40"
                          : "bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90"
                      }`} />
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end">
                      {/* Icon */}
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 ${
                        isSelected ? "bg-white/20 backdrop-blur-sm" : "bg-blue-600"
                      }`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>

                      {/* Title & Subtitle */}
                      <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                        {service.title}
                      </h3>
                      <p className="text-gray-200 text-sm sm:text-base mb-4">
                        {service.subtitle}
                      </p>

                      {/* Expand Indicator */}
                      <div className="flex items-center gap-2 text-white/80">
                        <span className="text-sm font-medium">
                          {isSelected ? "Tutup Detail" : "Lihat Detail & Penawaran"}
                        </span>
                        <motion.div
                          animate={{ rotate: isSelected ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown className="w-5 h-5" />
                        </motion.div>
                      </div>

                      {/* Expanded Content */}
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="mt-6 pt-6 border-t border-white/20"
                          >
                            <p className="text-white/90 text-sm sm:text-base mb-6 leading-relaxed">
                              {service.description}
                            </p>

                            {/* Features Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                              {service.features.map((feature, idx) => (
                                <div key={idx} className="flex items-start gap-2">
                                  <CheckCircle2 className="w-5 h-5 text-blue-300 flex-shrink-0 mt-0.5" />
                                  <span className="text-white/80 text-sm">{feature}</span>
                                </div>
                              ))}
                            </div>

                            {/* Special Offer Box */}
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/20">
                              <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                                {service.offer.title}
                              </h4>
                              <ul className="space-y-2">
                                {service.offer.items.map((item, idx) => (
                                  <li key={idx} className="flex items-center gap-2 text-white/80 text-sm">
                                    <ArrowRight className="w-4 h-4 text-blue-300" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* CTA Button */}
                            <button className="mt-6 w-full py-3.5 bg-white text-blue-900 font-semibold rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 group/btn">
                              Konsultasi Gratis
                              <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Selection Indicator */}
                    {isSelected && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg"
                      >
                        <X className="w-5 h-5 text-gray-900" />
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* ======================= */}
          {/* MATERIAL SECTION - ENHANCED */}
          {/* ======================= */}

          {activeTab === "material" && (
            <motion.div
              key="material"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-16"
            >
              {/* Material Grid */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                  Material Berkualitas
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {material.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -8, scale: 1.02 }}
                      className="group relative rounded-2xl overflow-hidden shadow-lg cursor-pointer"
                    >
                      <div className="relative h-48 sm:h-56">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                        <h4 className="text-white font-bold text-lg mb-1">{item.title}</h4>
                        <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                          {item.desc}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Finishing Grid */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                  Finishing Premium
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {finishing.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -8, scale: 1.02 }}
                      className="group relative rounded-2xl overflow-hidden shadow-lg cursor-pointer"
                    >
                      <div className="relative h-48 sm:h-56">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                        <h4 className="text-white font-bold text-lg mb-1">{item.title}</h4>
                        <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                          {item.desc}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}