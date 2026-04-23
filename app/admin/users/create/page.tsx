// app/admin/users/create/page.tsx

"use client"

import { useState, useEffect } from "react"
import { UserPlus, Loader2, CheckCircle, Copy, RefreshCw, Mail, Lock, User, MapPin, Hash } from "lucide-react"

interface FormData {
  id: string
  full_name: string
  email: string
  password: string
  address: string
}

export default function CreateUserPage() {
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [form, setForm] = useState<FormData>({
    id: "",
    full_name: "",
    email: "",
    password: "",
    address: ""
  })

  useEffect(() => {
    generateID()
  }, [])

  function generateID() {
    const random = Math.floor(1000 + Math.random() * 9000)
    const orderID = `ORD-${random}`
    setForm((prev) => ({ ...prev, id: orderID }))
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(form.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function createUser() {
    if (!form.full_name || !form.email || !form.password) {
      alert("Nama, Email, dan Password wajib diisi")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/admin/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          full_name: form.full_name,
          address: form.address,
          order_id: form.id
        })
      })

      const result = await res.json()

      if (!res.ok) {
        alert(result.error)
        setLoading(false)
        return
      }

      alert("User berhasil dibuat")
      
      setForm({
        id: "",
        full_name: "",
        email: "",
        password: "",
        address: ""
      })
      
      generateID()
    } catch (error) {
      alert("Terjadi kesalahan saat membuat user")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        
        {/* HEADER */}
        <div className="mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl shadow-lg shadow-blue-600/20">
              <UserPlus size={24} />
            </div>
            <span className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
              Admin Panel
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Tambah Akun User
          </h1>
          <p className="mt-2 text-slate-600 text-base sm:text-lg">
            Buat akun pengguna baru dengan ID pesanan otomatis
          </p>
        </div>

        {/* CARD FORM */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden">
          
          {/* Progress Bar Decoration */}
          <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

          <div className="p-6 sm:p-8 space-y-6">
            
            {/* ID ORDER - Highlighted Section */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-5 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-500" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Hash size={18} className="text-blue-400" />
                  <label className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                    ID Pesanan Otomatis
                  </label>
                </div>
                
                <div className="flex items-center justify-between gap-4">
                  <span className="text-2xl sm:text-3xl font-mono font-bold tracking-wider">
                    {form.id}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={copyToClipboard}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-200 group/btn"
                      title="Copy ID"
                    >
                      {copied ? (
                        <CheckCircle size={20} className="text-green-400" />
                      ) : (
                        <Copy size={20} className="text-slate-300 group-hover/btn:text-white" />
                      )}
                    </button>
                    <button
                      onClick={generateID}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-200 group/btn"
                      title="Generate New ID"
                    >
                      <RefreshCw size={20} className="text-slate-300 group-hover/btn:text-white group-hover/btn:rotate-180 transition-transform duration-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* FORM GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* NAMA */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <User size={16} className="text-blue-600" />
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  placeholder="Masukkan nama lengkap"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 hover:border-slate-300"
                />
              </div>

              {/* EMAIL */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Mail size={16} className="text-blue-600" />
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="contoh@email.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 hover:border-slate-300"
                />
              </div>

              {/* PASSWORD */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Lock size={16} className="text-blue-600" />
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Minimal 8 karakter"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 pr-12 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 hover:border-slate-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </button>
                </div>
              </div>

              {/* ALAMAT */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <MapPin size={16} className="text-blue-600" />
                  Alamat Lengkap
                </label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Masukkan alamat lengkap pengiriman..."
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 hover:border-slate-300 resize-none"
                />
              </div>
            </div>

            {/* DIVIDER */}
            <div className="border-t border-slate-100" />

            {/* BUTTON */}
            <button
              onClick={createUser}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-400 text-white font-semibold py-4 rounded-xl shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Membuat akun...</span>
                </>
              ) : (
                <>
                  <UserPlus size={20} />
                  <span>Buat Akun</span>
                </>
              )}
            </button>

            {/* INFO TEXT */}
            <p className="text-center text-sm text-slate-500">
              ID Pesanan akan otomatis tersimpan dengan akun user baru
            </p>

          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm">
            © 2026 Admin Dashboard. All rights reserved.
          </p>
        </div>

      </div>
    </div>
  )
}