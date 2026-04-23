// app/admin/completed/page.tsx

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Search,
  Calendar,
  Filter,
  Eye,
  Trash2,
  Package,
  TrendingUp,
  Clock,
  ChevronLeft,
  ChevronRight,
  Home,
  Building2,
  Hammer,
  X,
  ArrowLeft,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

interface CompletedOrder {
  id: string;
  product_name: string;
  customer_name: string;
  customer_email: string;
  status: string;
  category: string;
  completed_at: string;
  total_price: number;
  price: number;
  current_progress: number;
  quantity: number;
  address?: string;
  notes?: string;
}

interface Stats {
  totalCompleted: number;
  thisMonth: number;
  totalRevenue: number;
}

export default function CompletedOrdersPage() {
  const router = useRouter();
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
  });

  // Delete confirmation modal
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; orderId: string; productName: string }>({
    open: false,
    orderId: "",
    productName: "",
  });
  const [deleting, setDeleting] = useState(false);

  // Detail modal
  const [detailModal, setDetailModal] = useState<{ open: boolean; order: CompletedOrder | null }>({
    open: false,
    order: null,
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
        .ilike("status", "selesai")
        .order("completed_at", { ascending: false });

      if (error) throw error;

      const completedData = data || [];
      setOrders(completedData);
      setFilteredOrders(completedData);

      const now = new Date();
      const thisMonth = completedData.filter((order: CompletedOrder) => {
        if (!order.completed_at) return false;
        const completedDate = new Date(order.completed_at);
        return (
          completedDate.getMonth() === now.getMonth() &&
          completedDate.getFullYear() === now.getFullYear()
        );
      });

      const totalRevenue = completedData.reduce(
        (sum: number, order: CompletedOrder) => sum + (order.total_price || order.price || 0),
        0
      );

      setStats({
        totalCompleted: completedData.length,
        thisMonth: thisMonth.length,
        totalRevenue,
      });
    } catch (error) {
      console.error("Error fetching completed orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.product_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (order.customer_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((order) => order.category === selectedCategory);
    }

    setFilteredOrders(filtered);
    setCurrentPage(1);
  };

  const handleDelete = async () => {
    if (!deleteModal.orderId) return;
    try {
      setDeleting(true);
      const { error } = await supabase
        .from("orders")
        .delete()
        .eq("id", deleteModal.orderId);

      if (error) throw error;

      setOrders(prev => prev.filter(o => o.id !== deleteModal.orderId));
      setDeleteModal({ open: false, orderId: "", productName: "" });
      alert("Pesanan berhasil dihapus.");
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Gagal menghapus pesanan.");
    } finally {
      setDeleting(false);
    }
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case "interior": return <Home className="w-4 h-4" />;
      case "exterior": return <Building2 className="w-4 h-4" />;
      case "renovasi": return <Hammer className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getCategoryLabel = (category?: string) => {
    switch (category) {
      case "interior": return "Interior";
      case "exterior": return "Exterior";
      case "renovasi": return "Renovasi";
      default: return "Lainnya";
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case "interior": return "bg-purple-100 text-purple-700 border-purple-200";
      case "exterior": return "bg-blue-100 text-blue-700 border-blue-200";
      case "renovasi": return "bg-orange-100 text-orange-700 border-orange-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

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
      gradient: "from-blue-500 via-blue-400 to-cyan-400",
      bgGlow: "bg-blue-500/30",
    },
    {
      title: "Total Pendapatan",
      value: formatCurrency(stats.totalRevenue),
      icon: TrendingUp,
      gradient: "from-amber-500 via-orange-500 to-red-400",
      bgGlow: "bg-orange-500/30",
      isText: true,
    },
  ];

  return (
    <div className="min-h-screen space-y-6">

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModal.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-center text-gray-900 mb-2">Hapus Pesanan?</h3>
              <p className="text-gray-500 text-center mb-1">
                Anda akan menghapus pesanan:
              </p>
              <p className="text-gray-900 font-semibold text-center mb-6 line-clamp-2">
                "{deleteModal.productName}"
              </p>
              <p className="text-red-500 text-sm text-center mb-6">
                Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModal({ open: false, orderId: "", productName: "" })}
                  className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 font-medium transition"
                >
                  Batal
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-xl font-medium transition flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Menghapus...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" /> Hapus
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <AnimatePresence>
        {detailModal.open && detailModal.order && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-sm font-medium opacity-80">Pesanan Selesai</span>
                  </div>
                  <button
                    onClick={() => setDetailModal({ open: false, order: null })}
                    className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="text-xl font-bold line-clamp-2">{detailModal.order.product_name}</h3>
                <p className="text-emerald-100 text-sm mt-1">ID: #{detailModal.order.id.slice(0, 8)}</p>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 font-medium mb-1">Total Harga</p>
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(detailModal.order.total_price || detailModal.order.price)}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 font-medium mb-1">Kategori</p>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getCategoryColor(detailModal.order.category)}`}>
                      {getCategoryIcon(detailModal.order.category)}
                      {getCategoryLabel(detailModal.order.category)}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Pelanggan</span>
                    <span className="font-medium text-gray-900">{detailModal.order.customer_name || "-"}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Email</span>
                    <span className="font-medium text-gray-900 truncate max-w-[180px]">{detailModal.order.customer_email || "-"}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Jumlah</span>
                    <span className="font-medium text-gray-900">{detailModal.order.quantity || 1} unit</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Selesai Pada</span>
                    <span className="font-medium text-gray-900">{formatDate(detailModal.order.completed_at)}</span>
                  </div>
                  {detailModal.order.address && (
                    <div className="flex items-start justify-between text-sm gap-4">
                      <span className="text-gray-500 shrink-0">Alamat</span>
                      <span className="font-medium text-gray-900 text-right">{detailModal.order.address}</span>
                    </div>
                  )}
                  {detailModal.order.notes && (
                    <div className="flex items-start justify-between text-sm gap-4">
                      <span className="text-gray-500 shrink-0">Catatan</span>
                      <span className="font-medium text-gray-900 text-right">{detailModal.order.notes}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    setDetailModal({ open: false, order: null });
                    router.push(`/admin/orders/detail/${detailModal.order!.id}`);
                  }}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" /> Lihat Halaman Detail
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg shadow-emerald-500/25">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Pesanan</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
          Pesanan Selesai
        </h1>
        <p className="text-gray-500 mt-2 flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4" />
          Daftar semua pesanan yang telah selesai dikerjakan
        </p>
      </motion.div>

      {/* STAT CARDS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={stat.title} className="group relative">
              <div className={`absolute inset-0 ${stat.bgGlow} rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-5 shadow-lg border border-gray-100 overflow-hidden">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-gray-500 text-sm font-medium mb-1">{stat.title}</p>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {loading ? <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" /> : stat.value}
                </h2>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* SEARCH & FILTER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-100 p-4"
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari pesanan, pelanggan, atau ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
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
                          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 line-clamp-1">{order.product_name}</p>
                            <p className="text-xs text-gray-500">ID: {order.id.slice(0, 8)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{order.customer_name || "-"}</p>
                          <p className="text-xs text-gray-500">{order.customer_email || "-"}</p>
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
                          {formatDate(order.completed_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(order.total_price || order.price)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {/* Tombol Lihat Detail */}
                          <button
                            onClick={() => setDetailModal({ open: true, order })}
                            title="Lihat Detail"
                            className="p-2 hover:bg-emerald-100 rounded-lg transition-colors group"
                          >
                            <Eye className="w-4 h-4 text-gray-400 group-hover:text-emerald-600" />
                          </button>
                          {/* Tombol Hapus */}
                          <button
                            onClick={() => setDeleteModal({ open: true, orderId: order.id, productName: order.product_name })}
                            title="Hapus Pesanan"
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors group"
                          >
                            <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-600" />
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
              <p className="text-sm text-gray-400 mt-1">Belum ada pesanan yang selesai</p>
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
                disabled={currentPage === totalPages || totalPages === 0}
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