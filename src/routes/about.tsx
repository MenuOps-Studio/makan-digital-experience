import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { Sparkles, Award, Heart } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Σχετικά · Makan Nargile Lounge" },
      { name: "description", content: "Η ιστορία και οι αξίες του Makan — premium nargile lounge στις Σέρρες." },
      { property: "og:title", content: "About · Makan" },
      { property: "og:description", content: "The story and values behind Makan." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { t, lang } = useI18n();
  const values = lang === "el"
    ? [
        { icon: Sparkles, t: "Premium Επιλογή", d: "Κάθε γεύση και κάθε ποτό επιλέγεται με προσοχή στη λεπτομέρεια." },
        { icon: Award, t: "Άψογη Ποιότητα", d: "Συνεργαζόμαστε μόνο με τους κορυφαίους προμηθευτές στον κλάδο." },
        { icon: Heart, t: "Φιλοξενία", d: "Το πλήρωμά μας θα κάνει την επίσκεψή σας πραγματικά μοναδική." },
      ]
    : [
        { icon: Sparkles, t: "Premium Selection", d: "Every flavor and drink is curated with attention to detail." },
        { icon: Award, t: "Flawless Quality", d: "We only work with the leading suppliers in the industry." },
        { icon: Heart, t: "Hospitality", d: "Our team will make your visit truly unforgettable." },
      ];

  return (
    <div className="pt-28 sm:pt-32 pb-20 px-5 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <p className="text-[11px] tracking-[0.3em] uppercase text-gold">About</p>
          <h1 className="mt-3 font-display text-5xl sm:text-6xl text-foreground">{t("about.title")}</h1>
          <div className="gold-divider mt-6 max-w-xs mx-auto" />
        </div>

        <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
          <p>{t("about.p1")}</p>
          <p>{t("about.p2")}</p>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {values.map((v, i) => (
            <div key={i} className="rounded-xl border border-border/60 bg-card/40 p-6 hover:border-gold/40 transition-colors">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold-gradient text-primary-foreground shadow-gold">
                <v.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-xl text-foreground">{v.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{v.d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
