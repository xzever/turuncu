"use client";

import { useEffect } from "react";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="tr">
      <body>
        <main
          className="flex min-h-screen flex-col items-center justify-center px-4 py-16"
          role="alert"
        >
          <h1 className="font-bold" style={{ fontSize: "var(--text-2xl)" }}>
            Kritik bir hata olustu
          </h1>
          <p className="mt-2 max-w-md text-center text-slate-600" style={{ fontSize: "var(--text-base)" }}>
            Uygulama yuklenirken bir sorun olustu. Lutfen sayfayi yenileyin.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 rounded-xl bg-orange-500 px-5 py-2.5 font-semibold text-white"
            style={{ fontSize: "var(--text-sm)" }}
          >
            Sayfayi Yenile
          </button>
        </main>
      </body>
    </html>
  );
}
