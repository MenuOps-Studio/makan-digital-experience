import { useI18n } from "@/lib/i18n";
import type { MenuItem } from "@/lib/menu";
import { Sparkles, Flame, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

function Badge({ kind }: { kind: string }) {
  const { t } = useI18n();
  const map: Record<string, { icon?: React.ReactNode; className: string }> = {
    signature: { icon: <Sparkles className="h-3 w-3" />, className: "bg-gold-gradient text-primary-foreground" },
    "best-seller": { icon: <Flame className="h-3 w-3" />, className: "border border-gold/50 text-gold" },
    new: { className: "border border-gold/40 text-gold-soft" },
    vegan: { icon: <Leaf className="h-3 w-3" />, className: "border border-emerald-500/40 text-emerald-400" },
    vegetarian: { icon: <Leaf className="h-3 w-3" />, className: "border border-emerald-500/30 text-emerald-300/80" },
    classic: { className: "border border-border text-muted-foreground" },
  };
  const cfg = map[kind] ?? map.classic;
  return (
    <span className={cn("inline-flex items-center gap-1 text-[10px] font-semibold tracking-[0.15em] uppercase rounded-full px-2.5 py-0.5", cfg.className)}>
      {cfg.icon}
      {/* Fallback text αν δεν βρεθεί μετάφραση */}
      {t(`badge.${kind}`) || kind}
    </span>
  );
}

// Προσθέτουμε το status δυναμικά στο type
// Προσθέτουμε το status δυναμικά στο type
export function MenuItemCard({ item }: { item: MenuItem & { status?: string } }) {
  const { lang } = useI18n();
  const name = lang === "el" ? item.name_el : item.name_en;
  const desc = lang === "el" ? item.description_el : item.description_en;

  // Διαχωρίζουμε τις δύο καταστάσεις
  const isUnavailableToday = item.status === "UNAVAILABLE_TODAY";
  const isPermanentlyUnavailable = item.status === "UNAVAILABLE";
  const isUnavailable = isUnavailableToday || isPermanentlyUnavailable;

  return (
    <article className={cn(
      "group relative rounded-xl border border-border/60 bg-card/40 p-5 transition-all duration-500",
      isUnavailable ? "opacity-50 grayscale-[30%] pointer-events-none" : "hover:border-gold/50 hover:bg-card/80 hover:shadow-gold"
    )}>
      <div className="flex items-baseline justify-between gap-4">
        <h3 className={cn(
          "font-display text-xl sm:text-2xl leading-tight",
          isUnavailable ? "text-muted-foreground line-through" : "text-foreground"
        )}>
          {name}
        </h3>
        <div className="flex items-center gap-1 shrink-0">
          {isUnavailable ? (
            // Δυναμικό κείμενο ανάλογα με τον τύπο έλλειψης!
            <span className="text-xs sm:text-sm font-bold text-red-400 uppercase tracking-wider bg-red-950/30 border border-red-900/50 px-2.5 py-1 rounded-md">
              {isUnavailableToday 
                ? (lang === "el" ? "Εξαντλήθηκε" : "Sold Out") 
                : (lang === "el" ? "Μη Διαθέσιμο" : "Unavailable")}
            </span>
          ) : (
            // Κανονική εμφάνιση τιμής
            <>
              <span className="font-display text-xl sm:text-2xl text-gold tabular-nums">
                {item.price.toFixed(2)}
              </span>
              <span className="text-gold/70 text-sm">€</span>
            </>
          )}
        </div>
      </div>
      
      {desc && (
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {desc}
        </p>
      )}
      
      {item.badges && item.badges.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {item.badges.map((b) => <Badge key={b} kind={b.toLowerCase()} />)}
        </div>
      )}
    </article>
  );
}