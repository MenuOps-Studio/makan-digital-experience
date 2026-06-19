import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query"; // ΠΡΟΣΘΗΚΗ: useQueryClient
import { useMemo, useState, useEffect } from "react"; // ΠΡΟΣΘΗΚΗ: useEffect
import { Search } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { fetchMenu } from "@/lib/menu";
import { MenuItemCard } from "@/components/MenuItemCard";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client"; // ΠΡΟΣΘΗΚΗ: supabase

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Μενού · Makan Nargile Lounge" },
      { name: "description", content: "Δείτε το πλήρες μενού του Makan: premium ναργιλέδες, cocktails, καφέ και snacks." },
      { property: "og:title", content: "Menu · Makan" },
      { property: "og:description", content: "Premium nargile, cocktails, coffee & snacks." },
    ],
  }),
  component: MenuPage,
});

function MenuPage() {
  const { t, lang } = useI18n();
  const queryClient = useQueryClient(); // ΠΡΟΣΘΗΚΗ: Εργαλείο για ανανέωση του cache
  const { data, isLoading } = useQuery({ queryKey: ["menu"], queryFn: fetchMenu });

  const [active, setActive] = useState<string>("all");
  const [query, setQuery] = useState("");

  const items = data?.items ?? [];

  // --- ΝΕΟΣ ΚΩΔΙΚΑΣ: SUPABASE REAL-TIME ---
  useEffect(() => {
    // Φτιάχνουμε το "κανάλι" επικοινωνίας με τη βάση
    const channel = supabase
      .channel('realtime-menu-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'menu_items' },
        () => {
          // Μόλις αλλάξει κάτι, λέμε στο React Query να φέρει αθόρυβα τα νέα δεδομένα
          queryClient.invalidateQueries({ queryKey: ["menu"] });
        }
      )
      .subscribe();

    // Κλείνουμε το κανάλι αν ο χρήστης φύγει από τη σελίδα (για να μην βαραίνει το κινητό του)
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
  // ----------------------------------------

  // 1. Δημιουργούμε τις κατηγορίες δυναμικά από τα πιάτα
  const categories = useMemo(() => {
    const uniqueCats = new Map();
    items.forEach((item: any) => {
      if (!item.category) return; 
      if (!uniqueCats.has(item.category)) {
        uniqueCats.set(item.category, {
          id: item.category,
          slug: item.category.toLowerCase().replace(/\s+/g, '-'),
          name_el: item.category,
          name_en: item.category_en || item.category 
        });
      }
    });
    return Array.from(uniqueCats.values());
  }, [items]);

  // 2. Ομαδοποιούμε τα πιάτα με βάση τις δυναμικές κατηγορίες
  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    return categories
      .filter((c) => active === "all" || c.slug === active)
      .map((cat) => ({
        cat,
        items: items
          .filter((i: any) => i.category === cat.id && i.status !== 'HIDDEN')
          .filter((i: any) => {
            if (!q) return true;
            const name = (lang === "el" ? i.name_el : i.name_en || "").toLowerCase();
            const desc = ((lang === "el" ? i.description_el : i.description_en) || "").toLowerCase();
            return name.includes(q) || desc.includes(q);
          }),
      }))
      .filter((g) => g.items.length > 0);
  }, [categories, items, active, query, lang]);

  return (
    <div className="pt-28 sm:pt-32 pb-20 px-5 sm:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-[11px] tracking-[0.3em] uppercase text-gold">Menu</p>
          <h1 className="mt-3 font-display text-5xl sm:text-6xl text-foreground">{t("menu.title")}</h1>
          <p className="mt-3 text-muted-foreground">{t("menu.subtitle")}</p>
          <div className="gold-divider mt-6 max-w-xs mx-auto" />
        </div>

        {/* Search */}
        <div className="relative max-w-md mx-auto mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("menu.search")}
            className="w-full rounded-full border border-border bg-card/40 backdrop-blur pl-11 pr-5 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/30 transition-all"
          />
        </div>

        {/* Category pills */}
        <div className="mb-10 flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 sm:justify-center sm:flex-wrap scrollbar-none">
          <CategoryPill active={active === "all"} onClick={() => setActive("all")}>
            {t("menu.all")}
          </CategoryPill>
          {categories.map((c) => (
            <CategoryPill key={c.id} active={active === c.slug} onClick={() => setActive(c.slug)}>
              {lang === "el" ? c.name_el : c.name_en}
            </CategoryPill>
          ))}
        </div>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="grid gap-5 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-32 rounded-xl border border-border/40 bg-card/30 animate-pulse" />
            ))}
          </div>
        )}

        {/* Empty */}
        {!isLoading && grouped.length === 0 && (
          <p className="text-center text-muted-foreground py-20">{t("menu.empty")}</p>
        )}

        {/* Groups */}
        <div className="space-y-16">
          {grouped.map(({ cat, items }) => (
            <section key={cat.id} id={cat.slug}>
              <div className="mb-6 flex items-baseline justify-between gap-4">
                <h2 className="font-display text-3xl sm:text-4xl text-gold-gradient">
                  {lang === "el" ? cat.name_el : cat.name_en}
                </h2>
                <span className="shrink-0 whitespace-nowrap text-xs tracking-[0.2em] uppercase text-muted-foreground">
                  {items.length} {lang === "el" ? "προϊόντα" : "items"}
                </span>
              </div>
              <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
                {items.map((item) => <MenuItemCard key={item.id} item={item} />)}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

function CategoryPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full px-5 py-2 text-sm tracking-wide transition-all whitespace-nowrap",
        active
          ? "bg-gold-gradient text-primary-foreground shadow-gold"
          : "border border-border text-muted-foreground hover:text-gold hover:border-gold/40",
      )}
    >
      {children}
    </button>
  );
}