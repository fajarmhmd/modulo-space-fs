// components/ServicesSection.tsx

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { 
  ChevronDown, 
  ArrowRight, 
  Home, 
  Store, 
  Paintbrush, 
  TreePine,
  CheckCircle2,
  X,
  ShoppingCart,
  MessageCircle,
  Phone,
  Mail,
  User,
  Send,
  Loader2,
  MapPin,
  CheckCircle,
  LayoutGrid,
  ChevronRight,
  Eye
} from "lucide-react";

// Nomor WhatsApp tujuan
const WHATSAPP_NUMBER = "6289509478009";

/* ============================= */
/* DATA - LAYANAN */
/* ============================= */

const layananData = [
  {
    id: "renovasi-rumah",
    title: "Renovasi Rumah",
    subtitle: "Hunian Lebih Nyaman & Modern",
    image: "/renovasi-rumah.png",
    icon: Home,
    isRuko: true,
    description:
      "Solusi renovasi rumah dengan biaya terjangkau, hasil rapi, dan pengerjaan profesional untuk hunian lebih nyaman, modern, dan bernilai tinggi.",
    features: [
      "Perbaikan struktur & pembongkaran",
      "Instalasi plumbing & listrik",
      "Finishing cat interior & eksterior",
      "Renovasi dapur & kamar mandi",
      "Pemasangan lantai & plafon",
    ],
    offer: {
      title: "Paket Lengkap Renovasi",
      items: [
        "Survey & konsultasi GRATIS",
        "Desain 3D interior rumah",
        "RAB detail & transparan",
        "Garansi Pekerjaan"
      ]
    }
  },
  {
    id: "renovasi-ruko",
    title: "Renovasi Gedung",
    subtitle: "Bisnis Lebih Profesional & Menarik",
    image: "/renovasi-gedung.png",
    icon: Store,
    isRuko: true,
    description:
      "Renovasi Gedung, Sekolah, Bangunan ruko,dll dengan desain menarik, layout optimal untuk display produk, dan pengerjaan cepat untuk meningkatkan daya tarik bisnis Anda.",
    features: [
      "Desain facade & signage menarik",
      "Layout optimal display produk",
      "Sistem pencahayaan & spot lighting",
      "Instalasi keamanan & CCTV",
      "Branding & identitas",
    ],
    offer: {
      title: "Paket Gedung",
      items: [
        "Survey & konsultasi GRATIS",
        "Desain GRATIS",
        "Konsultasi branding bisnis",
        "Material berkualitas",
        "Garansi Pekerjaan",
      ]
    }
  },
  {
    id: "interior",
    title: "Interior Design",
    subtitle: "Elegansi & Fungsionalitas Maksimal",
    image: "/cat-interior.png",
    icon: Paintbrush,
    isRuko: false,
    description:
      "Desain dan pengerjaan interior custom yang menggabungkan estetika elegan dengan fungsionalitas maksimal untuk setiap ruang hidup Anda.",
    features: [
      "Kitchen set & custom furniture",
      "Built-in wardrobe & kabinet",
      "Wallpanel & dekoratif dinding",
      "Plafon modern & hidden lighting",
      "Finishing premium (HPL, Duco, Veneer)",
    ],
    offer: {
      title: "Paket Interior Lengkap",
      items: [
        "Survey & konsultasi GRATIS",
        "Konsultasi desainer interior",
        "Material berkualitas",
        "Instalasi profesional",
        "Garansi pekerjaan"
      ]
    }
  },
  {
    id: "exterior",
    title: "Exterior Design",
    subtitle: "Tampilan Luar yang Memukau",
    image: "/services/exterior.png",
    icon: TreePine,
    isRuko: false,
    description:
      "Penataan dan renovasi tampilan luar bangunan yang menciptakan first impression yang kuat dan tahan terhadap cuaca ekstrem.",
    features: [
      "Canopy & pagar minimalis",
      "Teralis & railing custom",
      "Finishing fasad modern",
      "Pengecatan & coating tahan cuaca",
      "Landscape & taman estetik",
    ],
    offer: {
      title: "Paket Curb Appeal",
      items: [
        "Survey & konsultasi GRATIS",
        "Desain konsep eksterior",
        "Desain konsep eksterior",
        "Pengerjaan cepat 7-14 hari",
        "Desain konsep eksterior"
      ]
    }
  },
];

