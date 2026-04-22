// app/custom-interior/page.tsx

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { PhoneCall } from "lucide-react";
import ProcessSection from "@/components/ProcessSection";
import ServicesSection from "@/components/ServicesSection";
import CategoryPriceCards from "@/components/category-price-cards";
import WhyUsSection from "@/components/why-us-section";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CustomInteriorPage() {
  return (
    <>
    <Navbar />
      {/* ================= HERO SECTION ================= */}
      <section className="relative w-full min-h-screen overflow-hidden">

        {/* Background */}
        <Image
          src="/hero-custom.png"
          alt="Custom Interior"
          fill
          priority
          className="object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen px-6 text-center">
          <div className="max-w-4xl">

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight"
            >
              Ruang yang Elegan,
              <br />
              Dirancang Khusus Untuk Anda
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.9 }}
              className="mt-6 text-white/80 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto"
            >
              Kami menghadirkan desain interior custom yang menyatu
              dengan karakter, gaya hidup, dan kebutuhan ruang Anda —
              dengan detail presisi dan kualitas premium.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.9 }}
              className="mt-10"
            >
              <Link
                href="https://wa.me/6289509478009"
                target="_blank"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-semibold shadow-2xl transition duration-300 hover:scale-105"
              >
                <PhoneCall size={18} />
                Konsultasi Gratis
              </Link>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ================= PROCESS SECTION ================= */}
<section id="cara-kerja">
  <ProcessSection />
</section>
<section id="layanan">
  <ServicesSection />
</section>
  <WhyUsSection />
    <Footer />
   </>
  );
}