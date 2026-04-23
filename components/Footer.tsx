"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Facebook,
  Instagram,
  Phone,
  Mail,
  Clock,
  MapPin,
} from "lucide-react";
import { FaTiktok } from "react-icons/fa";

/* ================= DATA ================= */

const paymentLogos = [
  "atm-bersama.png",
  "bca.png",
  "bank-transfer.png",
  "gopay.png",
  "ovo.png",
  "logo-bri.png",
];

const shippingLogos = [
  "jne.png",
  "jnt.png",
  "gosend.png",
  "footer-sicepat.png",
];

/* ================= LOGO ITEM ================= */

function LogoItem({ src }: { src: string }) {
  return (
    <div className="flex items-center justify-center h-8 bg-white/10 rounded-md px-2">
      <Image
        src={src}
        alt="logo"
        width={70}
        height={24}
        className="object-contain max-h-6 w-auto"
      />
    </div>
  );
}

/* ================= SOCIAL ICON ================= */

function SocialIcon({ icon: Icon, href = "https://wa.me/6289509478009" }: { icon: React.ElementType; href?: string }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
// whileHover={{ scale: 1 }}
      whileTap={{ scale: 0.95 }}
      className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
    >
      <Icon size={16} className="text-white" />
    </motion.a>
  );
}

/* ================= FOOTER ================= */

