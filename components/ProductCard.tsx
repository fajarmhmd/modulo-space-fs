// components/ProductCard.tsx
// DISAMAKAN dengan ProductCardV3 dari showcase-recommendation-section

"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Truck, ArrowRight } from "lucide-react";


function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID").format(n);
}

type Props = {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  size?: string;
  discount: number;
  voucher: number;
  badge?: string;
  index?: number; // untuk stagger animasi
};

export default function ProductCard({
  id,
  name,
  image,
  price,
  originalPrice,
  size,
  index = 0,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        delay: index * 0.1,
        type: "spring",
        stiffness: 100,
        damping: 15,
      }}
    >
      <Link href={`/produk/${id}`} className="group block h-full">
        <motion.div
          whileHover={{ y: -8 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="bg-white rounded-2xl sm:rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-blue-200/20 transition-shadow duration-500 overflow-hidden flex flex-col h-full"
        >
          {/* ── Image ── */}
          <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-100 flex-shrink-0">
            <motion.div
              // whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="w-full h-full"
            >
              <Image
                src={image}
                alt={name}
                fill
                className="object-cover"
              />
            </motion.div>

            {/* Subtle gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />


          </div>

          {/* ── Content ── */}
          <div className="p-5 sm:p-6 flex flex-col flex-1">
            <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-snug mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
              {name}
            </h3>

            {/* ── Price Section ── */}
            <div className="mb-4">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Rp {formatRupiah(price)}
                </span>
                {size && (
                  <span className="text-xs text-slate-400 font-medium">{size}</span>
                )}
              </div>
              <div className="text-sm text-slate-400 line-through">
                Rp {formatRupiah(originalPrice)}{size ? ` ${size}` : ""}
              </div>
            </div>

            {/* ── Gratis Design 3D & Survey Lokasi ── */}
            <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-blue-50 rounded-xl border border-blue-100">
              <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span className="text-xs sm:text-sm text-blue-700 font-semibold">
                Gratis Design 3D & Survey Lokasi
              </span>
            </div>

            {/* ── Gratis Ongkir Jabodetabek ── */}
            <div className="flex items-center gap-2 mb-5 px-3 py-2 bg-green-50 rounded-xl border border-green-100">
              <Truck size={16} className="text-green-600 flex-shrink-0" />
              <span className="text-xs sm:text-sm text-green-700 font-semibold">
                Gratis Ongkir Jabodetabek
              </span>
            </div>

            {/* ── CTA Button ── */}
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