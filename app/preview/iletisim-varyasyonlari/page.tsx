import type { Metadata } from "next";
import "./preview.css";

export const metadata: Metadata = {
  title: "Iletisim Mobil Varyasyonlari",
  robots: { index: false, follow: false },
};

const BRANCHES = ["Ankara", "Mugla"] as const;

function ConceptOne({ device }: { device: "phone" | "tablet" }) {
  return (
    <section className={`iletisim-preview__device iletisim-preview__device--${device}`}>
      <div className="iletisim-preview__surface iletisim-preview__surface--alpha">
        <header className="iletisim-preview__hero">
          <p className="iletisim-preview__eyebrow">Iletisim</p>
          <h2 className="iletisim-preview__title">Bize Ulasin</h2>
          <p className="iletisim-preview__lead">
            Ankara ve Mugla ofisleri arasinda hizli gecis yapin.
          </p>
        </header>

        <div className="iletisim-preview__switcher">
          {BRANCHES.map((branch, index) => (
            <button
              key={`${device}-${branch}`}
              type="button"
              className={`iletisim-preview__switcher-button ${index === 0 ? "is-active" : ""}`}
            >
              {branch}
            </button>
          ))}
        </div>

        <div className="iletisim-preview__quick-actions">
          <div className="iletisim-preview__quick-card">Yol Tarifi</div>
          <div className="iletisim-preview__quick-card">E-Posta</div>
          <div className="iletisim-preview__quick-card">WhatsApp</div>
        </div>

        <div className={`iletisim-preview__grid ${device === "tablet" ? "is-tablet" : ""}`}>
          <div className="iletisim-preview__stack">
            <article className="iletisim-preview__info-card">
              <div className="iletisim-preview__icon-badge" />
              <div className="iletisim-preview__copy">
                <span className="iletisim-preview__label">Ankara Irtibat Ofisi</span>
                <strong className="iletisim-preview__value">
                  Mustafa Kemal Mah. 2118. Cad. No:4
                </strong>
              </div>
            </article>

            <article className="iletisim-preview__info-card">
              <div className="iletisim-preview__icon-badge" />
              <div className="iletisim-preview__copy">
                <span className="iletisim-preview__label">Musteri Destek</span>
                <strong className="iletisim-preview__value">+90 312 285 66 67</strong>
                <span className="iletisim-preview__muted">Hafta ici 09:00 - 18:00</span>
              </div>
            </article>
          </div>

          <article className="iletisim-preview__map-card">
            <div className="iletisim-preview__map-pin" />
          </article>
        </div>

        <article className="iletisim-preview__form-card">
          <div className="iletisim-preview__form-head">
            <div className="iletisim-preview__form-badge" />
            <div>
              <h3 className="iletisim-preview__form-title">Bize Yazin</h3>
              <p className="iletisim-preview__form-text">
                Uzman ekibimiz size en kisa surede donus yapar.
              </p>
            </div>
          </div>

          <div className={`iletisim-preview__fields ${device === "tablet" ? "is-tablet" : ""}`}>
            <div className="iletisim-preview__field">
              <span className="iletisim-preview__field-label">Ad Soyad</span>
              <div className="iletisim-preview__field-box" />
            </div>
            <div className="iletisim-preview__field">
              <span className="iletisim-preview__field-label">E-Posta</span>
              <div className="iletisim-preview__field-box" />
            </div>
            <div className="iletisim-preview__field iletisim-preview__field--full">
              <span className="iletisim-preview__field-label">Mesaj</span>
              <div className="iletisim-preview__field-box iletisim-preview__field-box--tall" />
            </div>
          </div>

          <button type="button" className="iletisim-preview__cta">
            Gonder
          </button>
        </article>
      </div>
    </section>
  );
}

