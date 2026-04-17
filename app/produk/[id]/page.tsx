// app/produk/[id]/page.tsx
// PERBAIKAN: Lengkapi semua produk dengan data yang valid

import ProductDetail, { ProductDetailType, CartItem } from "@/components/ProductDetail";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Material options yang bisa digunakan semua produk
const materials = {
  standard: { 
    id: "standard", 
    name: "Multiplek Standard", 
    description: "Multiplek 15mm grade B, finishing melamic", 
    priceMultiplier: 0.9, 
    color: "#D4C4B0" 
  },
  premium: { 
    id: "premium", 
    name: "Multiplek Premium", 
    description: "Multiplek 18mm grade A, finishing HPL", 
    priceMultiplier: 1.0, 
    color: "#E8DCC4" 
  },
  super_premium: { 
    id: "super_premium", 
    name: "Super Premium", 
    description: "Multiplek 18mm anti air, finishing HPL premium", 
    priceMultiplier: 1.15, 
    color: "#C9B896" 
  },
  solid_wood: { 
    id: "solid_wood", 
    name: "Kayu Solid Jati", 
    description: "Kayu jati solid grade A, finishing natural", 
    priceMultiplier: 1.4, 
    color: "#8B6914" 
  },
  marble: { 
    id: "marble", 
    name: "Granit/Marmer", 
    description: "Top table granit/marmer asli 20mm", 
    priceMultiplier: 1.6, 
    color: "#F5F5F5" 
  },
};

