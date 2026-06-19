import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Phone, Sparkles, Star, Quote } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import { useI18n } from "@/lib/i18n";
import { fetchMenu } from "@/lib/menu";
import { MenuItemCard } from "@/components/MenuItemCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Makan — Premium Nargile Lounge | Σέρρες" },
      { name: "description", content: "Premium nargile bar & lounge στις Σέρρες. Επιμελημένες γεύσεις, cocktails και ατμόσφαιρα που μένει." },
    ],
  }),
  component: Home,
});

function Home() {
  const { t, lang } = useI18n();
  const { data } = useQuery({ queryKey: ["menu"], queryFn: fetchMenu });

  const featured = (data?.items ?? []).filter((i: any) => i.is_featured).slice(0, 3);

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
        <img
          src={heroImg}
          alt="Makan lounge"
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/10 to-background" />
        <div className="absolute inset-0 bg-background/10" />

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center pt-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-background/40 backdrop-blur px-4 py-1.5 text-[11px] tracking-[0.25em] uppercase text-gold animate-fade-up">
            <Sparkles className="h-3 w-3" />
            {t("hero.eyebrow")}
          </div>

          <h1 className="mt-6 font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.02] tracking-tight animate-fade-up delay-100">
            <span className="text-gold-gradient">Makan</span>
            <span className="block mt-2 text-foreground text-3xl sm:text-4xl md:text-5xl font-light italic">
              {t("hero.title")}
            </span>
          </h1>

          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-up delay-300">
            <Link
              to="/menu"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gold-gradient px-8 py-4 text-sm font-semibold tracking-wider uppercase text-primary-foreground shadow-gold transition-transform hover:scale-[1.03]"
            >
              {t("hero.cta")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/reservations"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-gold/40 px-8 py-4 text-sm font-semibold tracking-wider uppercase text-gold hover:bg-gold/10 transition-colors"
            >
              <Phone className="h-4 w-4" />
              {t("hero.cta2")}
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      {featured.length > 0 && (
        <section className="py-20 sm:py-28 px-5 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <p className="text-[11px] tracking-[0.3em] uppercase text-gold">
                {lang === "el" ? "Επιλογές του Σεφ" : "Signature Picks"}
              </p>
              <h2 className="mt-3 font-display text-4xl sm:text-5xl text-foreground">
                {lang === "el" ? "Ξεχωριστές γεύσεις." : "Standout flavors."}
              </h2>
              <div className="gold-divider mt-6 max-w-xs mx-auto" />
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((item: any) => <MenuItemCard key={item.id} item={item} />)}
            </div>
            <div className="mt-12 text-center">
              <Link to="/menu" className="inline-flex items-center gap-2 text-gold hover:gap-3 transition-all">
                {t("hero.cta")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ABOUT TEASER */}
      <section 
        className="relative py-32 sm:py-56 px-5 sm:px-8 border-y border-border bg-fixed bg-center bg-cover"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        {/* Σκούρο overlay για να διαβάζεται τέλεια το κείμενο πάνω από τη φωτογραφία */}
        <div className="absolute inset-0 bg-background/85" />

        <div className="relative z-10 mx-auto max-w-5xl grid gap-12 md:grid-cols-2 items-center">
          <div>
            <p className="text-[11px] tracking-[0.3em] uppercase text-gold">{t("nav.about")}</p>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl text-foreground leading-tight">
              {t("about.title")}
            </h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">{t("about.p1")}</p>
            <p className="mt-3 text-muted-foreground leading-relaxed">{t("about.p2")}</p>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {[
              { v: "30+", l: t("about.stat1") },
              { v: "9h", l: t("about.stat2") },
              { v: "10k+", l: t("about.stat3") },
            ].map((s, i) => (
              <div key={i} className="rounded-xl border border-border bg-background/60 backdrop-blur-sm px-2 py-4 sm:p-5 text-center">
                <div className="font-display text-2xl sm:text-4xl text-gold-gradient">{s.v}</div>
                <div className="mt-2 text-[9px] sm:text-[10px] tracking-wider sm:tracking-[0.2em] uppercase text-muted-foreground break-words">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 sm:py-28 px-5 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <p className="text-[11px] tracking-[0.3em] uppercase text-gold">Reviews</p>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl">{t("testimonials.title")}</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {(lang === "el"
              ? [
                  { n: "Petros Kardoulakis", t: "Πολύ όμορφος και ζεστός χώρος είναι το ιδανικό μέρος για ναργιλέ !!" },
                  { n: "mr moustache", t: "Πολύ ωραίο μαγαζί για να απολαύσεις τον καφε σου η το ποτό σου. Οι ναργιλέδες είναι εξαιρετικής ποιότητας και το προσωπικό πολύ ευγενικό. Μπράβο στα παιδιά φοβερή δουλειά" },
                  { n: "Νικολας Τζιομαλλος", t: "Πολύ καλό μαγαζί, φοβερή εξυπηρέτηση από το προσωπικό και πολυ επαγγελματισμός , το συνιστώ να ερθετε!" },
                ]
              : [
                  { n: "Petros Kardoulakis", t: "Very beautiful and warm space, it is the ideal place for hookah!!" },
                  { n: "mr moustache", t: "Very nice shop to enjoy your coffee or your drink. The hookahs are of excellent quality and the staff is very kind. Well done to the guys, great job" },
                  { n: "Nikolas Tziomallos", t: "Very good shop, great service from the staff and very professional, I recommend you come!" },
                ]
            ).map((r, i) => (
              <figure key={i} className="rounded-xl border border-border/60 bg-card/40 p-6">
                <Quote className="h-6 w-6 text-gold/60" />
                <blockquote className="mt-4 text-foreground leading-relaxed">"{r.t}"</blockquote>
                <figcaption className="mt-5 flex items-center justify-between">
                  <span className="text-sm font-medium">{r.n}</span>
                  <span className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, k) => (
                      <Star key={k} className="h-3.5 w-3.5 fill-gold text-gold" />
                    ))}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}