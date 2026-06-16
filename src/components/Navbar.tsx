import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { to: "/", label: t("nav.home") },
    { to: "/menu", label: t("nav.menu") },
    { to: "/about", label: t("nav.about") },
    { to: "/contact", label: t("nav.contact") },
  ] as const;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled || open
          ? "bg-background/85 backdrop-blur-xl border-b border-border"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group" onClick={() => setOpen(false)}>
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2PPGvJZJzwy5UV_z2qjTAIFpRtbvAP7QHD1d2dcWoTwiNqLR_-_ucA29-&s=10" 
              alt="Makan Logo" 
              className="h-16 md:h-20 w-auto object-contain"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-9">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                className="text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors relative py-2"
                activeProps={{ className: "text-gold" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <button
              className="md:hidden p-2 -mr-2 text-foreground"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {open && (
          <nav className="md:hidden pb-6 pt-2 flex flex-col gap-1 animate-fade-in">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: l.to === "/" }}
                className="px-3 py-3 rounded-lg text-base text-muted-foreground hover:text-gold hover:bg-secondary/40 transition-colors"
                activeProps={{ className: "text-gold bg-secondary/40" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
