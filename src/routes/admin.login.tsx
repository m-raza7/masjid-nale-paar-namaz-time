import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Moon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Admin Login — Nale-paar Masjid" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: "/administrator" });
  }, [user, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Signed in");
        navigate({ to: "/administrator" });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/administrator" },
        });
        if (error) throw error;
        toast.success("Account created. You can sign in now.");
        setMode("signin");
      }
      // } catch (e: any) {
      //   toast.error(e.message ?? "Authentication failed");
      // }
    } catch (e: any) {
      console.error("LOGIN ERROR:", e);
      console.error("MESSAGE:", e?.message);
      toast.error(e?.message ?? "Authentication failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden bg-gradient-hero p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <div className="arabesque absolute inset-0 opacity-20" />
        <Link to="/" className="relative flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-gold">
            <Moon className="h-5 w-5 text-gold-foreground" />
          </span>
          <span className="font-display text-2xl">Nale-paar Masjid</span>
        </Link>
        <div className="relative">
          <h1 className="font-display text-5xl">
            Administration
            <br />
            <span className="text-gold">Console</span>
          </h1>
          <p className="mt-4 max-w-md text-primary-foreground/75">
            Maintain prayer times, post announcements, and manage events for the community.
          </p>
        </div>
        <div className="relative text-xs text-primary-foreground/60">
          For authorised masjid staff only.
        </div>
      </div>
      <div className="flex items-center justify-center p-8">
        <form onSubmit={submit} className="w-full max-w-sm space-y-5">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-gold">
              {mode === "signin" ? "Welcome back" : "Create account"}
            </div>
            <h2 className="mt-2 font-display text-4xl">
              {mode === "signin" ? "Sign in" : "Sign up"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              The first account created is automatically granted admin access.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
            />
          </div>
          <Button
            type="submit"
            disabled={busy}
            className="w-full bg-gradient-gold text-gold-foreground hover:opacity-95"
          >
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </Button>
          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="block w-full text-center text-sm text-muted-foreground hover:text-foreground"
          >
            {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
          </button>
          <Link to="/" className="block text-center text-xs text-muted-foreground hover:underline">
            ← Back to website
          </Link>
        </form>
      </div>
    </div>
  );
}
