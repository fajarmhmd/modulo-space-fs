"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Strength = 0 | 1 | 2 | 3 | 4;

function getStrength(pw: string): Strength {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/[0-9!@#$%^&*]/.test(pw)) score++;
  return score as Strength;
}

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const strength = getStrength(password);
  const isValid = password.length >= 6 && password === confirm;

  const strengthColors: Record<Strength, string> = {
    0: "bg-gray-200",
    1: "bg-red-500",
    2: "bg-amber-400",
    3: "bg-green-500",
    4: "bg-green-600",
  };

  const strengthLabels: Record<Strength, string> = {
    0: "",
    1: "Password terlalu lemah",
    2: "Tambahkan huruf besar atau angka",
    3: "Hampir sempurna!",
    4: "Password kuat",
  };

  const strengthLabelColors: Record<Strength, string> = {
    0: "",
    1: "text-red-600",
    2: "text-amber-600",
    3: "text-green-700",
    4: "text-green-700",
  };

  async function handleUpdate() {
    if (!isValid) return;
    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (error) {
      alert("Gagal update password: " + error.message);
      return;
    }

    setSuccess(true);
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--color-background-tertiary, #f5f5f3)" }}
    >
      <div className="relative bg-white rounded-3xl border border-gray-100 shadow-sm p-10 w-full max-w-md overflow-hidden">
        {/* Decorative circle */}
        <div className="absolute -top-14 -right-14 w-44 h-44 rounded-full bg-blue-50 opacity-40 pointer-events-none" />

        {success ? (
          /* ── Success state ── */
          <div className="flex flex-col items-center text-center gap-3 py-4">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-2">
              <svg
                className="w-7 h-7 stroke-green-700"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="text-lg font-medium text-gray-900">
              Password diperbarui!
            </p>
            <p className="text-sm text-gray-500">
              Kamu sudah bisa login dengan password baru.
            </p>
            
              <a href="/login"
              className="mt-4 px-6 py-3 rounded-xl bg-blue-700 text-white text-sm font-medium hover:opacity-90 transition"
            >
              Ke halaman login
            </a>
          </div>
        ) : (
          <>
            {/* Icon */}
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-5">
              <svg
                className="w-6 h-6 stroke-blue-700"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>

            <h1
              className="text-2xl text-gray-900 mb-1 leading-tight"
              style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400 }}
            >
              Buat password baru
            </h1>
            <p className="text-sm text-gray-400 mb-6">
              Masukkan password baru yang kuat untuk akunmu.
            </p>

            {/* Password field */}
            <label className="block text-xs font-medium tracking-widest text-gray-400 uppercase mb-1.5">
              Password baru
            </label>
            <div className="relative mb-3">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showPw ? (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>

            {/* Confirm field */}
            <label className="block text-xs font-medium tracking-widest text-gray-400 uppercase mb-1.5">
              Konfirmasi password
            </label>
            <div className="relative mb-3">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Ulangi password"
                className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showConfirm ? (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>

            {/* Strength bar */}
            <div className="flex gap-1 mb-1">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`flex-1 h-1 rounded-full transition-colors duration-200 ${
                    i <= strength ? strengthColors[strength] : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
            <p className={`text-xs mb-5 min-h-[16px] ${strengthLabelColors[strength]}`}>
              {strengthLabels[strength]}
            </p>

            {/* Submit */}
            <button
              onClick={handleUpdate}
              disabled={!isValid || loading}
              className="w-full py-3 rounded-xl bg-blue-700 text-white text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin stroke-white" viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round">
                    <line x1="12" y1="2" x2="12" y2="6"/>
                    <line x1="12" y1="18" x2="12" y2="22"/>
                    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
                    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
                    <line x1="2" y1="12" x2="6" y2="12"/>
                    <line x1="18" y1="12" x2="22" y2="12"/>
                  </svg>
                  Menyimpan...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 stroke-white" viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Update Password
                </>
              )}
            </button>

            <div className="my-5 border-t border-gray-100" />

            
              <a href="/login"
              className="flex items-center justify-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Kembali ke login
            </a>
          </>
        )}
      </div>
    </div>
  );
}