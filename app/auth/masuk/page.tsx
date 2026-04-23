"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginWithEmail, loginWithGoogle } from "@/lib/auth";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailLogin = async () => {
    const { data, error } = await loginWithEmail(email, password);

    if (error) {
      alert(error.message);
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
  };

  const handleGoogleLogin = async () => {
    await loginWithGoogle();
  };

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto mt-6 sm:mt-20 px-4 pb-8">
      {/* Tabs: Masuk / Daftar */}
      <div className="flex justify-center gap-2 mb-2">
        <button className="px-6 py-2 rounded-full bg-white shadow font-semibold text-sm border border-gray-200">
          Masuk
        </button>
        <button className="px-6 py-2 rounded-full text-gray-500 text-sm">
          Daftar
        </button>
      </div>

      {/* Heading */}
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-gray-900">Selamat Datang</h1>
        <p className="text-sm text-gray-500 mt-1">Masukkan email dan password Anda</p>
      </div>

      {/* Email input */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </span>
        <input
          type="email"
          placeholder="Email"
          className="w-full border border-gray-200 bg-gray-50 p-3 pl-10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* Password input */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </span>
        <input
          type="password"
          placeholder="Password"
          className="w-full border border-gray-200 bg-gray-50 p-3 pl-10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {/* Login button */}
      <button
        onClick={handleEmailLogin}
        className="w-full bg-gray-900 text-white p-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-700 transition-colors"
      >
        Masuk <span>→</span>
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 my-1">
        <hr className="flex-1 border-gray-200" />
        <span className="text-xs text-gray-400">atau login dengan</span>
        <hr className="flex-1 border-gray-200" />
      </div>

      {/* Google / ID Pesanan button */}
      <button
        onClick={handleGoogleLogin}
        className="w-full border border-gray-200 bg-white p-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
      >
        {/* Google icon placeholder - replace with actual Google icon */}
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        ID Pesanan
      </button>

      {/* Terms */}
      <p className="text-xs text-center text-gray-400 mt-2">
        Dengan melanjutkan, Anda menyetujui{" "}
        <span className="underline cursor-pointer">syarat dan ketentuan</span>
      </p>
    </div>
  );
}