"use client";

import { useEffect } from "react";
import Link from "next/link";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <main
      className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16"
      role="alert"
    >
      <h1 className="text-2xl font-bold text-slate-900">Bir hata olustu</h1>
      <p className="mt-2 max-w-md text-center text-slate-600">
        Sayfa yuklenirken beklenmeyen bir sorun olustu. Lutfen tekrar deneyin.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={reset}
          className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white"
        >
          Tekrar Dene
        </button>
        <Link
          href="/"
          className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700"
        >
          Anasayfaya Don
        </Link>
      </div>
    </main>
  );
}
