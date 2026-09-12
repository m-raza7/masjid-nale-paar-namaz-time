import { jsxs, jsx } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { s as supabase } from "./client-B0vxMC1r.js";
import "@supabase/supabase-js";
function AnnouncementsPage() {
  const {
    data
  } = useQuery({
    queryKey: ["announcements", "active"],
    queryFn: async () => {
      const {
        data: data2
      } = await supabase.from("announcements").select("*").eq("active", true).order("created_at", {
        ascending: false
      });
      return data2 ?? [];
    }
  });
  return /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-3xl px-4 py-16", children: [
    /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-[0.2em] text-gold", children: "News" }),
    /* @__PURE__ */ jsx("h1", { className: "mt-2 font-display text-5xl", children: "Announcements" }),
    /* @__PURE__ */ jsxs("div", { className: "mt-10 space-y-5", children: [
      (data ?? []).map((a) => /* @__PURE__ */ jsxs("article", { className: "rounded-2xl border border-border bg-card p-7 shadow-sm", children: [
        /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: new Date(a.created_at).toLocaleDateString() }),
        /* @__PURE__ */ jsx("h2", { className: "mt-2 font-display text-3xl", children: a.title }),
        /* @__PURE__ */ jsx("p", { className: "mt-3 whitespace-pre-line leading-relaxed text-muted-foreground", children: a.description })
      ] }, a.id)),
      data?.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "No announcements at this time." })
    ] })
  ] });
}
export {
  AnnouncementsPage as component
};
