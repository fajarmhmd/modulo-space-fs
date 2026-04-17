// components/ProgressTimeline.tsx

"use client";

import { motion } from "framer-motion";

interface ProgressItem {
  id: string;
  title: string;
  description: string;
  progress: number;
  created_at: string;
}

export default function ProgressTimeline({
  items,
}: {
  items: ProgressItem[];
}) {
  if (!items.length) {
    return (
      <div className="text-center text-gray-500 py-10">
        Belum ada progress produksi
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {items.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex gap-4"
        >
          <div className="flex flex-col items-center">
            <div className="w-4 h-4 bg-green-500 rounded-full" />
            <div className="w-px h-full bg-gray-300" />
          </div>

          <div className="bg-white shadow-md rounded-xl p-4 w-full">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">{item.title}</h3>

              <span className="text-sm text-green-600 font-medium">
                {item.progress}%
              </span>
            </div>

            <p className="text-gray-500 text-sm mt-1">
              {item.description}
            </p>

            <p className="text-xs text-gray-400 mt-2">
              {new Date(item.created_at).toLocaleDateString()}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}