import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16">
      <h1 className="font-bold text-slate-900" style={{ fontSize: "var(--text-3xl)" }}>
        404
      </h1>
      <p className="mt-2 text-slate-600" style={{ fontSize: "var(--text-lg)" }}>
        Sayfa bulunamadi
      </p>
      <p className="mt-1 max-w-md text-center text-slate-500" style={{ fontSize: "var(--text-base)" }}>
        Aradiginiz sayfa mevcut degil veya tasinmis olabilir.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-xl bg-orange-500 px-5 py-2.5 font-semibold text-white"
        style={{ fontSize: "var(--text-sm)" }}
      >
        Anasayfaya Don
      </Link>
    </main>
  );
}
