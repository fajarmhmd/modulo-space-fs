// app/tentang/page.tsx

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import WhyUsSection from "@/components/why-us-section";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";


export default function TentangPage() {
  return (

    <>
      <Navbar />
    <div className="bg-white text-neutral-900">

      {/* ================= HERO ================= */}
      <section className="relative w-full min-h-screen overflow-hidden">

        <Image
          src="/hero-custom.png"
          alt="Tentang Modulo Space"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 flex items-center justify-center min-h-screen px-6 text-center">
          <div className="max-w-5xl">

            <motion.h1
              initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1 }}
              className="text-3xl sm:text-5xl lg:text-7xl font-semibold text-white leading-tight"
            >
              Modular Thinking
              <br />
              For Better Space
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mt-6 text-white/80 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg"
            >
              Kami percaya bahwa setiap ruang memiliki potensi untuk menjadi
              lebih fungsional dan lebih bernilai melalui pendekatan modular.
            </motion.p>

          </div>
        </div>
      </section>


      {/* ================= SECTION TEXT ================= */}
      <section className="max-w-7xl mx-auto px-6 py-24">

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <div className="text-sm uppercase tracking-[0.3em] text-neutral-500 mb-6">
            Tentang Kami
          </div>

          <h2 className="text-3xl sm:text-5xl font-semibold leading-tight">
            Menghadirkan Keindahan &
            <br />
            Kenyamanan di Setiap Ruang
          </h2>

          <p className="mt-6 text-neutral-600 max-w-3xl text-sm sm:text-base leading-relaxed">
            Kami berdedikasi membantu Anda menciptakan ruang yang elegan dan nyaman
            dengan desain yang disesuaikan, material berkualitas, dan perhatian terhadap detail.
          </p>
        </motion.div>

      </section>


      {/* ================= SECTION BEFORE AFTER ================= */}
      <section className="max-w-7xl mx-auto px-6 pb-24 grid lg:grid-cols-2 gap-12 items-start">

        {/* LEFT */}
        <BeforeAfterSlider />

        {/* RIGHT */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="space-y-6"
        >

          {/* 3 IMAGE GRID */}
          <div className="grid grid-cols-3 gap-4">
            {["/kitcen.png", "/kitchenset-minimalis.jpg", "/plafon-pvc.png"].map((img) => (
              <div key={img} className="relative aspect-square rounded-2xl overflow-hidden">
                <Image src={img} alt="Interior" fill className="object-cover" />
              </div>
            ))}
          </div>

          {/* 3 CARD */}
          <div className="grid sm:grid-cols-3 gap-4 mt-8">

            {[
              {
                title: "Desain Khusus",
                desc: "Menawarkan desain interior yang disesuaikan dengan kebutuhan dan gaya Anda.",
              },
              {
                title: "Material Tahan Lama",
                desc: "Menggunakan material berkualitas tinggi untuk daya tahan jangka panjang.",
              },
              {
                title: "Pelayanan Terbaik",
                desc: "Memberikan layanan personal yang berfokus pada kepuasan Anda.",
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                whileHover={{ y: -8 }}
                className="bg-neutral-50 p-6 rounded-2xl shadow-sm border"
              >
                <h4 className="font-semibold text-lg mb-3">
                  {item.title}
                </h4>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}

          </div>

        </motion.div>

      </section>

      {/* ================= SECTION VISI ================= */}
<section className="bg-[#f8f8f6] py-24">
  <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

    {/* LEFT IMAGE */}
    <motion.div
      initial={{ opacity: 0, x: -80 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
      className="relative h-[350px] sm:h-[450px] lg:h-[520px] rounded-3xl overflow-hidden shadow-xl"
    >
      <Image
        src="/process/step1.png"
        alt="Visi Modulo Space"
        fill
        className="object-cover"
      />
    </motion.div>

    {/* RIGHT TEXT */}
    <motion.div
      initial={{ opacity: 0, x: 80 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
    >
      <div className="text-sm uppercase tracking-[0.3em] text-neutral-500 mb-6">
        Visi Kami
      </div>

      <h3 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight">
        Menjadi Mitra Terpercaya
        <br />
        Dalam Mewujudkan Ruang Ideal
      </h3>

      <p className="mt-6 text-neutral-600 leading-relaxed text-sm sm:text-base max-w-xl">
Menjadi penyedia solusi renovasi dan penataan ruang terintegrasi berbasis desain modular modern, dengan standar kualitas tinggi dan pendekatan inovatif.
      </p>

      {/* Highlight Quote */}
      <div className="mt-8 border-l-4 border-black pl-6 text-neutral-700 italic">
        “Ruang yang baik bukan hanya terlihat indah,
        tetapi mampu meningkatkan kualitas hidup penghuninya.”
      </div>
    </motion.div>

  </div>
</section>

{/* ================= SECTION MISI ================= */}
<section className="bg-white py-24">
  <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

    {/* LEFT TEXT */}
    <motion.div
      initial={{ opacity: 0, x: -80 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
    >
      <div className="text-sm uppercase tracking-[0.3em] text-neutral-500 mb-6">
        Misi Kami
      </div>

      <h3 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight">
        Komitmen Kami Untuk
        <br />
        Memberikan Yang Terbaik
      </h3>

      <div className="mt-8 space-y-6">

        {[
          "Memberikan solusi desain interior yang inovatif dan relevan dengan kebutuhan klien.",
          "Menggunakan material berkualitas tinggi untuk memastikan ketahanan dan estetika jangka panjang.",
          "Membangun hubungan kerja yang transparan dan profesional dengan setiap klien.",
          "Mengoptimalkan setiap ruang agar fungsional, nyaman, dan bernilai investasi.",
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15, duration: 0.6 }}
            viewport={{ once: true }}
            className="flex items-start gap-4"
          >
            {/* Number */}
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold">
              {index + 1}
            </div>

            <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
              {item}
            </p>
          </motion.div>
        ))}

      </div>
    </motion.div>

    {/* RIGHT IMAGE */}
    <motion.div
      initial={{ opacity: 0, x: 80 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
      className="relative h-[350px] sm:h-[450px] lg:h-[520px] rounded-3xl overflow-hidden shadow-xl"
    >
      <Image
        src="/process/step2.png"
        alt="Misi Modulo Space"
        fill
        className="object-cover"
      />
    </motion.div>

  </div>
</section>

{/* ================= SECTION PERJALANAN ================= */}
{/* ================= SECTION PERJALANAN ================= */}
<section className="bg-[#f8f8f6] py-24">
  <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

    {/* LEFT IMAGE */}
    <motion.div
      initial={{ opacity: 0, x: -80 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
      className="relative h-[350px] sm:h-[450px] lg:h-[520px] rounded-3xl overflow-hidden shadow-xl"
    >
      <Image
        src="/process/perjalanan.png"
        alt="Perjalanan Modulo Space"
        fill
        className="object-cover"
      />
    </motion.div>

    {/* RIGHT TEXT */}
    <motion.div
      initial={{ opacity: 0, x: 80 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
    >
      <div className="text-sm uppercase tracking-[0.3em] text-neutral-500 mb-6">
        Perjalanan Kami
      </div>

      <h3 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight mb-8">
        Bertumbuh Bersama
        <br />
        Setiap Ruang Yang Kami Ciptakan
      </h3>

      <p className="text-neutral-600 text-sm sm:text-base leading-relaxed max-w-xl">
        Sejak awal berdiri, Modulo Space berkomitmen menghadirkan solusi interior 
        dan renovasi yang mengutamakan presisi, kualitas material, serta desain 
        yang relevan dengan kebutuhan modern. Berawal dari proyek hunian skala kecil, 
        kami terus berkembang menjadi mitra terpercaya dalam menangani berbagai 
        proyek residensial dan komersial. Dengan sistem kerja yang terstruktur, 
        tim profesional, serta pendekatan modular yang efisien, kami percaya bahwa 
        setiap ruang memiliki potensi untuk ditingkatkan menjadi lebih fungsional, 
        nyaman, dan bernilai jangka panjang.
      </p>

    </motion.div>

  </div>
</section>

<WhyUsSection />

    </div>
    <Footer />
    </>
  );
}