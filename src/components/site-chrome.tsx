import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useState } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

import logoImg from "../assets/nale-paar.jpeg";

/* ========================================================= */
/* PUBLIC NAVIGATION */
/* ========================================================= */

const nav: {
  to: string;
  label: string;
  external?: boolean;
}[] = [
  {
    to: "/",
    label: "Home",
  },
  {
    to: "/prayer-times",
    label: "Prayer Times",
  },
  {
    to: "/announcements",
    label: "Announcements",
  },
  {
    to: "/events",
    label: "Events",
  },
  {
    to: "/gallery",
    label: "Gallery",
  },
  {
    to: "https://madarsa-nale-paar.vercel.app/",
    label: "Madarsa",
    external: true,
  },
];

/* ========================================================= */
/* SITE HEADER */
/* ========================================================= */

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        {/* ================================================= */}
        {/* LOGO / BRAND */}
        {/* ================================================= */}

        <div className="flex min-w-0 items-center gap-3">
          {/* Profile / Masjid Image */}
          <img
            src={logoImg}
            onClick={() => setShowProfile(true)}
            className="h-10 w-10 shrink-0 cursor-pointer rounded-full object-cover transition-transform hover:scale-105"
            alt="Masjid Nale-paar"
          />

          {/* Brand */}
          <Link to="/">
            <div className="min-w-0 leading-tight">
              <div className="truncate font-display text-xl font-semibold">Masjid Nale-paar</div>

              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Azan &amp; Timetable
              </div>
            </div>
          </Link>
        </div>

        {/* ================================================= */}
        {/* DESKTOP NAVIGATION */}
        {/* ================================================= */}

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) =>
            item.external ? (
              <a
                key={item.label}
                href={item.to}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                activeProps={{
                  className: "bg-accent text-foreground",
                }}
                activeOptions={{
                  exact: item.to === "/",
                }}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        {/* ================================================= */}
        {/* RIGHT SIDE */}
        {/* ================================================= */}

        <div className="flex items-center gap-2">
          {/* Theme */}
          <ThemeToggle />

          {/* Admin */}
          <Link
            to="/admin/login"
            className="hidden rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 sm:inline-flex"
          >
            Admin
          </Link>

          {/* ================================================= */}
          {/* MOBILE MENU */}
          {/* ================================================= */}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-72">
              <div className="mt-8 flex flex-col gap-1">
                {nav.map((item) =>
                  item.external ? (
                    <a
                      key={item.label}
                      href={item.to}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setOpen(false)}
                      className="rounded-xl px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className="rounded-xl px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                      activeProps={{
                        className: "bg-accent text-foreground",
                      }}
                      activeOptions={{
                        exact: item.to === "/",
                      }}
                    >
                      {item.label}
                    </Link>
                  ),
                )}

                {/* Mobile Admin */}

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

      {/* =================================================== */}
      {/* FULL SCREEN PROFILE IMAGE */}
      {/* =================================================== */}

      {showProfile && (
        <div
          className="fixed inset-0 z-[999999] flex min-h-screen w-screen items-center justify-center bg-black/90 p-4"
          onClick={() => setShowProfile(false)}
        >
          <img
            src={logoImg}
            alt="Masjid Nale-paar"
            className="max-h-[90vh] max-w-[90vw] rounded-full object-contain shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </header>
  );
}

/* ========================================================= */
/* SITE FOOTER */
/* ========================================================= */

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-muted/40">
      <div className="container mx-auto grid gap-8 px-4 py-12 md:grid-cols-3">
        {/* ================================================= */}
        {/* ABOUT */}
        {/* ================================================= */}

        <div>
          <div className="font-display text-2xl">Masjid Nale-paar</div>

          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            Serving the community with daily prayers, Jumuah, and education. Updated prayer times by
            the masjid administration.
          </p>
        </div>

        {/* ================================================= */}
        {/* ADDRESS */}
        {/* ================================================= */}

        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-gold">Visit</div>

          <p className="mt-3 text-sm text-muted-foreground">
            Masjid Nale Paar, Cantonment Area,
            <br />
            Naya Bazar, Kamptee, 441001,
            <br />
            Nagpur, Maharashtra
          </p>
        </div>

        {/* ================================================= */}
        {/* CONTACT */}
        {/* ================================================= */}

        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-gold">Contact</div>

          <p className="mt-3 text-sm text-muted-foreground">
            +1 (555) 123-4567
            <br />
            info@nalepaar.masjid
          </p>
        </div>
      </div>

      {/* Copyright */}

      <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Masjid Nale-paar. All times subject to change.
      </div>
    </footer>
  );
}
