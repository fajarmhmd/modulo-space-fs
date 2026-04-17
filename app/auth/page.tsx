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

export default function AuthPage() {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);
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
    setFormData({
      name: "",
      email: "",
      password: "",
      order: ""
    });
    if (isLogin) {
      setLoginMode("email");
    }
  }, [isLogin]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin && loginMode === "email") {
      const { data, error } = await loginWithEmail(
        formData.email,
        formData.password
      );

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }

      const user = data.user;

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user?.id)
        .single();

      if (profile?.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/profile");
      }
    }

    if (isLogin && loginMode === "order") {
      const orderId = `ORD-${formData.order.trim()}`;

      const { data, error } = await supabase
        .from("profiles")
        .select("email")
        .eq("order_id", orderId)
        .maybeSingle();

      if (error) {
        console.log(error);
      }

      if (!data) {
        alert("ID Pesanan tidak ditemukan");
        setLoading(false);
        return;
      }

      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: formData.password
      });

      if (loginError) {
        alert(loginError.message);
        setLoading(false);
        return;
      }

      router.push("/profile");
    }

    if (!isLogin) {
      const { error } = await registerWithEmail(
        formData.email,
        formData.password,
        formData.name
      );

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }

      alert("Akun berhasil dibuat, silakan login.");
      setIsLogin(true);
      setLoginMode("email");
    }

    setLoading(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.98 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 25 }
    }
  };

  return (
    <>
    <Navbar />

    <div className="pt-24 md:pt-38 pb-20 bg-gradient-to-br from-slate-50 via-gray-50 to-stone-100 flex items-center justify-center min-h-[calc(100vh-160px)]">
        <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-5xl bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-black/5 overflow-hidden border border-white/60 flex flex-col lg:grid lg:grid-cols-2"
      >
        {/* IMAGE SIDE */}
        <div className="relative h-48 sm:h-64 lg:h-auto overflow-hidden order-first lg:order-none">
          <Image
            src="/process/step1.png"
            alt="Auth"
            fill
            className="object-cover transition-transform duration-700 hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/30 lg:bg-gradient-to-br lg:from-black/70 lg:via-black/50 lg:to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent lg:bg-gradient-to-br" />
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-6 sm:p-12 text-center"
          >
            <div className="mb-4 lg:mb-6">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white/10 backdrop-blur-md rounded-2xl lg:rounded-3xl flex items-center justify-center mb-4 lg:mb-6 mx-auto border border-white/20 shadow-xl">
                <Package className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
              </div>
            </div>
            <h2 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 lg:mb-4 tracking-tight">
              Modular Thinking
            </h2>
            <p className="text-white/80 text-sm sm:text-base lg:text-lg font-light max-w-xs lg:max-w-sm leading-relaxed">
              For Better Space
            </p>
            
            <div className="mt-6 lg:mt-12 flex gap-2">
              <div className="w-2 h-2 rounded-full bg-white/40" />
              <div className="w-2 h-2 rounded-full bg-white" />
              <div className="w-2 h-2 rounded-full bg-white/40" />
            </div>
          </motion.div>
        </div>

        {/* FORM SIDE */}
        <div className="p-6 sm:p-8 lg:p-12 xl:p-16 flex flex-col justify-center order-last">
          {/* Header Tabs dengan Shared Layout Animation */}
          <div className="relative flex gap-1 p-1.5 bg-gray-100/80 rounded-2xl mb-8 w-fit mx-auto lg:mx-0">
            {/* Animated Background Indicator menggunakan layoutId */}
            {isLogin && (
              <motion.div
                layoutId="activeTabBg"
                className="absolute inset-y-1.5 left-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-sm"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            {!isLogin && (
              <motion.div
                layoutId="activeTabBg"
                className="absolute inset-y-1.5 right-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-sm"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            
            <button
              onClick={() => setIsLogin(true)}
              className={`relative z-10 px-6 sm:px-8 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-300 ${
                isLogin ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Masuk
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`relative z-10 px-6 sm:px-8 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-300 ${
                !isLogin ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Daftar
            </button>
          </div>

          {/* Title dengan AnimatePresence yang lebih smooth */}
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? (loginMode === "email" ? "login-email" : "login-order") : "register"}
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="mb-6 lg:mb-8"
            >
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 tracking-tight">
                {isLogin
                  ? loginMode === "email"
                    ? "Selamat Datang Kembali"
                    : "Login dengan Pesanan"
                  : "Buat Akun Baru"}
              </h3>
              <p className="text-gray-500 text-sm sm:text-base">
                {isLogin
                  ? loginMode === "email"
                    ? "Masukkan email dan password Anda"
                    : "Masukkan ID pesanan dan password"
                  : "Daftar untuk memulai pengalaman baru"}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Form dengan stagger animation */}
          <motion.form 
            onSubmit={handleSubmit} 
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Register Name */}
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="name-field"
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  variants={itemVariants}
                >
                  <div className={`relative group transition-all duration-300 ${
                    focusedField === "name" ? "transform scale-[1.02]" : ""
                  }`}>
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className={`h-5 w-5 transition-colors duration-300 ${
                        focusedField === "name" ? "text-indigo-600" : "text-gray-400"
                      }`} />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Nama Lengkap"
                      className="w-full pl-11 pr-4 py-3.5 sm:py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl text-gray-900 placeholder-gray-400 transition-all duration-300 outline-none text-sm sm:text-base"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Field */}
            <AnimatePresence mode="wait">
              {(isLogin && loginMode === "email") || !isLogin ? (
                <motion.div
                  key="email-field"
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  variants={itemVariants}
                >
                  <div className={`relative group transition-all duration-300 ${
                    focusedField === "email" ? "transform scale-[1.02]" : ""
                  }`}>
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className={`h-5 w-5 transition-colors duration-300 ${
                        focusedField === "email" ? "text-indigo-600" : "text-gray-400"
                      }`} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Email"
                      className="w-full pl-11 pr-4 py-3.5 sm:py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl text-gray-900 placeholder-gray-400 transition-all duration-300 outline-none text-sm sm:text-base"
                    />
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            {/* Login Order */}
            <AnimatePresence mode="wait">
              {isLogin && loginMode === "order" && (
                <motion.div
                  key="order-field"
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  variants={itemVariants}
                >
                  <div className={`relative group transition-all duration-300 ${
                    focusedField === "order" ? "transform scale-[1.02]" : ""
                  }`}>
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Package className={`h-5 w-5 transition-colors duration-300 ${
                        focusedField === "order" ? "text-indigo-600" : "text-gray-400"
                      }`} />
                    </div>
                    <div className="flex items-center bg-gray-50 border-2 border-transparent focus-within:border-indigo-500 focus-within:bg-white rounded-2xl transition-all duration-300 overflow-hidden">
                      <span className="pl-11 pr-2 py-3.5 sm:py-4 text-gray-500 font-medium select-none text-sm sm:text-base">
                        ORD-
                      </span>
                      <input
                        type="text"
                        name="order"
                        value={formData.order}
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
            </AnimatePresence>

            {/* Password */}
            <motion.div 
              variants={itemVariants}
              className={`relative group transition-all duration-300 ${
              focusedField === "password" ? "transform scale-[1.02]" : ""
            }`}>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className={`h-5 w-5 transition-colors duration-300 ${
                  focusedField === "password" ? "text-indigo-600" : "text-gray-400"
                }`} />
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                placeholder="Password"
                className="w-full pl-11 pr-4 py-3.5 sm:py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl text-gray-900 placeholder-gray-400 transition-all duration-300 outline-none text-sm sm:text-base"
              />
            </motion.div>

            {/* Submit Button */}
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 disabled:from-gray-400 disabled:to-gray-400 text-white py-3.5 sm:py-4 rounded-2xl font-semibold text-sm sm:text-base transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-gray-900/20 disabled:shadow-none mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <span>{isLogin ? "Masuk" : "Daftar"}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </motion.form>

          {/* Switch Login Mode */}
          <AnimatePresence mode="wait">
            {isLogin && (
              <motion.div
                key="login-mode-switch"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="mt-6"
              >
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
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setLoginMode(loginMode === "email" ? "order" : "email")}
                  className="w-full mt-4 bg-white border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50/50 text-gray-700 hover:text-indigo-600 py-3.5 sm:py-4 rounded-2xl font-semibold text-sm sm:text-base transition-all duration-300 flex items-center justify-center gap-2 group"
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
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer Info */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 lg:mt-8 flex items-center justify-center gap-2 text-xs text-gray-400"
          >
            <Sparkles className="w-3 h-3" />
            <span>Dengan melanjutkan, Anda menyetujui syarat dan ketentuan</span>
          </motion.div>
        </div>
      </motion.div>
    </div>
    <Footer />
    </>
  );
}
