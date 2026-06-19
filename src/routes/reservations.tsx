import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Calendar, Clock, Users, Mail, User, CheckCircle2, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/reservations")({
  component: ReservationPage,
});

const SUPABASE_URL = 'https://yolfsfforkibqvagahoq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvbGZzZmZvcmtpYnF2YWdhaG9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1NDgxNTgsImV4cCI6MjA5NTEyNDE1OH0.vjjYyAag1TPK4trtUaESc8UAZXtefect-cDG9abSpqg';

function ReservationPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isFull, setIsFull] = useState(false); // ΝΕΟ: Κατάσταση για "Γεμάτη Ώρα"

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const selectedTime = formData.get("time") as string;
    const selectedDate = formData.get("date") as string;
    
    // Έλεγχος ασφαλείας: Βεβαιωνόμαστε ότι η ώρα λήγει σε 00, 15, 30 ή 45
    const minutes = selectedTime.split(":")[1];
    if (!["00", "15", "30", "45"].includes(minutes)) {
      alert("Παρακαλώ επιλέξτε ώρα ανά τέταρτο (π.χ. 20:00, 20:15, 20:30, 20:45).");
      return;
    }

    setLoading(true);

    try {
      // --- ΕΛΕΓΧΟΣ ΜΕ ΑΣΦΑΛΗ ΜΕΤΡΗΤΗ (RPC) ---
      const checkResponse = await fetch(
        `${SUPABASE_URL}/rest/v1/rpc/count_reservations`, 
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": SUPABASE_ANON_KEY,
            "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({ check_date: selectedDate, check_time: selectedTime })
        }
      );

      // Αν το Supabase πετάξει σφάλμα (π.χ. 404, 500)
      if (!checkResponse.ok) {
        console.error("Σφάλμα Μετρητή:", await checkResponse.text());
        alert("Υπήρξε πρόβλημα με τον έλεγχο διαθεσιμότητας. Παρακαλώ προσπαθήστε ξανά.");
        setLoading(false);
        return; 
      }

      const count = await checkResponse.json();
      console.log(`Ο μετρητής βρήκε ${count} κρατήσεις.`);
      
      if (count >= 5) {
        // ΑΝΤΙ ΓΙΑ ALERT: Εμφανίζουμε το όμορφο UI που φτιάξαμε!
        setIsFull(true);
        setLoading(false);
        return;
      }
      // ---------------------------------------------

      const data = {
        restaurant_id: 4,
        name: formData.get("name"),
        email: formData.get("email"),
        date: selectedDate,
        time: selectedTime,
        guests: formData.get("guests"),
        status: "PENDING"
      };

      const response = await fetch(`${SUPABASE_URL}/rest/v1/reservations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
          "Prefer": "return=minimal"
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        // --- ΔΙΟΡΘΩΣΗ: Προσθήκη await και διαχείριση σφάλματος ---
        if (formData.get("email")) {
          try {
            const emailRes = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                service_id: 'service_t7rq0kq',
                template_id: 'template_eznjue9',
                user_id: 'TR0cDisVNKLl4sAOE',
                template_params: {
                  name: formData.get("name"),
                  email: formData.get("email"),
                  date: selectedDate,
                  time: selectedTime,
                  guests: formData.get("guests"),
                  status_message: "Λάβαμε το αίτημα κράτησής σας και βρίσκεται σε ΑΝΑΜΟΝΗ. Μόλις ελέγξουμε τη διαθεσιμότητα, θα λάβετε νέο email επιβεβαίωσης!",
                  color: "#f59e0b"
                }
              })
            });

            if (!emailRes.ok) {
               const errText = await emailRes.text();
               console.error("Σφάλμα EmailJS:", errText);
            } else {
               console.log("Το email αναμονής στάλθηκε επιτυχώς!");
            }
          } catch (err) {
            console.error("Σφάλμα σύνδεσης με EmailJS:", err);
          }
        }
        
        setSuccess(true); // Το βάζουμε στο τέλος, αφού προσπαθήσουμε να στείλουμε το email
      }
    } 
    catch (error) {
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

        {/* 1. ΟΘΟΝΗ ΕΠΙΤΥΧΙΑΣ */}
        {success ? (
          <div className="bg-card/40 border border-gold/30 rounded-2xl p-12 text-center animate-fade-up">
            <CheckCircle2 className="w-16 h-16 text-gold mx-auto mb-6" />
            <h2 className="font-display text-4xl text-foreground mb-4">Το αίτημά σας εστάλη!</h2>
            <p className="text-muted-foreground mb-8">
              Λάβαμε την κράτησή σας. Μόλις το αίτημά σας εξεταστεί, θα λάβετε ένα ενημερωτικό email με την κατάσταση της κράτησής σας.
            </p>
            <Link to="/" className="inline-block px-8 py-4 rounded-full bg-gold-gradient text-background font-semibold uppercase tracking-wider text-sm">
              Επιστροφη στην Αρχικη
            </Link>
          </div>
        ) 
        
        /* 2. ΟΘΟΝΗ ΜΗ ΔΙΑΘΕΣΙΜΗΣ ΩΡΑΣ (ΝΕΟ) */
        : isFull ? (
          <div className="bg-card/40 border border-amber-500/30 rounded-2xl p-12 text-center animate-fade-up">
            <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-6" />
            <h2 className="font-display text-4xl text-foreground mb-4">Η ώρα δεν είναι διαθέσιμη</h2>
            <p className="text-muted-foreground mb-8">
              Λυπούμαστε, αλλά για τη συγκεκριμένη ώρα έχουν ήδη συμπληρωθεί οι διαθέσιμες κρατήσεις. Παρακαλώ προσπαθήστε για κάποια άλλη ώρα ή ημέρα.
            </p>
            {/* Αυτό το κουμπί μηδενίζει το isFull και τον γυρνάει πίσω στη φόρμα */}
            <button onClick={() => setIsFull(false)} className="inline-block px-8 py-4 rounded-full border border-border bg-background/50 text-foreground hover:bg-card/80 hover:border-gold/50 transition-colors font-semibold uppercase tracking-wider text-sm">
              ΕΠΙΛΟΓΗ ΑΛΛΗΣ ΩΡΑΣ
            </button>
          </div>
        ) 
        
        /* 3. Η ΚΛΑΣΙΚΗ ΦΟΡΜΑ */
        : (
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
                  <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2"><Mail size={14}/> Email</label>
                  <input type="email" name="email" required className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-gold transition-colors" placeholder="π.χ. email@example.com" />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2"><Calendar size={14}/> Ημερομηνία</label>
                  <input type="date" name="date" required className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-gold transition-colors" style={{colorScheme: 'dark'}} />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2"><Clock size={14}/> Ώρα</label>
                  <input type="time" name="time" step="900" required className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-gold transition-colors" style={{colorScheme: 'dark'}} />
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