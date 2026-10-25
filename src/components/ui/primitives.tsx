import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";
import { cx } from "../../lib/cx";

/* ------------------------------------------------------------------ button */

type Tone = "paper" | "solid" | "flag" | "ink" | "ghost";

export type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  tone?: Tone;
  size?: "md" | "sm";
  plate?: string;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { tone = "paper", size = "md", plate, className, type = "button", style, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      data-tone={tone}
      className={cx(
        "btn",
        tone === "paper" && "btn-paper",
        tone === "solid" && "btn-solid",
        tone === "flag" && "btn-flag",
        tone === "ink" && "btn-ink",
        tone === "ghost" && "btn-ghost",
        size === "sm" && "btn-sm",
        className,
      )}
      style={plate ? { ...style, ["--plate" as string]: plate } : style}
      {...rest}
    />
  );
});

export type IconButtonProps = ButtonProps & {
  label: string;
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, className, ...rest },
  ref,
) {
  return (
    <Button ref={ref} aria-label={label} className={cx("btn-icon", className)} {...rest} />
  );
});

/* ------------------------------------------------------------------- badge */

export function Badge({
  children,
  tone = "flag",
  className,
}: {
  children: React.ReactNode;
  tone?: "flag" | "solid" | "ink" | "paper";
  className?: string;
}) {
  const tones: Record<string, string> = {
    flag: "bg-flag text-on-flag border-ink",
    solid: "bg-accent text-on-accent border-ink",
    ink: "bg-ink text-paper border-ink",
    paper: "bg-paper text-ink border-ink",
  };
  return (
    <span
      className={cx(
        "label inline-flex items-center gap-1.5 border-2 px-2 py-1 leading-none",
        "[border-radius:6px_2px_7px_3px/3px_7px_2px_6px]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ avatar */

export function Avatar({
  name,
  src,
  size = 44,
  className,
}: {
  name: string;
  src?: string;
  size?: number;
  className?: string;
}) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  return (
    <AvatarPrimitive.Root
      className={cx(
        "inline-grid place-items-center overflow-hidden border-2 border-ink bg-paper",
        "[border-radius:46%_54%_55%_45%/52%_44%_56%_48%]",
        className,
      )}
      style={{ width: size, height: size }}
    >
      {src && (
        <AvatarPrimitive.Image
          src={src}
          alt={name}
          className="h-full w-full object-cover"
        />
      )}
      <AvatarPrimitive.Fallback
        delayMs={src ? 200 : 0}
        className="display grid h-full w-full place-items-center bg-flag text-ink"
        style={{ fontSize: size * 0.4 }}
      >
        {initials}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}

/* ---------------------------------------------------------------- progress */

export function Progress({
  value,
  label,
  className,
}: {
  value: number;
  label?: string;
  className?: string;
}) {
  return (
    <div className={cx("w-full", className)}>
      {label && (
        <div className="label mb-1.5 flex items-baseline justify-between gap-3 text-ink/70">
          <span>{label}</span>
          <span className="tabular-nums">{value}%</span>
        </div>
      )}
      <ProgressPrimitive.Root
        value={value}
        aria-label={label ?? "Progress"}
        className="relative h-4 w-full overflow-hidden border-2 border-ink bg-paper-2 [border-radius:5px_2px_6px_3px]"
      >
        <div className="dots pointer-events-none absolute inset-0 opacity-25" />
        <ProgressPrimitive.Indicator
          className="h-full bg-accent transition-[width] duration-500 ease-out"
          style={{ width: `${value}%` }}
        />
      </ProgressPrimitive.Root>
    </div>
  );
}

/* --------------------------------------------------------------- apparatus */

export function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="label inline-flex min-w-6 items-center justify-center border-2 border-ink bg-paper px-1.5 py-0.5 text-[0.65rem] text-ink [border-radius:4px_2px_5px_2px] shadow-[1.5px_1.5px_0_0_var(--color-ink)]">
      {children}
    </kbd>
  );
}

export function RegMark({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cx("regmark", className)} />;
}
