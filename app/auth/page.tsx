"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { loginWithEmail, registerWithEmail } from "@/lib/auth";
import { supabase } from "@/lib/supabaseClient";
import { Mail, Lock, User, Package, ArrowRight, Loader2, Sparkles } from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ─── Variants ────────────────────────────────────────────────────────────────

/** Animasi seluruh halaman saat pertama kali dibuka / refresh */
const pageVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] }
  }
};

/** Animasi card utama dengan delay setelah page fade in */
const cardVariants = {
  hidden: { opacity: 0, scale: 0.97, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.12 }
  }
};

/** Stagger untuk form fields */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 340, damping: 28 }
  }
};

/** Animasi konten form saat tab Masuk ↔ Daftar berganti (slide + blur) */
const formContentVariants = {
  hidden: (dir: number) => ({
    opacity: 0,
    x: dir * 30,
    filter: "blur(6px)",
    scale: 0.98
  }),
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    scale: 1,
    transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] }
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir * -30,
    filter: "blur(6px)",
    scale: 0.98,
    transition: { duration: 0.26, ease: [0.22, 1, 0.36, 1] }
  })
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function AuthPage() {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);
  const [direction, setDirection] = useState(1); // 1 = slide kanan, -1 = slide kiri
  const [loginMode, setLoginMode] = useState<"email" | "order">("email");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    order: ""
  });

  useEffect(() => {
    setFormData({ name: "", email: "", password: "", order: "" });
    if (isLogin) setLoginMode("email");
  }, [isLogin]);

  /** Ganti tab dengan arah animasi yang benar */
  const switchTab = (toLogin: boolean) => {
    if (toLogin === isLogin) return;
    setDirection(toLogin ? -1 : 1); // klik Masuk = slide dari kiri, klik Daftar = slide dari kanan
    setIsLogin(toLogin);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin && loginMode === "email") {
      const { data, error } = await loginWithEmail(formData.email, formData.password);
      if (error) { alert(error.message); setLoading(false); return; }
      const user = data.user;
      const { data: profile } = await supabase
        .from("profiles").select("role").eq("id", user?.id).single();
      router.push(profile?.role === "admin" ? "/admin" : "/profile");
    }

    if (isLogin && loginMode === "order") {
      const orderId = `ORD-${formData.order.trim()}`;
      const { data, error } = await supabase
        .from("profiles").select("email").eq("order_id", orderId).maybeSingle();
      if (error) console.log(error);
      if (!data) { alert("ID Pesanan tidak ditemukan"); setLoading(false); return; }
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: data.email, password: formData.password
      });
      if (loginError) { alert(loginError.message); setLoading(false); return; }
      router.push("/profile");
    }

    if (!isLogin) {
      const { error } = await registerWithEmail(formData.email, formData.password, formData.name);
      if (error) { alert(error.message); setLoading(false); return; }
      alert("Akun berhasil dibuat, silakan login.");
      switchTab(true);
    }

    setLoading(false);
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <Navbar />

      {/* [FIX 3] Page enter animation — fade + rise saat halaman dibuka/refresh */}
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className="pt-32 md:pt-40 pb-20 px-4 bg-gradient-to-br from-slate-50 via-gray-50 to-stone-100 flex items-center justify-center min-h-[calc(100vh-160px)]"
      >
        {/* Card utama */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-5xl bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-black/5 overflow-hidden border border-white/60 flex flex-col lg:grid lg:grid-cols-2"
        >
          {/* ── IMAGE SIDE ─────────────────────────────────────────────── */}
          {/* [FIX 1] min-h agar icon & teks tidak terpotong di mobile */}
          <div className="relative min-h-[210px] h-56 sm:h-64 lg:h-auto overflow-hidden order-first lg:order-none">
            <Image
              src="/process/step1.png"
              alt="Auth"
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              priority
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/15" />

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              /* [FIX 1] flex column dengan gap rapat + padding disesuaikan mobile */
              className="absolute inset-0 flex flex-col items-center justify-center gap-2 sm:gap-3 p-4 sm:p-8 text-center"
            >
              {/* Icon — lebih kecil di mobile agar tidak overflow */}
              <div className="w-11 h-11 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl lg:rounded-3xl flex items-center justify-center border border-white/20 shadow-xl flex-shrink-0">
                <Package className="w-5 h-5 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
              </div>

              <h2 className="text-white text-lg sm:text-3xl lg:text-4xl font-bold tracking-tight leading-snug">
                Modular Thinking
              </h2>
              <p className="text-white/80 text-xs sm:text-base lg:text-lg font-light leading-relaxed">
                For Better Space
              </p>

              {/* Dots */}
              <div className="flex gap-2 mt-1 sm:mt-4 lg:mt-8">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white/40" />
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white" />
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white/40" />
              </div>
            </motion.div>
          </div>

          {/* ── FORM SIDE ──────────────────────────────────────────────── */}
          <div className="p-6 sm:p-8 lg:p-12 xl:p-16 flex flex-col justify-center order-last">

            {/* [FIX 2] Tab Masuk / Daftar — spring indicator yang smooth */}
            <div className="relative flex gap-1 p-1.5 bg-gray-100/80 rounded-2xl mb-8 w-fit mx-auto lg:mx-0">
              {/* Indicator pill — bergerak dengan layoutId spring */}
              <motion.div
                layoutId="tabIndicator"
                className="absolute top-1.5 bottom-1.5 bg-white rounded-xl shadow-sm"
                style={{ left: isLogin ? "6px" : "calc(50% + 2px)", right: isLogin ? "calc(50% + 2px)" : "6px" }}
                transition={{ type: "spring", stiffness: 500, damping: 38, mass: 0.8 }}
              />
              <button
                onClick={() => switchTab(true)}
                className={`relative z-10 px-6 sm:px-8 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200 min-w-[80px] ${
                  isLogin ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Masuk
              </button>
              <button
                onClick={() => switchTab(false)}
                className={`relative z-10 px-6 sm:px-8 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200 min-w-[80px] ${
                  !isLogin ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Daftar
              </button>
            </div>

            {/* [FIX 2] Form content — slide + blur berdasarkan arah klik */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={isLogin ? (loginMode === "email" ? "login-email" : "login-order") : "register"}
                custom={direction}
                variants={formContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {/* Title */}
                <div className="mb-6 lg:mb-8">
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1.5 tracking-tight">
                    {isLogin
                      ? loginMode === "email" ? "Selamat Datang" : "Login dengan Pesanan"
                      : "Buat Akun Baru"}
                  </h3>
                  <p className="text-gray-500 text-sm sm:text-base">
                    {isLogin
                      ? loginMode === "email"
                        ? "Masukkan email dan password Anda"
                        : "Masukkan ID pesanan dan password"
                      : "Silahkan lengkapi form dibawah"}
                  </p>
                </div>

                {/* Form */}
                <motion.form
                  onSubmit={handleSubmit}
                  className="space-y-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {/* Name — register only */}
                  {!isLogin && (
                    <motion.div variants={itemVariants}>
                      <div className={`relative transition-transform duration-200 ${focusedField === "name" ? "scale-[1.02]" : ""}`}>
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <User className={`h-5 w-5 transition-colors duration-200 ${focusedField === "name" ? "text-indigo-600" : "text-gray-400"}`} />
                        </div>
                        <input
                          type="text" name="name" value={formData.name}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("name")}
                          onBlur={() => setFocusedField(null)}
                          placeholder="Nama Lengkap"
                          className="w-full pl-11 pr-4 py-3.5 sm:py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl text-gray-900 placeholder-gray-400 transition-all duration-200 outline-none text-sm sm:text-base"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Email */}
                  {(isLogin && loginMode === "email") || !isLogin ? (
                    <motion.div variants={itemVariants}>
                      <div className={`relative transition-transform duration-200 ${focusedField === "email" ? "scale-[1.02]" : ""}`}>
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail className={`h-5 w-5 transition-colors duration-200 ${focusedField === "email" ? "text-indigo-600" : "text-gray-400"}`} />
                        </div>
                        <input
                          type="email" name="email" value={formData.email}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("email")}
                          onBlur={() => setFocusedField(null)}
                          placeholder="Email"
                          className="w-full pl-11 pr-4 py-3.5 sm:py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl text-gray-900 placeholder-gray-400 transition-all duration-200 outline-none text-sm sm:text-base"
                        />
                      </div>
                    </motion.div>
                  ) : null}

                  {/* Order ID */}
                  {isLogin && loginMode === "order" && (
                    <motion.div variants={itemVariants}>
                      <div className={`relative transition-transform duration-200 ${focusedField === "order" ? "scale-[1.02]" : ""}`}>
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Package className={`h-5 w-5 transition-colors duration-200 ${focusedField === "order" ? "text-indigo-600" : "text-gray-400"}`} />
                        </div>
                        <div className="flex items-center bg-gray-50 border-2 border-transparent focus-within:border-indigo-500 focus-within:bg-white rounded-2xl transition-all duration-200 overflow-hidden">
                          <span className="pl-11 pr-2 py-3.5 sm:py-4 text-gray-500 font-medium select-none text-sm sm:text-base">ORD-</span>
                          <input
                            type="text" name="order" value={formData.order}
                            onChange={handleChange}
                            onFocus={() => setFocusedField("order")}
                            onBlur={() => setFocusedField(null)}
                            placeholder="Masukkan angka ID"
                            className="flex-1 pr-4 py-3.5 sm:py-4 bg-transparent text-gray-900 placeholder-gray-400 outline-none text-sm sm:text-base"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Password */}
                  <motion.div
                    variants={itemVariants}
                    className={`relative transition-transform duration-200 ${focusedField === "password" ? "scale-[1.02]" : ""}`}
                  >
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className={`h-5 w-5 transition-colors duration-200 ${focusedField === "password" ? "text-indigo-600" : "text-gray-400"}`} />
                    </div>
                    <input
                      type="password" name="password" value={formData.password}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Password"
                      className="w-full pl-11 pr-4 py-3.5 sm:py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl text-gray-900 placeholder-gray-400 transition-all duration-200 outline-none text-sm sm:text-base"
                    />
                  </motion.div>

                  {/* Submit */}
                  <motion.button
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-300 disabled:to-blue-300 text-white py-3.5 sm:py-4 rounded-2xl font-semibold text-sm sm:text-base transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 disabled:shadow-none mt-2"
                  >
                    {loading ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /><span>Memproses...</span></>
                    ) : (
                      <><span>{isLogin ? "Masuk" : "Daftar"}</span><ArrowRight className="w-5 h-5" /></>
                    )}
                  </motion.button>
                </motion.form>

                {/* Switch login mode (email ↔ ID Pesanan) */}
                {isLogin && (
                  <div className="mt-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200" />
                      </div>
                      <div className="relative flex justify-center text-xs sm:text-sm">
                        <span className="px-3 sm:px-4 bg-white text-gray-400">atau login dengan</span>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setLoginMode(loginMode === "email" ? "order" : "email")}
                      className="w-full mt-4 bg-white border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50/50 text-gray-700 hover:text-blue-600 py-3.5 sm:py-4 rounded-2xl font-semibold text-sm sm:text-base transition-all duration-300 flex items-center justify-center gap-2 group"
                    >
                      {loginMode === "email" ? (
                        <>
                          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                            <Package className="w-4 h-4 text-indigo-600" />
                          </div>
                          <span>ID Pesanan</span>
                        </>
                      ) : (
                        <>
                          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                            <Mail className="w-4 h-4 text-indigo-600" />
                          </div>
                          <span>Email</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                )}

                {/* Terms */}
                <div className="mt-6 lg:mt-8 flex items-center justify-center gap-2 text-xs text-gray-400">
                  <Sparkles className="w-3 h-3" />
                  <span>Lanjut untuk mulai menggunakan layanan</span>
                </div>
              </motion.div>
            </AnimatePresence>

          </div>
        </motion.div>
      </motion.div>

      <Footer />
    </>
  );
}