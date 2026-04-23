// app/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import UserLayout from "@/components/UserLayout";
import {
  User,
  Phone,
  MapPin,
  Shield,
  Calendar,
  Loader2,
  CheckCircle,
  Mail,
  Camera,
  Edit3,
  X,
  ChevronRight,
  Sparkles,
  Award,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
const [passwordForm, setPasswordForm] = useState({
  oldPassword: "",
  newPassword: "",
  confirmPassword: ""
});
const [passwordLoading, setPasswordLoading] = useState(false);

  const [edit, setEdit] = useState<any>({
    full_name: false,
    phone: false,
    address: false
  });

  const [form, setForm] = useState<any>({
    full_name: "",
    phone: "",
    address: ""
  });

  // Stats untuk tampilan modern
//   const userStats = [
//     { label: "Pesanan", value: "12", icon: Award, color: "from-blue-500 to-blue-600" },
//     { label: "Bergabung", value: "2023", icon: Calendar, color: "from-purple-500 to-purple-600" },
//     { label: "Status", value: "Active", icon: Sparkles, color: "from-green-500 to-green-600" },
//   ];

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error(error.message);
      setLoading(false);
      return;
    }

    setProfile(data);
    setForm({
      full_name: data.full_name || "",
      phone: data.phone || "",
      address: data.address || ""
    });
    setLoading(false);
  }

  async function updateField(field: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({ [field]: form[field] })
      .eq("id", user.id);

    setSaving(false);

    if (error) {
      alert("Gagal update: " + error.message);
      return;
    }

    setSuccess("Profil berhasil diperbarui");
    setTimeout(() => setSuccess(""), 3000);
    setEdit({ ...edit, [field]: false });
    fetchProfile();
  }

  function cancelEdit(field: string) {
    setForm({ ...form, [field]: profile[field] || "" });
    setEdit({ ...edit, [field]: false });
  }
  async function handleResetPassword() {
    const { data: { user } } = await supabase.auth.getUser();
  
    if (!user?.email) {
      alert("Email tidak ditemukan");
      return;
    }
  
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: "http://localhost:3000/reset-password",
    });
  
    if (error) {
      alert("Gagal kirim email: " + error.message);
      return;
    }
  
    alert("Link reset password sudah dikirim ke email kamu 📩");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="text-blue-600" size={48} />
        </motion.div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <p className="text-gray-600">Silakan login terlebih dahulu</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Success Toast */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -50, x: 50 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: -20, x: 50 }}
              className="fixed top-6 right-6 z-50 bg-white shadow-2xl border-l-4 border-green-500 rounded-xl px-6 py-4 flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="text-green-600" size={20} />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Berhasil!</p>
                <p className="text-sm text-gray-600">{success}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header Card - Modern Glass Morphism */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-6 md:p-10 shadow-xl shadow-blue-900/5 relative overflow-hidden"
        >
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
            {/* Avatar dengan Edit Overlay */}
            <div className="relative group">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-1 shadow-2xl">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-purple-600">
                  {profile.full_name?.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
                  {profile.full_name}
                </h1>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">
                  {profile.role || "Member"}
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-blue-500" />
                  <span>{profile.email}</span>
                </div>
                <div className="hidden md:block w-1 h-1 bg-black-300 rounded-full" />
              </div>
            </div>


          </div>

          {/* Stats Grid */}
          {/* <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-100">
            {userStats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className={`w-12 h-12 mx-auto mb-2 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                  <stat.icon className="text-white" size={24} />
                </div>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </div> */}
        </motion.div>

        {/* Form Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Nama Lengkap */}
          <InfoCard
            icon={<User size={20} />}
            title="Nama Lengkap"
            subtitle="Nama untuk pengiriman dan invoice"
            editing={edit.full_name}
            value={profile.full_name}
            onSave={() => updateField("full_name")}
            onCancel={() => cancelEdit("full_name")}
            onEdit={() => setEdit({ ...edit, full_name: true })}
          >
            <input
              type="text"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black placeholder-gray-400"
              placeholder="Masukkan nama lengkap"
            />
          </InfoCard>

          {/* Nomor Telepon */}
          <InfoCard
            icon={<Phone size={20} />}
            title="Nomor Telepon"
            subtitle="Untuk konfirmasi pesanan"
            editing={edit.phone}
            value={profile.phone}
            onSave={() => updateField("phone")}
            onCancel={() => cancelEdit("phone")}
            onEdit={() => setEdit({ ...edit, phone: true })}
          >
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-3 bg-white text-black border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="08xxxxxxxxxx"
            />
          </InfoCard>

          {/* Alamat - Full Width */}
          <InfoCard
            icon={<MapPin size={20} />}
            title="Alamat Pengiriman"
            subtitle="Alamat utama untuk pengiriman produk"
            editing={edit.address}
            value={profile.address}
            onSave={() => updateField("address")}
            onCancel={() => cancelEdit("address")}
            onEdit={() => setEdit({ ...edit, address: true })}
            fullWidth
          >
<textarea
  value={form.address}
  onChange={(e) => setForm({ ...form, address: e.target.value })}
  rows={3}
  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none text-black placeholder-gray-400"
  placeholder="Masukkan alamat lengkap"
/>
          </InfoCard>

          {/* Info Akun - Read Only */}

        </div>

        {/* Security Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-700 rounded-3xl p-6 md:p-8 text-white shadow-2xl"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold mb-2">Keamanan Akun</h3>
              <p className="text-gray-400 text-sm">Perbarui password secara berkala untuk keamanan maksimal</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-white text-gray-900 rounded-xl font-bold hover:bg-black-100 transition-colors flex items-center gap-2"
              onClick={handleResetPassword}
            >
              <Shield size={18} />
              Ganti Password
            </motion.button>
          </div>
        </motion.div>
        <AnimatePresence>
  {showPasswordForm && (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-white mt-6 rounded-2xl p-6 shadow-xl"
    >
      <h3 className="font-bold text-lg mb-4">Ganti Password</h3>

      <div className="space-y-4">
        <input
          type="password"
          placeholder="Password lama"
          value={passwordForm.oldPassword}
          onChange={(e) =>
            setPasswordForm({ ...passwordForm, oldPassword: e.target.value })
          }
          className="w-full px-4 py-3 border rounded-xl"
        />

        <input
          type="password"
          placeholder="Password baru"
          value={passwordForm.newPassword}
          onChange={(e) =>
            setPasswordForm({ ...passwordForm, newPassword: e.target.value })
          }
          className="w-full px-4 py-3 border rounded-xl"
        />

        <input
          type="password"
          placeholder="Konfirmasi password baru"
          value={passwordForm.confirmPassword}
          onChange={(e) =>
            setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
          }
          className="w-full px-4 py-3 border rounded-xl"
        />

        <button
          onClick={handleChangePassword}
          disabled={passwordLoading}
          className="w-full py-3 bg-black text-white rounded-xl font-semibold"
        >
          {passwordLoading ? "Menyimpan..." : "Update Password"}
        </button>
      </div>
    </motion.div>
  )}
</AnimatePresence>
      </div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {saving && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-2xl p-6 shadow-2xl flex items-center gap-4"
            >
              <Loader2 className="animate-spin text-blue-600" size={28} />
              <span className="font-semibold text-gray-900">Menyimpan perubahan...</span>
            </motion.div>
          </motion.div>
          
        )}
      </AnimatePresence>
    </div>
  );
}

// Component InfoCard yang lebih modern
function InfoCard({
  icon,
  title,
  subtitle,
  value,
  editing,
  onSave,
  onCancel,
  onEdit,
  children,
  fullWidth = false
}: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 ${fullWidth ? 'md:col-span-2' : ''}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
            {icon}
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{title}</h3>
            <p className="text-xs text-gray-500">{subtitle}</p>
          </div>
        </div>
        
        {!editing ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onEdit}
            className="p-2 hover:bg-black-100 rounded-lg transition-colors text-gray-600"
          >
            <Edit3 size={18} />
          </motion.button>
        ) : (
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCancel}
              className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
            >
              <X size={18} />
            </motion.button>
          </div>
        )}
      </div>

      <div className="mt-4">
        {editing ? (
          <div className="space-y-4">
            {children}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onSave}
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle size={18} />
                Simpan Perubahan
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onCancel}
                className="px-6 py-3 bg-black-100 text-gray-700 rounded-xl font-semibold hover:bg-black-200 transition-colors"
              >
                Batal
              </motion.button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between py-3 px-4 bg-black-500 rounded-xl">
            <span className="font-semibold text-gray-900">{value || "-"}</span>
            <ChevronRight size={18} className="text-gray-400" />
          </div>
        )}
      </div>
    </motion.div>
  );
}