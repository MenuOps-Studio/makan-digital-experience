import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "el" | "en";

type Dict = Record<string, { el: string; en: string }>;

const dict: Dict = {
  "nav.home": { el: "Αρχική", en: "Home" },
  "nav.menu": { el: "Μενού", en: "Menu" },
  "nav.about": { el: "Σχετικά", en: "About" },
  "nav.contact": { el: "Επικοινωνία", en: "Contact" },

  "hero.eyebrow": { el: "Premium Nargile Lounge — Σέρρες", en: "Premium Nargile Lounge — Serres" },
  "hero.title": { el: "Μια εμπειρία πέρα από τον καπνό.", en: "An experience beyond the smoke." },
  "hero.subtitle": {
    el: "Καλωσορίσατε στο Makan. Επιμελημένες γεύσεις, premium ναργιλέδες και ατμόσφαιρα που μένει.",
    en: "Welcome to Makan. Curated flavors, premium hookahs and an atmosphere that lingers.",
  },
  "hero.cta": { el: "Δείτε το Μενού", en: "View Menu" },
  "hero.cta2": { el: "Κράτηση Τραπεζιού", en: "Book a Table" },

  "menu.title": { el: "Το Μενού μας", en: "Our Menu" },
  "menu.subtitle": { el: "Γεύσεις επιλεγμένες με προσοχή στη λεπτομέρεια.", en: "Flavors curated with attention to detail." },
  "menu.search": { el: "Αναζήτηση...", en: "Search..." },
  "menu.empty": { el: "Δεν βρέθηκαν προϊόντα.", en: "No items found." },
  "menu.all": { el: "Όλα", en: "All" },

  "badge.signature": { el: "Signature", en: "Signature" },
  "badge.best-seller": { el: "Best Seller", en: "Best Seller" },
  "badge.new": { el: "Νέο", en: "New" },
  "badge.vegan": { el: "Vegan", en: "Vegan" },
  "badge.vegetarian": { el: "Vegetarian", en: "Vegetarian" },
  "badge.classic": { el: "Κλασικό", en: "Classic" },

  "about.title": { el: "Η Ιστορία του Makan", en: "The Makan Story" },
  "about.p1": {
    el: "Το Makan γεννήθηκε από την αγάπη για την τελειότητα. Συνδυάζουμε την παράδοση του ναργιλέ με μια σύγχρονη, premium εμπειρία.",
    en: "Makan was born from a love for the craft. We blend the tradition of nargile with a modern, premium experience.",
  },
  "about.p2": {
    el: "Κάθε λεπτομέρεια — από τις γεύσεις που επιλέγουμε μέχρι το φως που πέφτει στο τραπέζι σας — είναι σχεδιασμένη για να σας προσφέρει ένα μοναδικό βράδυ.",
    en: "Every detail — from the flavors we curate to the light falling on your table — is designed to give you an unforgettable evening.",
  },
  "about.stat1": { el: "Premium Γεύσεις", en: "Premium Flavors" },
  "about.stat2": { el: "Ωρες Λειτουργίας", en: "Hours Open" },
  "about.stat3": { el: "Ικανοποιημένοι Πελάτες", en: "Happy Guests" },

  "testimonials.title": { el: "Τι λένε για εμάς", en: "What guests say" },

  "contact.title": { el: "Επισκεφθείτε μας", en: "Visit Us" },
  "contact.address": { el: "Διεύθυνση", en: "Address" },
  "contact.phone": { el: "Τηλέφωνο", en: "Phone" },
  "contact.hours": { el: "Ώρες Λειτουργίας", en: "Opening Hours" },
  "contact.hours.value": { el: "Καθημερινά 18:00 – 03:00", en: "Daily 6:00 PM – 3:00 AM" },
  "contact.directions": { el: "Οδηγίες", en: "Get Directions" },

  "footer.tagline": { el: "Premium Nargile Lounge", en: "Premium Nargile Lounge" },
  "footer.rights": { el: "Με επιφύλαξη παντός δικαιώματος.", en: "All rights reserved." },
};

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: string) => string }>({
  lang: "el",
  setLang: () => {},
  t: (k) => k,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("el");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? (localStorage.getItem("makan-lang") as Lang | null) : null;
    if (stored === "el" || stored === "en") setLangState(stored);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("makan-lang", l);
  };

  const t = (k: string) => dict[k]?.[lang] ?? k;

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export const useI18n = () => useContext(Ctx);
