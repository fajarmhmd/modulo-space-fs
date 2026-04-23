// components/BeforeAfterSlider.tsx
"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { MoveHorizontal, ZoomIn, RefreshCcw } from "lucide-react";

export default function BeforeAfterSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showHint, setShowHint] = useState(true);

  const x = useMotionValue(50);
  const smoothX = useSpring(x, { stiffness: 100, damping: 30 });

  // Transforms
  const clipPath = useTransform(smoothX, (v) => `inset(0 ${100 - v}% 0 0)`);
  const left = useTransform(smoothX, (v) => `${v}%`);
  const rotate = useTransform(smoothX, [0, 50, 100], [-10, 0, 10]);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const percent = ((clientX - rect.left) / rect.width) * 100;
    x.set(Math.max(5, Math.min(95, percent)));
  }, [x]);

  const handleDragStart = () => {
    setIsDragging(true);
    setShowHint(false);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const resetPosition = () => {
    x.set(50);
    setShowHint(true);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-6"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Transformasi Ruangan
        </h2>
        <p className="text-gray-600">
          Geser untuk melihat perbedaan before & after
        </p>
      </motion.div>

      {/* Slider Container */}
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="relative w-full aspect-[16/9] max-h-[600px] rounded-3xl overflow-hidden shadow-2xl bg-gray-900 group cursor-ew-resize"
        onMouseMove={(e) => !isDragging && updatePosition(e.clientX)}
        onMouseDown={handleDragStart}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchMove={(e) => updatePosition(e.touches[0].clientX)}
        onTouchStart={handleDragStart}
        onTouchEnd={handleDragEnd}
      >
        {/* AFTER Image (Background) */}
        <div className="absolute inset-0">
          <Image
            src="/After-kitchenset.jpg"
            alt="After renovation"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        </div>

        {/* BEFORE Image (Clipped) */}
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={{ clipPath }}
        >
          <Image
            src="/before-kitchenset.jpg"
            alt="Before renovation"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
          {/* Sepia filter untuk efek "lama" */}
          <div className="absolute inset-0 bg-amber-900/10 mix-blend-multiply" />
        </motion.div>

        {/* Divider Line */}
        <motion.div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_30px_rgba(255,255,255,0.5)] z-10"
          style={{ left }}
        >
          {/* Glow Effect */}
          <div className="absolute inset-y-0 -inset-x-4 bg-gradient-to-r from-transparent via-white/20 to-transparent blur-xl" />
        </motion.div>

        {/* Drag Handle */}
        <motion.div
          drag="x"
          dragConstraints={containerRef}
          dragElastic={0}
          dragMomentum={false}
          onDrag={(e: any) => updatePosition(e.clientX)}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          style={{ left, x: "-50%" }}
          className="absolute top-1/2 -translate-y-1/2 z-20 cursor-ew-resize"
        >
          <motion.div
            animate={{
              scale: isDragging ? 1.1 : 1,
              boxShadow: isDragging
                ? "0 20px 40px rgba(0,0,0,0.3)"
                : "0 10px 30px rgba(0,0,0,0.2)",
            }}
            whileHover={{ scale: 1.05 }}
            className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-xl border-4 border-white/50 backdrop-blur-sm"
          >
            <MoveHorizontal className="w-6 h-6 text-gray-700" />
          </motion.div>

          {/* Pulse Ring */}
          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 2, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 rounded-full border-2 border-white"
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Labels */}
        <div className="absolute top-6 left-6 z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2 bg-black/40 backdrop-blur-md text-white px-4 py-2 rounded-full border border-white/20"
          >
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            <span className="text-sm font-semibold tracking-wider">BEFORE</span>
          </motion.div>
        </div>

        <div className="absolute top-6 right-6 z-10">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2 bg-black/40 backdrop-blur-md text-white px-4 py-2 rounded-full border border-white/20"
          >
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm font-semibold tracking-wider">AFTER</span>
          </motion.div>
        </div>

        {/* Percentage Indicator */}
        <motion.div
          style={{ left }}
          className="absolute bottom-6 -translate-x-1/2 z-10"
        >
          <div className="bg-white/90 backdrop-blur-md text-gray-900 px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            <motion.span>
              {useTransform(smoothX, (v) => `${Math.round(v)}%`)}
            </motion.span>
          </div>
        </motion.div>

        {/* Hint Text */}
        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md text-gray-800 px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 z-10"
            >
              <MoveHorizontal className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium">Geser untuk membandingkan</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reset Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            resetPosition();
          }}
          className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md text-gray-700 p-3 rounded-full shadow-lg hover:shadow-xl transition-all z-10"
        >
          <RefreshCcw className="w-5 h-5" />
        </motion.button>

        {/* Zoom Hint */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <div className="bg-black/40 backdrop-blur-md text-white/80 px-4 py-2 rounded-full text-xs flex items-center gap-2">
            <ZoomIn className="w-4 h-4" />
            <span>Klik & geser</span>
          </div>
        </div>
      </motion.div>

      {/* Caption */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-center"
      >
        <p className="text-gray-500 text-sm">
          Hasil renovasi dapur modern oleh tim ModuloSpace • Proyek selesai dalam 14 hari
        </p>
      </motion.div>
    </div>
  );
}