import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Calendar, Clock, Users, Phone, User, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/reservations")({
  component: ReservationPage,
});

const SUPABASE_URL = 'https://yolfsfforkibqvagahoq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvbGZzZmZvcmtpYnF2YWdhaG9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1NDgxNTgsImV4cCI6MjA5NTEyNDE1OH0.vjjYyAag1TPK4trtUaESc8UAZXtefect-cDG9abSpqg';

function ReservationPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const data = {
      restaurant_id: 1,
      name: formData.get("name"),
      phone: formData.get("phone"),
      date: formData.get("date"),
      time: formData.get("time"),
      guests: formData.get("guests"),
      status: "PENDING"
    };

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/reservations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
          "Prefer": "return=minimal" // ΣΗΜΑΝΤΙΚΟ: Λέει στο Supabase να αποθηκεύσει χωρίς να επιστρέψει δεδομένα
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        // Αν το Supabase το απορρίψει, τώρα θα μας πει ακριβώς το γιατί!
        const errorData = await response.json();
        console.error("Supabase Error:", errorData);
        alert("Σφάλμα Βάσης: " + (errorData.message || "Αποτυχία αποθήκευσης"));
      }
    } catch (error) {
      alert("Κάτι πήγε στραβά με τη σύνδεση. Παρακαλώ δοκιμάστε ξανά.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-gold hover:text-gold-light transition-colors mb-8 text-sm uppercase tracking-widest">
          <ArrowLeft size={16} /> Επιστροφή
        </Link>

        {success ? (
          <div className="bg-card/40 border border-gold/30 rounded-2xl p-12 text-center animate-fade-up">
            <CheckCircle2 className="w-16 h-16 text-gold mx-auto mb-6" />
            <h2 className="font-display text-4xl text-foreground mb-4">Το αίτημά σας εστάλη!</h2>
            <p className="text-muted-foreground mb-8">
              Λάβαμε την κράτησή σας. Σύντομα ένας εκπρόσωπός μας θα επικοινωνήσει μαζί σας τηλεφωνικά για την επιβεβαίωση.
            </p>
            <Link to="/" className="inline-block px-8 py-4 rounded-full bg-gold-gradient text-background font-semibold uppercase tracking-wider text-sm">
              Επιστροφη στην Αρχικη
            </Link>
          </div>
        ) : (
          <div className="bg-card/30 border border-border rounded-2xl p-8 sm:p-12 animate-fade-up">
            <div className="text-center mb-10">
              <p className="text-[11px] tracking-[0.3em] uppercase text-gold mb-3">Online Booking</p>
              <h1 className="font-display text-4xl sm:text-5xl text-foreground">Κράτηση Τραπεζιού</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2"><User size={14}/> Ονοματεπώνυμο</label>
                  <input type="text" name="name" required className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-gold transition-colors" placeholder="π.χ. Γιάννης Παππάς" />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2"><Phone size={14}/> Τηλέφωνο</label>
                  <input type="tel" name="phone" required className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-gold transition-colors" placeholder="π.χ. 6900000000" />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2"><Calendar size={14}/> Ημερομηνία</label>
                  <input type="date" name="date" required className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-gold transition-colors" style={{colorScheme: 'dark'}} />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2"><Clock size={14}/> Ώρα</label>
                  <input type="time" name="time" required className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-gold transition-colors" style={{colorScheme: 'dark'}} />
                </div>
                <div className="sm:col-span-2">
                  <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2"><Users size={14}/> Αριθμός Ατόμων</label>
                  <select name="guests" className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-gold transition-colors appearance-none">
                    <option value="1">1 Άτομο</option>
                    <option value="2" selected>2 Άτομα</option>
                    <option value="3">3 Άτομα</option>
                    <option value="4">4 Άτομα</option>
                    <option value="5">5 Άτομα</option>
                    <option value="6+">6+ Άτομα (Επικοινωνήστε μαζί μας)</option>
                  </select>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full mt-8 bg-gold-gradient text-background font-bold py-4 rounded-full uppercase tracking-widest text-sm hover:scale-[1.02] transition-transform disabled:opacity-50">
                {loading ? "Αποστολη..." : "Ολοκληρωση Κρατησης"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}