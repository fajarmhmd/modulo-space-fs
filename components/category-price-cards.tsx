// components/category-price-cards.tsx

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const categories = [
  {
    title: "Interior",
    slug: "interior",
    image: "/kitcen.png",
    pricePerMeter: 320000,
    desc: "Interior custom: kitchen set, wardrobe, panel dinding, kabinet dan built-in furniture dengan finishing premium.",
  },
  {
    title: "Exterior",
    slug: "exterior",
    image: "/canopy-exterior.jpg",
    pricePerMeter: 799000,
    desc: "Exterior & outdoor build: fasad, kanopi, storage luar ruang dan elemen tahan cuaca.",
  },
  {
    title: "Renovasi",
    slug: "renovasi",
    image: "/cat-renovasi.png",
    pricePerMeter: 1599000,
    desc: "Renovasi total & parsial mulai dari bongkar, desain ulang, hingga finishing detail.",
  },
];

function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID").format(n);
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 60, 
    scale: 0.9,
    filter: "blur(10px)" 
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      delay: i * 0.15,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  }),
};

const priceTagVariants = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.02,
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const }
  },
};

export default function CategoryPriceCards() {
  return (
<section id="kategori" className="w-full bg-gray-50/50 py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ================= HEADER ================= */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mb-8 sm:mb-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-12"
        >
          <motion.div variants={headerVariants} className="max-w-2xl">
            <motion.div 
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-blue-700 tracking-[0.15em] uppercase mb-4"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.3 }}
            >
              <span className="w-8 h-[2px] bg-blue-700" />
              Kategori Layanan
            </motion.div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-[1.15]">
              Pilih Jenis Pekerjaan
              <br className="hidden sm:block" />
              <span className="text-blue-900"> Sesuai Kebutuhan Anda</span>
            </h2>
          </motion.div>

          <motion.p 
            variants={headerVariants}
            className="text-gray-600 max-w-md text-sm sm:text-base leading-relaxed lg:text-right"
          >
            Estimasi harga menggunakan standar biaya per meter terbaru dan dapat
            disesuaikan material serta kompleksitas desain.
          </motion.p>
        </motion.div>

        {/* ================= GRID ================= */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {categories.map((c, i) => (
            <motion.div
              key={c.slug}
              custom={i}
              variants={cardVariants}
            >
              <Link href={`/kategori/${c.slug}`} className="block group h-full">
                <motion.div 
                  className="relative h-full rounded-3xl bg-white overflow-hidden shadow-sm hover:shadow-2xl transition-shadow duration-500"
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                >
                  {/* IMAGE CONTAINER */}
                  <div className="relative h-56 sm:h-60 lg:h-64 overflow-hidden">
                    <motion.div
                      className="absolute inset-0"
                      variants={{
                        rest: { scale: 1 },
                        hover: { 
                          scale: 1.08,
                          transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const }
                        }
                      }}
                    >
                      <Image
                        src={c.image}
                        alt={c.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </motion.div>
                    
                    {/* Gradient Overlay on Hover */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-blue-900/20 to-transparent"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                    />
                    
                    {/* Category Badge */}
                    <motion.div 
                      className="absolute top-4 left-4"
                      initial={{ opacity: 0, y: -10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                      viewport={{ once: true }}
                    >
                      <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-bold text-blue-900 shadow-lg">
                        {c.title}
                      </div>
                    </motion.div>

                    {/* Arrow Icon on Hover */}
                    <motion.div
                      className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg"
                      initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                      whileHover={{ opacity: 1, scale: 1, rotate: 0 }}
                      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const}}
                    >
                      <svg className="w-5 h-5 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </motion.div>
                  </div>

                  {/* CONTENT */}
                  <div className="p-6 flex flex-col gap-5">
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                      {c.desc}
                    </p>

                    {/* PRICE CARD - WARNA BIRU */}
                    <motion.div 
                      className="relative rounded-2xl bg-gradient-to-br from-blue-900 to-blue-800 text-white p-5 overflow-hidden"
                      variants={priceTagVariants}
                    >
                      {/* Decorative Elements */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-700/30 rounded-full -translate-y-1/2 translate-x-1/2" />
                      <div className="absolute bottom-0 left-0 w-20 h-20 bg-blue-600/20 rounded-full translate-y-1/2 -translate-x-1/2" />
                      
                      <div className="relative flex items-end justify-between">
                        <div>
                          <div className="text-xs uppercase tracking-wider text-blue-200 mb-1 font-medium">
                            Mulai dari
                          </div>
                          <div className="text-xl sm:text-2xl font-bold tracking-tight">
                            Rp {formatRupiah(c.pricePerMeter)}
                          </div>
                        </div>
                        <div className="text-sm font-medium text-blue-200">
                          / m²
                        </div>
                      </div>
                    </motion.div>

                    {/* CTA Link */}
                    <motion.div 
                      className="flex items-center gap-2 text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors duration-300"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span>Lihat Produk</span>
                      <motion.svg 
                        className="w-4 h-4" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        animate={{ x: [0, 3, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </motion.svg>
                    </motion.div>
                  </div>

                  {/* Bottom Border Animation */}
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-blue-400"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const }}
                    style={{ originX: 0 }}
                  />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}