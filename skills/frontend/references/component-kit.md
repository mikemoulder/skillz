# Component kit

Six patterns cover almost every hackathon screen. Build these, compose them,
resist writing a seventh.

## 1. The screen

Every screen is the same three lines. Consistency here is most of what makes a
multi-page hack feel like one product.

```tsx
export default async function Page() {
  const items = await getItems();          // from lib/data.ts, seed-backed
  return (
    <AppShell brand="PROJECT" status="demo data" nav={NAV}>
      <PageHeader
        title="Review queue"
        description="Everything flagged in the last 24 hours, highest risk first."
        actions={<Button>New review</Button>}
      />
      {items.length === 0 ? (
        <EmptyState
          title="Nothing flagged yet"
          body="Connect a data source and findings will appear here within a minute."
          action={<Button>Connect a source</Button>}
        />
      ) : (
        <ItemGrid items={items} />
      )}
    </AppShell>
  );
}
```

Note the description line. One sentence explaining what the screen is, in the
user's language, does more for a judge than any amount of visual polish. Most
hacks skip it and the judge spends their ten seconds working out what they are
looking at.

## 2. The card

```tsx
export function ItemCard({ item }: { item: Item }) {
  return (
    <Card className="group transition-colors hover:border-primary/40">
      <CardHeader className="gap-1">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="line-clamp-1 text-base">{item.title}</CardTitle>
          <StatusBadge status={item.status} />
        </div>
        <CardDescription className="line-clamp-2">{item.summary}</CardDescription>
      </CardHeader>
      <CardFooter className="justify-between text-sm text-muted-foreground">
        <span className="font-mono tabular-nums">{item.score}</span>
        <time dateTime={item.updatedAt}>{relative(item.updatedAt)}</time>
      </CardFooter>
    </Card>
  );
}
```

The three details that separate this from a default card:

- `line-clamp-1` / `line-clamp-2`: real data has a title six words longer than
  your seed. Clamping is the difference between a grid and a mess.
- `tabular-nums font-mono` on every number in a column. Proportional digits
  make numeric columns jitter and it looks cheap.
- `hover:border-primary/40`: a border shift, not a lift. Cheap, and it tells
  the judge the card is interactive.

## 3. Status

Semantic color, never accent. One map, used everywhere.

```tsx
const STATUS = {
  active:  { label: "Active",  className: "border-success/30  text-success  bg-success/10" },
  pending: { label: "Pending", className: "border-warning/30  text-warning  bg-warning/10" },
  failed:  { label: "Failed",  className: "border-destructive/30 text-destructive bg-destructive/10" },
} as const;

export function StatusBadge({ status }: { status: keyof typeof STATUS }) {
  const s = STATUS[status];
  return <Badge variant="outline" className={s.className}>{s.label}</Badge>;
}
```

Tinted background + matching border + matching text at three opacities is the
whole trick. It works in both modes with no extra tokens.

## 4. The metric row

The highest-leverage component in a hackathon UI. Judges scan numbers first.

```tsx
export function Stat({ label, value, delta }: { label: string; value: string; delta?: string }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums tracking-tight">{value}</p>
      {delta && <p className="mt-1 text-xs text-success">{delta}</p>}
    </div>
  );
}
// <div className="mb-8 grid gap-4 sm:grid-cols-3">...</div>
```

Three or four stats, never five. Label above value, not below. The number is
the largest thing on the row. If the label is bigger, you have inverted it.

Make the numbers *mean something*. "1,284 documents" is furniture; "1,284
documents, 3 flagged" is a product. Derive stats from the data on screen so
they stay true when the seed changes.

## 5. The form

`rhf-zod` per CONFIG, but for a hackathon the uncontrolled version is usually
enough and takes a tenth of the time:

```tsx
"use client";
export function QuickForm({ action }: { action: (fd: FormData) => Promise<void> }) {
  const [pending, start] = React.useTransition();
  return (
    <form
      action={(fd) => start(async () => { await action(fd); toast.success("Saved"); })}
      className="flex gap-2"
    >
      <Input name="q" placeholder="Paste a URL or describe the problem" required />
      <Button type="submit" disabled={pending}>
        {pending ? <Loader2 className="size-4 animate-spin" /> : "Analyze"}
      </Button>
    </form>
  );
}
```

Non-negotiable in a demo:

- **Disable the button while pending.** Judges double-click. Every time.
- **Spinner inside the button**, not next to it. The layout must not shift.
- **Toast on success.** Silence after a submit reads as a broken app.
- **`required` + `type="email"` etc.** Native validation is free and instant.

## 6. The empty search

The state judges hit most often and teams build least often. When a filter
returns nothing, say what was searched and offer the way out:

```tsx
<EmptyState
  icon={SearchX}
  title={`No results for "${query}"`}
  body="Try a shorter query, or clear the filters to see everything."
  action={<Button variant="outline" onClick={clear}>Clear filters</Button>}
/>
```

## Motion, concretely

```tsx
import { motion } from "motion/react";

// list entrance, staggered, capped
{items.slice(0, 8).map((item, i) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2, delay: i * 0.03, ease: "easeOut" }}
  >
    <ItemCard item={item} />
  </motion.div>
))}
```

Everything else (hover, focus, color, expand) is a Tailwind `transition-*`
utility. Do not reach for a library for those.

The one delight moment, if the money shot is a number: count it up over 800ms
on mount. If it is a list: stagger it. If it is a submit: confetti, once. Pick
exactly one and put it where the demo script points.

## What not to build

Modals with multi-step flows, a settings page, a data table with sorting and
pagination, a command palette, a theme switcher, breadcrumbs, a footer. Each
is a plausible-sounding hour that no rubric rewards.
