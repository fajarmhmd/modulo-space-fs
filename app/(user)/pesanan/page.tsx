// app/pesanan/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import UserLayout from "@/components/UserLayout";
import {
  Package,
  Loader2,
  ChevronRight,
  ChevronDown,
  Box,
  Hammer,
  Paintbrush,
  Send,
  CheckCircle2,
  Flag,
  Clock,
  MapPin,
  Phone,
  Mail,
  User
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

type OrderProgress = {
  id: string;
  title: string;
  description: string;
  progress: number;
  created_at: string;
  images?: string[];
};

interface Order {
  id: string;
  product_name: string;
  product_image?: string;
  product_material?: string;
  quantity: number;
  price: number;
  total_price: number;
  status: string;
  current_progress: number;
  created_at: string;
  address?: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  order_progress?: OrderProgress[];
}

const timelineSteps = [
  { value: 0, label: "Pesanan Dibuat", icon: Box, color: "from-gray-500 to-gray-600", defaultDesc: "Pesanan Anda telah diterima dan sedang menunggu konfirmasi" },
  { value: 20, label: "Pemotongan Material", icon: Hammer, color: "from-amber-500 to-orange-500", defaultDesc: "Material sedang dipersiapkan dan dipotong sesuai ukuran" },
  { value: 50, label: "Perakitan", icon: Hammer, color: "from-blue-500 to-blue-600", defaultDesc: "Komponen furniture sedang dirakit oleh tim profesional" },
  { value: 75, label: "Finishing", icon: Paintbrush, color: "from-purple-500 to-purple-600", defaultDesc: "Proses pengecatan dan finishing akhir" },
  { value: 100, label: "Siap Dikirim", icon: Send, color: "from-green-500 to-emerald-600", defaultDesc: "Pesanan siap dikirim ke alamat Anda" },
  { value: 101, label: "Selesai", icon: Flag, color: "from-emerald-600 to-teal-600", defaultDesc: "Pesanan telah diterima dan selesai" },
];

const statusColors: Record<string, string> = {
  "Menunggu Konfirmasi": "bg-amber-100 text-amber-700 border-amber-200",
  "Diproses": "bg-blue-100 text-blue-700 border-blue-200",
  "Selesai": "bg-green-100 text-green-700 border-green-200",
  "Dibatalkan": "bg-red-100 text-red-700 border-red-200",
};

function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID").format(n);
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const findAdminProgress = (stepValue: number, adminProgresses: OrderProgress[] | undefined) => {
  if (!adminProgresses || adminProgresses.length === 0) return null;
  
  if (stepValue === 101) {
    return adminProgresses.find(p => p.progress === 100 && p.title.toLowerCase().includes('selesai')) || 
           adminProgresses[adminProgresses.length - 1];
  }
  
  const matching = adminProgresses.filter(p => p.progress <= stepValue);
  return matching.length > 0 
    ? matching.reduce((prev, current) => (prev.progress > current.progress) ? prev : current)
    : null;
};

const getCurrentStepIndex = (currentProgress: number, status: string) => {
  if (status === "Selesai") return 5;
  
  for (let i = 0; i < timelineSteps.length; i++) {
    if (currentProgress < timelineSteps[i].value) {
      return Math.max(0, i - 1);
    }
  }
  return 4;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("orders-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => fetchOrders())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("progress-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "order_progress" }, () => fetchOrders())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  async function fetchOrders() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) { setLoading(false); return; }

      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (ordersError) { console.error(ordersError); return; }

      const ordersWithProgress = await Promise.all(
        (ordersData || []).map(async (order) => {
          const { data: progressData } = await supabase
            .from("order_progress")
            .select("*")
            .eq("order_id", order.id)
            .order("created_at", { ascending: true });
          return { ...order, order_progress: progressData || [] };
        })
      );

      setOrders(ordersWithProgress);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const toggleExpand = (orderId: string) => {
    setExpandedOrders(prev => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Pesanan Saya</h1>
          <p className="text-gray-500 mt-2">
            Pantau status dan progress pembuatan furniture Anda
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-lg">
            <Package className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500">Belum ada pesanan</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => {
              const currentStepIndex = getCurrentStepIndex(order.current_progress, order.status);
              const isExpanded = expandedOrders[order.id] || false;
              const isCompleted = order.status === "Selesai";
              
              // Step yang visible: jika collapsed = hanya current, jika expanded = semua
              const visibleSteps = isExpanded 
                ? timelineSteps 
                : [timelineSteps[currentStepIndex]];

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                      {/* Product Image */}
                      <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                        {order.product_image ? (
                          <Image src={order.product_image} alt={order.product_name} fill className="object-cover" />
                        ) : (
                          <Box className="m-auto text-gray-400" size={24} />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h2 className="font-bold text-xl text-gray-900 truncate">
                          {order.product_name}
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-gray-500">
                            #{order.id.slice(0, 8).toUpperCase()}
                          </span>
                          <span className="text-gray-300">•</span>
                          <span className="text-sm text-gray-500">
                            {formatDate(order.created_at)}
                          </span>
                        </div>
                        {order.product_material && (
                          <p className="text-sm text-gray-600 mt-1">
                            Material: {order.product_material}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${statusColors[order.status]}`}>
                          {order.status}
                        </span>
                        <button
                          onClick={() => toggleExpand(order.id)}
                          className="p-2 hover:bg-gray-100 rounded-full transition"
                        >
                          {isExpanded ? (
                            <ChevronDown size={20} className="text-gray-500" />
                          ) : (
                            <ChevronRight size={20} className="text-gray-500" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-600">
                          Progress Pembuatan
                        </span>
                        <span className="text-lg font-bold text-blue-600">
                          {isCompleted ? '100%' : `${order.current_progress}%`}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: isCompleted ? '100%' : `${order.current_progress}%` }}
                          transition={{ duration: 1 }}
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Timeline Section */}
                  <div className="p-6 bg-gray-50/50">
                    <div className="relative">
                      {/* Vertical Line - hanya tampil jika expanded */}
                      {isExpanded && (
                        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />
                      )}

                      <div className={`space-y-6 ${!isExpanded ? 'space-y-0' : ''}`}>
                        {visibleSteps.map((step, idx) => {
                          const stepIndex = timelineSteps.indexOf(step);
                          const isStepCompleted = isCompleted || order.current_progress >= step.value;
                          const isStepCurrent = stepIndex === currentStepIndex && !isCompleted;
                          
                          const adminProgress = findAdminProgress(step.value, order.order_progress);
                          const displayTitle = adminProgress?.title || step.label;
                          const displayDesc = adminProgress?.description || step.defaultDesc;
                          const displayDate = adminProgress?.created_at;

                          const Icon = step.icon;

                          return (
                            <motion.div
                              key={step.value}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className={`relative flex gap-4 ${!isExpanded ? 'items-center' : ''}`}
                            >
                              {/* Icon Circle */}
                              <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center shadow-lg flex-shrink-0 transition-all ${
                                isStepCompleted
                                  ? `bg-gradient-to-r ${step.color} text-white`
                                  : isStepCurrent
                                    ? "bg-blue-600 text-white ring-4 ring-blue-200"
                                    : "bg-gray-200 text-gray-400"
                              }`}>
                                {isStepCompleted ? <CheckCircle2 size={20} /> : <Icon size={20} />}
                                {isStepCurrent && (
                                  <span className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20" />
                                )}
                              </div>

                              {/* Content */}
                              <div className={`flex-1 rounded-2xl p-4 shadow-sm border transition-all ${
                                isStepCompleted
                                  ? "bg-white border-gray-200"
                                  : isStepCurrent
                                    ? "bg-blue-50 border-blue-200"
                                    : "bg-gray-100 border-gray-200 opacity-60"
                              }`}>
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h4 className={`font-bold ${
                                      isStepCompleted ? "text-gray-900" : 
                                      isStepCurrent ? "text-blue-900" : "text-gray-500"
                                    }`}>
                                      {displayTitle}
                                    </h4>
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold mt-1 ${
                                      isStepCompleted
                                        ? "bg-green-100 text-green-700"
                                        : isStepCurrent
                                          ? "bg-blue-100 text-blue-700 animate-pulse"
                                          : "bg-gray-200 text-gray-500"
                                    }`}>
                                      {isStepCompleted ? (
                                        <><CheckCircle2 size={10} /> {step.value === 101 ? 'Done' : `${step.value}%`}</>
                                      ) : isStepCurrent ? (
                                        <><Clock size={10} /> Sedang Berjalan</>
                                      ) : (
                                        <>{step.value === 101 ? 'Done' : `${step.value}%`}</>
                                      )}
                                    </span>
                                  </div>
                                  {displayDate && isExpanded && (
                                    <span className="text-xs text-gray-500">
                                      {formatDate(displayDate)}
                                    </span>
                                  )}
                                </div>
                                
                                <p className={`text-sm leading-relaxed ${
                                  isStepCompleted ? "text-gray-600" : 
                                  isStepCurrent ? "text-blue-700" : "text-gray-400"
                                }`}>
                                  {displayDesc}
                                </p>

                                {/* Images dari admin */}
                                {adminProgress?.images && adminProgress.images.length > 0 && isExpanded && (
                                  <div className="flex gap-2 mt-3">
                                    {adminProgress.images.map((img, imgIdx) => (
                                      <div
                                        key={imgIdx}
                                        className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-100 group"
                                      >
                                        <Image
                                          src={img}
                                          alt={`Progress ${imgIdx + 1}`}
                                          fill
                                          className="object-cover group-hover:scale-110 transition-transform"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Detail Pesanan - MUNCUL SAAT EXPANDED */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-gray-100 overflow-hidden"
                      >
                        <div className="p-6 bg-white">
                          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <User size={18} className="text-blue-600" />
                            Detail Pesanan
                          </h3>
                          
                          {/* Info Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-gray-50 rounded-xl p-4">
                              <span className="text-xs text-gray-500 block mb-1">Jumlah</span>
                              <span className="font-semibold text-gray-900">{order.quantity} pcs</span>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4">
                              <span className="text-xs text-gray-500 block mb-1">Harga Satuan</span>
                              <span className="font-semibold text-gray-900">IDR {formatRupiah(order.price || 0)}</span>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4">
                              <span className="text-xs text-gray-500 block mb-1">Material</span>
                              <span className="font-semibold text-gray-900">{order.product_material || "-"}</span>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4">
                              <span className="text-xs text-gray-500 block mb-1">Total</span>
                              <span className="font-bold text-blue-600">IDR {formatRupiah(order.total_price || 0)}</span>
                            </div>
                          </div>

                          {/* Customer Info */}
                          <div className="space-y-3">
                            <h4 className="font-semibold text-gray-900 text-sm">Informasi Pengiriman</h4>
                            
                            {order.customer_name && (
                              <div className="flex items-center gap-3 text-sm">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <User size={14} className="text-blue-600" />
                                </div>
                                <div>
                                  <span className="text-gray-500 text-xs block">Nama</span>
                                  <span className="font-medium text-gray-900">{order.customer_name}</span>
                                </div>
                              </div>
                            )}
                            
                            {order.customer_phone && (
                              <div className="flex items-center gap-3 text-sm">
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                  <Phone size={14} className="text-green-600" />
                                </div>
                                <div>
                                  <span className="text-gray-500 text-xs block">Telepon</span>
                                  <span className="font-medium text-gray-900">{order.customer_phone}</span>
                                </div>
                              </div>
                            )}
                            
                            {order.address && (
                              <div className="flex items-start gap-3 text-sm">
                                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <MapPin size={14} className="text-amber-600" />
                                </div>
                                <div>
                                  <span className="text-gray-500 text-xs block">Alamat Pengiriman</span>
                                  <span className="font-medium text-gray-900">{order.address}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Footer - Total Only */}
                  {!isExpanded && (
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                      <div className="flex items-center gap-6 text-sm">
                        <div>
                          <span className="text-gray-500">Jumlah</span>
                          <p className="font-semibold text-gray-900">{order.quantity} pcs</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Harga Satuan</span>
                          <p className="font-semibold text-gray-900">IDR {formatRupiah(order.price || 0)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-gray-500 text-sm">Total</span>
                        <p className="text-xl font-bold text-blue-600">
                          IDR {formatRupiah(order.total_price || 0)}
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}