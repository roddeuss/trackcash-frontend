export default function OfflinePage() {
  return (
    <main className="min-h-[70dvh] flex items-center justify-center p-6">
      <div className="max-w-md text-center bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow">
        <h1 className="text-xl font-semibold mb-2">Kamu sedang offline</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-300">
          Beberapa data terakhir mungkin masih bisa dilihat dari cache.
          Coba ulangi saat koneksi kembali tersedia.
        </p>
      </div>
    </main>
  );
}
