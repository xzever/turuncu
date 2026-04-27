import Link from "next/link";

export default function NotFound() {
  return (
    <main
      className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16"
      style={{ background: "var(--color-bg)", color: "var(--color-text)" }}
    >
      <h1 className="font-bold" style={{ fontSize: "var(--text-3xl)" }}>
        404
      </h1>
      <p className="mt-2" style={{ color: "var(--color-muted)", fontSize: "var(--text-lg)" }}>
        Sayfa bulunamadi
      </p>
      <p className="mt-1 max-w-md text-center" style={{ color: "var(--color-dim)", fontSize: "var(--text-base)" }}>
        Aradiginiz sayfa mevcut degil veya tasinmis olabilir.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-xl px-5 py-2.5 font-semibold"
        style={{ background: "var(--color-primary)", color: "var(--color-on-primary)", fontSize: "var(--text-sm)" }}
      >
        Anasayfaya Don
      </Link>
    </main>
  );
}
