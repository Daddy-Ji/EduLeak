import { createFileRoute, Outlet, redirect, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/login" });
  },
  component: AuthLayout,
});

function AuthLayout() {
  const router = useRouter();
  return (
    <div className="container-edit py-8">
      <div className="flex items-center justify-between border-b border-border pb-4 mb-8">
        <div className="flex items-center gap-6 text-sm">
          <Link to="/admin" className="font-display text-xl">Admin</Link>
          <Link to="/admin/courses" className="text-ink/70 hover:text-ink">Courses</Link>
          <Link to="/admin/media" className="text-ink/70 hover:text-ink">Media</Link>
        </div>
        <button
          onClick={async () => { await supabase.auth.signOut(); router.navigate({ to: "/" }); }}
          className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-ink"
        >
          Sign out
        </button>
      </div>
      <Outlet />
    </div>
  );
}
