/* The five states: drop into src/components/states.tsx
 *
 * Every screen that can fetch, filter or submit needs all five. This is the
 * cheapest polish in a hackathon: about 40 lines for a visible jump in
 * perceived quality.
 *
 * Requires: shadcn button, card, skeleton, sonner. lucide-react.
 */
"use client";

import * as React from "react";
import { AlertTriangle, Inbox, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

/* ── 1. EMPTY ──────────────────────────────────────────────────────────────
 * Never a blank div. Icon, one sentence, the action that fills it.
 */
export function EmptyState({
  icon: Icon = Inbox,
  title,
  body,
  action,
}: {
  icon?: React.ElementType;
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border px-6 py-16 text-center">
      <div className="rounded-full bg-muted p-3">
        <Icon className="size-6 text-muted-foreground" aria-hidden />
      </div>
      <div className="space-y-1">
        <p className="font-medium">{title}</p>
        <p className="max-w-sm text-sm text-muted-foreground">{body}</p>
      </div>
      {action}
    </div>
  );
}

/* ── 2. LOADING ────────────────────────────────────────────────────────────
 * A skeleton shaped like the real content. Not a spinner. The shape is the
 * point: it tells the judge what is coming and stops the layout jumping.
 */
export function CardSkeleton() {
  return (
    <div className="space-y-3 rounded-lg border border-border p-4">
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
      <div className="flex gap-2 pt-1">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
  );
}

export function LoadingGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

/* ── 3. ERROR ──────────────────────────────────────────────────────────────
 * A sentence a human wrote, and a retry. Never a stack trace on a projector.
 */
export function ErrorState({
  title = "That did not load",
  body = "The request failed. This is usually temporary, so try again.",
  onRetry,
}: {
  title?: string;
  body?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-destructive/30 bg-destructive/5 px-6 py-12 text-center">
      <AlertTriangle className="size-6 text-destructive" aria-hidden />
      <div className="space-y-1">
        <p className="font-medium">{title}</p>
        <p className="max-w-sm text-sm text-muted-foreground">{body}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw className="size-4" /> Retry
        </Button>
      )}
    </div>
  );
}

/* ── 4. PARTIAL ────────────────────────────────────────────────────────────
 * Render what arrived, skeleton the rest. Beats an all-or-nothing spinner
 * and makes a slow backend look like a fast one.
 */
export function PartialGrid<T>({
  items,
  expected,
  render,
}: {
  items: T[];
  expected: number;
  render: (item: T, i: number) => React.ReactNode;
}) {
  const missing = Math.max(0, expected - items.length);
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(render)}
      {Array.from({ length: missing }, (_, i) => (
        <CardSkeleton key={`skeleton-${i}`} />
      ))}
    </div>
  );
}

/* ── 5. SUCCESS ────────────────────────────────────────────────────────────
 * Confirm that the action landed. Silence reads as a bug during a demo.
 * Mount <Toaster richColors /> in the root layout once.
 */
export { toast } from "sonner";

/* ── The switch ────────────────────────────────────────────────────────────
 * One component that cannot forget a state, because the types will not let it.
 */
export type Async<T> =
  | { status: "loading" }
  | { status: "error"; retry?: () => void }
  | { status: "empty" }
  | { status: "ready"; data: T };

export function AsyncBoundary<T>({
  state,
  empty,
  children,
  skeleton = <LoadingGrid />,
}: {
  state: Async<T>;
  empty: React.ReactNode;
  children: (data: T) => React.ReactNode;
  skeleton?: React.ReactNode;
}) {
  switch (state.status) {
    case "loading":
      return <>{skeleton}</>;
    case "error":
      return <ErrorState onRetry={state.retry} />;
    case "empty":
      return <>{empty}</>;
    case "ready":
      return <>{children(state.data)}</>;
  }
}
