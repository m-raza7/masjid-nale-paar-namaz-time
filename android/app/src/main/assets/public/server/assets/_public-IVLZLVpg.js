import { jsx, jsxs } from "react/jsx-runtime";
import { Link, Outlet } from "@tanstack/react-router";
import { Moon } from "lucide-react";
import { T as ThemeToggle } from "./theme-toggle-DIt_bYe4.js";
import "react";
import "./button-DjOZMqFS.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
const nav = [
  { to: "/", label: "Home" },
  { to: "/prayer-times", label: "Prayer Times" },
  { to: "/monthly-timetable", label: "Monthly" },
  { to: "/announcements", label: "Announcements" },
  { to: "/events", label: "Events" }
];
function SiteHeader() {
  return /* @__PURE__ */ jsx("header", { className: "sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto flex h-16 items-center justify-between gap-4 px-4", children: [
    /* @__PURE__ */ jsxs(Link, { to: "/", className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("span", { className: "grid h-10 w-10 place-items-center rounded-full bg-gradient-gold shadow-gold", children: /* @__PURE__ */ jsx(Moon, { className: "h-5 w-5 text-gold-foreground" }) }),
      /* @__PURE__ */ jsxs("div", { className: "leading-tight", children: [
        /* @__PURE__ */ jsx("div", { className: "font-display text-xl font-semibold", children: "Al-Noor Masjid" }),
        /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-[0.2em] text-muted-foreground", children: "Azan & Timetable" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("nav", { className: "hidden items-center gap-1 md:flex", children: nav.map((n) => /* @__PURE__ */ jsx(
      Link,
      {
        to: n.to,
        className: "rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
        activeProps: { className: "bg-accent text-foreground" },
        activeOptions: { exact: n.to === "/" },
        children: n.label
      },
      n.to
    )) }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(ThemeToggle, {}),
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/admin/login",
          className: "hidden rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 sm:inline-flex",
          children: "Admin"
        }
      )
    ] })
  ] }) });
}
function SiteFooter() {
  return /* @__PURE__ */ jsxs("footer", { className: "border-t border-border/60 bg-muted/40", children: [
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto grid gap-8 px-4 py-12 md:grid-cols-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "font-display text-2xl", children: "Al-Noor Masjid" }),
        /* @__PURE__ */ jsx("p", { className: "mt-3 max-w-sm text-sm text-muted-foreground", children: "Serving the community with daily prayers, Jumuah, and education. Updated prayer times by the masjid administration." })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-[0.2em] text-gold", children: "Visit" }),
        /* @__PURE__ */ jsxs("p", { className: "mt-3 text-sm text-muted-foreground", children: [
          "123 Crescent Lane",
          /* @__PURE__ */ jsx("br", {}),
          "City, Country"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-[0.2em] text-gold", children: "Contact" }),
        /* @__PURE__ */ jsxs("p", { className: "mt-3 text-sm text-muted-foreground", children: [
          "+1 (555) 123-4567",
          /* @__PURE__ */ jsx("br", {}),
          "info@alnoor.masjid"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "border-t border-border/60 py-4 text-center text-xs text-muted-foreground", children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      " Al-Noor Masjid. All times subject to change."
    ] })
  ] });
}
function PublicLayout() {
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen flex-col bg-background", children: [
    /* @__PURE__ */ jsx(SiteHeader, {}),
    /* @__PURE__ */ jsx("main", { className: "flex-1", children: /* @__PURE__ */ jsx(Outlet, {}) }),
    /* @__PURE__ */ jsx(SiteFooter, {})
  ] });
}
export {
  PublicLayout as component
};
