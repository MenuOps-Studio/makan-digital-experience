import { Link } from "@tanstack/react-router";
import { Instagram, MapPin } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
  </svg>
);

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="font-display text-3xl text-gold-gradient">Makan</div>
            <p className="mt-2 text-sm text-muted-foreground tracking-wide uppercase">
              {t("footer.tagline")}
            </p>
            <div className="mt-5 flex gap-3">
              <a href="https://www.instagram.com/makanrooftop/" target="_blank" rel="noreferrer" className="p-2 rounded-full border border-border hover:border-gold hover:text-gold transition-colors" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://www.tiktok.com/@makan.serres" target="_blank" rel="noreferrer" className="p-2 rounded-full border border-border hover:border-gold hover:text-gold transition-colors" aria-label="TikTok">
                <TikTokIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold tracking-[0.2em] uppercase text-gold mb-4">
              {t("contact.address")}
            </h4>
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-gold" />
              <span>Π. Τσαλδάρη 18<br />Σέρρες 621 23</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              <span className="block text-foreground">{t("contact.hours")}</span>
              {t("contact.hours.value")}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold tracking-[0.2em] uppercase text-gold mb-4">
              {t("nav.menu")}
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-muted-foreground hover:text-gold">{t("nav.home")}</Link></li>
              <li><Link to="/menu" className="text-muted-foreground hover:text-gold">{t("nav.menu")}</Link></li>
              <li><Link to="/about" className="text-muted-foreground hover:text-gold">{t("nav.about")}</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-gold">{t("nav.contact")}</Link></li>
            </ul>
          </div>
        </div>

        <div className="gold-divider mt-12" />
        <p className="mt-6 text-xs text-muted-foreground text-center tracking-wider">
          © {new Date().getFullYear()} MAKAN · {t("footer.rights")}
        </p>
      </div>
    </footer>
  );
}
