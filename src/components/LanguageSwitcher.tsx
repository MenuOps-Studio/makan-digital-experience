import { useI18n, type Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const { lang, setLang } = useI18n();
  const options: { value: Lang; label: string }[] = [
    { value: "el", label: "EL" },
    { value: "en", label: "EN" },
  ];
  return (
    <div className="inline-flex items-center rounded-full border border-border bg-background/40 p-0.5 backdrop-blur">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => setLang(o.value)}
          className={cn(
            "px-3 py-1 text-xs font-medium tracking-wider rounded-full transition-all",
            lang === o.value
              ? "bg-gold-gradient text-primary-foreground shadow-gold"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
