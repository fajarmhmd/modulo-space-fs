// components/hero-typing-section.tsx

"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

/* ================= DATA ================= */

const dynamicWords = ["Renovasi", "Interior", "Exterior"];

const slides = [
  "/hero2.jpg",
  "/hero4.jpg",
  "/wallback-drop.png",
  "/nakas-gantung.png",
];

/* ================= ANIMATION VARIANTS ================= */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 25, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease: [0.25, 0.1, 0.25, 1] as any
      },
  },
};

const textRevealVariants = {
  hidden: { y: 60, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      delay: i * 0.1,
      ease: [0.25, 0.1, 0.25, 1] as any
      },
  }),
};

export default function HeroTypingSection() {
  /* ================= TYPING ================= */

  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = dynamicWords[wordIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        const next = current.slice(0, text.length + 1);
        setText(next);
        if (next === current) setTimeout(() => setIsDeleting(true), 1200);
      } else {
        const next = current.slice(0, text.length - 1);
        setText(next);
        if (next === "") {
          setIsDeleting(false);
          setWordIndex((i) => (i + 1) % dynamicWords.length);
        }
      }
    }, isDeleting ? 40 : 70);

    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex]);

  /* ================= SLIDER ================= */

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const AUTO_DELAY = 5000;
  const TRANSITION_DURATION = 800;

  // Check mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate slides per view
  const slidesPerView = isMobile ? 1 : 2;

  // Create extended slides for smooth infinite loop
  const extendedSlides = useMemo(() => {
    return [...slides, ...slides, ...slides, ...slides];
  }, []);

  // Calculate actual position (for display dots)
  const actualIndex = currentIndex % slides.length;

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex(index);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, TRANSITION_DURATION);
  }, [isTransitioning]);

  const goNext = useCallback(() => {
    if (isTransitioning) return;
    goToSlide(currentIndex + 1);
  }, [currentIndex, isTransitioning, goToSlide]);

  const goPrev = useCallback(() => {
    if (isTransitioning) return;
    goToSlide(currentIndex - 1);
  }, [currentIndex, isTransitioning, goToSlide]);

  // Autoplay - selalu berjalan
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (!isTransitioning) {
        goNext();
      }
    }, AUTO_DELAY);
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [goNext, isTransitioning]);

  // Smooth infinite loop - reset position when needed
  useEffect(() => {
    const totalSlides = slides.length;
    const buffer = totalSlides * 2;
    
    if (currentIndex >= buffer + totalSlides) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(buffer);
      }, TRANSITION_DURATION);
    }
    
    if (currentIndex < buffer - totalSlides) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(buffer + totalSlides - 1);
      }, TRANSITION_DURATION);
    }
  }, [currentIndex]);

  // Calculate translate
  const translateX = -(currentIndex * (100 / slidesPerView));

  return (
<section className="w-full bg-white pt-6 lg:pt-10 pb-6 lg:pb-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-12 items-center">
          
          {/* ================= LEFT CONTENT ================= */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6 order-1"
          >
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center gap-2 border border-gray-200 rounded-full px-5 py-2 text-sm font-semibold text-blue-700 bg-blue-50/50"
            >
              <motion.span 
                className="w-2 h-2 bg-blue-600 rounded-full"
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              Modulo Space | {text}
              <motion.span 
                className="inline-block"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
              |
              </motion.span>
            </motion.div>

            <div className="space-y-1">
              <div className="overflow-hidden">
                <motion.h1 
                  custom={0}
                  variants={textRevealVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900"
                >
                  Modular
                </motion.h1>
              </div>
              <div className="overflow-hidden">
                <motion.h1 
                  custom={1}
                  variants={textRevealVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900"
                >
                  Thinking For
                </motion.h1>
              </div>
              <div className="overflow-hidden">
                <motion.h1 
                  custom={2}
                  variants={textRevealVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-blue-900"
                >
                  Better Space
                </motion.h1>
              </div>
            </div>

            <motion.p 
              variants={itemVariants}
              className="text-gray-600 text-base max-w-lg leading-relaxed"
            >
              Kami membantu menciptakan ruang yang fungsional,
              efisien dan berkualitas dengan pendekatan desain modern
              dan pengerjaan profesional.
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 pt-2"
            >
              <Link
                href="/custom-interior"
                className="group relative bg-blue-900 text-white py-3 px-8 rounded-xl font-semibold text-center overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-blue-900/30 hover:-translate-y-1"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Custom Interior
                  <motion.span
                    className="inline-block"
                    initial={{ x: 0 }}
                    whileHover={{ x: 6 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    
                  </motion.span>
                </span>
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                />
              </Link>

              <Link
                href="/kategori/interior"
                className="group relative border-2 border-blue-900 text-blue-900 py-3 px-8 rounded-xl font-semibold text-center overflow-hidden transition-all duration-500 hover:-translate-y-1"
              >
                <span className="relative z-10 flex items-center justify-center gap-2 transition-colors duration-500 group-hover:text-black">
                  Cari Furniture
                  <motion.span
                    className="inline-block"
                    initial={{ x: 0 }}
                    whileHover={{ x: 6 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    →
                  </motion.span>
                </span>
                <motion.div 
                  className="absolute inset-0 bg-blue-900"
                  initial={{ y: "100%" }}
                  whileHover={{ y: 0 }}
                  transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                />
              </Link>
            </motion.div>
          </motion.div>

          {/* ================= RIGHT SLIDER ================= */}
          <motion.div 
            initial={{ opacity: 0, x: 50, filter: "blur(10px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative order-2 w-full"
          >
            {/* Slider Container */}
            <div className="overflow-hidden rounded-3xl">
              <motion.div
                className="flex"
                animate={{ 
                  x: `${translateX}%`,
                }}
                transition={{ 
                  duration: isTransitioning ? 0.8 : 0,
                  ease: [0.25, 0.1, 0.25, 1] as any
                  }}
              >
                {extendedSlides.map((src, i) => (
                  <div
                    key={`${src}-${i}`}
                    className="w-full lg:w-1/2 flex-shrink-0 px-2"
                  >
                    <motion.div 
                      className="relative h-[280px] sm:h-[320px] md:h-[380px] lg:h-[440px] rounded-2xl overflow-hidden shadow-2xl"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                      <Image
                        src={src}
                        alt={`Hero ${(i % slides.length) + 1}`}
                        fill
                        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:scale-110"
                        priority={i >= slides.length && i < slides.length * 2}
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </motion.div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Controls */}
            <motion.div 
              className="flex items-center justify-between mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {/* Dots */}
              <div className="flex gap-2">
                {slides.map((_, i) => {
                  const isActive = i === actualIndex;
                  return (
                    <motion.button
                      key={i}
                      onClick={() => {
                        const diff = i - actualIndex;
                        const newIndex = currentIndex + diff;
                        goToSlide(newIndex);
                      }}
                      className={`h-2 rounded-full transition-all duration-500 ${
                        isActive ? "bg-blue-900" : "bg-gray-300 hover:bg-gray-400"
                      }`}
                      animate={{ 
                        width: isActive ? 32 : 8,
                      }}
                      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  );
                })}
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-3">
                <motion.button
                  // whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={goPrev}
                  disabled={isTransitioning}
                  className="w-12 h-12 bg-blue-900 hover:bg-blue-800 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-900/20 transition-all duration-300 disabled:opacity-50"
                >
                  <ChevronLeft size={22} />
                </motion.button>

                <motion.button
                  // whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={goNext}
                  disabled={isTransitioning}
                  className="w-12 h-12 bg-blue-900 hover:bg-blue-800 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-900/20 transition-all duration-300 disabled:opacity-50"
                >
                  <ChevronRight size={22} />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}