// app/admin/completed/page.tsx

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Search,
  Calendar,
  Filter,
  Download,
  Eye,
  MoreHorizontal,
  Package,
  TrendingUp,
  Clock,
  Star,
  FileText,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Home,
  Building2,
  Hammer
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

interface CompletedOrder {
  id: string;
  product_name: string;
  customer_name: string;
  customer_email: string;
  status: string;
  category: string;
  completed_at: string;
  total_price: number;
  rating?: number;
  review?: string;
}

interface Stats {
  totalCompleted: number;
  thisMonth: number;
  totalRevenue: number;
  averageRating: number;
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

export default function CompletedOrdersPage() {
  const [orders, setOrders] = useState<CompletedOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<CompletedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState<Stats>({
    totalCompleted: 0,
    thisMonth: 0,
    totalRevenue: 0,
    averageRating: 0,
  });

  const itemsPerPage = 8;

  useEffect(() => {
    fetchCompletedOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [searchQuery, selectedCategory, orders]);

  const fetchCompletedOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("status", "selesai")
        .order("completed_at", { ascending: false });

      if (error) throw error;

      const completedData = data || [];
      setOrders(completedData);
      setFilteredOrders(completedData);

      // Calculate stats
      const now = new Date();
      const thisMonth = completedData.filter((order: CompletedOrder) => {
        const completedDate = new Date(order.completed_at);
        return (
          completedDate.getMonth() === now.getMonth() &&
          completedDate.getFullYear() === now.getFullYear()
        );
      });

      const totalRevenue = completedData.reduce(
        (sum: number, order: CompletedOrder) => sum + (order.total_price || 0),
        0
      );

      const avgRating =
        completedData.length > 0
          ? completedData.reduce(
              (sum: number, order: CompletedOrder) => sum + (order.rating || 5),
              0
            ) / completedData.length
          : 0;

      setStats({
        totalCompleted: completedData.length,
        thisMonth: thisMonth.length,
        totalRevenue,
        averageRating: Math.round(avgRating * 10) / 10,
      });
    } catch (error) {
      console.error("Error fetching completed orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((order) => order.category === selectedCategory);
    }

    setFilteredOrders(filtered);
    setCurrentPage(1);
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case "interior":
        return <Home className="w-4 h-4" />;
      case "exterior":
        return <Building2 className="w-4 h-4" />;
      case "renovasi":
        return <Hammer className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getCategoryLabel = (category?: string) => {
    switch (category) {
      case "interior":
        return "Interior";
      case "exterior":
        return "Exterior";
      case "renovasi":
        return "Renovasi";
      default:
        return "Lainnya";
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case "interior":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "exterior":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "renovasi":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const statCards = [
    {
      title: "Total Selesai",
      value: stats.totalCompleted,
      icon: CheckCircle2,
      gradient: "from-emerald-500 via-green-500 to-teal-500",
      bgGlow: "bg-emerald-500/30",
    },
    {
      title: "Bulan Ini",
      value: stats.thisMonth,
      icon: Calendar,
      gradient: "from-blue-500 via-blue-400 to-cyan-500",
      bgGlow: "bg-blue-500/30",
    },
    {
      title: "Total Pendapatan",
      value: `Rp ${stats.totalRevenue.toLocaleString("id-ID")}`,
      icon: TrendingUp,
      gradient: "from-amber-500 via-orange-500 to-red-500",
      bgGlow: "bg-amber-500/30",
    },
    {
      title: "Rating Rata-rata",
      value: stats.averageRating.toFixed(1),
      icon: Star,
      gradient: "from-purple-500 via-purple-400 to-pink-500",
      bgGlow: "bg-purple-500/30",
    },
  ];

  return (
    <div className="min-h-screen space-y-8">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-3xl" />
      </div>

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow-lg shadow-emerald-500/25">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Pesanan
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
            Pesanan Selesai
          </h1>
          <p className="text-gray-500 mt-2 flex items-center gap-2 text-sm md:text-base">
            <Clock className="w-4 h-4" />
            Daftar semua pesanan yang telah selesai dikerjakan
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Laporan</span>
          </button>
        </div>
      </motion.div>

      {/* STAT CARDS */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
      >
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              key={stat.title}
              variants={itemVariants}
              className="group relative"
            >
              <div className={`absolute inset-0 ${stat.bgGlow} rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-5 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
                
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                </div>

                <p className="text-gray-500 text-sm font-medium mb-1">{stat.title}</p>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {loading ? (
                    <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
                  ) : (
                    stat.value
                  )}
                </h2>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* FILTERS & SEARCH */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-4 md:p-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari pesanan, pelanggan, atau ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer"
            >
              <option value="all">Semua Kategori</option>
              <option value="interior">Interior</option>
              <option value="exterior">Exterior</option>
              <option value="renovasi">Renovasi</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* ORDERS TABLE */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-100 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-600" />
              Daftar Pesanan Selesai
            </h2>
            <span className="text-sm text-gray-500">
              Menampilkan {filteredOrders.length} pesanan
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Pesanan
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Pelanggan
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Selesai
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Harga
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <AnimatePresence>
                  {paginatedOrders.map((order, index) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{order.product_name}</p>
                            <p className="text-xs text-gray-500">ID: {order.id.slice(0, 8)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{order.customer_name}</p>
                          <p className="text-xs text-gray-500">{order.customer_email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${getCategoryColor(order.category)}`}>
                          {getCategoryIcon(order.category)}
                          {getCategoryLabel(order.category)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {new Date(order.completed_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">
                          Rp {(order.total_price || 0).toLocaleString("id-ID")}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= (order.rating || 5)
                                  ? "fill-amber-400 text-amber-400"
                                  : "fill-gray-200 text-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-2 hover:bg-emerald-100 rounded-lg transition-colors group">
                            <Eye className="w-4 h-4 text-gray-400 group-hover:text-emerald-600" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <MoreHorizontal className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          )}

          {!loading && filteredOrders.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium text-lg">Tidak ada pesanan</p>
              <p className="text-sm text-gray-400 mt-1">
                Belum ada pesanan yang selesai
              </p>
            </motion.div>
          )}
        </div>

        {/* Pagination */}
        {!loading && filteredOrders.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              Halaman {currentPage} dari {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === page
                        ? "bg-emerald-600 text-white"
                        : "border border-gray-200 hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}