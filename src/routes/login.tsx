import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Admin sign in — EduLeak" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setBusy(true);
    try {
      if (mode === "in") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin + "/admin" },
        });
        if (error) throw error;
      }
      navigate({ to: "/admin" });
    } catch (e: any) {
      setErr(e.message ?? "Sign in failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container-edit py-16 max-w-md">
      <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Members only</p>
      <h1 className="mt-2 font-display text-4xl">{mode === "in" ? "Sign in" : "Create account"}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Admin access to the EduLeak course manager.
      </p>
      <form onSubmit={submit} className="mt-8 space-y-4">
        <div>
          <label className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Email</label>
          <input
            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full border-b border-ink bg-transparent py-2 outline-none focus:border-gold"
          />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Password</label>
          <input
            type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full border-b border-ink bg-transparent py-2 outline-none focus:border-gold"
          />
        </div>
        {err && <p className="text-sm text-destructive">{err}</p>}
        <button
          disabled={busy}
          className="mt-2 w-full bg-ink text-paper py-3 text-sm uppercase tracking-[0.2em] disabled:opacity-50"
        >
          {busy ? "Working…" : mode === "in" ? "Sign in" : "Create account"}
        </button>
      </form>
      <button
        onClick={() => setMode(mode === "in" ? "up" : "in")}
        className="mt-5 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-ink"
      >
        {mode === "in" ? "Need an account? Sign up →" : "← Have an account? Sign in"}
      </button>
      <p className="mt-10 text-xs text-muted-foreground">
        The first user to sign up becomes the site admin.
        <br /><Link to="/" className="hover:text-ink">← Back to home</Link>
      </p>
    </div>
  );
}
