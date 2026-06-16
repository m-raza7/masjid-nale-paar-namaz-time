import { Link } from "@tanstack/react-router";
import { Menu, Moon } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const nav: { to: string; label: string; external?: boolean }[] = [
  { to: "/", label: "Home" },
  { to: "/prayer-times", label: "Prayer Times" },
  { to: "/announcements", label: "Announcements" },
  { to: "/events", label: "Events" },
  {
    to: "https://madarsa-nale-paar.vercel.app/",
    label: "Madarsa - Nale Paar",
    external: true,
  },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-gold shadow-gold">
            <Moon className="h-5 w-5 text-gold-foreground" />
          </span>
          <div className="min-w-0 leading-tight">
            <div className="truncate font-display text-xl font-semibold">Nale-paar Masjid</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Azan &amp; Timetable
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((n) =>
            n.external ? (
              <a
                key={n.label}
                href={n.to}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {n.label}
              </a>
            ) : (
              <Link
                key={n.to}
                to={n.to}
                className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                activeProps={{ className: "bg-accent text-foreground" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ),
          )}
        </nav>
        {/* <a
            href="https://madarsa-nale-paar.vercel.app/"
            className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            Madarsa - Nale Paar
          </a> */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            to="/admin/login"
            className="hidden rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 sm:inline-flex"
          >
            Admin
          </Link>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="mt-8 flex flex-col gap-1">
                {nav.map((n) => (
                  <Link
                    key={n.to}
                    to={n.to}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    activeProps={{ className: "bg-accent text-foreground" }}
                    activeOptions={{ exact: n.to === "/" }}
                  >
                    {n.label}
                  </Link>
                ))}
                <Link
                  to="/admin/login"
                  onClick={() => setOpen(false)}
                  className="mt-4 rounded-xl bg-primary px-4 py-3 text-center text-base font-medium text-primary-foreground"
                >
                  Admin
                </Link>
              </div>
            </SheetContent>
          </Sheet>
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
          <div className="font-display text-2xl">Nale-paar Masjid</div>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            Serving the community with daily prayers, Jumuah, and education. Updated prayer times by
            the masjid administration.
          </p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-gold">Visit</div>
          <p className="mt-3 text-sm text-muted-foreground">
            123 Crescent Lane
            <br />
            City, Country
          </p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-gold">Contact</div>
          <p className="mt-3 text-sm text-muted-foreground">
            +1 (555) 123-4567
            <br />
            info@alnoor.masjid
          </p>
        </div>
      </div>
      <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Nale-paar Masjid. All times subject to change.
      </div>
    </footer>
  );
}
