import { jsxs, jsx } from "react/jsx-runtime";
import { useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Moon } from "lucide-react";
import { s as supabase } from "./client-B0vxMC1r.js";
import { u as useAuth } from "./use-auth-zv0hsF3L.js";
import { B as Button } from "./button-DjOZMqFS.js";
import { L as Label, I as Input } from "./label-BJaHSwYl.js";
import "@supabase/supabase-js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-label";
function AdminLogin() {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (user) navigate({
      to: "/administrator"
    });
  }, [user, navigate]);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signin") {
        const {
          error
        } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        toast.success("Signed in");
        navigate({
          to: "/administrator"
        });
      } else {
        const {
          error
        } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin + "/administrator"
          }
        });
        if (error) throw error;
        toast.success("Account created. You can sign in now.");
        setMode("signin");
      }
    } catch (e2) {
      console.error("LOGIN ERROR:", e2);
      console.error("MESSAGE:", e2?.message);
      toast.error(e2?.message ?? "Authentication failed");
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "grid min-h-screen lg:grid-cols-2", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative hidden bg-gradient-hero p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between", children: [
      /* @__PURE__ */ jsx("div", { className: "arabesque absolute inset-0 opacity-20" }),
      /* @__PURE__ */ jsxs(Link, { to: "/", className: "relative flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("span", { className: "grid h-10 w-10 place-items-center rounded-full bg-gradient-gold", children: /* @__PURE__ */ jsx(Moon, { className: "h-5 w-5 text-gold-foreground" }) }),
        /* @__PURE__ */ jsx("span", { className: "font-display text-2xl", children: "Al-Noor Masjid" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxs("h1", { className: "font-display text-5xl", children: [
          "Administration",
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("span", { className: "text-gold", children: "Console" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 max-w-md text-primary-foreground/75", children: "Maintain prayer times, post announcements, and manage events for the community." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "relative text-xs text-primary-foreground/60", children: "For authorised masjid staff only." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center p-8", children: /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "w-full max-w-sm space-y-5", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-[0.2em] text-gold", children: mode === "signin" ? "Welcome back" : "Create account" }),
        /* @__PURE__ */ jsx("h2", { className: "mt-2 font-display text-4xl", children: mode === "signin" ? "Sign in" : "Sign up" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "The first account created is automatically granted admin access." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "email", children: "Email" }),
        /* @__PURE__ */ jsx(Input, { id: "email", type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), autoComplete: "email" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "password", children: "Password" }),
        /* @__PURE__ */ jsx(Input, { id: "password", type: "password", required: true, minLength: 6, value: password, onChange: (e) => setPassword(e.target.value), autoComplete: mode === "signin" ? "current-password" : "new-password" })
      ] }),
      /* @__PURE__ */ jsx(Button, { type: "submit", disabled: busy, className: "w-full bg-gradient-gold text-gold-foreground hover:opacity-95", children: busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account" }),
      /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setMode(mode === "signin" ? "signup" : "signin"), className: "block w-full text-center text-sm text-muted-foreground hover:text-foreground", children: mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in" }),
      /* @__PURE__ */ jsx(Link, { to: "/", className: "block text-center text-xs text-muted-foreground hover:underline", children: "← Back to website" })
    ] }) })
  ] });
}
export {
  AdminLogin as component
};
