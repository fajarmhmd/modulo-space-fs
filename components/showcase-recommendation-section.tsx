// components/showcase-recommendation-section.tsx
// PERBAIKAN: Update ID produk agar sesuai dengan productsData

"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";

function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID").format(n);
}

const renovasi = {
  title: "Program Renovasi Hunian",
  subtitle:
    "Upgrade dapur, kamar, ruang tamu, dan area utama dengan sistem kerja profesional, material berkualitas.",
  price: 3799000,
  image: "/cat-renovasi.png",
  bullets: [
    "Survey & pengukuran lokasi gratis",
    "RAB & timeline transparan",
    "Material standard / premium tersedia",
    "Quality control setiap tahap pengerjaan",
  ],
};

// PERBAIKAN: ID produk harus sesuai dengan ID di app/produk/[id]/page.tsx
const products = [
  {
    id: "kitchen-set-1",  // PERBAIKAN: dari 1 menjadi "kitchen-set-1"
    name: "Kitchen Set Custom",
    image: "/cat-interior.png",
    size: "/ m²",
    price: 3500000,
    originalPrice: 4200000,
    discount: 17,
    voucher: 5,
  },
  {
    id: "lemari-sliding-1",  // PERBAIKAN: dari 2 menjadi "lemari-sliding-1"
    name: "Lemari Sliding",
    image: "/cat-interior.png",
    size: "per meter",
    price: 2750000,
    originalPrice: 3200000,
    discount: 14,
    voucher: 5,
  },
  {
    id: "canopy-1",  // PERBAIKAN: dari 3 menjadi "canopy-1"
    name: "Canopy Minimalis",
    image: "/cat-exterior.png",
    size: "/ m²",
    price: 850000,
    originalPrice: 990000,
    discount: 14,
    voucher: 3,
  },
  {
    id: "pintu-aluminium-1",  // PERBAIKAN: dari 4 menjadi "pintu-aluminium-1"
    name: "Pintu Aluminium",
    image: "/cat-exterior.png",
    size: "/ m²",
    price: 2100000,
    originalPrice: 2500000,
    discount: 16,
    voucher: 4,
  },
  {
    id: "backdrop-tv-1",  // PERBAIKAN: dari 5 menjadi "backdrop-tv-1"
    name: "Backdrop TV Panel",
    image: "/cat-interior.png",
    size: "per meter",
    price: 2400000,
    originalPrice: 2900000,
    discount: 18,
    voucher: 5,
  },
  {
    id: "pager-besi-1",  // PERBAIKAN: dari 6 menjadi "pager-besi-1"
    name: "Pager Besi Minimalis",
    image: "/cat-exterior.png",
    size: "per meter",
    price: 780000,
    originalPrice: 920000,
    discount: 15,
    voucher: 3,
  },
];

export default function ShowcaseRecommendationSection() {
  const [page, setPage] = useState(0);
  const [lock, setLock] = useState(false);
  const [perView, setPerView] = useState(1);
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) setPerView(3);
      else if (window.innerWidth >= 640) setPerView(2);
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
    const t = setTimeout(() => setLock(false), 500);
    return () => clearTimeout(t);
  }, [page]);

  useEffect(() => {
    timer.current = setInterval(next, 6000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [pages]);

  const translate = `-${page * 100}%`;

  return (
    <section className="w-full bg-gradient-to-b from-white to-neutral-50 py-14 sm:py-18 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ===== HEADER ===== */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.96, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 1,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mb-12"
        >
          <div className="text-xs font-semibold tracking-[0.3em] text-neutral-600 uppercase mb-3">
            Highlight Penawaran
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
            Rekomendasi Produk
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10 items-stretch">

          {/* ===== RENOVASI CARD ===== */}
          <motion.div
            initial={{ opacity: 0, y: 80, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 1,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="rounded-3xl border border-neutral-300 bg-white shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col overflow-hidden"
          >
            <div className="relative h-52">
              <Image
                src={renovasi.image}
                alt="Renovasi"
                fill
                className="object-cover"
              />
            </div>

            <div className="p-6 flex flex-col flex-1">

              <div className="text-xs font-semibold text-neutral-600 uppercase tracking-wide mb-2">
                Penawaran Renovasi
              </div>

              <h3 className="font-bold text-xl text-neutral-900 tracking-tight">
                {renovasi.title}
              </h3>

              <p className="text-sm text-neutral-700 mt-3 leading-relaxed">
                {renovasi.subtitle}
              </p>

              <div className="mt-5 space-y-2 text-sm text-neutral-800">
                {renovasi.bullets.map((b) => (
                  <div key={b} className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-black mt-1" />
                    {b}
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-6">
                <div className="text-xs text-neutral-600">Mulai dari</div>
                <div className="text-2xl font-extrabold text-neutral-900">
                  Rp {formatRupiah(renovasi.price)}
                </div>

                <button className="mt-4 w-full bg-black hover:bg-neutral-800 text-white py-3 rounded-2xl font-semibold transition">
                  Konsultasi & Survey
                </button>
              </div>
            </div>
          </motion.div>

          {/* ===== SLIDER ===== */}
          <motion.div
            initial={{ opacity: 0, y: 100, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{
              duration: 1.1,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="lg:col-span-2 overflow-hidden"
          >
            <div
              className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ transform: `translateX(${translate})` }}
            >
              {Array.from({ length: pages }).map((_, pageIndex) => (
                <div
                  key={pageIndex}
                  className="min-w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {products
                    .slice(
                      pageIndex * perView,
                      pageIndex * perView + perView
                    )
                    .map((p) => (
                      <ProductCard key={p.id} {...p} />
                    ))}
                </div>
              ))}
            </div>

            {/* ===== CONTROLS ===== */}
            <div className="flex gap-4 mt-8">
              <button
                onClick={prev}
                className="w-12 h-12 rounded-full bg-black text-white hover:bg-neutral-800 flex items-center justify-center shadow-lg transition"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={next}
                className="w-12 h-12 rounded-full bg-black text-white hover:bg-neutral-800 flex items-center justify-center shadow-lg transition"
              >
                <ChevronRight size={20} />
              </button>
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}