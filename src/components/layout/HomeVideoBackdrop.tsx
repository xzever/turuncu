/**
 * Tam ekran arka plan videosu — üst bar (z-50) bu katmanın üzerinde kalır.
 */
export default function HomeVideoBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[1] w-full overflow-hidden" aria-hidden>
      <video
        className="absolute inset-0 z-0 h-full w-full object-cover"
        autoPlay
        muted
        playsInline
        loop
        preload="auto"
      >
        <source src="/hakkimizda.mp4" type="video/mp4" />
      </video>
      <div
        className="absolute inset-0 z-[1] bg-gradient-to-b from-black/45 via-black/25 to-black/50"
        aria-hidden
      />
    </div>
  );
}
