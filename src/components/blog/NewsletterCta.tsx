"use client";

/**
 * NewsletterCta — E-bülten abonelik CTA bloğu
 *
 * Minimal, kendi içinde state'li. Gerçek kayıt endpoint'i gelmediği için
 * şu an `mailto:` fallback + client-side success state kullanır.
 *
 * Endpoint hazırsa `submit` fonksiyonuna bağlanır (TODO yorumu).
 *
 * AGENTS.md uyumu:
 *  - Madde 4: focus ring BEYAZ (focus-visible default'u kullan)
 *  - Madde 8: input 44px min, 16px font (iOS zoom önleme)
 *  - Madde 9: <label htmlFor> kullanılır
 *  - Tüm ölçüler token
 */
import { useId, useState, type FormEvent } from "react";
import { Mail, Check } from "lucide-react";

type Props = {
  className?: string;
  title?: string;
  description?: string;
};

export default function NewsletterCta({
  className,
  title = "Solar sektöründen özet",
  description = "Aylık bülten: yeni teknolojiler, vaka çalışmaları, mevzuat güncellemeleri.",
}: Props) {
  const emailId = useId();
  const consentId = useId();
  const [email, setEmail] = useState<string>("");
  const [consent, setConsent] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const validate = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate(email)) {
      setError("Lütfen geçerli bir e-posta adresi girin.");
      return;
    }
    if (!consent) {
      setError("Devam etmek için KVKK onayı gerekli.");
      return;
    }
    setError(null);

    /* TODO: Gerçek endpoint'e POST.
       Örn: fetch("/api/newsletter", { method: "POST", body: JSON.stringify({ email }) })
       �?u an mailto fallback — kullanıcı e-posta istemcisinden onaylar. */
    const subject = encodeURIComponent("Bülten aboneliği");
    const body = encodeURIComponent(
      `Bültene abone olmak istiyorum.\nE-posta: ${email}\n`,
    );
    if (typeof window !== "undefined") {
      window.location.href = `mailto:info@turuncusolar.com?subject=${subject}&body=${body}`;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <aside
        className={`bl-newsletter bl-newsletter--success${className ? ` ${className}` : ""}`}
        role="status"
        aria-live="polite"
      >
        <Check size={20} aria-hidden="true" />
        <div>
          <h3 className="bl-newsletter__title">Teşekkürler!</h3>
          <p className="bl-newsletter__desc">
            Bültenimize ekleyeceğiz. Onay için e-postanı kontrol et.
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside
      className={`bl-newsletter${className ? ` ${className}` : ""}`}
      aria-label="E-bülten aboneliği"
    >
      <div className="bl-newsletter__text">
        <div className="bl-newsletter__title-row">
          <Mail size={18} aria-hidden="true" />
          <h3 className="bl-newsletter__title">{title}</h3>
        </div>
        <p className="bl-newsletter__desc">{description}</p>
      </div>

      <form className="bl-newsletter__form" onSubmit={handleSubmit} noValidate>
        <label htmlFor={emailId} className="bl-newsletter__label">
          E-posta
        </label>
        <div className="bl-newsletter__row">
          <input
            id={emailId}
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="ornek@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bl-newsletter__input"
            required
            aria-invalid={error ? "true" : "false"}
          />
          <button
            type="submit"
            className="bl-newsletter__btn"
            aria-label="Bültene abone ol"
          >
            Abone Ol
          </button>
        </div>

        <label htmlFor={consentId} className="bl-newsletter__consent">
          <input
            id={consentId}
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
          />
          <span>
            Kişisel verilerimin işlenmesine ilişkin{" "}
            <a href="/kvkk" target="_blank" rel="noopener noreferrer">
              Aydınlatma Metni
            </a>
            ni okudum, kabul ediyorum.
          </span>
        </label>

        {error && (
          <p className="bl-newsletter__error" role="alert">
            {error}
          </p>
        )}
      </form>
    </aside>
  );
}
