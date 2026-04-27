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
      <h1 className="font-bold text-slate-900" style={{ fontSize: "var(--text-2xl)" }}>
        Bir hata olustu
      </h1>
      <p className="mt-2 max-w-md text-center text-slate-600" style={{ fontSize: "var(--text-base)" }}>
        Sayfa yuklenirken beklenmeyen bir sorun olustu. Lutfen tekrar deneyin.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={reset}
          className="rounded-xl bg-orange-500 px-5 py-2.5 font-semibold text-white"
          style={{ fontSize: "var(--text-sm)" }}
        >
          Tekrar Dene
        </button>
        <Link
          href="/"
          className="rounded-xl border border-slate-300 px-5 py-2.5 font-semibold text-slate-700"
          style={{ fontSize: "var(--text-sm)" }}
        >
          Anasayfaya Don
        </Link>
      </div>
    </main>
  );
}
