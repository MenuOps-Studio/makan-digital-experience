import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, MapPin } from "lucide-react";
import { useI18n } from "@/lib/i18n";

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
              <a href="#" className="p-2 rounded-full border border-border hover:border-gold hover:text-gold transition-colors" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-full border border-border hover:border-gold hover:text-gold transition-colors" aria-label="Facebook">
                <Facebook className="h-4 w-4" />
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
