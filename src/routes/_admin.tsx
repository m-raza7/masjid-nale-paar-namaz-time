import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";

import {
  Bell,
  Calendar,
  ClockIcon,
  Home,
  Images,
  LogOut,
  Menu,
  LayoutDashboard,
  X,
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

import logoImg from "../assets/nale-paar.jpeg";

export const Route = createFileRoute("/_admin")({
  component: AdminLayout,
});

type NavItem = {
  to: string;
  label: string;
  icon: any;
  exact?: boolean;
};

const nav: NavItem[] = [
  {
    to: "/",
    label: "Home",
    icon: Home,
    exact: true,
  },
  {
    to: "/administrator",
    label: "Dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    to: "/administrator/prayer-times",
    label: "Prayer Times",
    icon: ClockIcon,
  },
  {
    to: "/administrator/announcements",
    label: "Announcements",
    icon: Bell,
  },
  {
    to: "/administrator/events",
    label: "Events",
    icon: Calendar,
  },
  {
    to: "/administrator/gallery",
    label: "Gallery",
    icon: Images,
  },
];

function AdminLayout() {
  const { user, isAdmin, loading } = useAuth();

  const navigate = useNavigate();

  const path = useRouterState({
    select: (s) => s.location.pathname,
  });

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate({
        to: "/admin/login",
      });
    }
  }, [user, loading, navigate]);

  /* ========================================================= */
  /* LOADING */
  /* ========================================================= */

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center text-muted-foreground">Loading…</div>
    );
  }

  /* ========================================================= */
  /* NOT LOGGED IN */
  /* ========================================================= */

  if (!user) {
    return null;
  }

  /* ========================================================= */
  /* NOT ADMIN */
  /* ========================================================= */

  if (!isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center bg-background px-4 text-center">
        <div>
          <h1 className="font-display text-3xl">Not authorised</h1>

          <p className="mt-2 text-muted-foreground">Your account does not have admin access.</p>

          <Button
            className="mt-6"
            onClick={async () => {
              await supabase.auth.signOut();

              navigate({
                to: "/admin/login",
              });
            }}
          >
            Sign out
          </Button>
        </div>
      </div>
    );
  }

  /* ========================================================= */
  /* ADMIN LAYOUT */
  /* ========================================================= */

  return (
    <div className="flex min-h-screen bg-background">
      {/* ===================================================== */}
      {/* SIDEBAR */}
      {/* ===================================================== */}

      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 transform border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform md:static md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between gap-3 border-b border-sidebar-border px-6">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3">
              <img src={logoImg} className="h-9 w-9 rounded-full object-cover" alt="Nale Paar" />
            </Link>

            <div className="font-display text-lg">Admin</div>
          </div>

          {/* Mobile Close */}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-md p-2 hover:bg-sidebar-accent md:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* =================================================== */}
        {/* NAVIGATION */}
        {/* =================================================== */}

        <nav className="space-y-1 p-4">
          {nav.map((n) => {
            const active = n.exact ? path === n.to : path.startsWith(n.to);

            return (
              <Link
                key={n.to}
                to={n.to as any}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60"
                }`}
              >
                <n.icon className="h-4 w-4" />

                <span>{n.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* =================================================== */}
        {/* SIGN OUT */}
        {/* =================================================== */}

        <div className="absolute inset-x-0 bottom-0 border-t border-sidebar-border p-4">
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={async () => {
              await supabase.auth.signOut();

              navigate({
                to: "/",
              });
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </div>
      </aside>

      {/* ===================================================== */}
      {/* MAIN CONTENT */}
      {/* ===================================================== */}

      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 md:px-8">
          {/* Mobile Menu */}
          <button
            type="button"
            className="md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle menu"
          >
            <Menu />
          </button>

          {/* User Email */}
          <div className="text-sm text-muted-foreground">{user.email}</div>

          {/* Theme */}
          <ThemeToggle />
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