/* ============================= */
/* DATA - MATERIAL PER KATEGORI */
/* ============================= */

const materialData = {
  interior: [
    { title: "Plywood", image: "/polywood.jpg", desc: "Kokoh & tahan lama untuk furniture" },
    { title: "MDF", image: "/mdf.jpg", desc: "Permukaan halus ideal untuk finishing" },
    { title: "HMR", image: "/hmr.jpg", desc: "Anti air & rayap untuk area lembab" },
    { title: "PVC Board", image: "/pvc.jpg", desc: "Ringan & ekonomis untuk plafon" },
    { title: "Gypsum", image: "/gypsum.jpg", desc: "Tahan api & mudah dibentuk" },
    { title: "GRC Board", image: "/grc.jpg", desc: "Kuat & tahan cuaca untuk dinding" },
  ],
  exterior: [
    { title: "Aluminium Composite", image: "/acp.jpg", desc: "Tahan cuaca & modern untuk fasad" },
    { title: "Batu Alam", image: "/batualam.jpg", desc: "Estetik alami & tahan lama" },
    { title: "Fiber Cement", image: "/fiber-cement.jpg", desc: "Anti rayap & tahan air" },
    { title: "WPC", image: "/wpc.jpg", desc: "Wood-plastic composite untuk outdoor" },
    { title: "Kaca Tempered", image: "/tempered.jpg", desc: "Kuat & aman untuk railing" },
    { title: "Besi Hollow", image: "/hollow.jpg", desc: "Kokoh untuk canopy & pagar" },
  ],
  renovasi: [
    { title: "Beton Ready Mix", image: "/beton.jpg", desc: "Kualitas terjamin untuk struktur" },
    { title: "Bata Ringan", image: "/bata-ringan.jpg", desc: "Ringan & efisien untuk dinding" },
    { title: "Semen Mortar", image: "/semen-mortar.jpg", desc: "Praktis untuk plester & pasangan" },
    { title: "Waterproofing", image: "/waterprofing-sika.jpg", desc: "Anti bocor untuk area basah" },
    { title: "Keramik", image: "/keramiksatu.jpg", desc: "Tahan gores & mudah dibersihkan" },
    { title: "Granit", image: "/granit.jpeg", desc: "Premium & elegan untuk lantai" },
  ],
};

/* ============================= */
/* DATA - FINISHING PER KATEGORI */
/* ============================= */

const finishingData = {
  interior: [
    { title: "Duco", image: "/duco.jpg", desc: "Finish mengkilap premium untuk furniture" },
    { title: "HPL", image: "/hpl.jpg", desc: "Tahan gores & panas untuk permukaan" },
    { title: "PVC Sheet", image: "/pvc-seet.jpg", desc: "Fleksibel & waterproof untuk dinding" },
    { title: "Veneer", image: "/veneer.jpg", desc: "Serat kayu alami yang elegan" },
    { title: "Laminate", image: "/laminated.jpg", desc: "Beragam motif & mudah perawatan" },
    { title: "Wallpaper 3D", image: "/wallpaper.jpg", desc: "Tekstur menarik untuk accent wall" },
  ],
  exterior: [
    { title: "Cat Tembok Exterior", image: "/cat-tembok.jpg", desc: "Tahan cuaca & anti jamur" },
    { title: "Wood Stain", image: "/wood-stain.jpg", desc: "Melindungi & mempercantik kayu outdoor" },
    { title: "Epoxy Coating", image: "/epoxy.jpg", desc: "Tahan kimia & mengkilap untuk lantai" },
    { title: "Texture Paint", image: "/texture-paint.jpg", desc: "Efek tekstur unik untuk fasad" },
    { title: "Clear Coat UV", image: "/uv.jpg", desc: "Melindungi dari sinar UV" },
    { title: "Anti Karat", image: "/anti-karat.jpg", desc: "Melindungi besi dari korosi" },
  ],
  renovasi: [
    { title: "Cat Tembok Interior", image: "/cat-interior.jpg", desc: "Warna tahan lama & mudah dibersihkan" },
    { title: "Plamir", image: "/plamir.png", desc: "Dasar cat untuk hasil maksimal" },
    { title: "Cat Duco Spray", image: "/duco-spray.jpg", desc: "Hasil halus untuk furniture lama" },
    { title: "Cat Besi", image: "/cat-besi.jpg", desc: "Tahan karat untuk railing & canopy" },
    { title: "Cat Kayu", image: "/cat-kayu.jpg", desc: "Melindungi & mempercantik kayu" },
    { title: "Thinner & Solvent", image: "/thinner.jpg", desc: "Pengencer untuk hasil optimal" },
  ],
};

