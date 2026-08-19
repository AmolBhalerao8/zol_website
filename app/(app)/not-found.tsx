import Link from "next/link";

export default function AppNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">404</p>
      <h1 className="text-2xl font-bold tracking-tight text-zinc-950">Nothing on the board matches that</h1>
      <p className="max-w-md text-sm leading-6 text-zinc-600">
        That repair order, vehicle, or record does not exist. It may have been closed out, or the link may be
        mistyped.
      </p>
      <Link
        href="/board"
        className="mt-2 rounded-full bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
      >
        Back to the board
      </Link>
    </div>
  );
}