function ConceptTwo({ device }: { device: "phone" | "tablet" }) {
  return (
    <section className={`iletisim-preview__device iletisim-preview__device--${device}`}>
      <div className="iletisim-preview__surface iletisim-preview__surface--beta">
        <header className="iletisim-preview__hero iletisim-preview__hero--beta">
          <p className="iletisim-preview__eyebrow iletisim-preview__eyebrow--beta">Iletisim</p>
          <h2 className="iletisim-preview__title iletisim-preview__title--beta">
            Ofis ve Destek
          </h2>
          <p className="iletisim-preview__lead iletisim-preview__lead--beta">
            Sube secin, saatleri gorun ve ayni ekranda form birakin.
          </p>
        </header>

        <div className="iletisim-preview__segmented">
          {BRANCHES.map((branch, index) => (
            <button
              key={`beta-${device}-${branch}`}
              type="button"
              className={`iletisim-preview__segmented-button ${index === 1 ? "is-active" : ""}`}
            >
              {branch}
            </button>
          ))}
        </div>

        <div className={`iletisim-preview__content-band ${device === "tablet" ? "is-tablet" : ""}`}>
          <article className="iletisim-preview__office-panel">
            <div className="iletisim-preview__office-head">
              <div>
                <span className="iletisim-preview__label iletisim-preview__label--beta">Mugla</span>
                <h3 className="iletisim-preview__office-title">Bolge Ofisi</h3>
              </div>
              <span className="iletisim-preview__tag">Acik</span>
            </div>
            <p className="iletisim-preview__office-copy">
              Turizm ve tarim projeleri icin saha destegi.
            </p>
            <div className="iletisim-preview__mini-list">
              <span>Adres</span>
              <span>Telefon</span>
              <span>WhatsApp</span>
            </div>
          </article>

          <article className="iletisim-preview__hours-panel">
            <span className="iletisim-preview__label iletisim-preview__label--beta">
              Calisma Saatleri
            </span>
            <div className="iletisim-preview__hours-lines">
              <div />
              <div />
              <div />
            </div>
            <button type="button" className="iletisim-preview__ghost-button">
              Formu Ac
            </button>
          </article>
        </div>

        <article className="iletisim-preview__sheet">
          <div className={`iletisim-preview__sheet-grid ${device === "tablet" ? "is-tablet" : ""}`}>
            <div className="iletisim-preview__field">
              <span className="iletisim-preview__field-label iletisim-preview__field-label--beta">
                Sube
              </span>
              <div className="iletisim-preview__field-box iletisim-preview__field-box--beta" />
            </div>
            <div className="iletisim-preview__field">
              <span className="iletisim-preview__field-label iletisim-preview__field-label--beta">
                Telefon
              </span>
              <div className="iletisim-preview__field-box iletisim-preview__field-box--beta" />
            </div>
            <div className="iletisim-preview__field iletisim-preview__field--full">
              <span className="iletisim-preview__field-label iletisim-preview__field-label--beta">
                Mesaj
              </span>
              <div className="iletisim-preview__field-box iletisim-preview__field-box--beta iletisim-preview__field-box--tall" />
            </div>
          </div>

          <div className="iletisim-preview__sheet-actions">
            <button type="button" className="iletisim-preview__secondary-cta">
              Mail
            </button>
            <button type="button" className="iletisim-preview__primary-cta">
              Gonder
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}

export default function IletisimVaryasyonlariPage() {
  return (
    <main className="iletisim-preview">
      <header className="iletisim-preview__page-head">
        <p className="iletisim-preview__page-kicker">Preview</p>
        <h1 className="iletisim-preview__page-title">Iletisim Mobil Varyasyonlari</h1>
      </header>

      <section className="iletisim-preview__concept">
        <div className="iletisim-preview__concept-head">
          <h2 className="iletisim-preview__concept-title">Varyasyon A</h2>
          <p className="iletisim-preview__concept-copy">
            Daha kurumsal, daha teknik, operasyon odakli bir dark control panel dili.
          </p>
        </div>
        <div className="iletisim-preview__devices">
          <ConceptOne device="phone" />
          <ConceptOne device="tablet" />
        </div>
      </section>

      <section className="iletisim-preview__concept">
        <div className="iletisim-preview__concept-head">
          <h2 className="iletisim-preview__concept-title">Varyasyon B</h2>
          <p className="iletisim-preview__concept-copy">
            Daha editorial, daha sıcak, bilgi ve formu tek sheet hissiyle toplayan yön.
          </p>
        </div>
        <div className="iletisim-preview__devices">
          <ConceptTwo device="phone" />
          <ConceptTwo device="tablet" />
        </div>
      </section>
    </main>
  );
}
