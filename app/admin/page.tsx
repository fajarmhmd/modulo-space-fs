// app/admin/page.tsx

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Clock,
  CheckCircle2,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  MoreHorizontal,
  AlertCircle,
  Users,
  Zap,
  Filter,
  Search,
  Bell
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

interface Order {
  id: string;
  product_name: string;
  status: string;
  current_progress: number;
  created_at?: string;
  customer_name?: string;
  category?: string;

  profiles?: {
    full_name: string;
  };
}

interface Stats {
  total: number;
  diproses: number;
  selesai: number;
  interior: number;
  exterior: number;
  renovasi: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 100 }
  }
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    diproses: 0,
    selesai: 0,
    interior: 0,
    exterior: 0,
    renovasi: 0,
  });

  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

const fetchData = async () => {
  try {

    const { data: orders, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    if (!orders) return;

    // ✅ FIX: gunakan .toLowerCase() agar cocok dengan "Selesai" maupun "selesai"
    setStats({
      total: orders.length,
      diproses: orders.filter((o: Order) => o.status?.toLowerCase() !== "selesai").length,
      selesai: orders.filter((o: Order) => o.status?.toLowerCase() === "selesai").length,
      interior: orders.filter((o: Order) => o.category === "interior").length,
      exterior: orders.filter((o: Order) => o.category === "exterior").length,
      renovasi: orders.filter((o: Order) => o.category === "renovasi").length,
    });

    setRecentOrders(orders.slice(0, 5));

  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    setLoading(false);
  }
};

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "selesai":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "diproses":
      case "proses":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "from-emerald-500 to-emerald-600";
    if (progress >= 50) return "from-blue-500 to-blue-600";
    return "from-amber-500 to-orange-500";
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case "interior":
        return "🏠";
      case "exterior":
        return "🏢";
      case "renovasi":
        return "🔨";
      default:
        return "📦";
    }
  };

  const statCards = [
    {
      title: "Total Order",
      value: stats.total,
      icon: Package,
      gradient: "from-blue-600 via-blue-500 to-cyan-500",
      bgGlow: "bg-blue-500/30",
      trend: "+12%",
      trendUp: true
    },
    {
      title: "Sedang Diproses",
      value: stats.diproses,
      icon: Clock,
      gradient: "from-amber-500 via-orange-500 to-red-500",
      bgGlow: "bg-orange-500/30",
      trend: "+5%",
      trendUp: true
    },
    {
      title: "Pesanan Selesai",
      value: stats.selesai,
      icon: CheckCircle2,
      gradient: "from-emerald-500 via-green-500 to-teal-500",
      bgGlow: "bg-emerald-500/30",
      trend: "+8%",
      trendUp: true
    },
  ];

  const categoryStats = [
    { name: "Interior", value: stats.interior, color: "bg-purple-500" },
    { name: "Exterior", value: stats.exterior, color: "bg-blue-500" },
    { name: "Renovasi", value: stats.renovasi, color: "bg-orange-500" },
  ];

  return (
    <div className="min-h-screen space-y-8">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-400/5 rounded-full blur-3xl" />
      </div>

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg shadow-blue-500/25">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Overview
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
            Dashboard Admin
          </h1>
          <p className="text-gray-500 mt-2 flex items-center gap-2 text-sm md:text-base">
            <Calendar className="w-4 h-4" />
            {new Date().toLocaleDateString('id-ID', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </motion.div>

      {/* STAT CARDS */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6"
      >
        {statCards.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              key={stat.title}
              variants={itemVariants}
              className="group relative"
            >
              {/* Glow Effect */}
              <div className={`absolute inset-0 ${stat.bgGlow} rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-5 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
                {/* Top Gradient Line */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />

                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${stat.trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    <TrendingUp className="w-3 h-3" />
                    {stat.trend}
                  </div>
                </div>

                <p className="text-gray-500 text-sm font-medium mb-1">{stat.title}</p>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {loading ? (
                    <div className="h-10 w-20 bg-gray-200 rounded animate-pulse" />
                  ) : (
                    stat.value.toLocaleString('id-ID')
                  )}
                </h2>

                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Update real-time
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Category Stats & Recent Orders Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="xl:col-span-1 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-100 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              Order by Kategori
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Distribusi order berdasarkan kategori
            </p>
          </div>

          <div className="p-6 space-y-4">
            {categoryStats.map((cat, index) => (
              <div key={cat.name} className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${cat.color}`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                    <span className="text-sm font-bold text-gray-900">{cat.value}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stats.total > 0 ? (cat.value / stats.total) * 100 : 0}%` }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      className={`h-full ${cat.color} rounded-full`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* RECENT ORDERS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="xl:col-span-2 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-100 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                Order Terbaru
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                5 pesanan terakhir yang masuk
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <Filter className="w-5 h-5 text-gray-400" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <MoreHorizontal className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {recentOrders.map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.1 }}
                      className="group relative bg-gray-50/50 hover:bg-white hover:shadow-md rounded-2xl p-4 md:p-5 transition-all duration-300 border border-transparent hover:border-gray-200"
                    >
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        {/* Order Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">{getCategoryIcon(order.category)}</span>
                            <h3 className="font-semibold text-gray-900 truncate">
                              {order.product_name}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 flex items-center gap-2 flex-wrap">
                            <Users className="w-3 h-3" />
                            {order.customer_name || order.profiles?.full_name || "Guest User"}
                            <span className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                            <span className="text-gray-400 text-xs">
                              Order #{order.id.slice(0,6)}
                            </span>
                          </p>
                        </div>

                        {/* Progress Section */}
                        <div className="w-full md:w-48 lg:w-56">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-gray-500">Progress</span>
                            <span className="text-sm font-bold text-gray-900">
                              {order.current_progress}%
                            </span>
                          </div>
                          <div className="relative w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${order.current_progress}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                              className={`absolute top-0 left-0 h-full rounded-full bg-gradient-to-r ${getProgressColor(order.current_progress)}`}
                            />
                          </div>
                        </div>

                        {/* Action */}
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-100 rounded-xl self-end md:self-auto">
                          <ArrowUpRight className="w-5 h-5 text-gray-400" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {recentOrders.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">Belum ada order</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Order baru akan muncul di sini
                    </p>
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {recentOrders.length > 0 && (
            <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100">
              <button className="w-full py-3 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-colors flex items-center justify-center gap-2">
               Semua Order
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}