# App UI — the `(app)` product surface

A front-end-only shop-management surface: the board, repair orders, the week
schedule, and parts. It runs entirely on typed mock data. No database, no auth,
no API routes, no network calls.

This is separate from `app/(platform)/`, which is the real, backed product
surface (Prisma + Clerk + Vapi webhooks). The two coexist deliberately — see
[Relationship to `(platform)`](#relationship-to-platform).

## Route map

| Route | File | Rendering |
| --- | --- | --- |
| `/board` | `app/(app)/board/page.tsx` | Static. Stat strip + filterable live board. |
| `/repair-orders` | `app/(app)/repair-orders/page.tsx` | Static. Search over RO/customer/plate/VIN + status filter. |
| `/repair-orders/[ro]` | `app/(app)/repair-orders/[ro]/page.tsx` | SSG via `generateStaticParams` — one page per RO. |
| `/schedule` | `app/(app)/schedule/page.tsx` | Static. Bays as rows, days as columns. |
| `/parts` | `app/(app)/parts/page.tsx` | Static. Purchase orders + back-order callout. |
| unknown id | `app/(app)/not-found.tsx` | Styled 404, reached via `notFound()`. |

The shell lives in `app/(app)/layout.tsx`: fixed black rail (220px on `lg`,
icon-only 64px on `md`, bottom bar below), and a sticky top bar with a blinking
LIVE dot, shop name, date, and computed counts.

These routes are **not** in `middleware.ts`'s matcher, so they are public. Add
them there if they should ever require a session.

## Where the mock data lives

All of it is in `lib/mock/`, one file per entity, all importing `types.ts`:

| File | Exports |
| --- | --- |
| `types.ts` | `Customer`, `Vehicle`, `RepairOrder`, `PartOrder`, `TimelineEvent`, `Shop`, and the status unions. |
| `customers.ts` | `customers`, `getCustomer(id)` — 25 records. |
| `vehicles.ts` | `vehicles`, `getVehicle(id)`, `getVehiclesForCustomer(id)` — 30 records. |
| `repair-orders.ts` | `repairOrders`, `getRepairOrder(ro)`, `orderSubtotal(order)`, `STATUS_LABELS` — 18 records, each with a timeline. |
| `parts.ts` | `partOrders`, `partOrderTotal`, `backOrdered`, `PART_STATUS_LABELS` — 15 records. |
| `shop.ts` | `shop` — name, address, $145/hr labor rate, tax rate, bay count, hours. |
| `time.ts` | `daysAgo`, `hoursAgo`, `minutesAgo`, `dayAt`, `todayIndex`. |
| `index.ts` | Barrel + derived stats (`getBoardStats`) + the integrity gate. |

Two properties worth preserving:

**Dates are always relative.** Every timestamp is derived at module load from a
fixed offset in `time.ts`, so the data never rots into a stale calendar date.
Do not hardcode a date anywhere in `lib/mock/`.

**Cross-references are enforced.** `lib/mock/index.ts` runs
`assertReferentialIntegrity()` at module load and throws if an RO points at a
missing vehicle, a vehicle at a missing customer, an RO/vehicle pair whose
owners disagree, or a part order at a missing RO. A typo therefore fails
`npm run build` instead of producing a blank page at runtime.

**Counts are computed once.** `getBoardStats()` derives cars-in-bays, bays-free,
awaiting-approval, calls-answered-today, and average reply time from the arrays.
The shell badge and the board tiles read the same function, so they cannot
disagree. Never type a count in twice.

## Shared components

In `components/app/`, used across every screen — restyle here, not per page:

- `primitives.tsx` — `Eyebrow`, `Panel`, `PageHeader`, `StatTile`, `StatStrip`,
  `StatusPill`, `EmptyState`.
- `data-table.tsx` — generic `DataTable<T>` with the mobile card fallback built
  in. Real `<table>` semantics on `md`+, stacked cards below. Never a
  horizontally scrolling table.
- `timeline.tsx` — reverse-chronological RO history.
- `filter-chips.tsx`, `search-input.tsx` — the only two client components in the
  kit (`"use client"`), both controlled by their parent.
- `format.ts` — currency/date/mileage formatters with the locale pinned to
  `en-US` so server output is deterministic and hydration never disagrees.

## Design language

Extends what the repo already uses rather than introducing a second system:
cream ground `#f7f4ee`, black rail `zinc-950`, white panels, `rounded-3xl`,
`shadow-card`, zinc text.

One rule carries meaning and should not be broken casually:

> **Emerald means ZOL did it unattended. Amber means a person is the blocker.**

That is why `StatusPill` takes `tone="zol" | "human"`, why the timeline icons
differ, and why an untouched Tuesday morning on `/schedule` is amber rather than
grey — idle capacity is a problem, not neutral space.

Animations (`.app-row`, `.app-led`) are appended at the bottom of
`app/globals.css` and are disabled under `prefers-reduced-motion: reduce`.

## What to replace when a real backend arrives

The mock layer is deliberately shaped like a query layer, so the swap is
mechanical:

1. **Replace the accessors, keep the signatures.** `getRepairOrder(ro)`,
   `getCustomer(id)`, `getVehicle(id)`, `getBoardStats()` become `async`
   functions hitting Prisma. The pages already `await params`, so making the
   page bodies await data is a local change.
2. **Delete `assertReferentialIntegrity()`.** Foreign keys in the database
   replace it. It exists only because the data is hand-written.
3. **Delete `lib/mock/time.ts` and use real columns.** The relative-offset trick
   is a fixture concern; real rows carry real timestamps.
4. **Move the types.** `lib/mock/types.ts` should give way to the Prisma-generated
   types. Keep the `Actor` union (`"zol" | "human"`) — it encodes the emerald/amber
   rule and has no Prisma equivalent.
5. **Add the route matcher.** Put `/board`, `/repair-orders`, `/schedule`, and
   `/parts` into `middleware.ts` so they require a session, and scope every
   query by `workspaceId` the way `(platform)` already does.
6. **Reconsider `generateStaticParams`.** `/repair-orders/[ro]` is prerendered
   for all 18 fixtures today; with real data it should be dynamic.

## Known gaps

- `/inbox`, `/customers`, and `/settings` were **not** built here. `(platform)`
  already ships `/conversations`, `/customers`, and `/setup/ai-employee` against
  real data; duplicating them on mock data would have created two competing
  versions of the same screen.
- Nothing persists. There are no mutations, so there is no in-memory composer or
  "take over" toggle on this surface.
