import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone, Mail, Clock, ExternalLink } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Επικοινωνία · Makan Nargile Lounge" },
      { name: "description", content: "Επικοινωνία και τοποθεσία Makan — Π. Τσαλδάρη 18, Σέρρες 621 23." },
      { property: "og:title", content: "Contact · Makan" },
      { property: "og:description", content: "Find us at P. Tsaldari 18, Serres 621 23." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { t } = useI18n();
  const address = "Π. Τσαλδάρη 18, Σέρρες 621 23";
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  const embedUrl = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

  return (
    <div className="pt-28 sm:pt-32 pb-20 px-5 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <p className="text-[11px] tracking-[0.3em] uppercase text-gold">Contact</p>
          <h1 className="mt-3 font-display text-5xl sm:text-6xl">{t("contact.title")}</h1>
          <div className="gold-divider mt-6 max-w-xs mx-auto" />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <ContactCard icon={MapPin} title={t("contact.address")} value="Π. Τσαλδάρη 18, Σέρρες 621 23" />
            <ContactCard icon={Phone} title={t("contact.phone")} value="+30 23210 00000" href="tel:+302321000000" />
            <ContactCard icon={Mail} title="Email" value="info@makan.gr" href="mailto:info@makan.gr" />
            <ContactCard icon={Clock} title={t("contact.hours")} value={t("contact.hours.value")} />

            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gold-gradient px-6 py-3 text-sm font-semibold tracking-wider uppercase text-primary-foreground shadow-gold hover:scale-[1.02] transition-transform"
            >
              {t("contact.directions")}
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <div className="rounded-xl overflow-hidden border border-border/60 bg-card/40 min-h-[400px]">
            <iframe
              src={embedUrl}
              title="Makan location"
              className="w-full h-full min-h-[400px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactCard({
  icon: Icon,
  title,
  value,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  href?: string;
}) {
  const Inner = (
    <div className="flex items-start gap-4 rounded-xl border border-border/60 bg-card/40 p-5 hover:border-gold/40 transition-colors">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold-gradient text-primary-foreground">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className="text-[10px] tracking-[0.25em] uppercase text-gold">{title}</div>
        <div className="mt-1 text-foreground">{value}</div>
      </div>
    </div>
  );
  return href ? <a href={href}>{Inner}</a> : Inner;
}
