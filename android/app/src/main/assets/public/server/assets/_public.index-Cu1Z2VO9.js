import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Sparkles, ArrowRight, Clock, MapPin, Calendar } from "lucide-react";
import { s as supabase } from "./client-B0vxMC1r.js";
import { t as todayISO, c as currentAndNextPrayer, a as toSlots, h as hijriDate, f as formatTime12, b as formatCountdown } from "./prayer-eI_VmdU3.js";
import { B as Button } from "./button-DjOZMqFS.js";
import "@supabase/supabase-js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
function HomePage() {
  const today = todayISO();
  const {
    data: prayer
  } = useQuery({
    queryKey: ["prayer-today", today],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("prayer_times").select("*").eq("date", today).maybeSingle();
      return data;
    }
  });
  const {
    data: announcements
  } = useQuery({
    queryKey: ["announcements", "active"],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("announcements").select("*").eq("active", true).order("created_at", {
        ascending: false
      }).limit(3);
      return data ?? [];
    }
  });
  const {
    data: events
  } = useQuery({
    queryKey: ["events", "upcoming"],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("events").select("*").gte("event_date", today).order("event_date").limit(3);
      return data ?? [];
    }
  });
  const [now, setNow] = useState(/* @__PURE__ */ new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(/* @__PURE__ */ new Date()), 1e3);
    return () => clearInterval(id);
  }, []);
  const {
    current,
    next,
    msToNext
  } = currentAndNextPrayer(prayer ?? null, now);
  const slots = prayer ? toSlots(prayer) : [];
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("section", { className: "relative overflow-hidden bg-gradient-hero text-primary-foreground", children: [
      /* @__PURE__ */ jsx("div", { className: "arabesque absolute inset-0 opacity-20" }),
      /* @__PURE__ */ jsxs("div", { className: "container relative mx-auto grid gap-12 px-4 py-20 md:grid-cols-2 md:py-28", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-gold", children: [
            /* @__PURE__ */ jsx(Sparkles, { className: "h-3 w-3" }),
            " ",
            hijriDate(now)
          ] }),
          /* @__PURE__ */ jsxs("h1", { className: "mt-6 font-display text-5xl leading-[1.05] md:text-7xl", children: [
            "Stand for prayer",
            /* @__PURE__ */ jsx("br", {}),
            /* @__PURE__ */ jsx("span", { className: "text-gold", children: "at its appointed time." })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "mt-6 max-w-lg text-lg text-primary-foreground/75", children: "Daily Azan and Jamaat times, monthly schedule and community announcements — kept current by the masjid administration." }),
          /* @__PURE__ */ jsxs("div", { className: "mt-8 flex flex-wrap gap-3", children: [
            /* @__PURE__ */ jsx(Button, { asChild: true, size: "lg", className: "bg-gradient-gold text-gold-foreground shadow-gold hover:opacity-95", children: /* @__PURE__ */ jsxs(Link, { to: "/prayer-times", children: [
              "View today's times ",
              /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
            ] }) }),
            /* @__PURE__ */ jsx(Button, { asChild: true, size: "lg", variant: "outline", className: "border-gold/40 bg-transparent text-primary-foreground hover:bg-gold/10", children: /* @__PURE__ */ jsx(Link, { to: "/monthly-timetable", children: "Monthly timetable" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-gold/20 bg-card/95 p-8 text-card-foreground shadow-elegant backdrop-blur", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-[0.2em] text-muted-foreground", children: "Next Prayer" }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: now.toLocaleString(void 0, {
              weekday: "long",
              month: "long",
              day: "numeric"
            }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-baseline justify-between", children: [
            /* @__PURE__ */ jsx("div", { className: "font-display text-6xl text-primary", children: next?.name ?? "—" }),
            /* @__PURE__ */ jsx("div", { className: "font-display text-3xl text-gold", children: formatTime12(next?.azan ?? null) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 rounded-2xl bg-muted/60 p-6 text-center", children: [
            /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-[0.2em] text-muted-foreground", children: "Time remaining" }),
            /* @__PURE__ */ jsx("div", { className: "mt-2 font-display text-5xl tabular-nums text-primary", children: formatCountdown(msToNext) })
          ] }),
          current && /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center justify-between rounded-xl border border-border/60 px-4 py-3 text-sm", children: [
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Now" }),
            /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
              current.name,
              " · ",
              formatTime12(current.azan)
            ] })
          ] })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "container mx-auto px-4 py-20", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-end justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-[0.2em] text-gold", children: "Today" }),
          /* @__PURE__ */ jsx("h2", { className: "mt-2 font-display text-4xl md:text-5xl", children: "Today's prayer times" })
        ] }),
        /* @__PURE__ */ jsx(Link, { to: "/monthly-timetable", className: "hidden text-sm font-medium text-primary hover:underline md:inline", children: "View full month →" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6", children: [
        slots.map((s) => /* @__PURE__ */ jsxs("div", { className: "group rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:shadow-elegant", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx("div", { className: "font-display text-xl", children: s.name }),
            /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4 text-gold" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-3 font-display text-3xl text-primary", children: formatTime12(s.azan) }),
          s.jamaat && /* @__PURE__ */ jsxs("div", { className: "mt-1 text-xs text-muted-foreground", children: [
            "Jamaat · ",
            formatTime12(s.jamaat)
          ] })
        ] }, s.name)),
        slots.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "No timetable set for today. Please check back soon." })
      ] })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "border-y border-border/60 bg-muted/30 py-20", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto grid gap-12 px-4 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-[0.2em] text-gold", children: "Announcements" }),
        /* @__PURE__ */ jsx("h2", { className: "mt-2 font-display text-4xl", children: "From the masjid" }),
        /* @__PURE__ */ jsxs("div", { className: "mt-8 space-y-4", children: [
          (announcements ?? []).map((a) => /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-card p-6 shadow-sm", children: [
            /* @__PURE__ */ jsx("div", { className: "font-display text-2xl", children: a.title }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: a.description })
          ] }, a.id)),
          announcements?.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "No announcements at this time." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-[0.2em] text-gold", children: "Events" }),
        /* @__PURE__ */ jsx("h2", { className: "mt-2 font-display text-4xl", children: "Upcoming gatherings" }),
        /* @__PURE__ */ jsxs("div", { className: "mt-8 space-y-4", children: [
          (events ?? []).map((e) => /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-card p-6 shadow-sm", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "font-display text-2xl", children: e.title }),
                e.description && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: e.description })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "shrink-0 rounded-lg bg-gradient-gold px-3 py-2 text-center text-gold-foreground", children: [
                /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-wider", children: new Date(e.event_date).toLocaleString(void 0, {
                  month: "short"
                }) }),
                /* @__PURE__ */ jsx("div", { className: "font-display text-2xl leading-none", children: new Date(e.event_date).getDate() })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground", children: [
              e.start_time && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(Clock, { className: "h-3 w-3" }),
                " ",
                formatTime12(e.start_time),
                e.end_time && ` – ${formatTime12(e.end_time)}`
              ] }),
              e.location && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(MapPin, { className: "h-3 w-3" }),
                " ",
                e.location
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(Calendar, { className: "h-3 w-3" }),
                " ",
                new Date(e.event_date).toLocaleDateString(void 0, {
                  weekday: "long"
                })
              ] })
            ] })
          ] }, e.id)),
          events?.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "No upcoming events." })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  HomePage as component
};
