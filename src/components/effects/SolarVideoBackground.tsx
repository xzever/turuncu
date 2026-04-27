import "./solar-video-background.css";

export default function SolarVideoBackground() {
  return (
    <div className="solar-video-bg" aria-hidden="true">
      <video
        className="solar-video-bg__media"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/sss-background.webp"
      >
        <source src="/solarbacrkound.mp4" type="video/mp4" />
      </video>
      <span className="solar-video-bg__shade" />
    </div>
  );
}
