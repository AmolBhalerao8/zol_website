import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Eyebrow } from "./primitives";

export type Column<T> = {
  /** Stable key, also used as the React key for cells. */
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
  /**
   * The identifying column. On mobile it becomes the card's headline and
   * carries the row link; elsewhere it renders like any other cell.
   */
  primary?: boolean;
  /** Hide this column on the mobile card fallback. */
  hideOnCard?: boolean;
};

export type DataTableProps<T> = {
  columns: Column<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  /** When present, the primary cell renders as a link to this href. */
  getRowHref?: (row: T) => string;
  caption: string;
  empty?: ReactNode;
  /** Adds the staggered entrance used on the board. */
  stagger?: boolean;
};

/**
 * One table idiom for the whole app. Renders real `<table>` semantics on md and
 * up, and collapses to stacked cards below that -- never a horizontally
 * scrolling table.
 */
export function DataTable<T>({
  columns,
  rows,
  getRowKey,
  getRowHref,
  caption,
  empty,
  stagger = false,
}: DataTableProps<T>) {
  if (rows.length === 0 && empty) {
    return <>{empty}</>;
  }

  const primary = columns.find((column) => column.primary) ?? columns[0];
  const cardColumns = columns.filter((column) => column !== primary && !column.hideOnCard);

  return (
    <>
      {/* Desktop: real table semantics. */}
      <div className="hidden md:block">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="border-b border-zinc-200">
              {columns.map((column) => (
                <th key={column.key} scope="col" className={cn("px-5 py-3", column.className)}>
                  <Eyebrow>{column.header}</Eyebrow>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const href = getRowHref?.(row);
              return (
                <tr
                  key={getRowKey(row)}
                  className={cn(
                    "border-b border-zinc-100 transition-colors last:border-b-0 hover:bg-zinc-50",
                    stagger && "app-row",
                  )}
                  style={stagger ? { animationDelay: `${index * 45}ms` } : undefined}
                >
                  {columns.map((column) => {
                    const content = column.cell(row);
                    return (
                      <td key={column.key} className={cn("px-5 py-4 align-middle", column.className)}>
                        {column === primary && href ? (
                          <Link
                            href={href}
                            className="rounded-sm font-medium text-zinc-950 underline-offset-4 hover:underline"
                          >
                            {content}
                          </Link>
                        ) : (
                          content
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile: stacked cards carrying the same data. */}
      <ul className="divide-y divide-zinc-100 md:hidden">
        {rows.map((row, index) => {
          const href = getRowHref?.(row);
          const headline = primary.cell(row);
          return (
            <li
              key={getRowKey(row)}
              className={cn("p-5", stagger && "app-row")}
              style={stagger ? { animationDelay: `${index * 45}ms` } : undefined}
            >
              <div className="font-medium text-zinc-950">
                {href ? (
                  <Link href={href} className="underline-offset-4 hover:underline">
                    {headline}
                  </Link>
                ) : (
                  headline
                )}
              </div>
              <dl className="mt-3 space-y-2">
                {cardColumns.map((column) => (
                  <div key={column.key} className="flex items-start justify-between gap-4">
                    <dt>
                      <Eyebrow>{column.header}</Eyebrow>
                    </dt>
                    <dd className="text-right text-sm text-zinc-700">{column.cell(row)}</dd>
                  </div>
                ))}
              </dl>
            </li>
          );
        })}
      </ul>
    </>
  );
}
