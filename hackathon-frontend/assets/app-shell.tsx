/* App shell: drop into src/components/app-shell.tsx
 *
 * The frame every screen sits in. Build this in phase 2, before any feature.
 * A consistent shell is most of what makes four screens look like one product.
 */
import * as React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export function AppShell({
  children,
  nav,
  right,
  brand = "PROJECT",
  status,
}: {
  children: React.ReactNode;
  nav?: { href: string; label: string }[];
  right?: React.ReactNode;
  brand?: string;
  status?: string; // e.g. "demo data". Be honest, judges respect it
}) {
  return (
    <div className="min-h-dvh bg-background">
      {/* Header: sticky, one border, no shadow. */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="grid size-6 place-items-center rounded-md bg-primary text-primary-foreground text-xs font-bold">
              {brand.slice(0, 1)}
            </span>
            {brand}
          </Link>

          {nav && (
            <nav className="hidden items-center gap-1 md:flex">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}

          <div className="ml-auto flex items-center gap-3">
            {status && (
              <Badge variant="outline" className="hidden sm:inline-flex">
                {status}
              </Badge>
            )}
            {right}
          </div>
        </div>
      </header>

      {/* One container width, everywhere. Do not vary it per page. */}
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}

/* Page header: every screen opens the same way. Title, one line of context,
 * actions on the right. Consistency here reads as design intent. */
export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        {description && (
          <p className="max-w-prose text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

/* Section: the only other layout primitive you need. */
export function Section({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
