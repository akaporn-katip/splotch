import * as PopoverPrimitive from "@radix-ui/react-popover";
import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { cx } from "../../lib/cx";
import { Label } from "./form";
import { IconButton } from "./primitives";
import { CalendarIcon, ChevronLeft, ChevronRight } from "./icons";

/**
 * A month printed as a grid of days. Radix Popover owns the opening, the escape
 * key and the return of focus to the trigger; the arrow keys, the month paging
 * and the roving tab stop are ours, because no primitive draws a calendar.
 */

function startOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function addDays(date: Date, days: number): Date {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function daysInMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

function addMonths(date: Date, months: number): Date {
  const day = date.getDate();
  const copy = new Date(date.getFullYear(), date.getMonth() + months, 1);
  copy.setDate(Math.min(day, daysInMonth(copy)));
  return copy;
}

function startOfWeek(date: Date, weekStartsOn: number): Date {
  const shift = (date.getDay() - weekStartsOn + 7) % 7;
  return addDays(date, -shift);
}

/** Local calendar day, never UTC: toISOString() would shift the date east of Greenwich. */
function dayKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function isSameDay(a: Date | undefined, b: Date | undefined): boolean {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** Six rows at most, dropping a trailing week that belongs entirely to the next month. */
function weeksOfMonth(month: Date, weekStartsOn: number): Date[][] {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const gridStart = startOfWeek(first, weekStartsOn);
  const weeks: Date[][] = [];

  for (let week = 0; week < 6; week += 1) {
    const row: Date[] = [];
    for (let day = 0; day < 7; day += 1) row.push(addDays(gridStart, week * 7 + day));
    const offMonth = row.every((date) => date.getMonth() !== month.getMonth());
    if (offMonth && weeks.length >= 4) break;
    weeks.push(row);
  }

  return weeks;
}

export type DatePickerProps = {
  value?: Date;
  onValueChange?: (date: Date) => void;
  label?: string;
  hint?: string;
  placeholder?: string;
  /** Any BCP 47 tag. Defaults to the runtime locale. */
  locale?: string;
  /** 0 = Sunday. Defaults to Monday, as the printed sheet reads. */
  weekStartsOn?: number;
  min?: Date;
  max?: Date;
  disabled?: boolean;
  id?: string;
  className?: string;
};

export function DatePicker({
  value,
  onValueChange,
  label,
  hint,
  placeholder = "Pick a date",
  locale,
  weekStartsOn = 1,
  min,
  max,
  disabled,
  id,
  className,
}: DatePickerProps) {
  const auto = useId();
  const fieldId = id ?? auto;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const monthId = `${fieldId}-month`;

  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState<Date>(() => startOfDay(value ?? new Date()));
  const [month, setMonth] = useState<Date>(() => {
    const anchor = value ?? new Date();
    return new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  });
  const gridRef = useRef<HTMLDivElement>(null);

  const lo = min ? startOfDay(min) : undefined;
  const hi = max ? startOfDay(max) : undefined;
  const outOfRange = (date: Date) => Boolean((lo && date < lo) || (hi && date > hi));

  const format = (options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(locale, options);
  const longDay = format({ weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const shortDate = format({ day: "2-digit", month: "short", year: "numeric" });
  const monthTitle = format({ month: "long", year: "numeric" });
  const weekday = format({ weekday: "short" });

  const today = startOfDay(new Date());

  function focusDay() {
    gridRef.current?.querySelector<HTMLButtonElement>('[data-focused="true"]')?.focus();
  }

  useEffect(() => {
    if (!open) return;
    focusDay();
  }, [open, focused]);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) return;
    const anchor = value ?? today;
    setFocused(startOfDay(anchor));
    setMonth(new Date(anchor.getFullYear(), anchor.getMonth(), 1));
  }

  function moveTo(next: Date) {
    const clamped = lo && next < lo ? lo : hi && next > hi ? hi : next;
    setFocused(clamped);
    setMonth(new Date(clamped.getFullYear(), clamped.getMonth(), 1));
  }

  function handleKeys(event: KeyboardEvent<HTMLDivElement>) {
    const anchor = focused;
    switch (event.key) {
      case "ArrowLeft":
        moveTo(addDays(anchor, -1));
        break;
      case "ArrowRight":
        moveTo(addDays(anchor, 1));
        break;
      case "ArrowUp":
        moveTo(addDays(anchor, -7));
        break;
      case "ArrowDown":
        moveTo(addDays(anchor, 7));
        break;
      case "Home":
        moveTo(startOfWeek(anchor, weekStartsOn));
        break;
      case "End":
        moveTo(addDays(startOfWeek(anchor, weekStartsOn), 6));
        break;
      case "PageUp":
        moveTo(addMonths(anchor, event.shiftKey ? -12 : -1));
        break;
      case "PageDown":
        moveTo(addMonths(anchor, event.shiftKey ? 12 : 1));
        break;
      default:
        return;
    }
    event.preventDefault();
  }

  function pick(date: Date) {
    onValueChange?.(startOfDay(date));
    setOpen(false);
  }

  const weekdays = Array.from({ length: 7 }, (_, index) =>
    weekday.format(addDays(startOfWeek(today, weekStartsOn), index)),
  );

  return (
    <div className={cx("w-full", className)}>
      {label && <Label id={`${fieldId}-label`}>{label}</Label>}

      <PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange}>
        <PopoverPrimitive.Trigger asChild disabled={disabled}>
          <button
            type="button"
            id={fieldId}
            aria-describedby={hintId}
            aria-labelledby={label ? `${fieldId}-label ${fieldId}-value` : undefined}            className={cx("field mt-1.5 flex items-center justify-between gap-3 text-left")}
          >
            <span id={`${fieldId}-value`} className={cx("truncate", !value && "text-ink/60")}>
              {value ? shortDate.format(value) : placeholder}
            </span>
            <CalendarIcon size={17} className="shrink-0 text-ink/70" />
          </button>
        </PopoverPrimitive.Trigger>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            sideOffset={8}
            align="start"
            // Radix would park focus on the first focusable child (the month
            // arrows). The interesting focus target is the day itself.
            onOpenAutoFocus={(event) => {
              event.preventDefault();
              focusDay();
            }}
            className={cx(
              "panel panel-plate z-50 w-[19.5rem] bg-paper p-3 text-ink",
              "data-[state=open]:animate-[rise_170ms_var(--ease-snap)]",
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <IconButton
                type="button"
                tone="ghost"
                size="sm"
                label="Previous month"
                onClick={() => setMonth(addMonths(month, -1))}
              >
                <ChevronLeft size={17} />
              </IconButton>
              <p
                id={monthId}
                aria-live="polite"
                className="display text-[1rem] leading-none tracking-[0.01em]"
              >
                {monthTitle.format(month)}
              </p>
              <IconButton
                type="button"
                tone="ghost"
                size="sm"
                label="Next month"
                onClick={() => setMonth(addMonths(month, 1))}
              >
                <ChevronRight size={17} />
              </IconButton>
            </div>

            <div
              ref={gridRef}
              role="grid"
              aria-labelledby={monthId}
              onKeyDown={handleKeys}
              className="mt-2.5"
            >
              <div role="row" className="grid grid-cols-7">
                {weekdays.map((name, index) => (
                  <span
                    key={`${name}-${index}`}
                    role="columnheader"
                    className="label grid h-7 place-items-center text-[0.55rem] text-ink/70"
                  >
                    {name}
                  </span>
                ))}
              </div>

              {weeksOfMonth(month, weekStartsOn).map((week) => (
                <div role="row" key={dayKey(week[0])} className="grid grid-cols-7 gap-y-0.5">
                  {week.map((date) => {
                    const selected = isSameDay(date, value);
                    const isToday = isSameDay(date, today);
                    const offMonth = date.getMonth() !== month.getMonth();
                    const blocked = outOfRange(date);
                    const isFocused = isSameDay(date, focused);

                    return (
                      <div
                        key={dayKey(date)}
                        role="gridcell"
                        aria-selected={selected}
                        className="grid"
                      >
                        <button
                          type="button"
                          tabIndex={isFocused ? 0 : -1}
                          data-focused={isFocused ? "true" : undefined}
                          data-day={dayKey(date)}
                          aria-label={longDay.format(date)}
                          aria-current={isToday ? "date" : undefined}
                          disabled={blocked}
                          onClick={() => pick(date)}
                          style={{ borderRadius: "var(--radius-cut-sm)" }}
                          className={cx(
                            "grid h-9 place-items-center text-[0.8125rem] font-medium tabular-nums transition-colors duration-150",
                            selected
                              ? "bg-accent text-on-accent"
                              : cx(
                                  "hover:bg-flag hover:text-on-flag",
                                  offMonth ? "text-ink/60" : "text-ink",
                                ),
                            isToday && "outline-2 -outline-offset-2 outline-ink",
                            blocked &&
                              "cursor-not-allowed text-ink/60 [background-image:repeating-linear-gradient(45deg,transparent,transparent_3px,color-mix(in_oklab,var(--color-ink)_18%,transparent)_3px,color-mix(in_oklab,var(--color-ink)_18%,transparent)_4px)] hover:bg-transparent",
                          )}
                        >
                          {date.getDate()}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>

      {hint && <p id={hintId} className="mt-1.5 text-[0.8125rem] leading-snug text-ink/75">{hint}</p>}
    </div>
  );
}
