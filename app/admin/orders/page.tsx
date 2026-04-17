// app/admin/orders/page.tsx

"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Home, Building2, PaintBucket, ArrowRight } from "lucide-react";



export default function OrdersCategoryPage() {
  const categories = [
    { 
      name: "Interior", 
      slug: "interior", 
      icon: Home,
      gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
      bgGlow: "bg-purple-500/20",
      description: "Desain dan renovasi ruang dalam"
    },
    { 
      name: "Exterior", 
      slug: "exterior", 
      icon: Building2,
      gradient: "from-emerald-400 via-teal-500 to-cyan-600",
      bgGlow: "bg-emerald-500/20",
      description: "Pengerjaan fasad dan area luar"
    },
    { 
      name: "Renovasi", 
      slug: "renovasi", 
      icon: PaintBucket,
      gradient: "from-amber-400 via-orange-500 to-rose-500",
      bgGlow: "bg-orange-500/20",
      description: "Pembaharuan dan perbaikan struktur"
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };
  

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-12">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-6 border border-gray-200">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-gray-600">
              Dashboard Order
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent mb-4">
            Pilih Kategori Order
          </h1>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Kelola dan pantau semua order berdasarkan kategori layanan. 
            Pilih kategori untuk melihat detail order aktif.
          </p>
        </motion.div>

        {/* Category Cards Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-3 gap-6 lg:gap-8"
        >
          {categories.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <motion.div key={cat.slug} variants={itemVariants}>
                <Link href={`/admin/orders/${cat.slug}`}>
                  <div className="group relative h-full">
                    {/* Glow effect */}
                    <div className={`absolute inset-0 ${cat.bgGlow} rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    
                    {/* Card */}
                    <div className="relative h-full bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden">
                      {/* Gradient background on hover */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                      
                      {/* Top accent line */}
                      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${cat.gradient} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
                      
                      {/* Icon Container */}
                      <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${cat.gradient} shadow-lg mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                        <IconComponent className="w-8 h-8 text-white" strokeWidth={2} />
                      </div>

                      {/* Content */}
                      <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-600 transition-all duration-300">
                        {cat.name}
                      </h2>
                      
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {cat.description}
                      </p>

                      {/* Action Button */}
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                        <span className="text-sm font-semibold text-gray-500 group-hover:text-gray-700 transition-colors">
                          Lihat Order
                        </span>
                        
                        <div className={`p-2 rounded-full bg-gray-100 group-hover:bg-gradient-to-r ${cat.gradient} transition-all duration-300`}>
                          <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-white transform group-hover:translate-x-1 transition-all duration-300" />
                        </div>
                      </div>

                      {/* Decorative corner */}
                      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-transparent via-transparent to-gray-100 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom Stats or Info */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-6 px-6 py-3 bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              <span className="text-sm text-gray-600">3 Kategori Aktif</span>
            </div>
            <div className="w-px h-4 bg-gray-300" />
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-sm text-gray-600">Sistem Real-time</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}