// Data produk lengkap - SEMUA ID harus sesuai dengan kategori page
const productsData: Record<string, ProductDetailType> = {
  // INTERIOR PRODUCTS
  "kitchen-set-1": {
    id: "kitchen-set-1",
    name: "Kitchen Set Premium Minimalis",
    subtitle: "Interior Collection",
    category: "interior",
    basePrice: 3500000,
    originalPrice: 4200000,
    discount: 17,
    images: ["/cat-interior.png", "/cat-interior.png", "/cat-interior.png"],
    description: "Kitchen set premium dengan desain minimalis modern yang cocok untuk berbagai ukuran dapur. Dibuat dengan material berkualitas tinggi dan finishing premium yang tahan lama.",
    specs: [
      { label: "Material Dasar", value: "Multiplek/Plywood grade A" },
      { label: "Ketebalan", value: "18mm body, 18mm pintu" },
      { label: "Finishing", value: "HPL / Cat Duco / Veneer" },
      { label: "Handle", value: "Stainless steel / Minimalis" },
      { label: "Rak", value: "Adjustable shelf system" },
    ],
    features: [
      "Material anti rayap dan tahan air",
      "Finishing premium dengan berbagai pilihan warna",
      "Rak interior adjustable",
      "Soft close hinge & drawer",
      "Garansi 5 tahun struktur",
    ],
    suitableFor: [
      "Apartemen compact",
      "Rumah tapak",
      "Kitchen set modern",
    ],
    materials: [materials.standard, materials.premium, materials.super_premium, materials.solid_wood, materials.marble],
    hasMeterInput: true,
    minMeter: 1,
    maxMeter: 10,
  },
  "minibar-1": {
    id: "minibar-1",
    name: "Minibar Custom Modern",
    subtitle: "Interior Collection",
    category: "interior",
    basePrice: 2800000,
    originalPrice: 3300000,
    discount: 15,
    images: ["/cat-interior.png", "/cat-interior.png"],
    description: "Minibar custom dengan desain modern yang elegan. Dilengkapi dengan rak penyimpanan wine dan gelas yang terintegrasi sempurna.",
    specs: [
      { label: "Material", value: "Multiplek 18mm" },
      { label: "Rak Wine", value: "Kapasitas 12 botol" },
      { label: "Laci", value: "Soft close drawer" },
      { label: "Top Table", value: "Granit/Stainless" },
    ],
    features: [
      "Rak wine kemiringan optimal",
      "Laci soft close",
      "Top table tahan gores",
      "LED ambient light",
    ],
    suitableFor: [
      "Ruang tamu",
      "Entertainment room",
      "Home office",
    ],
    materials: [materials.standard, materials.premium, materials.super_premium, materials.solid_wood, materials.marble],
    hasMeterInput: true,
    minMeter: 0.5,
    maxMeter: 3,
  },
  "lemari-custom-1": {
    id: "lemari-custom-1",
    name: "Lemari Custom Premium",
    subtitle: "Interior Collection",
    category: "interior",
    basePrice: 2600000,
    originalPrice: 3100000,
    discount: 16,
    images: ["/cat-interior.png", "/cat-interior.png"],
    description: "Lemari custom dengan desain minimalis dan fungsional. Dilengkapi dengan sistem penyimpanan yang optimal untuk kebutuhan Anda.",
    specs: [
      { label: "Material", value: "Multiplek 18mm, Finishing HPL" },
      { label: "Sistem", value: "Sliding door dengan rel aluminium" },
      { label: "Rak", value: "Adjustable shelf system" },
    ],
    features: [
      "Sliding door hemat ruang",
      "Rak adjustable",
      "Cermin full body opsional",
      "Laci dalam dengan lock",
    ],
    suitableFor: [
      "Kamar tidur utama",
      "Kamar tidur anak",
      "Dressing room",
    ],
    materials: [materials.standard, materials.premium, materials.super_premium, materials.solid_wood, materials.marble],
    hasMeterInput: true,
    minMeter: 1,
    maxMeter: 5,
  },
  "lemari-sliding-1": {
    id: "lemari-sliding-1",
    name: "Lemari Sliding Modern",
    subtitle: "Interior Collection",
    category: "interior",
    basePrice: 2750000,
    originalPrice: 3200000,
    discount: 14,
    images: ["/cat-interior.png", "/cat-interior.png"],
    description: "Lemari sliding dengan desain modern dan material premium. Sistem sliding yang halus dan tahan lama.",
    specs: [
      { label: "Material", value: "Multiplek 18mm, Finishing HPL wood texture" },
      { label: "Rel", value: "Aluminium heavy duty" },
      { label: "Handle", value: "Minimalis built-in" },
    ],
    features: [
      "Sistem sliding silent",
      "Anti jump rel",
      "Soft close buffer",
      "Full hanging system",
    ],
    suitableFor: [
      "Kamar dengan ruang terbatas",
      "Apartemen",
      "Guest room",
    ],
    materials: [materials.standard, materials.premium, materials.super_premium, materials.solid_wood, materials.marble],
    hasMeterInput: true,
    minMeter: 1,
    maxMeter: 4,
  },
  "backdrop-tv-1": {
    id: "backdrop-tv-1",
    name: "Wall Backdrop TV",
    subtitle: "Interior Collection",
    category: "interior",
    basePrice: 2400000,
    originalPrice: 2900000,
    discount: 18,
    images: ["/cat-interior.png", "/cat-interior.png"],
    description: "Backdrop TV dengan desain modern yang elegan. Dilengkapi dengan rak penyimpanan dan sistem kabel tersembunyi.",
    specs: [
      { label: "Material", value: "Multiplek 18mm, Finishing HPL/paint" },
      { label: "Rak", value: "Floating shelf system" },
      { label: "Cahaya", value: "LED strip ready" },
    ],
    features: [
      "Cable management system",
      "Rak floating",
      "LED ambient light",
      "Mounting bracket included",
    ],
    suitableFor: [
      "Ruang tamu",
      "Home theater",
      "Master bedroom",
    ],
    materials: [materials.standard, materials.premium, materials.super_premium, materials.solid_wood, materials.marble],
    hasMeterInput: true,
    minMeter: 1,
    maxMeter: 6,
  },
  "buffet-1": {
    id: "buffet-1",
    name: "Buffet Minimalis",
    subtitle: "Interior Collection",
    category: "interior",
    basePrice: 2300000,
    originalPrice: 2700000,
    discount: 15,
    images: ["/cat-interior.png", "/cat-interior.png"],
    description: "Buffet dengan desain minimalis yang fungsional. Cocok untuk penyimpanan peralatan makan dan dekorasi.",
    specs: [
      { label: "Material", value: "Multiplek 18mm, Finishing veneer/melamic" },
      { label: "Laci", value: "Soft close system" },
      { label: "Kaki", value: "Solid wood/ metal frame" },
    ],
    features: [
      "Laci dengan divider",
      "Rak botol",
      "Soft close hinge",
      "Anti scratch top",
    ],
    suitableFor: [
      "Ruang makan",
      "Pantry",
      "Ruang tamu",
    ],
    materials: [materials.standard, materials.premium, materials.super_premium, materials.solid_wood, materials.marble],
    hasMeterInput: true,
    minMeter: 0.5,
    maxMeter: 3,
  },
  "rak-tangga-1": {
    id: "rak-tangga-1",
    name: "Rak Bawah Tangga",
    subtitle: "Interior Collection",
    category: "interior",
    basePrice: 2100000,
    originalPrice: 2500000,
    discount: 16,
    images: ["/cat-interior.png", "/cat-interior.png"],
    description: "Solusi penyimpanan custom untuk area bawah tangga. Maksimalkan ruang yang tidak terpakai.",
    specs: [
      { label: "Material", value: "Multiplek 18mm, Finishing HPL" },
      { label: "Sistem", value: "Pull-out drawer system" },
      { label: "Custom", value: "Sesuai ukuran tangga" },
    ],
    features: [
      "Custom measurement",
      "Pull-out system",
      "Soft close",
      "Anti slip mat",
    ],
    suitableFor: [
      "Rumah 2 lantai",
      "Area storage terbatas",
      "Under-stair optimization",
    ],
    materials: [materials.standard, materials.premium, materials.super_premium, materials.solid_wood, materials.marble],
    hasMeterInput: true,
    minMeter: 0.5,
    maxMeter: 3,
  },
  "nakas-1": {
    id: "nakas-1",
    name: "Nakas Gantung",
    subtitle: "Interior Collection",
    category: "interior",
    basePrice: 950000,
    originalPrice: 1200000,
    discount: 20,
    images: ["/cat-interior.png", "/cat-interior.png"],
    description: "Nakas gantung dengan desain Scandinavian yang minimalis. Hemat ruang lantai dan mudah dibersihkan.",
    specs: [
      { label: "Material", value: "Multiplek 18mm, Finishing cat Duco" },
      { label: "Mounting", value: "Wall bracket heavy duty" },
      { label: "Laci", value: "Single drawer" },
    ],
    features: [
      "Floating design",
      "Heavy duty bracket",
      "Soft close drawer",
      "Easy clean",
    ],
    suitableFor: [
      "Kamar tidur minimalis",
      "Kamar anak",
      "Small bedroom",
    ],
    materials: [materials.standard, materials.premium, materials.super_premium, materials.solid_wood, materials.marble],
    hasMeterInput: false,
  },

  // EXTERIOR PRODUCTS
  "plafon-1": {
    id: "plafon-1",
    name: "Plafon PVC Premium Minimalis",
    subtitle: "Exterior Works",
    category: "exterior",
    basePrice: 220000,
    originalPrice: 375000,
    discount: 14,
    images: ["/plafon-pvc.png", "/plafon-pvc.png"],
    description: "Upgrade tampilan ruang tamu, kamar, dapur, hingga kantor dengan plafon PVC modern seperti pada gambar. Tahan lama, elegan, dan minim perawatan. Cocok untuk wilayah Bogor & Jabodetabek.",
    specs: [
      { label: "Rangka", value: "PVC tebal 7mm – 9mm" },
      { label: "Atap", value: "Plafon Pvc, Tersedia lampu downlight / hidden LED" },
      { label: "Finishing", value: "Finishing nat presisi" },
      { label: "Garansi", value: "2 Bulan" },
    ],
    features: [
      "Anti rayap & anti jamur",
      "Tahan air / lembab",
      "Bobot ringan, aman",
      "Desain modern & mewah",
    ],
    suitableFor: [
      "Plafon Kamar",
      "Plafon Ruang Tamu",
      "Rumah",
      "Kantor",
      "Ruko",
    ],
    materials: [materials.standard, materials.premium, materials.super_premium, materials.solid_wood, materials.marble],
    hasMeterInput: true,
    minMeter: 2,
    maxMeter: 20,
  },
  "pager-besi-1": {
    id: "pager-besi-1",
    name: "Pager Besi Minimalis",
    subtitle: "Exterior Works",
    category: "exterior",
    basePrice: 780000,
    originalPrice: 920000,
    discount: 15,
    images: ["/cat-exterior.png", "/cat-exterior.png"],
    description: "Pager besi dengan desain minimalis dan kokoh. Finishing cat powder coating tahan karat dan tahan cuaca.",
    specs: [
      { label: "Material", value: "Besi hollow 2x2 dan 2x4 galvanis" },
      { label: "Finishing", value: "Powder coating oven baked" },
      { label: "Tinggi", value: "Standard 120-150cm" },
    ],
    features: [
      "Besi galvanis anti karat",
      "Powder coating tahan gores",
      "Konstruksi las CO2",
      "Instalasi include",
    ],
    suitableFor: [
      "Pembatas properti",
      "Keamanan rumah",
      "Taman",
    ],
    materials: [materials.standard, materials.premium, materials.super_premium, materials.solid_wood, materials.marble],
    hasMeterInput: true,
    minMeter: 1,
    maxMeter: 50,
  },
  "pintu-teralis-1": {
    id: "pintu-teralis-1",
    name: "Pintu Teralis Security",
    subtitle: "Exterior Works",
    category: "exterior",
    basePrice: 1650000,
    originalPrice: 1950000,
    discount: 15,
    images: ["/cat-exterior.png", "/cat-exterior.png"],
    description: "Pintu teralis dengan desain modern dan keamanan tinggi. Dilengkapi dengan kunci multiple point.",
    specs: [
      { label: "Rangka", value: "Besi hollow 2x4 galvanis 1.2mm" },
      { label: "Teralis", value: "Besi strip 3mm motif minimalis" },
      { label: "Kunci", value: "Multipoint lock system" },
    ],
    features: [
      "Multipoint locking",
      "Anti cut mesh",
      "Heavy duty hinge",
      "Powder coating finish",
    ],
    suitableFor: [
      "Pintu utama",
      "Pintu belakang",
      "Security door",
    ],
    materials: [materials.standard, materials.premium, materials.super_premium, materials.solid_wood, materials.marble],
    hasMeterInput: false,
  },
  "pintu-aluminium-1": {
    id: "pintu-aluminium-1",
    name: "Pintu Aluminium Premium",
    subtitle: "Exterior Works",
    category: "exterior",
    basePrice: 2100000,
    originalPrice: 2500000,
    discount: 16,
    images: ["/cat-exterior.png", "/cat-exterior.png"],
    description: "Pintu aluminium dengan kualitas premium. Ringan, kuat, dan tahan cuaca ekstrem.",
    specs: [
      { label: "Frame", value: "Aluminium extrusion 3mm" },
      { label: "Panel", value: "Aluminium composite/solid" },
      { label: "Seal", value: "Rubber seal double layer" },
    ],
    features: [
      "100% anti karat permanen",
      "Insulasi panas/suara",
      "Seal kedap air",
      "Low maintenance",
    ],
    suitableFor: [
      "Pintu luar",
      "Balkon",
      "Akses outdoor",
    ],
    materials: [materials.standard, materials.premium, materials.super_premium, materials.solid_wood, materials.marble],
    hasMeterInput: false,
  },
  "kitchen-aluminium-1": {
    id: "kitchen-aluminium-1",
    name: "Kitchen Set Aluminium Outdoor",
    subtitle: "Exterior Works",
    category: "exterior",
    basePrice: 3200000,
    originalPrice: 3700000,
    discount: 13,
    images: ["/cat-exterior.png", "/cat-exterior.png"],
    description: "Kitchen set outdoor dari aluminium yang tahan cuaca dan anti karat. Cocok untuk dapur luar atau BBQ area.",
    specs: [
      { label: "Frame", value: "Aluminium extrusion heavy duty" },
      { label: "Top", value: "Granit/stainless steel" },
      { label: "Door", value: "Aluminium panel with insulation" },
    ],
    features: [
      "100% anti karat",
      "Tahan panas/cuaca",
      "Mudah dibersihkan",
      "Custom configuration",
    ],
    suitableFor: [
      "Outdoor kitchen",
      "BBQ area",
      "Pool side kitchen",
    ],
    materials: [materials.standard, materials.premium, materials.super_premium, materials.solid_wood, materials.marble],
    hasMeterInput: true,
    minMeter: 1,
    maxMeter: 5,
  },
  "pager-sliding-1": {
    id: "pager-sliding-1",
    name: "Pager Sliding Otomatis",
    subtitle: "Exterior Works",
    category: "exterior",
    basePrice: 1400000,
    originalPrice: 1650000,
    discount: 15,
    images: ["/cat-exterior.png", "/cat-exterior.png"],
    description: "Pager sliding dengan sistem roda heavy duty. Hemat ruang buka dan modern.",
    specs: [
      { label: "Frame", value: "Besi hollow 2x4 galvanis" },
      { label: "Roda", value: "Nylon/steel bearing heavy duty" },
      { label: "Rel", value: "Steel track with cover" },
    ],
    features: [
      "Hemat ruang buka",
      "Smooth sliding",
      "Heavy duty wheel",
      "Remote control ready",
    ],
    suitableFor: [
      "Carport sempit",
      "Driveway",
      "Commercial gate",
    ],
    materials: [materials.standard, materials.premium, materials.super_premium, materials.solid_wood, materials.marble],
    hasMeterInput: true,
    minMeter: 2,
    maxMeter: 10,
  },
};

let globalCart: CartItem[] = [];

async function addToCartAction(item: CartItem) {
  "use server";
  try {
    const existingIndex = globalCart.findIndex(i => i.id === item.id);
    if (existingIndex >= 0) {
      globalCart[existingIndex].quantity += item.quantity;
    } else {
      globalCart.push(item);
    }
    return { success: true };
  } catch (error) {
    console.error("Server action error:", error);
    throw new Error("Failed to add to cart");
  }
}

export function generateStaticParams() {
  return Object.keys(productsData).map((id) => ({ id }));
}

export const dynamic = 'force-dynamic';

export default async function ProductPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const product = productsData[id];

  if (!product) {
    notFound();
  }

  const recommendedProducts = Object.values(productsData)
    .filter(p => p.id !== id && p.category === product.category)
    .slice(0, 4);

  return (
    <>
    <Navbar/>
    <ProductDetail 
      product={product} 
      initialCart={globalCart}
      onAddToCart={addToCartAction}
      recommendedProducts={recommendedProducts}
    />
    <Footer />
    </>
  );
}