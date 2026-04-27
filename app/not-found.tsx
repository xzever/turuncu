import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16">
      <h1 className="text-4xl font-bold text-slate-900">404</h1>
      <p className="mt-2 text-lg text-slate-600">Sayfa bulunamadi</p>
      <p className="mt-1 max-w-md text-center text-slate-500">
        Aradiginiz sayfa mevcut degil veya tasinmis olabilir.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white"
      >
        Anasayfaya Don
      </Link>
    </main>
  );
}
