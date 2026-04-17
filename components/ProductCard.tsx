// components/ProductCard.tsx
// PERBAIKAN: Pastikan Link menggunakan ID yang benar

import Image from "next/image";
import Link from "next/link";

function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID").format(n);
}

type Props = {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  discount: number;
  voucher?: number;
  size?: string;
};

export default function ProductCard({
  id,
  name,
  image,
  price,
  originalPrice,
  discount,
  voucher,
  size,
}: Props) {
  return (
    <Link href={`/produk/${id}`} className="block group">
      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer hover:-translate-y-1 h-full flex flex-col">
        {/* IMAGE */}
        <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition duration-500"
          />
          
          {/* Discount Badge */}

        </div>

        {/* CONTENT */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-bold text-[15px] leading-snug line-clamp-2 text-gray-900 group-hover:text-blue-600 transition mb-2">
            {name}
          </h3>

          {size && (
            <div className="text-xs text-gray-500 font-medium mb-2">
              {size}
            </div>
          )}

          {/* PRICE */}
          <div className="mt-auto space-y-1">
            <div className="text-xs text-gray-400 line-through">
              Rp{formatRupiah(originalPrice)}
            </div>
            <div className="text-xl font-extrabold text-blue-600">
              Rp{formatRupiah(price)}
            </div>
          </div>

          {voucher && (
            <div className="mt-2 inline-block bg-red-50 text-red-600 text-xs font-semibold px-2 py-1 rounded border border-red-200">
              + Voucher Rp{formatRupiah(voucher * 10000)}
            </div>
          )}

          <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-500">
            <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Gratis Ongkir
          </div>
        </div>
      </div>
    </Link>
  );
}