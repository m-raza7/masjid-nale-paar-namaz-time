import { Link } from "@tanstack/react-router";
import { Moon } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const nav = [
  { to: "/", label: "Home" },
  { to: "/prayer-times", label: "Prayer Times" },
  { to: "/monthly-timetable", label: "Monthly" },
  { to: "/announcements", label: "Announcements" },
  { to: "/events", label: "Events" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-gold shadow-gold">
            <Moon className="h-5 w-5 text-gold-foreground" />
          </span>
          <div className="leading-tight">
            <div className="font-display text-xl font-semibold">Al-Noor Masjid</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Azan &amp; Timetable</div>
          </div>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              activeProps={{ className: "bg-accent text-foreground" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            to="/admin/login"
            className="hidden rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 sm:inline-flex"
          >
            Admin
          </Link>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-muted/40">
      <div className="container mx-auto grid gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <div className="font-display text-2xl">Al-Noor Masjid</div>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            Serving the community with daily prayers, Jumuah, and education. Updated prayer times by the masjid administration.
          </p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-gold">Visit</div>
          <p className="mt-3 text-sm text-muted-foreground">123 Crescent Lane<br />City, Country</p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-gold">Contact</div>
          <p className="mt-3 text-sm text-muted-foreground">+1 (555) 123-4567<br />info@alnoor.masjid</p>
        </div>
      </div>
      <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Al-Noor Masjid. All times subject to change.
      </div>
    </footer>
  );
}