export default function Footer() {
  return (
<footer id="footer" className="bg-[#1e3a5f] text-white sm:pt-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >

        {/* ================= DESKTOP ================= */}
        <div className="hidden lg:grid grid-cols-12 gap-6">

          {/* ===== LEFT - Brand & Contact (4 cols) ===== */}
          <div className="col-span-4">
            {/* Logo lebih besar, rapat, sejajar */}
            <div className="flex items-center gap-1 mb-2">
              <Image 
                src="/logo-inisial.png" 
                alt="Logo" 
                width={72} 
                height={72}
                className="object-contain flex-shrink-0"
              />
              <Image 
                src="/logo-full.png" 
                alt="Modulo Space" 
                width={180} 
                height={72}
                className="object-contain flex-shrink-0"
              />
            </div>

            {/* Contact lebih dekat ke logo (mb dikurangi, space-y dikurangi) */}
            <div className="space-y-1.5 text-sm text-white/70">
              <div className="flex gap-2 items-start">
                <MapPin size={13} className="mt-0.5 flex-shrink-0 text-white/60"/>
                <span className="text-xs leading-relaxed">Pajajaran XI No.66, Parung Panjang, Kab.Bogor, Jawa Barat 16330</span>
              </div>
              <div className="flex gap-2 items-center">
                <Clock size={13} className="text-white/60"/>
                <span className="text-xs">Senin–Minggu (09:00–21:00)</span>
              </div>
              <div className="flex gap-2 items-center">
                <Phone size={13} className="text-white/60"/>
                <span className="text-xs">+62 811-3084-2365</span>
              </div>
              <div className="flex gap-2 items-center">
                <Mail size={13} className="text-white/60"/>
                <span className="text-xs">modulospaceidn@gmail.com</span>
              </div>
            </div>

            <div className="flex gap-2 mt-3">
              <SocialIcon icon={Facebook} />
              <SocialIcon icon={Instagram} />
              <SocialIcon icon={FaTiktok} />
            </div>
          </div>

          {/* ===== CENTER - Payment & Company (4 cols) ===== */}
          <div className="col-span-4 space-y-6">
            
            {/* Metode Pembayaran */}
            <div>
              <h3 className="font-semibold mb-3 text-sm flex items-center gap-2">
                <span className="w-1 h-4 bg-white rounded-full"></span>
                Metode Pembayaran
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {paymentLogos.map((p, i) => (
                  <LogoItem key={i} src={`/payments/${p}`} />
                ))}
              </div>
            </div>

            {/* Modulo Space Links */}
            <div>
              <h4 className="font-semibold mb-3 text-sm flex items-center gap-2">
                <span className="w-1 h-4 bg-white rounded-full"></span>
                Modulo Space
              </h4>
              <ul className="space-y-1 text-xs">
                <li><Link href="/tentang" className="text-white/60 hover:text-white transition-colors">Tentang Kami</Link></li>
                <li><Link href="https://wa.me/6289509478009" className="text-white/60 hover:text-white transition-colors">Desain Interior</Link></li>
              </ul>
            </div>

          </div>

          {/* ===== RIGHT - Shipping & Help (4 cols) ===== */}
          <div className="col-span-4 space-y-6">
            
            {/* Jasa Pengiriman */}
            <div>
              <h3 className="font-semibold mb-3 text-sm flex items-center gap-2">
                <span className="w-1 h-4 bg-white rounded-full"></span>
                Jasa Pengiriman
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {shippingLogos.map((s, i) => (
                  <LogoItem key={i} src={`/shipping/${s}`} />
                ))}
              </div>
            </div>

            {/* Bantuan Links */}
            <div>
              <h4 className="font-semibold mb-3 text-sm flex items-center gap-2">
                <span className="w-1 h-4 bg-white rounded-full"></span>
                Layanan Kami
              </h4>
            <div>
              <ul className="space-y-1 text-xs">
                <li><Link href="https://wa.me/6289509478009" className="text-white/60 hover:text-white transition-colors">Jasa Interior</Link></li>
                <li><Link href="https://wa.me/6289509478009" className="text-white/60 hover:text-white transition-colors">Jasa Exterior</Link></li>
                <li><Link href="https://wa.me/6289509478009" className="text-white/60 hover:text-white transition-colors">Jasa Renovasi</Link></li>
                <li><Link href="https://wa.me/6289509478009" className="text-white/60 hover:text-white transition-colors">Bongkar Pasang</Link></li>
              </ul>
            </div>
            </div>

          </div>

        </div>

        {/* ================= MOBILE ================= */}
        <div className="lg:hidden space-y-4">

          {/* ===== LOGO + CONTACT (MOBILE) ===== */}
          <div>
            <div className="flex items-center gap-1 mb-2">
              <Image 
                src="/logo-inisial.png" 
                alt="Logo" 
                width={60} 
                height={60}
                className="object-contain flex-shrink-0"
              />
              <Image 
                src="/logo-full.png" 
                alt="Modulo Space" 
                width={150} 
                height={60}
                className="object-contain flex-shrink-0"
              />
            </div>

            <div className="space-y-1.5 text-xs text-white/70">
              <div className="flex gap-2 items-start">
                <MapPin size={12} className="mt-0.5 flex-shrink-0 text-white/60"/>
                <span>Pajajaran XI No.66, Parung Panjang, Kab.Bogor, Jawa Barat 16330</span>
              </div>
              <div className="flex gap-2 items-center">
                <Phone size={12} className="text-white/60"/>
                <span>+62 811-3084-2365</span>
              </div>
              <div className="flex gap-2 items-center">
                <Mail size={12} className="text-white/60"/>
                <span>modulospaceidn@gmail.com</span>
              </div>
            </div>

            <div className="flex gap-2 mt-3">
              <SocialIcon icon={Facebook} />
              <SocialIcon icon={Instagram} />
              <SocialIcon icon={FaTiktok} />
            </div>
          </div>

          {/* ===== Metode Pembayaran ===== */}
          <div>
            <h3 className="font-semibold mb-2 text-sm">Metode Pembayaran</h3>
            <div className="grid grid-cols-3 gap-2">
              {paymentLogos.map((p, i) => (
                <LogoItem key={i} src={`/payments/${p}`} />
              ))}
            </div>
          </div>

          {/* ===== Jasa Pengiriman ===== */}
          <div>
            <h3 className="font-semibold mb-2 text-sm">Jasa Pengiriman</h3>
            <div className="grid grid-cols-3 gap-2">
              {shippingLogos.map((s, i) => (
                <LogoItem key={i} src={`/shipping/${s}`} />
              ))}
            </div>
          </div>

          {/* ===== Links sejajar ===== */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2 text-sm">Modulo Space</h4>
              <ul className="space-y-1 text-xs">
                <li><Link href="/tentang" className="text-white/60 hover:text-white transition-colors">Tentang Kami</Link></li>
                <li><Link href="https://wa.me/6289509478009" className="text-white/60 hover:text-white transition-colors">Desain Interior</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2 text-sm">Layanan</h4>
              <ul className="space-y-1 text-xs">
                <li><Link href="https://wa.me/6289509478009" className="text-white/60 hover:text-white transition-colors">Jasa Interior</Link></li>
                <li><Link href="https://wa.me/6289509478009" className="text-white/60 hover:text-white transition-colors">Jasa Exterior</Link></li>
                <li><Link href="https://wa.me/6289509478009" className="text-white/60 hover:text-white transition-colors">Jasa Renovasi</Link></li>
                <li><Link href="https://wa.me/6289509478009" className="text-white/60 hover:text-white transition-colors">Bongkar Pasang</Link></li>
              </ul>
            </div>
          </div>

        </div>

      </motion.div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-white/50">
          <div>© 2026 Modulo Space. All rights reserved.</div>
          <div className="flex items-center gap-3">
            <p className="hover:text-white transition-colors">Kebijakan Privasi</p>
            <span>|</span>
            <p className="hover:text-white transition-colors">Syarat & Ketentuan</p>
          </div>
        </div>
      </div>

    </footer>
  );
}