// app/public/page.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CategoryPriceCards from "@/components/category-price-cards";


import HeroTypingSection from "@/components/hero-typing-section";
import ShowcaseRecommendationSection from "@/components/showcase-recommendation-section";
import WhyUsSection from "@/components/why-us-section";
import OrderFlowSection from "@/components/OrderFlowSection";


export default function Page() {
  return (
    <>
      <HeroTypingSection />
            <CategoryPriceCards />
  <ShowcaseRecommendationSection />
  <OrderFlowSection />
  <WhyUsSection />
    </>
  );
}
