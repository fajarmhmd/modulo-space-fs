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
  "kitchenset-minibar": {
    id: "kitchenset-minibar",
    name: "Kitchen Set Custom Minimalis Modern + Mini bar/island",
    subtitle: "Interior Collection",
    category: "interior",
    basePrice: 1999000,
    originalPrice: 2500000,
    discount: 15,
    images: ["/kitchenset-minibar.png", "/After-kitchenset.jpg"],
    description: "Kitchen set modern bergaya natural luxury minimalis, memadukan tekstur kayu hangat dengan panel hitam elegan. Cocok untuk rumah type 70 ke atas, cluster premium, villa, dan rumah modern.",
    specs: [
      { label: "Material", value: "Multiplek 18mm" },
      { label: "Rak Wine", value: "Kapasitas 12 botol" },
      { label: "Laci", value: "Soft close drawer" },
      { label: "Top Table", value: "Granit/Stainless" },
    ],
    features: [
      "Model handleless / hidden handle",
      "Soft closing engsel",
      "Laci tandem premium",
      "Rak gantung multifungsi",
      "Built in oven & microwave tower",
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
    name: "Lemari Pakaian Custom Built-in / Wardrobe Full Tinggi Plafon",
    subtitle: "Interior Collection",
    category: "interior",
    basePrice: 1799000,
    originalPrice: 2300000,
    discount: 16,
    images: ["/lemari-samping.png", "/lemari-depan.png"],
    description: "Wardrobe custom ini dirancang untuk memaksimalkan penyimpanan kamar tidur dengan tampilan rapi, mewah, dan seamless. Tinggi sampai plafon sehingga ruang atas tidak terbuang..",
    specs: [
      { label: "Body Lemari", value: "Multiplek 18mm, Finishing HPL" },
      { label: "Pintu", value: "Soft closing hinge, Model handleless / groove handle" },
      { label: "Tengah Display", value: "Kaca tempered / acrylic bening, LED strip warm white" },
      { label: "Interior", value: "Rak lipat pakaian, Hanging area baju panjang, Laci aksesoris" },
    ],
    features: [
      "Menyatu dengan dinding, tampak mewah",
      "Penyimpanan lebih banyak",
      "Kamar terlihat rapi",
      "Tinggi plafon maksimal terpakai",
      "Bisa custom ukuran",
      "Nilai estetika kamar naik",
      "Cocok rumah minimalis modern",
    ],
    suitableFor: [
      "Kamar tidur utama",
      "Kamar tidur anak",
      "Dressing room",
      "Apartemen",
      "Guest room",
    ],
    materials: [materials.standard, materials.premium, materials.super_premium, materials.solid_wood, materials.marble],
    hasMeterInput: true,
    minMeter: 1,
    maxMeter: 5,
  },
  "mezzanine": {
    id: "mezzanine",
    name: "Mezzanine / Lantai tambahan interior modern industrial dengan struktur baja, railing kaca, tangga floating, dan area kerja di atas.",
    subtitle: "Interior Collection",
    category: "interior",
    basePrice: 2699000,
    originalPrice: 3500000,
    discount: 14,
    images: ["/mejanin.png", "/mejanin-dua.jpg"],
    description: "Mezzanine ini memakai konsep open space modern industrial luxury, memanfaatkan tinggi plafon rumah menjadi area tambahan seperti ruang kerja, ruang santai, perpustakaan, atau kamar tambahan.",
    specs: [
      { label: "Struktur", value: "Baja hollow 100x100 / WF sesuai bentang, Las penuh + finishing rapi, Cat epoxy anti karat" },
      { label: "Lantai", value: "Multiplek 18mm + vinyl / SPC / parquet, Atau cor dak ringan + keramik" },
      { label: "Railing", value: "Kaca tempered 10mm–12mm, Frame besi powder coating" },
      { label: "Tangga", value: "Floating stair baja, Anak tangga kayu solid / granit / HPL" },
      { label: "Pencahayaan", value: "Downlight LED, Hidden LED strip" },
    ],
    features: [
      "Menambah ruang tanpa beli lahan",
      "Cocok untuk rumah plafon tinggi",
      "Tampilan mewah & modern",
      "Bisa jadi ruang kerja privat",
      "Nilai rumah naik",
      "Sirkulasi ruangan tetap lega",
      "Estetik untuk konten / tamu",
    ],
    suitableFor: [
      "Rumah Tinggal",
      "Fungsi Ruangan",
      "Home office",
      "Kamar anak",
      "Ruang gaming",
      "Rumah cluster modern",
      "Studio kerja",
    ],
    materials: [materials.standard, materials.premium, materials.super_premium, materials.solid_wood, materials.marble],
    hasMeterInput: true,
    minMeter: 1,
    maxMeter: 4,
  },
  "backdrop-tv-1": {
    id: "backdrop-tv-1",
    name: "Wall Backdrop TV Custom / Panel TV Wall Premium dengan kombinasi wall panel kisi kayu, rak display LED, kabinet bawah, dan panel tengah dekoratif",
    subtitle: "Interior Collection",
    category: "interior",
    basePrice: 2490000,
    originalPrice: 2900000,
    discount: 18,
    images: ["/wallback-drop.png", "/wallback-drop1.png"],
    description: "Backdrop TV ini berfungsi sebagai pusat desain ruang tamu sekaligus storage. Menggabungkan elemen kayu natural dengan panel gelap modern sehingga terlihat mewah dan hangat.",
    specs: [
      { label: "Struktur", value: "Multiplek 18 mm, Rangka hollow bila diperlukan" },
      { label: "Finishing", value: "HPL motif walnut / teak, Panel tengah PVC marble / ACP / textured board" },
      { label: "Rak Display", value: "Open shelf custom, LED strip warm white" },
      { label: "Kabinet Bawah", value: "Laci push open / soft close, Tempat receiver, STB, console" },
      { label: "Instalasi TV:", value: "Bracket TV tanam rapi, Jalur kabel hidden" },
    ],
    features: [
      "Ruang tamu terlihat mewah",
      "Menyembunyikan kabel berantakan",
      "Ada storage tambahan",
      "TV jadi focal point ruangan",
      "Bisa custom ukuran TV apa saja",
      "Nilai estetika rumah naik",
      "Cocok rumah modern & cluster",
    ],
    suitableFor: [
      "Ruang tamu",
      "Family room",
      "Cluster modern",
      "Apartemen premium",
      "Townhouse",
      "Villa",
    ],
    materials: [materials.standard, materials.premium, materials.super_premium, materials.solid_wood, materials.marble],
    hasMeterInput: true,
    minMeter: 1,
    maxMeter: 6,
  },
  "meja-kerja-1": {
    id: "meja-kerja-1",
    name: "meja kerja custom / meja komputer sudut (L-shape) home office modern dengan desain minimalis industrial.",
    subtitle: "Interior Collection",
    category: "interior",
    basePrice: 1590000,
    originalPrice: 2100000,
    discount: 18,
    images: ["/meja-kerja.png"],
    description: "Meja kerja ini memakai model sudut L-shape sehingga area kerja lebih luas dan efisien. Sisi utama untuk komputer/laptop, sisi samping untuk menulis, printer, dokumen, atau perangkat tambahan.",
    specs: [
      { label: "Top Table", value: "Tebal 18–36 mm, Multiplek / MDF premium, Finishing HPL woodgrain / veneer" },
      { label: "Rangka", value: "Hollow besi 40x40 / 50x50, Cat powder coating hitam doff" },
      { label: "Design", value: "Model L-shape, Jalur kabel rapi, Kaki kokoh anti goyang" },
    ],
    features: [
      "Area kerja luas",
      "Cocok multitasking 2 monitor",
      "Memanfaatkan sudut ruangan",
      "Kokoh dan tahan lama",
      "Tampilan profesional",
      "Bisa custom ukuran ruangan",
    ],
    suitableFor: [
      "Kamar kerja",
      "Kamar tidur",
      "Kantor kecil",
      "Apartemen",
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
    name: "Rak bawah tangga custom / Storage bawah tangga multifungsi dengan kombinasi rak display + Laci penyimpanan + Kabinet tertutup",
    subtitle: "Interior Collection",
    category: "interior",
    basePrice: 1690000,
    originalPrice: 2100000,
    discount: 16,
    images: ["/rak-tangga3.png", "/rak-tangga2.png", "/rak-tangga1.png"],
    description: "Furniture custom ini dibuat mengikuti kemiringan tangga sehingga setiap sudut ruang termanfaatkan maksimal. Pada gambar memakai desain classic modern minimalis, perpaduan warna putih dan kayu natural.",
    specs: [
      { label: "Bodi Cabinet", value: "Multiplek 18 mm / blockboard, Back panel 3 mm, Finishing HPL / cat duco" },
      { label: "Laci", value: "Rel telescopic / soft closing, Handle klasik black metal" },
      { label: "Rak Display", value: "Open shelf custom sudut tangga, Bisa tambah LED strip" },
      { label: "Kabinet Samping", value: "Pintu engsel soft close" },
    ],
    features: [
      "Area bawah tangga tidak terbuang",
      "Rumah lebih rapi",
      "Menambah banyak penyimpanan",
      "Bisa jadi rak buku/dekorasi",
      "Tampilan rumah lebih mewah",
      "Custom sesuai ukuran tangga",
      "Cocok rumah minimalis",
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
    name: "Nakas gantung / Bedside table floating custom dengan desain minimalis modern natural wood",
    subtitle: "Interior Collection",
    category: "interior",
    basePrice: 599000,
    originalPrice: 950000,
    discount: 20,
    images: ["/nakas-gantung.png", "/nakas-gantung1.png"],
    description: "Nakas gantung ini dipasang menempel di dinding sehingga lantai tetap lega dan mudah dibersihkan. Memiliki 1 laci penyimpanan untuk barang pribadi seperti charger, buku, obat, dompet, dan aksesoris.",
    specs: [
      { label: "Body", value: "Multiplek 18 mm / MDF premium, Back support bracket besi siku tersembunyi" },
      { label: "Finishing", value: "HPL motif oak / teak / walnut, Atau veneer natural coating doff" },
      { label: "Laci", value: "Rel soft closing, Sistem handleless groove" },
      { label: "Pemasangan", value: "Menempel ke dinding bata / beton / hebel" },
    ],
    features: [
      "Hemat ruang kamar",
      "Lantai terlihat luas",
      "Aman untuk ruang sempit",
      "Tampilan modern dan rapi",
      "Bisa custom ukuran & warna",
      "Cocok dipadukan bed minimalis",
    ],
    suitableFor: [
      "Kamar tidur minimalis",
      "Kamar anak",
      "Small bedroom",
      "Apartemen studio",
      "Kost eksklusif / homestay",
    ],
    materials: [materials.standard, materials.premium, materials.super_premium, materials.solid_wood, materials.marble],
    hasMeterInput: true,
  },

  // EXTERIOR PRODUCTS
  "plafon-1": {
    id: "plafon-1",
    name: "Plafon Pvc modern / drop ceiling up ceiling",
    subtitle: "Exterior Works",
    category: "exterior",
    basePrice: 320000,
    originalPrice: 475000,
    discount: 14,
    images: ["/plafon-pvc.png"],
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
  "canopy-pvc-1": {
    id: "canopy-pvc-1",
    name: "Canopy + Plafon Pvc / Up Ceiling / Drop Ceiling",
    subtitle: "Exterior Works",
    category: "exterior",
    basePrice: 949000,
    originalPrice: 1149000,
    discount: 15,
    images: ["/canopy-exterior.jpg"],
    description: "Konsep eksterior pada gambar mengusung gaya minimalis modern elegan dengan perpaduan warna putih, hitam, dan aksen kayu. Memberikan kesan rumah lebih mewah, rapi, dan bernilai tinggi.",
    specs: [
      { label: "Canopy", value: "Besi hollow galvanis, Atap spandek premium, Ceiling PVC motif kayu, Downlight LED" },
      { label: "Pagar", value: "Hollow besi tebal, Cat powder coating" },
      { label: "Landscape", value: "Tanaman tropis, Batu alam, Rumput taman" },
      { label: "Fasad", value: "Cat exterior weatherproof, Finishing modern clean" },
    ],
    features: [
      "Rumah tampak mewah dari depan",
      "Carport terlindungi hujan & panas",
      "Keamanan lebih baik",
      "Nilai properti meningkat",
      "Tampilan first impression kuat",
      "Cocok rumah cluster modern", 
    ],
    suitableFor: [
      "Cluster modern",
      "Rumah hook",
      "Villa",
      "Townhouse",
    ],
    materials: [materials.standard, materials.premium, materials.super_premium, materials.solid_wood, materials.marble],
    hasMeterInput: true,
  },
  "canopy-sliding-1": {
    id: "canopy-sliding-1",
    name: "kanopi kaca buka tutup / skylight retractable sliding roof dengan rangka aluminium atau besi premium",
    subtitle: "Exterior Works",
    category: "exterior",
    basePrice: 2100000,
    originalPrice: 2500000,
    discount: 16,
    images: ["/canopy-sliding.jpg"],
    description: "Kanopi ini menggunakan sistem geser buka tutup sehingga atap kaca dapat dibuka saat ingin sirkulasi udara dan cahaya alami, lalu ditutup saat hujan atau panas berlebih.",
    specs: [
      { label: "Rangka", value: "Aluminium heavy duty / besi galvanis, Powder coating outdoor" },
      { label: "Penutup", value: "Kaca tempered laminated 8+8 mm, Atau polycarbonate solid premium" },
      { label: "Sistem Rel", value: "Sliding rail heavy duty, Bearing wheel senyap" },
      { label: "Drainase", value: "Talang air tersembunyi, Jalur pembuangan air hujan" },
    ],
    features: [
      "Rumah terasa luas & mewah",
      "Bisa buka tutup sesuai cuaca",
      "Cocok area tengah rumah",
      "Menambah sirkulasi udara",
      "Tampilan premium modern",
    ],
    suitableFor: [
      "Void rumah 2 lantai",
      "Innercourt / taman tengah",
      "Rooftop",
      "Kolam indoor",
      "Area jemur modern",
      "Skylight dapur",
    ],
    materials: [materials.standard, materials.premium, materials.super_premium, materials.solid_wood, materials.marble],
    hasMeterInput: true,
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
    name: "Pager Sliding dengan kombinasi besi hollow, panel motif kayu, tembok fasad, dan sistem geser samping",
    subtitle: "Exterior Works",
    category: "exterior",
    basePrice: 849000,
    originalPrice: 1100000,
    discount: 15,
    images: ["/pagar-sliding.png", "/pagar-sliding1.png"],
    description: "Pagar ini memakai model sliding gate (geser samping) sehingga hemat ruang buka-tutup dibanding pagar swing biasa. Tampilan elegan dengan perpaduan warna hitam doff dan aksen kayu natural.",
    specs: [
      { label: "Rangka", value: "Besi hollow 50x100 / 40x80 / galvanis" },
      { label: "Finishing", value: "Cat epoxy + powder coating, Panel WPC / ACP motif kayu / kayu ulin" },
      { label: "Sistem", value: "Sliding rel bawah heavy duty, Roda bearing baja, Stopper pengaman" },
    ],
    features: [
      "Hemat area buka pagar",
      "Tampilan rumah mewah & modern",
      "Lebih praktis untuk mobil keluar masuk",
      "Aman dan kokoh",
      "Perawatan mudah",
      "Nilai fasad rumah naik",
    ],
    suitableFor: [
      "Rumah 2 lantai modern",
      "Cluster premium",
      "Rumah hook",
      "Ruko premium",
      "Villa",
    ],
    materials: [materials.standard, materials.premium, materials.super_premium, materials.solid_wood, materials.marble],
    hasMeterInput: true,
    minMeter: 2,
    maxMeter: 10,
  },
  "railing-balkon-1": {
    id: "railing-balkon-1",
    name: "railing balkon aluminium / besi minimalis modern dengan kaca atau hollow horizontal pada area balkon depan",
    subtitle: "Exterior Works",
    category: "exterior",
    basePrice: 799000,
    originalPrice: 1500000,
    discount: 15,
    images: ["/railing-balkon1.png", "/railing-balkon.png"],
    description: "Railing balkon modern berfungsi sebagai pengaman area balkon sekaligus mempercantik fasad rumah. Desain pada gambar memakai warna hitam elegan dengan garis horizontal minimalis sehingga tampak clean dan premium.",
    specs: [
      { label: "Rangka", value: "Hollow 40x40 / 50x50, Tebal 1.6 mm – 2 mm" },
      { label: "Finishing", value: "Cat duco outdoor, Powder coating hitam doff, Anti karat primer epoxy" },
      { label: "Model", value: "Horizontal bar, Vertical minimalis, Kombinasi kaca tempered" },
      { label: "Tinggi Standar", value: "90 cm – 110 cm" },
    ],
    features: [
      "Aman untuk balkon lantai atas",
      "Tampilan rumah modern",
      "Perawatan mudah",
      "Tahan cuaca luar ruangan",
      "Bisa custom model & warna",
      "Nilai fasad rumah naik",
    ],
    suitableFor: [
      "Rumah 2 lantai modern",
      "Cluster premium",
      "Townhouse",
      "Ruko premium",
      "Villa",
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