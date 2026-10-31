"use client";

import {
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
  type ReactNode,
  type FormEvent,
} from "react";
import Link from "next/link";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useReducedMotion,
} from "motion/react";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowDown,
  Menu,
  X,
  Plus,
  ChevronLeft,
  ChevronRight,
  MoveHorizontal,
  Check,
  ShieldCheck,
  Focus,
  Layers,
  SlidersHorizontal,
  MapPin,
  Instagram,
  CheckCircle2,
} from "lucide-react";
import {
  copy,
  images,
  paths,
  prices,
  type Locale,
  type Page,
} from "@/lib/content";
import { localDate, previewBooking, type BookingRequest } from "@/lib/booking";

const Language = createContext<{
  locale: Locale;
  t: typeof copy.en;
  setLocale: (l: Locale) => void;
}>({ locale: "en", t: copy.en, setLocale: () => {} });
const useCopy = () => useContext(Language);
const Arrow = () => <ArrowUpRight size={17} strokeWidth={1.5} />;
function Picture({
  src,
  alt,
  className = "",
  priority = false,
  sizes = "(max-width: 700px) 100vw, 50vw",
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}
function Reveal({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      id={id}
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: reduced ? 0 : 0.6 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
function Logo() {
  const { t } = useCopy();
  return (
    <Link href="/" aria-label={`NORD Detailing — ${t.nav[0]}`} className="logo">
      <span className="logo-word">
        NORD<span className="logo-mark">↗</span>
      </span>
      <span className="logo-sub">DETAILING</span>
    </Link>
  );
}
function Header({ page }: { page: Page }) {
  const { locale, setLocale, t } = useCopy();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 30);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => {
    if (!open) return;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const background = document.querySelectorAll<HTMLElement>("main, footer");
    background.forEach((element) => {
      element.inert = true;
    });
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        document.getElementById("menu-toggle")?.focus();
      }
    };
    window.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = old;
      background.forEach((element) => {
        element.inert = false;
      });
      window.removeEventListener("keydown", key);
    };
  }, [open]);
  return (
    <>
      <a className="skip-link" href="#main">
        {locale === "en" ? "Skip to content" : "Liigu sisu juurde"}
      </a>
      <div className="demo-bar">
        <span className="demo-dot" />
        {t.demo}
        <ArrowUpRight size={11} />
      </div>
      <header
        className={`header ${scrolled || page !== "home" ? "solid" : ""} ${open ? "menu-open" : ""}`}
      >
        <div className="nav-wrap">
          <Logo />
          <nav
            aria-label={locale === "en" ? "Main navigation" : "Peamenüü"}
            className="desktop-nav"
          >
            {paths.map((p, i) => (
              <Link
                key={p}
                href={p}
                aria-current={
                  ["home", "services", "gallery", "about", "contact"][i] ===
                  page
                    ? "page"
                    : undefined
                }
              >
                {t.nav[i]}
              </Link>
            ))}
          </nav>
          <div className="nav-actions">
            <div
              className="languages"
              aria-label={locale === "en" ? "Language" : "Keel"}
            >
              {(["en", "et"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  lang={l}
                  aria-pressed={locale === l}
                  onClick={() => {
                    setLocale(l);
                    setOpen(false);
                  }}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <Link
              className="button button-small nav-book"
              href="/contact/#booking"
            >
              {t.book}
              <Arrow />
            </Link>
            <button
              id="menu-toggle"
              className="menu-toggle"
              aria-label={open ? t.dismiss : t.menu}
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen(!open)}
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {open && (
            <motion.nav
              id="mobile-nav"
              className="mobile-nav"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              aria-label={t.menu}
            >
              {paths.map((p, i) => (
                <Link key={p} href={p} onClick={() => setOpen(false)}>
                  {t.nav[i]}
                  <Arrow />
                </Link>
              ))}
              <Link
                className="button"
                href="/contact/#booking"
                onClick={() => setOpen(false)}
              >
                {t.book}
                <Arrow />
              </Link>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
function Hero() {
  const { t } = useCopy();
  const reduced = useReducedMotion();
  return (
    <section className="hero">
      <Picture
        src="/images/hero.webp"
        alt="Black sports coupe in a dark detailing studio — generated concept image"
        className="hero-image"
        priority
        sizes="100vw"
      />
      <div className="hero-shade" />
      <div className="hero-content container">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
        >
          <div className="eyebrow">
            <span className="gold-line" />
            {t.eyebrow}
          </div>
          <h1>
            {t.hero[0]}
            <br />
            <span>{t.hero[1]}</span>
          </h1>
          <p>{t.subtitle}</p>
          <div className="hero-buttons">
            <Link className="button" href="/services/">
              {t.explore}
              <Arrow />
            </Link>
            <Link className="text-button" href="/contact/#booking">
              {t.appointment}
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </motion.div>
      </div>
      <div className="hero-bottom container">
        <a href="#services" className="scroll-cue">
          <span>
            <ArrowDown size={14} />
          </span>
          {t.scroll}
        </a>
        <div className="hero-coordinate">
          <span className="demo-dot" />
          {t.location}
          <span className="coordinates">59°26′ N &nbsp; 24°45′ E</span>
        </div>
        <span className="hero-index">01 — 05</span>
      </div>
    </section>
  );
}
function SectionHeading({
  label,
  title,
  text,
  children,
}: {
  label: string;
  title: string;
  text?: string;
  children?: ReactNode;
}) {
  return (
    <Reveal className="section-heading">
      <div>
        <span className="eyebrow muted">{label}</span>
        <h2>{title}</h2>
      </div>
      <div className="heading-side">
        {text && <p>{text}</p>}
        {children}
      </div>
    </Reveal>
  );
}
function Services({ full = false }: { full?: boolean }) {
  const { t } = useCopy();
  return (
    <section className="section services-section" id="services">
      <div className="container">
        {!full && (
          <SectionHeading
            label={t.serviceLabel}
            title={t.serviceTitle}
            text={t.serviceIntro}
          >
            <Link className="text-button" href="/services/">
              {t.allServices}
              <Arrow />
            </Link>
          </SectionHeading>
        )}
        <div className={`services-grid ${full ? "detailed" : ""}`}>
          {t.serviceNames.map((name, i) => (
            <Reveal
              key={name}
              className="service-card"
              id={full ? `service-${i}` : undefined}
            >
              <div className="service-image">
                <Picture
                  src={images[i]}
                  alt={name + " — demonstration image"}
                />
                <span className="service-number">0{i + 1}</span>
                <Link
                  className="round-link"
                  href={`/contact/?service=${i}#booking`}
                  aria-label={`${t.book}: ${name}`}
                >
                  <Arrow />
                </Link>
              </div>
              <div className="service-body">
                <div className="service-name-row">
                  <h3>{name}</h3>
                  <span className="price">
                    {t.from} <strong>€{prices[i]}</strong>
                  </span>
                </div>
                <p>{t.serviceDescriptions[i]}</p>
                {full && (
                  <>
                    <p className="service-detail">{t.serviceDetails[i]}</p>
                    <div className="duration">
                      {t.duration}
                      <span>{t.durations[i]}</span>
                    </div>
                    <ul className="includes">
                      {t.includes.map((item) => (
                        <li key={item}>
                          <Check size={14} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                <Link
                  className="service-cta"
                  href={
                    full
                      ? `/contact/?service=${i}#booking`
                      : `/services/#service-${i}`
                  }
                >
                  {full ? t.book : t.serviceCta}
                  <ArrowRight size={15} />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="fine-print price-note">
          <span>{t.sample}</span>
          {t.priceNote}
        </p>
      </div>
    </section>
  );
}
function Why() {
  const { t } = useCopy();
  const icons = [Focus, Layers, SlidersHorizontal, ShieldCheck];
  return (
    <section className="section approach">
      <div className="container approach-layout">
        <Reveal className="approach-image">
          <Picture
            src="/images/paint.webp"
            alt="Automotive bodywork and reflections — stock concept image"
          />
          <span className="image-caption">NORD / {t.precision}</span>
        </Reveal>
        <Reveal className="approach-copy">
          <span className="eyebrow muted">{t.whyLabel}</span>
          <h2>{t.whyTitle}</h2>
          <p>{t.whyText}</p>
          <div className="benefits">
            {t.whyNames.map((name, i) => {
              const Icon = icons[i];
              return (
                <div key={name}>
                  <Icon size={22} strokeWidth={1.3} />
                  <h3>{name}</h3>
                  <p>{t.whyDescriptions[i]}</p>
                </div>
              );
            })}
          </div>
          <Link href="/about/" className="text-button">
            {t.nav[3]}
            <Arrow />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
function Comparison() {
  const { t } = useCopy();
  const [value, setValue] = useState(50);
  return (
    <section className="section comparison-section">
      <div className="container">
        <SectionHeading
          label={t.compareLabel}
          title={t.compareTitle}
          text={t.compareText}
        />
        <Reveal>
          <div className="comparison">
            <Picture
              src="/images/paint.webp"
              alt={t.after + " — " + t.illustrative}
            />
            <div
              className="comparison-before"
              style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}
            >
              <Picture src="/images/paint.webp" alt="" />
              <div className="surface-haze" />
            </div>
            <span className="compare-tag before-tag">{t.before}</span>
            <span className="compare-tag after-tag">{t.after}</span>
            <div className="divider" style={{ left: `${value}%` }}>
              <span>
                <MoveHorizontal size={22} />
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              aria-label={t.slider}
              aria-valuetext={`${value}% ${t.before}`}
              className="compare-range"
            />
          </div>
          <p className="fine-print compare-note">{t.illustrative}</p>
        </Reveal>
      </div>
    </section>
  );
}
const galleryItems = [
  { src: "/images/hero.webp", cat: 1 },
  { src: "/images/interior.webp", cat: 0 },
  { src: "/images/paint.webp", cat: 2 },
  { src: "/images/ceramic.jpg", cat: 3 },
  { src: "/images/exterior.jpg", cat: 1 },
  { src: "/images/interior.webp", cat: 0 },
];
function Gallery({ preview = false }: { preview?: boolean }) {
  const { t } = useCopy();
  const [filter, setFilter] = useState(-1);
  const [active, setActive] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const filtered = galleryItems
    .map((item, id) => ({ ...item, id }))
    .filter((x) => filter === -1 || x.cat === filter);
  const close = () => {
    setActive(null);
    dialog.current?.close();
    lastFocus.current?.focus();
  };
  const move = (dir: number) =>
    setActive((old) => {
      const index = filtered.findIndex((x) => x.id === old);
      return filtered[(index + dir + filtered.length) % filtered.length].id;
    });
  useEffect(() => {
    if (active === null) return;
    lastFocus.current = document.activeElement as HTMLElement;
    dialog.current?.showModal();
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = old;
    };
  }, [active === null]);
  return (
    <section className="section gallery-section">
      <div className="container">
        {preview && (
          <SectionHeading
            label={t.galleryLabel}
            title={t.galleryTitle}
            text={t.galleryText}
          />
        )}
        <div className="gallery-toolbar">
          <div className="filter-list" aria-label={t.nav[2]}>
            {[t.all, ...t.categories].map((label, i) => (
              <button
                key={label}
                aria-pressed={filter === i - 1}
                className={filter === i - 1 ? "active" : ""}
                onClick={() => setFilter(i - 1)}
              >
                {label}
                <span>
                  {i === 0
                    ? "06"
                    : String(
                        galleryItems.filter((x) => x.cat === i - 1).length,
                      ).padStart(2, "0")}
                </span>
              </button>
            ))}
          </div>
          <span className="gallery-toolbar-label">{t.visualJournal}</span>
        </div>
        <motion.div layout className="gallery-grid">
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => (
              <motion.button
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                key={item.id}
                className={`gallery-item gallery-item-${item.id}`}
                onClick={() => setActive(item.id)}
                aria-label={`${t.openImage}: ${t.categories[item.cat]} ${item.id + 1}`}
              >
                <Picture
                  src={item.src}
                  alt={t.categories[item.cat] + " — demonstration image"}
                />
                <span className="gallery-overlay">
                  <span>{t.categories[item.cat]}</span>
                  <Plus size={24} />
                </span>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
        <div className="gallery-foot">
          <p className="fine-print">{t.galleryNote}</p>
          {preview && (
            <Link className="text-button" href="/gallery/">
              {t.viewGallery}
              <Arrow />
            </Link>
          )}
        </div>
      </div>
      <dialog
        ref={dialog}
        className="lightbox"
        aria-label={t.nav[2]}
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            move(-1);
          }
          if (e.key === "ArrowRight") {
            e.preventDefault();
            move(1);
          }
        }}
      >
        {active !== null && (
          <>
            <button
              autoFocus
              className="lightbox-close icon-button"
              aria-label={t.close}
              onClick={close}
            >
              <X />
            </button>
            <button
              className="lightbox-prev icon-button"
              aria-label={t.previous}
              onClick={() => move(-1)}
            >
              <ChevronLeft />
            </button>
            <div className="lightbox-image">
              <Picture
                src={galleryItems[active].src}
                alt={
                  t.categories[galleryItems[active].cat] + " — " + t.galleryNote
                }
                sizes="90vw"
              />
            </div>
            <button
              className="lightbox-next icon-button"
              aria-label={t.next}
              onClick={() => move(1)}
            >
              <ChevronRight />
            </button>
            <div className="lightbox-caption">
              {t.categories[galleryItems[active].cat]}
              <span>{t.galleryNote}</span>
            </div>
          </>
        )}
      </dialog>
    </section>
  );
}
function Process() {
  const { t } = useCopy();
  return (
    <section className="section process-section">
      <div className="container">
        <SectionHeading label={t.processLabel} title={t.processTitle} />
        <div className="process-grid">
          {t.processNames.map((name, i) => (
            <Reveal key={name} className="process-step">
              <span className="step-number">
                0{i + 1}
                <span />
              </span>
              <h3>{name}</h3>
              <p>{t.processDescriptions[i]}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
function Testimonial() {
  const { t } = useCopy();
  return (
    <section className="testimonial">
      <Reveal className="container">
        <span className="eyebrow muted">{t.testimonialLabel}</span>
        <blockquote>{t.quote}</blockquote>
        <span className="quote-rule" />
        <p className="fine-print">{t.quoteNote}</p>
      </Reveal>
    </section>
  );
}
const blank: BookingRequest = {
  name: "",
  email: "",
  phone: "",
  vehicle: "",
  service: "",
  date: "",
  message: "",
};
function Booking() {
  const { t, locale } = useCopy();
  const [values, setValues] = useState<BookingRequest>(blank);
  const [errors, setErrors] = useState<
    Partial<Record<keyof BookingRequest, string>>
  >({});
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const result = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const service = new URLSearchParams(window.location.search).get("service");
    if (service !== null && /^[0-5]$/.test(service))
      setValues((v) => ({ ...v, service }));
  }, []);
  const update = (key: keyof BookingRequest, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };
  async function submit(e: FormEvent) {
    e.preventDefault();
    const next: Partial<Record<keyof BookingRequest, string>> = {};
    (["name", "email", "phone", "vehicle", "service", "date"] as const).forEach(
      (key) => {
        if (!values[key].trim()) next[key] = t.required;
      },
    );
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      next.email = t.emailError;
    if (
      values.phone &&
      (!/^\+?[\d\s()\-]{7,24}$/.test(values.phone) ||
        values.phone.replace(/\D/g, "").length < 7)
    )
      next.phone = t.phoneError;
    if (values.date && values.date < localDate()) next.date = t.dateError;
    if (values.name.trim().length > 0 && values.name.trim().length < 2)
      next.name = t.invalid;
    setErrors(next);
    if (Object.keys(next).length) {
      document.getElementById(`booking-${Object.keys(next)[0]}`)?.focus();
      return;
    }
    setStatus("loading");
    await previewBooking(values);
    setValues(blank);
    setStatus("done");
    requestAnimationFrame(() => result.current?.focus());
  }
  const keys = [
    "name",
    "email",
    "phone",
    "vehicle",
    "service",
    "date",
    "message",
  ] as const;
  return (
    <section className="section booking-section" id="booking">
      <div className="container booking-layout">
        <Reveal className="booking-copy">
          <span className="eyebrow muted">{t.bookingLabel}</span>
          <h2>{t.bookingTitle}</h2>
          <p>{t.bookingText}</p>
          <div className="booking-rule" />
          <span className="eyebrow muted">{t.demoContact}</span>
          <p className="booking-location">
            <MapPin size={17} />
            {t.location}
          </p>
          <p className="fine-print">{t.formDemo}</p>
        </Reveal>
        <Reveal className="booking-form-wrap">
          {status === "done" ? (
            <div
              className="form-success"
              ref={result}
              tabIndex={-1}
              role="status"
            >
              <CheckCircle2 size={38} />
              <h3>
                {locale === "en"
                  ? "Demo preview complete"
                  : "Näidise eelvaade on valmis"}
              </h3>
              <p>{t.success}</p>
              <button className="button" onClick={() => setStatus("idle")}>
                {t.reset}
                <Arrow />
              </button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="booking-form">
              <div className="form-grid">
                {keys.map((key, i) => (
                  <div
                    className={`field ${key === "message" ? "field-wide" : ""}`}
                    key={key}
                  >
                    <label htmlFor={`booking-${key}`}>
                      {t.fields[i]}{" "}
                      <span>{key === "message" ? `(${t.optional})` : "*"}</span>
                    </label>
                    {key === "service" ? (
                      <select
                        id={`booking-${key}`}
                        name={key}
                        value={values[key]}
                        onChange={(e) => update(key, e.target.value)}
                        required
                        aria-invalid={!!errors[key]}
                        aria-describedby={
                          errors[key] ? `error-${key}` : undefined
                        }
                      >
                        <option value="">{t.select}</option>
                        {t.serviceNames.map((name, index) => (
                          <option key={name} value={index}>
                            {name} — €{prices[index]}
                          </option>
                        ))}
                      </select>
                    ) : key === "message" ? (
                      <textarea
                        id={`booking-${key}`}
                        name={key}
                        rows={3}
                        maxLength={2000}
                        value={values[key]}
                        onChange={(e) => update(key, e.target.value)}
                      />
                    ) : (
                      <input
                        id={`booking-${key}`}
                        name={key}
                        type={
                          key === "email"
                            ? "email"
                            : key === "phone"
                              ? "tel"
                              : key === "date"
                                ? "date"
                                : "text"
                        }
                        autoComplete={
                          key === "name"
                            ? "name"
                            : key === "email"
                              ? "email"
                              : key === "phone"
                                ? "tel"
                                : undefined
                        }
                        min={key === "date" ? localDate() : undefined}
                        max={key === "date" ? "2100-12-31" : undefined}
                        maxLength={key === "date" ? undefined : 150}
                        value={values[key]}
                        onChange={(e) => update(key, e.target.value)}
                        required
                        aria-invalid={!!errors[key]}
                        aria-describedby={
                          errors[key] ? `error-${key}` : undefined
                        }
                        placeholder={
                          key === "vehicle" ? "Porsche 911, 2024" : undefined
                        }
                      />
                    )}{" "}
                    {errors[key] && (
                      <p
                        className="field-error"
                        id={`error-${key}`}
                        role="alert"
                      >
                        {errors[key]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <p className="fine-print form-consent">{t.consent}</p>
              <button
                className="button form-submit"
                disabled={status === "loading"}
                type="submit"
              >
                {status === "loading" ? t.submitting : t.submit}
                <Arrow />
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
function Footer() {
  const { t } = useCopy();
  const [social, setSocial] = useState(false);
  return (
    <footer>
      <div className="container footer-main">
        <div className="footer-brand">
          <Logo />
          <p>{t.footerText}</p>
          <button
            className="social-button"
            onClick={() => setSocial(!social)}
            aria-expanded={social}
          >
            <Instagram size={17} />
            <span>{t.follow}</span>
            <Arrow />
          </button>
          {social && (
            <p className="fine-print" role="status">
              {t.socialText}
            </p>
          )}
        </div>
        <div className="footer-links">
          <span className="eyebrow muted">{t.navigate}</span>
          {paths.slice(1).map((path, i) => (
            <Link key={path} href={path}>
              {t.nav[i + 1]}
            </Link>
          ))}
        </div>
        <div className="footer-contact">
          <span className="eyebrow muted">{t.findUs}</span>
          <p>{t.address}</p>
          <p>{t.email}</p>
          <p>{t.phone}</p>
          <span className="fine-print">{t.demoContact}</span>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} NORD DETAILING</span>
        <Link href="/privacy/">{t.privacy}</Link>
        <span>
          {t.created}{" "}
          <a
            href="https://stixyrid.github.io/vexora-digital/"
            target="_blank"
            rel="noopener noreferrer"
          >
            VEXORA DIGITAL <ArrowUpRight size={12} />
          </a>
        </span>
      </div>
    </footer>
  );
}
function PageIntro({
  title,
  text,
  index,
}: {
  title: string;
  text: string;
  index: string;
}) {
  const { t } = useCopy();
  return (
    <section className="page-intro container">
      <Reveal>
        <span className="eyebrow muted">
          {t.location} <span className="intro-slash">/</span> NORD {index}
        </span>
        <h1>{title}</h1>
        <p>{text}</p>
      </Reveal>
    </section>
  );
}
function Contact() {
  const { t } = useCopy();
  return (
    <>
      <PageIntro title={t.contactTitle} text={t.contactText} index="05" />
      <div className="container contact-overview">
        <div>
          <span className="eyebrow muted">{t.demoContact}</span>
          <h3>{t.location}</h3>
          <p>{t.email}</p>
          <p>{t.phone}</p>
          <p className="fine-print">{t.address}</p>
        </div>
        <div className="map-placeholder">
          <div className="map-lines" />
          <MapPin size={30} strokeWidth={1} />
          <strong>{t.map}</strong>
          <p>{t.mapNote}</p>
        </div>
      </div>
      <Booking />
    </>
  );
}
function About() {
  const { t } = useCopy();
  return (
    <>
      <PageIntro title={t.aboutTitle} text={t.aboutIntro} index="04" />
      <div className="about-banner container">
        <Picture
          src="/images/hero.webp"
          alt="NORD fictional detailing studio — AI-generated concept"
          sizes="100vw"
        />
        <span>NORD / {t.precision}</span>
      </div>
      <section className="section container philosophy">
        <span className="eyebrow muted">{t.philosophyLabel}</span>
        <Reveal>
          <h2>{t.philosophy}</h2>
          <p>{t.philosophyText}</p>
          <p>{t.philosophySecond}</p>
          <p className="fine-print">{t.aboutNote}</p>
        </Reveal>
      </section>
      <Why />
      <Process />
      <Booking />
    </>
  );
}
function Privacy() {
  const { t } = useCopy();
  return (
    <>
      <PageIntro title={t.privacyTitle} text={t.privacyText} index="INFO" />
      <section className="container privacy-content">
        <h2>{t.imageCredit}</h2>
        <p>{t.creditText}</p>
        <ul>
          <li>
            <a
              href="https://unsplash.com/license"
              target="_blank"
              rel="noopener noreferrer"
            >
              Unsplash License <Arrow />
            </a>
          </li>
          <li>
            <a
              href="https://images.unsplash.com/photo-1503376780353-7e6692767b70"
              target="_blank"
              rel="noopener noreferrer"
            >
              Exterior / Unsplash
            </a>
          </li>
        </ul>
        <p>{t.rights}</p>
        <Link href="/" className="button">
          {t.back}
          <Arrow />
        </Link>
      </section>
    </>
  );
}
export default function Site({ page }: { page: Page }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  useEffect(() => {
    try {
      const saved = localStorage.getItem("nord-language");
      if (saved === "en" || saved === "et") setLocaleState(saved);
    } catch {}
  }, []);
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  const setLocale = (l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem("nord-language", l);
    } catch {}
  };
  const t = copy[locale];
  return (
    <Language.Provider value={{ locale, t, setLocale }}>
      <MotionConfig reducedMotion="user">
        <Header page={page} />
        <main id="main">
          {page === "home" ? (
            <>
              <Hero />
              <div className="brand-strip">
                <div className="container">
                  <span>{t.precision}</span>
                  <span className="brand-strip-right">
                    EST. CONCEPT <span>✦</span> {t.location}
                  </span>
                </div>
              </div>
              <Services />
              <Why />
              <Comparison />
              <Gallery preview />
              <Process />
              <Testimonial />
              <Booking />
            </>
          ) : page === "services" ? (
            <>
              <PageIntro
                title={t.servicesTitle}
                text={t.servicesText}
                index="02"
              />
              <Services full />
              <Process />
              <Booking />
            </>
          ) : page === "gallery" ? (
            <>
              <PageIntro
                title={t.galleryTitle}
                text={t.galleryText}
                index="03"
              />
              <Gallery />
              <Comparison />
              <Booking />
            </>
          ) : page === "about" ? (
            <About />
          ) : page === "contact" ? (
            <Contact />
          ) : (
            <Privacy />
          )}
        </main>
        <Footer />
      </MotionConfig>
    </Language.Provider>
  );
}
