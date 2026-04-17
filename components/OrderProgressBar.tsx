// components/OrderProgressBar.tsx

export default function OrderProgressBar({
  progress,
}: {
  progress: number;
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="font-semibold mb-4">Progress Produksi</h2>

      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div
          className="bg-green-500 h-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="mt-2 text-sm text-gray-600">
        {progress}% selesai
      </p>
    </div>
  );
}