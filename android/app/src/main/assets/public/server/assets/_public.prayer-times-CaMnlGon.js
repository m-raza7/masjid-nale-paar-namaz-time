import { jsxs, jsx } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { s as supabase } from "./client-B0vxMC1r.js";
import { t as todayISO, c as currentAndNextPrayer, a as toSlots, h as hijriDate, f as formatTime12, b as formatCountdown } from "./prayer-eI_VmdU3.js";
import "@supabase/supabase-js";
function PrayerTimesPage() {
  const today = todayISO();
  const {
    data
  } = useQuery({
    queryKey: ["prayer-today", today],
    queryFn: async () => {
      const {
        data: data2
      } = await supabase.from("prayer_times").select("*").eq("date", today).maybeSingle();
      return data2;
    }
  });
  const [now, setNow] = useState(/* @__PURE__ */ new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(/* @__PURE__ */ new Date()), 1e3);
    return () => clearInterval(id);
  }, []);
  const {
    next,
    msToNext
  } = currentAndNextPrayer(data ?? null, now);
  const slots = data ? toSlots(data) : [];
  return /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-16", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-[0.2em] text-gold", children: hijriDate(now) }),
      /* @__PURE__ */ jsx("h1", { className: "mt-3 font-display text-5xl md:text-6xl", children: "Prayer Times" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-muted-foreground", children: now.toLocaleDateString(void 0, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto mt-10 max-w-xl rounded-3xl bg-gradient-hero p-8 text-center text-primary-foreground shadow-elegant", children: [
      /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-[0.2em] text-gold", children: "Next prayer" }),
      /* @__PURE__ */ jsx("div", { className: "mt-2 font-display text-5xl", children: next?.name ?? "—" }),
      /* @__PURE__ */ jsx("div", { className: "mt-1 text-gold", children: formatTime12(next?.azan ?? null) }),
      /* @__PURE__ */ jsx("div", { className: "mt-6 font-display text-6xl tabular-nums", children: formatCountdown(msToNext) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto mt-12 max-w-4xl overflow-hidden rounded-2xl border border-border bg-card shadow-sm", children: [
      /* @__PURE__ */ jsxs("table", { className: "w-full text-left", children: [
        /* @__PURE__ */ jsx("thead", { className: "bg-muted/60", children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-xs uppercase tracking-wider text-muted-foreground", children: "Prayer" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-xs uppercase tracking-wider text-muted-foreground", children: "Azan" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-xs uppercase tracking-wider text-muted-foreground", children: "Jamaat" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-border", children: slots.map((s) => /* @__PURE__ */ jsxs("tr", { className: "transition-colors hover:bg-accent/40", children: [
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 font-display text-2xl", children: s.name }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 font-display text-xl text-primary", children: formatTime12(s.azan) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-muted-foreground", children: formatTime12(s.jamaat) })
        ] }, s.name)) })
      ] }),
      data && /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 border-t border-border bg-muted/30 text-center", children: [["Jumuah 1", data.jumuah_1], ["Jumuah 2", data.jumuah_2], ["Jumuah 3", data.jumuah_3]].map(([l, v]) => /* @__PURE__ */ jsxs("div", { className: "px-4 py-5", children: [
        /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: l }),
        /* @__PURE__ */ jsx("div", { className: "mt-1 font-display text-xl text-gold", children: formatTime12(v) })
      ] }, l)) })
    ] })
  ] });
}
export {
  PrayerTimesPage as component
};
