// app/admin/orders/detail/[id]/page.tsx

"use client";

import { use, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { 
  FiPackage, 
  FiUser, 
  FiCalendar, 
  FiChevronRight,
  FiUpload,
  FiClock,
  FiCheckCircle,
  FiArrowLeft,
  FiMapPin,
  FiDollarSign,
  FiTrendingUp,
  FiX,
  FiCamera,
  FiInfo,
  FiPlay,
  FiLayers,
  FiBox,
  FiTruck,
  FiFlag,
  FiLock,
  FiAlertCircle,
  FiCheckSquare,
  FiMail,
  FiPhone
} from "react-icons/fi";
import Link from "next/link";

interface Order {
  id: string;
  user_id?: string;
  product_name?: string;
  price?: number;
  current_progress: number;
  created_at: string;
  updated_at?: string;
  address?: string;
  quantity?: number;
  status?: 'diproses' | 'selesai' | 'dibatalkan';
  category?: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  notes?: string;
  completed_at?: string;
}

interface ProgressStep {
  value: number;
  label: string;
  description: string;
  icon: React.ElementType;
}

interface ProgressHistory {
  id: string;
  title: string;
  description: string;
  progress: number;
  created_at: string;
  images: string[];
}

interface Profile {
  id: string;
  full_name?: string;
  avatar_url?: string;
  // Note: kolom email tidak ada di tabel profiles, gunakan customer_email dari order
}

export default function OrderDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [order, setOrder] = useState<Order | null>(null);
  const [customerProfile, setCustomerProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [activeTab, setActiveTab] = useState<'timeline' | 'history'>('timeline');
  const [progressHistory, setProgressHistory] = useState<ProgressHistory[]>([]);
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [progress, setProgress] = useState(20);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const progressSteps: ProgressStep[] = [
    { value: 20, label: "Material", description: "Pemotongan & Persiapan Bahan", icon: FiLayers },
    { value: 50, label: "Produksi", description: "Perakitan & Pembuatan", icon: FiPlay },
    { value: 70, label: "Finishing", description: "Pengecatan & Finishing", icon: FiBox },
    { value: 100, label: "Pengiriman", description: "Pengiriman ke Customer", icon: FiTruck }
  ];

  useEffect(() => {
    if (!id) return;
    loadOrder();
    loadProgressHistory();
  }, [id]);

  useEffect(() => {
    return () => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  // Set default progress ke step berikutnya yang tersedia
  useEffect(() => {
    if (order) {
      const nextStep = progressSteps.find(step => step.value > order.current_progress);
      if (nextStep) {
        setProgress(nextStep.value);
      } else if (order.current_progress < 100) {
        setProgress(order.current_progress);
      }
    }
  }, [order]);

  async function loadOrder() {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setOrder(data);
      
      // Load customer profile if user_id exists
      if (data?.user_id) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user_id)
          .single();
        setCustomerProfile(profileData);
      }
    } catch (error) {
      console.error("Error loading order:", error);
    } finally {
      setLoading(false);
    }
  }

  async function loadProgressHistory() {
    try {
      const { data, error } = await supabase
        .from("order_progress")
        .select("*")
        .eq("order_id", id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProgressHistory(data || []);
    } catch (error) {
      console.error("Error loading progress history:", error);
    }
  }

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    addImages(files);
  }

  function addImages(files: File[]) {
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    setImages(prev => [...prev, ...validFiles]);
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  }

  function removeImage(index: number) {
    setImages(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(imagePreviews[index]);
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    addImages(files);
  }

  async function uploadImages() {
    const urls: string[] = [];

    for (const file of images) {
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name}`;

      const { error } = await supabase.storage
        .from("progress")
        .upload(fileName, file);

      if (!error) {
        const { data } = supabase.storage
          .from("progress")
          .getPublicUrl(fileName);

        urls.push(data.publicUrl);
      }
    }

    return urls;
  }

  async function addProgress() {
    if (!title.trim()) {
      alert("Judul progress harus diisi");
      return;
    }

    // Validasi: progress harus lebih tinggi dari current
    if (progress <= (order?.current_progress || 0)) {
      alert(`Progress harus lebih tinggi dari ${order?.current_progress}%`);
      return;
    }

    try {
      setSubmitting(true);
      const imageUrls = await uploadImages();

      const { error: progressError } = await supabase.from("order_progress").insert({
        order_id: id,
        title,
        description: desc,
        progress,
        images: imageUrls,
      });

      if (progressError) throw progressError;

      const { error: orderError } = await supabase
        .from("orders")
        .update({ 
          current_progress: progress,
          updated_at: new Date().toISOString()
        })
        .eq("id", id);

      if (orderError) throw orderError;

      setTitle("");
      setDesc("");
      setImages([]);
      setImagePreviews([]);
      
      // Set progress ke step berikutnya
      const nextStep = progressSteps.find(step => step.value > progress);
      if (nextStep) {
        setProgress(nextStep.value);
      }
      
      await loadOrder();
      await loadProgressHistory();
      alert("Progress berhasil diupdate!");
    } catch (error) {
      console.error("Error adding progress:", error);
      alert("Gagal mengupdate progress. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  async function markAsComplete() {
    try {
      setCompleting(true);
      
      const { error } = await supabase
        .from("orders")
        .update({ 
          status: 'selesai',
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq("id", id);

      if (error) throw error;

      setShowCompleteModal(false);
      await loadOrder();
      alert("Pesanan berhasil ditandai sebagai selesai!");
    } catch (error) {
      console.error("Error completing order:", error);
      alert("Gagal menyelesaikan pesanan. Silakan coba lagi.");
    } finally {
      setCompleting(false);
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getProgressColor = (value: number) => {
    if (value <= 25) return 'from-amber-400 to-orange-500';
    if (value <= 50) return 'from-orange-400 to-rose-500';
    if (value <= 75) return 'from-rose-400 to-purple-500';
    return 'from-purple-400 to-emerald-500';
  };

  const getProgressStatus = (progress: number, status?: string) => {
    if (status === 'selesai') return { label: 'Selesai', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
    if (status === 'dibatalkan') return { label: 'Dibatalkan', color: 'bg-red-100 text-red-700 border-red-200' };
    if (progress === 100) return { label: 'Siap Selesai', color: 'bg-blue-100 text-blue-700 border-blue-200' };
    if (progress >= 70) return { label: 'Finishing', color: 'bg-purple-100 text-purple-700 border-purple-200' };
    if (progress >= 50) return { label: 'Produksi', color: 'bg-rose-100 text-rose-700 border-rose-200' };
    if (progress >= 20) return { label: 'Material', color: 'bg-amber-100 text-amber-700 border-amber-200' };
    return { label: 'Menunggu', color: 'bg-slate-100 text-slate-700 border-slate-200' };
  };

  const isStepDisabled = (stepValue: number) => {
    if (!order) return true;
    if (order.status === 'selesai') return true;
    return stepValue <= order.current_progress;
  };

  const isOrderCompleted = order?.status === 'selesai';
  const isReadyToComplete = order?.current_progress === 100 && !isOrderCompleted;

  // Get customer display name
// Get customer display name
// Get customer display name
// Get customer display name
const getCustomerName = () => {
  // PRIORITAS 1: customer_name yang valid (bukan Guest User)
  if (order?.customer_name && order.customer_name !== 'Guest User') {
    return order.customer_name;
  }
  
  // PRIORITAS 2: full_name dari profile (yang valid)
  if (customerProfile?.full_name && customerProfile.full_name !== 'Guest User') {
    return customerProfile.full_name;
  }
  
  // PRIORITAS 3: Email dari order.customer_email
  if (order?.customer_email) {
    const nameFromEmail = order.customer_email.split('@')[0];
    return nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
  }
  
  // DEFAULT
  return 'Customer';
};

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-600 font-medium">Memuat data order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center bg-white p-10 rounded-3xl shadow-xl max-w-md w-full">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiPackage className="text-4xl text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Order Tidak Ditemukan</h2>
          <p className="text-slate-500 mb-8">Order yang Anda cari tidak ada atau telah dihapus.</p>
          <Link 
            href="/orders" 
            className="inline-flex items-center justify-center gap-2 w-full bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-slate-800 transition font-medium"
          >
            <FiArrowLeft /> Kembali ke Daftar Order
          </Link>
        </div>
      </div>
    );
  }

  const status = getProgressStatus(order.current_progress, order.status);
  const nextStep = progressSteps.find(step => step.value > order.current_progress);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Complete Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheckCircle className="text-3xl text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-center text-slate-900 mb-2">
              Selesaikan Pesanan?
            </h3>
            <p className="text-slate-500 text-center mb-6">
              Pesanan ini akan ditandai sebagai selesai dan tidak dapat diubah lagi. Pastikan semua proses sudah benar-benar selesai.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCompleteModal(false)}
                className="flex-1 py-3 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-medium transition"
              >
                Batal
              </button>
              <button
                onClick={markAsComplete}
                disabled={completing}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-xl font-medium transition flex items-center justify-center gap-2"
              >
                {completing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <FiCheckSquare /> Ya, Selesaikan
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modern Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link 
                href="/orders" 
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition"
              >
                <FiArrowLeft className="text-lg" />
              </Link>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-lg font-bold text-slate-900">
                    Order #{order.id.slice(0, 8)}
                  </h1>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${status.color}`}>
                    {status.label}
                  </span>
                  {isOrderCompleted && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <FiCheckCircle /> Done
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500">{formatDate(order.created_at)}</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Progress</p>
                <p className="text-lg font-bold text-slate-900">{order.current_progress}%</p>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                isOrderCompleted 
                  ? 'bg-emerald-500 shadow-emerald-500/25' 
                  : 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/25'
              }`}>
                {isOrderCompleted ? <FiCheckCircle className="text-white text-xl" /> : <FiTrendingUp className="text-white text-xl" />}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Order Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Product Card */}
          <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center flex-shrink-0">
                <FiPackage className="text-3xl text-slate-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-1">Produk</p>
                    <h2 className="text-xl font-bold text-slate-900 mb-1 truncate">
                      {order.product_name || 'Produk Custom'}
                    </h2>
                    <div className="flex items-center gap-3 text-slate-500 text-sm">
                      <span>Qty: {order.quantity || 1} Item</span>
                      {order.category && (
                        <>
                          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                          <span className="capitalize">{order.category}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium whitespace-nowrap">
                    Detail <FiChevronRight />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Price Card */}
          <div className={`rounded-2xl p-6 text-white ${
            isOrderCompleted 
              ? 'bg-gradient-to-br from-emerald-600 to-emerald-700' 
              : 'bg-gradient-to-br from-slate-900 to-slate-800'
          }`}>
            <p className="text-white/70 text-sm uppercase tracking-wider font-medium mb-2">Total Harga</p>
            <p className="text-3xl font-bold">
              {formatCurrency(order.price)}
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-white/70">
              <FiDollarSign className={isOrderCompleted ? 'text-emerald-300' : 'text-emerald-400'} />
              <span>{isOrderCompleted ? 'Pesanan Selesai' : 'Pembayaran Lunas'}</span>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-8">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Informasi Customer</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <FiUser className="text-xl text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Nama</p>
                <p className="font-semibold text-slate-900">{getCustomerName()}</p>
              </div>
            </div>
            {order.customer_email && (
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <FiMail className="text-xl text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Email</p>
                  <p className="font-semibold text-slate-900 text-sm truncate max-w-[150px]">{order.customer_email}</p>
                </div>
              </div>
            )}
            {order.customer_phone && (
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                  <FiPhone className="text-xl text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Telepon</p>
                  <p className="font-semibold text-slate-900">{order.customer_phone}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
                <FiMapPin className="text-xl text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Alamat</p>
                <p className="font-semibold text-slate-900 text-sm truncate max-w-[200px]">{order.address || '-'}</p>
              </div>
            </div>
          </div>
          
          {order.notes && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-500 font-medium mb-1">Catatan</p>
              <p className="text-slate-700 text-sm">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Complete Order Banner - Show when 100% but not completed */}
        {isReadyToComplete && (
          <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-600/20">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiFlag className="text-2xl" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">Pesanan Siap Diselesaikan!</h3>
                  <p className="text-blue-100">Progress sudah 100%. Tandai pesanan ini sebagai selesai.</p>
                </div>
              </div>
              <button
                onClick={() => setShowCompleteModal(true)}
                className="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition flex items-center justify-center gap-2 shadow-lg"
              >
                <FiCheckCircle /> Selesaikan Pesanan
              </button>
            </div>
          </div>
        )}

        {/* Completed Banner */}
        {isOrderCompleted && (
          <div className="mb-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-500/20">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <FiCheckCircle className="text-3xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Pesanan Selesai!</h3>
                <p className="text-emerald-100">
                  Pesanan ini telah diselesaikan pada {formatDate(order.completed_at)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Progress Section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left - Progress Timeline */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b border-slate-200">
                <button
                  onClick={() => setActiveTab('timeline')}
                  className={`flex-1 px-6 py-4 text-sm font-semibold transition flex items-center justify-center gap-2 ${
                    activeTab === 'timeline' 
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' 
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <FiTrendingUp /> Timeline Progress
                </button>
                {/* <button
                  onClick={() => setActiveTab('history')}
                  className={`flex-1 px-6 py-4 text-sm font-semibold transition flex items-center justify-center gap-2 ${
                    activeTab === 'history' 
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' 
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <FiClock /> Riwayat Update ({progressHistory.length})
                </button> */}
              </div>

              <div className="p-6">
                {activeTab === 'timeline' ? (
                  <>
                    {/* Progress Bar */}
                    <div className="mb-10">
                      <div className="flex justify-between items-end mb-3">
                        <div>
                          <p className="text-sm text-slate-500 mb-1">Status Saat Ini</p>
                          <p className="text-lg font-bold text-slate-900">
                            {progressSteps.find(s => s.value === order.current_progress)?.label || 'Menunggu'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold text-slate-900">{order.current_progress}%</p>
                        </div>
                      </div>
                      <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${getProgressColor(order.current_progress)} transition-all duration-700 ease-out`}
                          style={{ width: `${order.current_progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Timeline Steps */}
                    <div className="relative">
                      <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-slate-200"></div>
                      
                      <div className="space-y-6">
                        {progressSteps.map((step, index) => {
                          const isCompleted = order.current_progress >= step.value;
                          const isCurrent = order.current_progress === step.value;
                          const isPassed = order.current_progress > step.value;
                          const Icon = step.icon;
                          
                          return (
                            <div key={step.value} className="relative flex items-start gap-5">
                              {/* Step Indicator */}
                              <div className={`relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                                isCompleted 
                                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
                                  : isCurrent
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-4 ring-blue-100'
                                    : 'bg-slate-100 text-slate-400'
                              }`}>
                                {isCompleted ? <FiCheckCircle className="text-xl" /> : <Icon className="text-xl" />}
                              </div>
                              
                              {/* Step Content */}
                              <div className={`flex-1 pt-2 pb-6 ${index === progressSteps.length - 1 ? 'pb-0' : ''}`}>
                                <div className="flex items-center gap-3 mb-1">
                                  <h3 className={`font-bold text-lg ${
                                    isCompleted ? 'text-slate-900' : isCurrent ? 'text-blue-600' : 'text-slate-400'
                                  }`}>
                                    {step.label}
                                  </h3>
                                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                                    isCompleted 
                                      ? 'bg-emerald-100 text-emerald-700' 
                                      : isCurrent
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-slate-100 text-slate-500'
                                  }`}>
                                    {step.value}%
                                  </span>
                                  {isCurrent && !isOrderCompleted && (
                                    <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-amber-100 text-amber-700 animate-pulse">
                                      Sedang Berjalan
                                    </span>
                                  )}
                                  {isPassed && (
                                    <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-slate-100 text-slate-500 flex items-center gap-1">
                                      <FiLock className="text-xs" /> Selesai
                                    </span>
                                  )}
                                </div>
                                <p className={`text-sm ${isCompleted || isCurrent ? 'text-slate-600' : 'text-slate-400'}`}>
                                  {step.description}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Next Step Alert */}
                    {nextStep && !isOrderCompleted && (
                      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <FiInfo className="text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-blue-900 mb-1">Progress Selanjutnya</p>
                            <p className="text-blue-700">{nextStep.label} - {nextStep.description}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="space-y-4">
                    {progressHistory.length > 0 ? (
                      progressHistory.map((item) => (
                        <div key={item.id} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-slate-900">{item.title}</h4>
                              <p className="text-sm text-slate-500">{formatDateTime(item.created_at)}</p>
                            </div>
                            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                              item.progress === 100 
                                ? 'bg-emerald-100 text-emerald-700' 
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {item.progress}%
                            </span>
                          </div>
                          {item.description && (
                            <p className="text-sm text-slate-600 mb-3">{item.description}</p>
                          )}
                          {item.images && item.images.length > 0 && (
                            <div className="flex gap-2">
                              {item.images.map((img, idx) => (
                                <div key={idx} className="w-16 h-16 rounded-lg overflow-hidden">
                                  <Image
                                    src={img}
                                    alt={`Progress ${idx + 1}`}
                                    width={64}
                                    height={64}
                                    className="object-cover w-full h-full"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FiClock className="text-2xl text-slate-400" />
                        </div>
                        <p className="text-slate-500">Belum ada riwayat update</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right - Update Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 sticky top-24">
              {/* Form Header */}
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isOrderCompleted 
                      ? 'bg-emerald-100' 
                      : 'bg-blue-100'
                  }`}>
                    {isOrderCompleted ? (
                      <FiCheckCircle className="text-emerald-600 text-xl" />
                    ) : (
                      <FiTrendingUp className="text-blue-600 text-xl" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      {isOrderCompleted ? 'Pesanan Selesai' : 'Update Progress'}
                    </h2>
                    <p className="text-sm text-slate-500">
                      {isOrderCompleted 
                        ? 'Pesanan ini sudah tidak dapat diubah' 
                        : 'Perbarui status produksi order ini'}
                    </p>
                  </div>
                </div>
              </div>

              {isOrderCompleted ? (
                /* Completed State */
                <div className="p-6">
                  <div className="text-center py-8">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiCheckCircle className="text-4xl text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Pesanan Telah Selesai</h3>
                    <p className="text-slate-500 mb-6">
                      Pesanan ini telah diselesaikan dan tidak dapat diubah lagi.
                    </p>
                    <div className="bg-slate-50 rounded-xl p-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Progress Akhir</span>
                        <span className="font-bold text-emerald-600">100%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-2">
                        <span className="text-slate-500">Selesai Pada</span>
                        <span className="font-medium text-slate-900">
                          {formatDate(order.completed_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Update Form */
                <form onSubmit={(e) => { e.preventDefault(); addProgress(); }} className="p-6 space-y-5">
                  {/* Progress Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Pilih Progress
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {progressSteps.map((step) => {
                        const disabled = isStepDisabled(step.value);
                        const isCompleted = order.current_progress >= step.value;
                        
                        return (
                          <button
                            key={step.value}
                            type="button"
                            onClick={() => !disabled && setProgress(step.value)}
                            disabled={disabled}
                            className={`py-3 px-3 rounded-xl border-2 font-semibold text-sm transition-all relative ${
                              progress === step.value && !disabled
                                ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md shadow-blue-600/10'
                                : disabled
                                  ? 'border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed'
                                  : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center justify-center gap-1">
                              {isCompleted && <FiCheckCircle className="text-xs" />}
                              {step.label}
                            </div>
                            <span className="block text-xs font-normal mt-0.5 opacity-70">
                              {disabled && isCompleted ? 'Sudah selesai' : `${step.value}%`}
                            </span>
                            {disabled && isCompleted && (
                              <div className="absolute top-1 right-1">
                                <FiLock className="text-xs text-slate-400" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {order.current_progress > 0 && (
                      <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                        <FiAlertCircle className="text-amber-500" />
                        Progress yang sudah dilewati tidak dapat dipilih lagi
                      </p>
                    )}
                  </div>

                  {/* Title Input */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Judul Progress
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Produksi Lemari"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Keterangan
                    </label>
                    <textarea
                      placeholder="Deskripsi detail progress..."
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                      rows={3}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition resize-none"
                    />
                  </div>

                  {/* Date & Time */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Waktu Update
                    </label>
                    <div className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-200">
                      <div className="flex items-center gap-2 text-slate-700">
                        <FiCalendar className="text-slate-400" />
                        <span className="text-sm">
                          {new Date().toLocaleDateString('id-ID', { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Upload Foto
                    </label>
                    <div 
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
                        isDragging 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImage}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer block">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <FiCamera className="text-slate-400 text-xl" />
                        </div>
                        <p className="text-sm font-medium text-slate-700 mb-1">
                          {isDragging ? 'Lepaskan file di sini' : 'Klik atau drag foto ke sini'}
                        </p>
                        <p className="text-xs text-slate-400">
                          PNG, JPG, JPEG (Max 5MB)
                        </p>
                      </label>
                    </div>

                    {/* Image Preview Grid */}
                    {imagePreviews.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mt-3">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative group aspect-square">
                            <div className="relative w-full h-full rounded-lg overflow-hidden">
                              <Image
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition shadow-lg hover:bg-red-600"
                            >
                              <FiX className="text-xs" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white py-3.5 px-4 rounded-xl font-semibold transition-all disabled:cursor-not-allowed shadow-lg shadow-slate-900/20 hover:shadow-xl hover:shadow-slate-900/30 flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Menyimpan...
                        </>
                      ) : (
                        <>
                          <FiCheckCircle /> Simpan Progress
                        </>
                      )}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setTitle("");
                      setDesc("");
                      setImages([]);
                      setImagePreviews([]);
                      const nextStep = progressSteps.find(step => step.value > order.current_progress);
                      if (nextStep) {
                        setProgress(nextStep.value);
                      }
                    }}
                    className="w-full py-3 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium transition"
                  >
                    Reset Form
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}