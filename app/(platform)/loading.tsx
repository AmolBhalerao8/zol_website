export default function PlatformLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-white">
      <div className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-emerald-400" />
        <p className="text-sm font-medium text-zinc-300">Loading your workspace...</p>
      </div>
    </main>
  );
}
