import { jsx, jsxs } from "react/jsx-runtime";
import { useNavigate, useRouterState, Link, Outlet } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Home, ClockIcon, Bell, Calendar, LogOut, Menu } from "lucide-react";
import { s as supabase } from "./client-B0vxMC1r.js";
import { u as useAuth } from "./use-auth-zv0hsF3L.js";
import { T as ThemeToggle } from "./theme-toggle-DIt_bYe4.js";
import { B as Button } from "./button-DjOZMqFS.js";
import "@supabase/supabase-js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
const nav = [{
  to: "/administrator",
  label: "Dashboard",
  icon: Home,
  exact: true
}, {
  to: "/administrator/prayer-times",
  label: "Prayer Times",
  icon: ClockIcon
}, {
  to: "/administrator/announcements",
  label: "Announcements",
  icon: Bell
}, {
  to: "/administrator/events",
  label: "Events",
  icon: Calendar
}];
function AdminLayout() {
  const {
    user,
    isAdmin,
    loading
  } = useAuth();
  const navigate = useNavigate();
  const path = useRouterState({
    select: (s) => s.location.pathname
  });
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (loading) return;
    if (!user) navigate({
      to: "/admin/login"
    });
  }, [user, loading, navigate]);
  if (loading) return /* @__PURE__ */ jsx("div", { className: "grid min-h-screen place-items-center text-muted-foreground", children: "Loading…" });
  if (!user) return null;
  if (!isAdmin) {
    return /* @__PURE__ */ jsx("div", { className: "grid min-h-screen place-items-center bg-background px-4 text-center", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { className: "font-display text-3xl", children: "Not authorised" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-muted-foreground", children: "Your account does not have admin access." }),
      /* @__PURE__ */ jsx(Button, { className: "mt-6", onClick: async () => {
        await supabase.auth.signOut();
        navigate({
          to: "/admin/login"
        });
      }, children: "Sign out" })
    ] }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxs("aside", { className: `fixed inset-y-0 left-0 z-30 w-64 transform border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform md:static md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`, children: [
      /* @__PURE__ */ jsxs("div", { className: "flex h-16 items-center gap-3 border-b border-sidebar-border px-6", children: [
        /* @__PURE__ */ jsx("span", { className: "grid h-9 w-9 place-items-center rounded-full bg-gradient-gold text-gold-foreground", children: "★" }),
        /* @__PURE__ */ jsx("div", { className: "font-display text-lg", children: "Admin" })
      ] }),
      /* @__PURE__ */ jsx("nav", { className: "p-4 space-y-1", children: nav.map((n) => {
        const active = n.exact ? path === n.to : path.startsWith(n.to);
        return /* @__PURE__ */ jsxs(Link, { to: n.to, onClick: () => setOpen(false), className: `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-colors ${active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60"}`, children: [
          /* @__PURE__ */ jsx(n.icon, { className: "h-4 w-4" }),
          " ",
          n.label
        ] }, n.to);
      }) }),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-x-0 bottom-0 border-t border-sidebar-border p-4", children: /* @__PURE__ */ jsxs(Button, { variant: "ghost", className: "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent", onClick: async () => {
        await supabase.auth.signOut();
        navigate({
          to: "/"
        });
      }, children: [
        /* @__PURE__ */ jsx(LogOut, { className: "mr-2 h-4 w-4" }),
        " Sign out"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-col", children: [
      /* @__PURE__ */ jsxs("header", { className: "flex h-16 items-center justify-between border-b border-border bg-card px-4 md:px-8", children: [
        /* @__PURE__ */ jsx("button", { className: "md:hidden", onClick: () => setOpen((v) => !v), "aria-label": "Toggle menu", children: /* @__PURE__ */ jsx(Menu, {}) }),
        /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: user.email }),
        /* @__PURE__ */ jsx(ThemeToggle, {})
      ] }),
      /* @__PURE__ */ jsx("main", { className: "flex-1 p-4 md:p-8", children: /* @__PURE__ */ jsx(Outlet, {}) })
    ] })
  ] });
}
export {
  AdminLayout as component
};
