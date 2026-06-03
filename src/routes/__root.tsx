import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { TelegramPopup } from "@/components/telegram-popup";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/seo";
import { supabase } from "@/integrations/supabase/client";

function NotFoundComponent() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-5">
      <div className="text-center max-w-md">
        <p className="num-display text-7xl text-gold">404</p>
        <h1 className="mt-2 font-display text-3xl">Page not found</h1>
        <p className="mt-3 text-sm text-muted-foreground">The page you're looking for moved or never existed.</p>
        <Link to="/" className="inline-block mt-6 border-b border-ink pb-0.5 text-sm">Return home</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-5">
      <div className="text-center max-w-md">
        <h1 className="font-display text-3xl">Something broke</h1>
        <p className="mt-3 text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 inline-block border-b border-ink pb-0.5 text-sm"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `${SITE_NAME} — Free courses for class 9 through college` },
      { name: "description", content: SITE_DESCRIPTION },
      { name: "author", content: SITE_NAME },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:type", content: "website" },
      { property: "og:title", content: `${SITE_NAME} — Free courses for class 9 through college` },
      { property: "og:description", content: SITE_DESCRIPTION },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "EduLeak" },
      { property: "og:title", content: "EduLeak" },
      { name: "twitter:title", content: "EduLeak" },
      { name: "description", content: "EduLeak is a free educational resource website with an admin panel for course management." },
      { property: "og:description", content: "EduLeak is a free educational resource website with an admin panel for course management." },
      { name: "twitter:description", content: "EduLeak is a free educational resource website with an admin panel for course management." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/FCCn8pjTyXc46ncigiq4zLeE02k2/social-images/social-1780506642804-1000371509.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/FCCn8pjTyXc46ncigiq4zLeE02k2/social-images/social-1780506642804-1000371509.webp" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Work+Sans:wght@300;400;500;600&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          name: SITE_NAME,
          description: SITE_DESCRIPTION,
          url: "/",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function AuthInvalidator() {
  const router = useRouter();
  const queryClient = useQueryClient();
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      router.invalidate();
      queryClient.invalidateQueries();
    });
    return () => subscription.unsubscribe();
  }, [router, queryClient]);
  return null;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthInvalidator />
      <SiteHeader />
      <main className="min-h-[60vh]">
        <Outlet />
      </main>
      <SiteFooter />
      <TelegramPopup />
    </QueryClientProvider>
  );
}
