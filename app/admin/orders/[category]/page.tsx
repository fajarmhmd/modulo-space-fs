// app/admin/orders/[category]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiPackage, FiUser, FiClock, FiCheckCircle, FiXCircle, 
  FiAlertCircle, FiSearch, FiFilter, FiTrash2, 
  FiEdit, FiChevronLeft, FiChevronRight, FiRefreshCw,
  FiGrid, FiList, FiPhone, FiMail, FiMapPin,
  FiCalendar, FiDollarSign, FiMoreVertical, FiEye
} from "react-icons/fi";
import Image from "next/image";

// Types
interface Order {
  id: string;
  user_id: string | null;
  product_name: string;
  status: string;
  current_progress: number;
  created_at: string;
  category: string | null;
  price: number | null;
  quantity: number | null;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  address: string | null;
  notes: string | null;
}

interface OrderWithUser extends Order {
  display_name: string;
  display_email: string;
  display_avatar: string | null;
  is_guest: boolean;
}

export default function OrdersByCategory() {
  const params = useParams();
  const category = Array.isArray(params?.category) ? params.category[0] : params?.category;

  const [orders, setOrders] = useState<OrderWithUser[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<OrderWithUser | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "progress">("newest");
  const [error, setError] = useState<string | null>(null);

  // Fetch orders with user profiles
  useEffect(() => {
    if (!category) return;
    fetchOrders();
  }, [category]);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Query 1: Ambil orders dulu
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .ilike("category", category as string)
        .order("created_at", { ascending: false });

      if (ordersError) {
        throw ordersError;
      }

      if (!ordersData || ordersData.length === 0) {
        setOrders([]);
        setFilteredOrders([]);
        setLoading(false);
        return;
      }

      // Query 2: Ambil profiles untuk user_ids yang ada
      const userIds = ordersData
        .map(order => order.user_id)
        .filter(id => id !== null);

      let profilesMap: Record<string, any> = {};
      
      if (userIds.length > 0) {
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("id, full_name, email, avatar_url")
          .in("id", userIds);

        if (!profilesError && profilesData) {
          profilesMap = profilesData.reduce((acc, profile) => {
            acc[profile.id] = profile;
            return acc;
          }, {} as Record<string, any>);
        }
      }

      // Transform data dengan logic yang lebih baik untuk nama
// Transform data dengan logic yang lebih baik untuk nama
// Transform data dengan logic yang lebih baik untuk nama
const transformedData: OrderWithUser[] = ordersData.map((order: any) => {
  const profile = order.user_id ? profilesMap[order.user_id] : null;
  
  // Logic untuk menentukan nama yang ditampilkan
  let displayName: string;
  let displayEmail: string;
  
  // PRIORITAS 1: profile.full_name yang valid (bukan Guest User, bukan email)
  if (profile?.full_name && profile.full_name !== 'Guest User' && !profile.full_name.includes('@')) {
    displayName = profile.full_name;
    displayEmail = order.customer_email || "-";
  }
  // PRIORITAS 2: order.customer_name yang valid (bukan Guest User)
  else if (order.customer_name && order.customer_name !== 'Guest User') {
    displayName = order.customer_name;
    displayEmail = order.customer_email || "-";
  }
  // PRIORITAS 3: profile.full_name yang berisi email
  else if (profile?.full_name && profile.full_name.includes('@')) {
    displayName = profile.full_name.split('@')[0];
    displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
    displayEmail = order.customer_email || "-";
  }
  // PRIORITAS 4: Email dari order.customer_email
  else if (order.customer_email) {
    displayName = order.customer_email.split('@')[0];
    displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
    displayEmail = order.customer_email;
  }
  // DEFAULT: Guest User
  else {
    displayName = "Guest User";
    displayEmail = "-";
  }
  
  return {
    ...order,
    display_name: displayName,
    display_email: displayEmail,
    display_avatar: profile?.avatar_url || null,
    is_guest: !profile && !order.customer_name,
  };
});

      setOrders(transformedData);
      setFilteredOrders(transformedData);
    } catch (err: any) {
      console.error("Error fetching orders:", err);
      setError(err.message || "Terjadi kesalahan saat mengambil data");
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort logic
  useEffect(() => {
    let filtered = [...orders];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(order => 
        order.display_name.toLowerCase().includes(term) ||
        order.display_email.toLowerCase().includes(term) ||
        order.customer_phone?.toLowerCase().includes(term) ||
        order.product_name?.toLowerCase().includes(term) ||
        order.id.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => {
        const status = order.status?.toLowerCase() || '';
        return status === statusFilter.toLowerCase();
      });
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "progress":
          return (b.current_progress || 0) - (a.current_progress || 0);
        default:
          return 0;
      }
    });

    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sortBy, orders]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const handleDelete = async () => {
    if (!orderToDelete) return;
    
    setDeletingId(orderToDelete.id);
    try {
      const { error } = await supabase
        .from("orders")
        .delete()
        .eq("id", orderToDelete.id);

      if (!error) {
        setOrders(prev => prev.filter(o => o.id !== orderToDelete.id));
        setShowDeleteModal(false);
        setOrderToDelete(null);
      }
    } catch (error) {
      console.error("Error deleting order:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusConfig = (status: string) => {
    const statusLower = status?.toLowerCase() || '';
    
    if (statusLower === 'pending' || statusLower === 'menunggu') {
      return { 
        color: "bg-amber-100 text-amber-800 border-amber-300", 
        icon: FiClock, 
        label: "Menunggu",
        bgColor: "bg-amber-500",
        textColor: "text-amber-700"
      };
    } else if (statusLower === 'processing' || statusLower === 'diproses' || statusLower === 'proses') {
      return { 
        color: "bg-blue-100 text-blue-800 border-blue-300", 
        icon: FiRefreshCw, 
        label: "Diproses",
        bgColor: "bg-blue-500",
        textColor: "text-blue-700"
      };
    } else if (statusLower === 'completed' || statusLower === 'selesai') {
      return { 
        color: "bg-emerald-100 text-emerald-800 border-emerald-300", 
        icon: FiCheckCircle, 
        label: "Selesai",
        bgColor: "bg-emerald-500",
        textColor: "text-emerald-700"
      };
    } else if (statusLower === 'cancelled' || statusLower === 'dibatalkan') {
      return { 
        color: "bg-rose-100 text-rose-800 border-rose-300", 
        icon: FiXCircle, 
        label: "Dibatalkan",
        bgColor: "bg-rose-500",
        textColor: "text-rose-700"
      };
    }
    
    return { 
      color: "bg-gray-100 text-gray-800 border-gray-300", 
      icon: FiAlertCircle, 
      label: status || "Unknown",
      bgColor: "bg-gray-500",
      textColor: "text-gray-700"
    };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return "Rp 0";
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Stats
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status?.toLowerCase() === 'pending' || o.status?.toLowerCase() === 'menunggu').length,
    processing: orders.filter(o => ['processing', 'diproses', 'proses'].includes(o.status?.toLowerCase() || '')).length,
    completed: orders.filter(o => ['completed', 'selesai'].includes(o.status?.toLowerCase() || '')).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-8 w-64 bg-gray-200 rounded-lg animate-pulse mb-2"></div>
            <div className="h-4 w-96 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          
          {/* Stats Skeleton */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="h-20 bg-gray-200 rounded-xl animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiAlertCircle className="text-2xl text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Terjadi Kesalahan</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchOrders}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 capitalize">
                Order {category}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Kelola dan pantau semua pesanan {category}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={fetchOrders}
                className="p-2.5 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition"
                title="Refresh"
              >
                <FiRefreshCw className={loading ? "animate-spin" : ""} />
              </button>
              <Link
                href="/admin/orders"
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-medium transition text-sm"
              >
                Kembali
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-700">Total Order</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FiPackage className="text-blue-600 text-xl" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-700">Menunggu</p>
                <p className="text-3xl font-bold text-amber-600 mt-1">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <FiClock className="text-amber-600 text-xl" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-700">Diproses</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{stats.processing}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FiRefreshCw className="text-blue-600 text-xl" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-700">Selesai</p>
                <p className="text-3xl font-bold text-emerald-600 mt-1">{stats.completed}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <FiCheckCircle className="text-emerald-600 text-xl" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters & Controls */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg" />
              <input
                type="text"
                placeholder="Cari nama customer, email, atau produk..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm sm:text-base text-gray-900 placeholder-gray-500"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-sm font-medium min-w-[140px] text-gray-900"
                >
                  <option value="all">Semua Status</option>
                  <option value="pending">Menunggu</option>
                  <option value="diproses">Diproses</option>
                  <option value="selesai">Selesai</option>
                  <option value="dibatalkan">Dibatalkan</option>
                </select>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-medium text-gray-900"
              >
                <option value="newest">Terbaru</option>
                <option value="oldest">Terlama</option>
                <option value="progress">Progress</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                    viewMode === "grid" 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <FiGrid />
                  <span className="hidden sm:inline">Grid</span>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                    viewMode === "list" 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <FiList />
                  <span className="hidden sm:inline">List</span>
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(searchTerm || statusFilter !== "all") && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-200">
              <span className="text-sm font-medium text-gray-700">Filter aktif:</span>
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg text-sm font-semibold">
                  <FiSearch className="text-xs" />
                  "{searchTerm}"
                  <button onClick={() => setSearchTerm("")} className="ml-1 hover:text-blue-900">×</button>
                </span>
              )}
              {statusFilter !== "all" && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg text-sm font-semibold">
                  <FiFilter className="text-xs" />
                  {statusFilter === 'pending' ? 'Menunggu' : 
                   statusFilter === 'diproses' ? 'Diproses' :
                   statusFilter === 'selesai' ? 'Selesai' : 'Dibatalkan'}
                  <button onClick={() => setStatusFilter("all")} className="ml-1 hover:text-blue-900">×</button>
                </span>
              )}
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
                className="text-sm text-red-600 hover:text-red-700 font-semibold ml-auto"
              >
                Reset semua
              </button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-gray-700">
            Menampilkan <span className="font-bold text-gray-900">{filteredOrders.length}</span> order
          </p>
        </div>

        {/* Content */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiPackage className="text-3xl text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Tidak ada order</h3>
            <p className="text-gray-600 mb-6">Belum ada order dengan kriteria yang dipilih</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
              }}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition"
            >
              Reset Filter
            </button>
          </div>
        ) : viewMode === "grid" ? (
          // Grid View
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence>
              {currentOrders.map((order, index) => {
                const statusConfig = getStatusConfig(order.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className="group bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300"
                  >
                    {/* Card Header */}
                    <div className="p-5 border-b border-gray-200 bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {/* Avatar */}
                          <div className="relative">
                            {order.display_avatar ? (
                              <Image
                                src={order.display_avatar}
                                alt={order.display_name}
                                width={48}
                                height={48}
                                className="rounded-full object-cover border-2 border-white shadow-sm"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-white shadow-sm">
                                {order.display_name.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${statusConfig.bgColor} rounded-full border-2 border-white`}></div>
                          </div>
                          
                          <div className="min-w-0">
                            <h3 className="font-bold text-gray-900 truncate max-w-[140px] sm:max-w-[180px]">
                              {order.display_name}
                            </h3>
                            <p className="text-sm text-gray-600 truncate max-w-[140px] sm:max-w-[180px]">{order.display_email}</p>
                            {order.is_guest && (
                              <span className="inline-block mt-1 px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded-full font-medium">
                                Guest
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className={`px-3 py-1.5 rounded-full text-xs font-bold border ${statusConfig.color} flex items-center gap-1.5 whitespace-nowrap`}>
                          <StatusIcon className="text-xs" />
                          {statusConfig.label}
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 space-y-4">
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Produk</p>
                        <p className="font-bold text-gray-900 text-lg">{order.product_name}</p>
                        {order.notes && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{order.notes}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-xl p-3">
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Harga</p>
                          <p className="font-bold text-gray-900">{formatCurrency(order.price)}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3">
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Jumlah</p>
                          <p className="font-bold text-gray-900">{order.quantity || 1} unit</p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="bg-gray-50 rounded-xl p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Progress</span>
                          <span className="text-sm font-bold text-gray-900">{order.current_progress || 0}%</span>
                        </div>
                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${statusConfig.bgColor}`}
                            style={{ width: `${order.current_progress || 0}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                        <FiCalendar className="text-gray-400" />
                        {formatDate(order.created_at)}
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="px-5 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                      <span className="text-xs font-mono font-semibold text-gray-500">#{order.id.slice(0, 8)}</span>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/orders/detail/${order.id}`}
                          className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm font-semibold"
                        >
                          <FiEdit size={14} />
                          Update
                        </Link>
                        <button
                          onClick={() => {
                            setOrderToDelete(order);
                            setShowDeleteModal(true);
                          }}
                          className="p-2 text-rose-600 hover:bg-rose-100 rounded-lg transition"
                          title="Hapus"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          // List View
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Produk</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Progress</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Tanggal</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentOrders.map((order) => {
                    const statusConfig = getStatusConfig(order.status);
                    const StatusIcon = statusConfig.icon;

                    return (
                      <tr key={order.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {order.display_avatar ? (
                              <Image
                                src={order.display_avatar}
                                alt={order.display_name}
                                width={40}
                                height={40}
                                className="rounded-full object-cover border border-gray-200"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold border border-gray-200">
                                {order.display_name.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <p className="font-bold text-gray-900">{order.display_name}</p>
                              <p className="text-sm text-gray-600">{order.display_email}</p>
                              {order.is_guest && (
                                <span className="inline-block mt-0.5 px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded-full font-semibold">
                                  Guest
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-900">{order.product_name}</p>
                          <p className="text-sm text-gray-600">{formatCurrency(order.price)}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${statusConfig.color}`}>
                            <StatusIcon className="text-xs" />
                            {statusConfig.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-24 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${statusConfig.bgColor}`}
                                style={{ width: `${order.current_progress || 0}%` }}
                              />
                            </div>
                            <span className="text-sm font-bold text-gray-900">{order.current_progress || 0}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                          {formatDate(order.created_at)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/admin/orders/detail/${order.id}`}
                              className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm font-semibold"
                            >
                              <FiEdit size={14} />
                              Update
                            </Link>
                            <button
                              onClick={() => {
                                setOrderToDelete(order);
                                setShowDeleteModal(true);
                              }}
                              className="p-2 text-rose-600 hover:bg-rose-100 rounded-lg transition"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2.5 border border-gray-300 rounded-xl hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition text-gray-700"
            >
              <FiChevronLeft />
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-xl font-bold transition ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2.5 border border-gray-300 rounded-xl hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition text-gray-700"
            >
              <FiChevronRight />
            </button>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
            >
              <div className="w-14 h-14 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiTrash2 className="text-2xl text-rose-600" />
              </div>
              
              <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
                Hapus Order?
              </h3>
              
              <p className="text-center text-gray-700 mb-6">
                Apakah Anda yakin ingin menghapus order dari <span className="font-bold text-gray-900">{orderToDelete?.display_name}</span>? 
                Tindakan ini tidak dapat dibatalkan.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-800 hover:bg-gray-100 font-bold transition"
                >
                  Batal
                </button>
                
                <button
                  onClick={handleDelete}
                  disabled={deletingId === orderToDelete?.id}
                  className="flex-1 px-4 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deletingId === orderToDelete?.id ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Menghapus...
                    </>
                  ) : (
                    'Hapus Order'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}