type CategoryKey = "interior" | "exterior" | "renovasi";

const categoryLabels: Record<CategoryKey, string> = {
  interior: "Interior",
  exterior: "Exterior", 
  renovasi: "Renovasi",
};

const categoryIcons: Record<CategoryKey, typeof Home> = {
  interior: Paintbrush,
  exterior: TreePine,
  renovasi: Home,
};

/* ============================= */
/* COMPONENT */
/* ============================= */

export default function ServicesSection() {
  const [activeTab, setActiveTab] = useState<"layanan" | "material">("layanan");
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedServiceTitle, setSelectedServiceTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // State untuk material & finishing toggle per kategori
  const [expandedMaterial, setExpandedMaterial] = useState<Record<CategoryKey, boolean>>({
    interior: false,
    exterior: false,
    renovasi: false,
  });
  
  const [expandedFinishing, setExpandedFinishing] = useState<Record<CategoryKey, boolean>>({
    interior: false,
    exterior: false,
    renovasi: false,
  });

  // Form states
  const [consultForm, setConsultForm] = useState({
    nama: "",
    whatsapp: "",
    email: "",
    pesan: ""
  });
  
  const [orderForm, setOrderForm] = useState({
    nama: "",
    whatsapp: "",
    alamat: "",
    detail: ""
  });

  const toggleMaterial = (category: CategoryKey) => {
    setExpandedMaterial(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const toggleFinishing = (category: CategoryKey) => {
    setExpandedFinishing(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const handleConsultClick = (e: React.MouseEvent, serviceTitle: string) => {
    e.stopPropagation();
    setSelectedServiceTitle(serviceTitle);
    setIsConsultModalOpen(true);
    setConsultForm({ nama: "", whatsapp: "", email: "", pesan: "" });
  };

  const handleOrderClick = (e: React.MouseEvent, serviceTitle: string) => {
    e.stopPropagation();
    setSelectedServiceTitle(serviceTitle);
    setIsOrderModalOpen(true);
    setOrderForm({ nama: "", whatsapp: "", alamat: "", detail: "" });
  };

  const closeModals = () => {
    setIsConsultModalOpen(false);
    setIsOrderModalOpen(false);
    setShowSuccess(false);
    setSelectedServiceTitle("");
  };

  const handleConsultInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setConsultForm(prev => ({ ...prev, [name]: value }));
  };

  const handleOrderInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOrderForm(prev => ({ ...prev, [name]: value }));
  };

  const handleConsultSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const message = `*KONSULTASI BARU*%0A%0A` +
      `*Layanan:* ${selectedServiceTitle}%0A` +
      `*Nama:* ${consultForm.nama}%0A` +
      `*WhatsApp:* ${consultForm.whatsapp}%0A` +
      `*Email:* ${consultForm.email || '-'}%0A%0A` +
      `*Pesan:*%0A${consultForm.pesan}%0A%0A` +
      `Mohon ditindaklanjuti. Terima kasih.`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
    setIsLoading(false);
    setShowSuccess(true);
    setTimeout(() => closeModals(), 2000);
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const message = `*PESANAN BARU*%0A%0A` +
      `*Layanan:* ${selectedServiceTitle}%0A` +
      `*Nama:* ${orderForm.nama}%0A` +
      `*WhatsApp:* ${orderForm.whatsapp}%0A%0A` +
      `*Alamat:*%0A${orderForm.alamat}%0A%0A` +
      `*Detail Pesanan:*%0A${orderForm.detail}%0A%0A` +
      `Mohon segera diproses. Terima kasih.`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
    setIsLoading(false);
    setShowSuccess(true);
    setTimeout(() => closeModals(), 2000);
  };

  // Render grid material/finishing per kategori
  const renderCategoryGrid = (
    items: typeof materialData.interior,
    isExpanded: boolean,
    category: CategoryKey
  ) => {
    const displayItems = isExpanded ? items : [items[0]];
    
    return (
      <motion.div 
        layout
        className={`grid gap-3 sm:gap-4 lg:gap-5 ${
          isExpanded 
            ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6" 
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        }`}
      >
        <AnimatePresence mode="popLayout">
          {displayItems.map((item, index) => (
            <motion.div
              key={`${category}-${item.title}`}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="group relative rounded-xl sm:rounded-2xl overflow-hidden shadow-lg cursor-pointer bg-white"
            >
              <div className={`relative overflow-hidden ${isExpanded ? 'h-32 sm:h-40 lg:h-48' : 'h-40 sm:h-48 lg:h-56'}`}>
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                <h4 className="text-white font-bold text-sm sm:text-base lg:text-lg mb-0.5 sm:mb-1">{item.title}</h4>
                <p className="text-gray-300 text-xs sm:text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 line-clamp-2">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    );
  };

  // Render toggle button
  const renderToggleButton = (
    isExpanded: boolean,
    onToggle: () => void,
    category: CategoryKey,
    count: number
  ) => {
    const Icon = categoryIcons[category];
    const label = categoryLabels[category];
    
    return (
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl transition-all duration-300 ${
          isExpanded 
            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25" 
            : "bg-white text-gray-800 shadow-md hover:shadow-lg border border-gray-100"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${
            isExpanded ? "bg-white/20" : "bg-blue-50"
          }`}>
            <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${isExpanded ? "text-white" : "text-blue-600"}`} />
          </div>
          <div className="text-left">
            <h4 className="font-bold text-sm sm:text-base lg:text-lg">{label}</h4>
            <p className={`text-xs sm:text-sm ${isExpanded ? "text-blue-100" : "text-gray-500"}`}>
              {isExpanded ? `Menampilkan ${count} material` : `Tampilkan ${count} material`}
            </p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.2 }}
          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
            isExpanded ? "bg-white/20" : "bg-gray-100"
          }`}
        >
          {isExpanded ? (
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            <LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </motion.div>
      </motion.button>
    );
  };

  return (
    <section className="py-10 sm:py-16 lg:py-20 xl:py-15 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-4 sm:mb-12 lg:mb-16"
        >
          <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 bg-blue-100 text-blue-700 text-xs sm:text-base font-semibold rounded-full mb-3 sm:mb-4">
            Layanan Kami
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
            Solusi Profesional <span className="text-blue-600">Renovasi & Desain</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg px-2 sm:px-0">
            Kami menghadirkan layanan berkualitas dengan pendekatan modern untuk memenuhi kebutuhan renovasi rumah, ruko, dan desain interior eksterior Anda.
          </p>
        </motion.div>

        {/* TAB NAVIGATION */}
        <div className="flex justify-center mb-6 sm:mb-12">
          <div className="bg-gray-200/80 p-1 rounded-full flex gap-1 w-full max-w-xs sm:max-w-none sm:w-auto">
            {[
              { id: "layanan", label: "Layanan" },
              { id: "material", label: "Material" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as "layanan" | "material");
                  setSelectedService(null);
                }}
                className={`flex-1 sm:flex-none px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
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

        {/* LAYANAN SECTION */}
        <AnimatePresence mode="wait">
          {activeTab === "layanan" && (
            <motion.div
              key="layanan"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8"
            >
              {layananData.map((service, index) => {
                const Icon = service.icon;
                const isSelected = selectedService === service.id;
                const isRuko = service.isRuko;
                
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedService(isSelected ? null : service.id)}
                    className={`group relative cursor-pointer rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 ${
                      isSelected 
                        ? "ring-2 sm:ring-4 ring-blue-500 ring-offset-2 sm:ring-offset-4 shadow-2xl" 
                        : "hover:shadow-xl sm:hover:shadow-2xl"
                    }`}
                  >
                    <div className="relative min-h-[420px] sm:min-h-[480px] md:min-h-[520px] lg:min-h-[560px]">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className={`absolute inset-0 transition-all duration-500 ${
                        isSelected 
                          ? "bg-gradient-to-t from-blue-950/98 via-blue-900/90 to-blue-800/70"
                          : "bg-gradient-to-t from-black/90 via-black/50 to-black/20 group-hover:from-black/95"
                      }`} />
                    </div>

                    <div className="absolute inset-0 p-4 sm:p-6 lg:p-8 flex flex-col justify-end overflow-hidden lg:overflow-visible">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center mb-2 sm:mb-3 lg:mb-4 transition-all duration-300 flex-shrink-0 ${
                        isSelected ? "bg-white/20 backdrop-blur-sm" : "bg-blue-600"
                      }`}>
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
                      </div>

                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2 leading-tight">
                        {service.title}
                      </h3>
                      <p className="text-gray-200 text-sm sm:text-base mb-2 sm:mb-3 lg:mb-4 line-clamp-2">
                        {service.subtitle}
                      </p>

                      <div className="flex items-center gap-2 text-white/80 flex-shrink-0">
                        <span className="text-xs sm:text-sm font-medium">
                          {isSelected ? "Tutup Detail" : "Lihat Detail"}
                        </span>
                        <motion.div
                          animate={{ rotate: isSelected ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                        </motion.div>
                      </div>

                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="mt-3 sm:mt-4 lg:mt-6 pt-3 sm:pt-4 lg:pt-6 border-t border-white/20 overflow-y-auto lg:overflow-visible max-h-[45vh] sm:max-h-[50vh] lg:max-h-none scrollbar-hide"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                          >
                            <p className="text-white/90 text-sm sm:text-base mb-3 sm:mb-4 lg:mb-6 leading-relaxed">
                              {service.description}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4 lg:mb-6">
                              {service.features.map((feature, idx) => (
                                <div key={idx} className="flex items-start gap-2">
                                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-300 flex-shrink-0 mt-0.5" />
                                  <span className="text-white/80 text-xs sm:text-sm">{feature}</span>
                                </div>
                              ))}
                            </div>

                            <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 border border-white/20 mb-3 sm:mb-4 lg:mb-6">
                              <h4 className="text-white font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                                <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                                {service.offer.title}
                              </h4>
                              <ul className="space-y-1.5 sm:space-y-2">
                                {service.offer.items.map((item, idx) => (
                                  <li key={idx} className="flex items-center gap-2 text-white/80 text-xs sm:text-sm">
                                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-blue-300 flex-shrink-0" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className={`flex gap-2 sm:gap-3 ${isRuko ? 'flex-col' : 'flex-col sm:flex-row'}`}>
                              <button 
                                onClick={(e) => handleConsultClick(e, service.title)}
                                className={`py-3 px-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2 text-sm min-h-[48px] ${isRuko ? 'w-full' : 'flex-1'}`}
                              >
                                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="hidden sm:inline">Konsultasi Gratis</span>
                                <span className="sm:hidden">Konsultasi</span>
                              </button>
                              
                              {!isRuko && (
                                <button 
                                  onClick={(e) => handleOrderClick(e, service.title)}
                                  className="flex-1 py-3 px-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 text-sm min-h-[48px]"
                                >
                                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                                  Pesan Sekarang
                                </button>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {isSelected && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center shadow-lg"
                      >
                        <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-900" />
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* MATERIAL SECTION - BARU */}
          {activeTab === "material" && (
            <motion.div
              key="material"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-10 sm:space-y-14 lg:space-y-20"
            >
              {/* === MATERIAL BERKUALITAS === */}
              <div>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center mb-6 sm:mb-8"
                >
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs sm:text-sm font-semibold rounded-full mb-3">
                    Pilihan Terbaik
                  </span>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                    Material <span className="text-blue-600">Berkualitas</span>
                  </h3>
                  <p className="text-gray-500 mt-2 text-sm sm:text-base max-w-xl mx-auto">
                    Material premium yang kami gunakan untuk setiap proyek, dikelompokkan berdasarkan kebutuhan Anda.
                  </p>
                </motion.div>

                <div className="space-y-4 sm:space-y-6">
                  {(Object.keys(materialData) as CategoryKey[]).map((category) => (
                    <motion.div
                      key={`material-${category}`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="space-y-3 sm:space-y-4"
                    >
                      {renderToggleButton(
                        expandedMaterial[category],
                        () => toggleMaterial(category),
                        category,
                        materialData[category].length
                      )}
                      
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`${category}-${expandedMaterial[category]}`}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          {renderCategoryGrid(
                            materialData[category],
                            expandedMaterial[category],
                            category
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* === FINISHING PREMIUM === */}
              <div>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center mb-6 sm:mb-8"
                >
                  <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 text-xs sm:text-sm font-semibold rounded-full mb-3">
                    Sentuhan Akhir
                  </span>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                    Finishing <span className="text-amber-600">Premium</span>
                  </h3>
                  <p className="text-gray-500 mt-2 text-sm sm:text-base max-w-xl mx-auto">
                    Beragam pilihan finishing berkualitas untuk hasil maksimal pada setiap bagian proyek Anda.
                  </p>
                </motion.div>

                <div className="space-y-4 sm:space-y-6">
                  {(Object.keys(finishingData) as CategoryKey[]).map((category) => (
                    <motion.div
                      key={`finishing-${category}`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="space-y-3 sm:space-y-4"
                    >
                      {renderToggleButton(
                        expandedFinishing[category],
                        () => toggleFinishing(category),
                        category,
                        finishingData[category].length
                      )}
                      
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`${category}-${expandedFinishing[category]}`}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          {renderCategoryGrid(
                            finishingData[category],
                            expandedFinishing[category],
                            category
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* MODAL KONSULTASI */}
      <AnimatePresence>
        {isConsultModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={closeModals}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {!showSuccess ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <MessageCircle className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Konsultasi Gratis</h3>
                        <p className="text-sm text-gray-500">{selectedServiceTitle}</p>
                      </div>
                    </div>
                    <button 
                      onClick={closeModals}
                      className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>

                  <form className="space-y-4" onSubmit={handleConsultSubmit}>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input 
                          type="text" 
                          name="nama"
                          value={consultForm.nama}
                          onChange={handleConsultInputChange}
                          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
                          placeholder="Masukkan nama Anda"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nomor WhatsApp *</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input 
                          type="tel" 
                          name="whatsapp"
                          value={consultForm.whatsapp}
                          onChange={handleConsultInputChange}
                          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
                          placeholder="08xxxxxxxxxx"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email (Opsional)</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input 
                          type="email" 
                          name="email"
                          value={consultForm.email}
                          onChange={handleConsultInputChange}
                          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
                          placeholder="modulospace@gmail.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pesan *</label>
                      <textarea 
                        name="pesan"
                        value={consultForm.pesan}
                        onChange={handleConsultInputChange}
                        className="w-full p-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none h-24 text-gray-900 placeholder:text-gray-400"
                        placeholder="Beritahu kami apa kebutuhan kebutuhan Anda..."
                        required
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 disabled:opacity-70 disabled:cursor-not-allowed"
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
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Berhasil!</h3>
                  <p className="text-gray-600">Data Anda telah dikirim ke WhatsApp.</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL PESAN SEKARANG */}
      <AnimatePresence>
        {isOrderModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={closeModals}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {!showSuccess ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <ShoppingCart className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Pesan Sekarang</h3>
                        <p className="text-sm text-gray-500">{selectedServiceTitle}</p>
                      </div>
                    </div>
                    <button 
                      onClick={closeModals}
                      className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>

                  <form className="space-y-4" onSubmit={handleOrderSubmit}>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input 
                          type="text" 
                          name="nama"
                          value={orderForm.nama}
                          onChange={handleOrderInputChange}
                          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
                          placeholder="Masukkan nama Anda"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nomor WhatsApp *</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input 
                          type="tel" 
                          name="whatsapp"
                          value={orderForm.whatsapp}
                          onChange={handleOrderInputChange}
                          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
                          placeholder="08xxxxxxxxxx"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap *</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <textarea 
                          name="alamat"
                          value={orderForm.alamat}
                          onChange={handleOrderInputChange}
                          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none h-20 text-gray-900 placeholder:text-gray-400"
                          placeholder="Masukkan alamat lengkap proyek..."
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Detail Pesanan *</label>
                      <textarea 
                        name="detail"
                        value={orderForm.detail}
                        onChange={handleOrderInputChange}
                        className="w-full p-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none h-24 text-gray-900 placeholder:text-gray-400"
                        placeholder="Jelaskan detail kebutuhan Anda..."
                        required
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-green-600/25 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Mengirim...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-5 h-5" />
                          Kirim ke WhatsApp
                        </>
                      )}
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Berhasil!</h3>
                  <p className="text-gray-600">Pesanan Anda telah dikirim ke WhatsApp.</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STYLE */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}