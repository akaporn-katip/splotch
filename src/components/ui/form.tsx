import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import * as SelectPrimitive from "@radix-ui/react-select";
import * as SliderPrimitive from "@radix-ui/react-slider";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { useId } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cx } from "../../lib/cx";
import { Check, ChevronDown } from "./icons";

/* ------------------------------------------------------------------ labels */

export function Label({
  children,
  htmlFor,
  className,
}: {
  children: ReactNode;
  htmlFor?: string;
  className?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cx("label block text-[0.7rem] text-ink", className)}
    >
      {children}
    </label>
  );
}

export function Help({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <p id={id} className="mt-1.5 text-[0.8125rem] leading-snug text-ink/75">
      {children}
    </p>
  );
}

export function ErrorText({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <p
      id={id}
      className="mt-1.5 flex items-start gap-1.5 text-[0.8125rem] font-medium leading-snug text-error"
    >
      <span aria-hidden="true" className="mt-[0.45em] block h-[1px] w-3 shrink-0 bg-current" />
      {children}
    </p>
  );
}

/* --------------------------------------------------------------- text field */

export type InputProps = ComponentPropsWithoutRef<"input"> & {
  label?: string;
  hint?: string;
  error?: string;
};

export function Input({ label, hint, error, className, id, ...rest }: InputProps) {
  const auto = useId();
  const fieldId = id ?? auto;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  return (
    <div className="w-full">
      {label && <Label htmlFor={fieldId}>{label}</Label>}
      <input
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={cx(hintId, errorId) || undefined}
        className={cx("field mt-1.5", className)}
        {...rest}
      />
      {error ? <ErrorText id={errorId}>{error}</ErrorText> : hint ? <Help id={hintId}>{hint}</Help> : null}
    </div>
  );
}

export function Textarea({
  label,
  hint,
  className,
  id,
  ...rest
}: ComponentPropsWithoutRef<"textarea"> & { label?: string; hint?: string }) {
  const auto = useId();
  const fieldId = id ?? auto;
  return (
    <div className="w-full">
      {label && <Label htmlFor={fieldId}>{label}</Label>}
      <textarea
        id={fieldId}
        className={cx("field mt-1.5 min-h-24 resize-y", className)}
        {...rest}
      />
      {hint && <Help id={`${fieldId}-hint`}>{hint}</Help>}
    </div>
  );
}

/* ------------------------------------------------------------------ switch */

export function Switch({
  label,
  checked,
  onCheckedChange,
  disabled,
  id,
}: {
  label: string;
  checked?: boolean;
  onCheckedChange?: (v: boolean) => void;
  disabled?: boolean;
  id?: string;
}) {
  const auto = useId();
  const switchId = id ?? auto;
  return (
    <div className="flex items-center gap-3">
      <SwitchPrimitive.Root
        id={switchId}
        aria-label={label}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className={cx(
          "group relative h-8 w-14 shrink-0 border-2 border-ink bg-paper-2 transition-colors duration-150",
          "[border-radius:5px_3px_6px_3px/4px_6px_3px_5px]",
          "data-[state=checked]:bg-accent",
          "disabled:cursor-not-allowed disabled:opacity-55",
        )}
      >
        <span
          aria-hidden="true"
          className={cx(
            "dots pointer-events-none absolute inset-0 opacity-20",
            "[border-radius:inherit]",
          )}
        />
        <SwitchPrimitive.Thumb
          className={cx(
            "block h-5 w-5 border-2 border-ink bg-paper shadow-[1px_1px_0_0_var(--color-ink)]",
            "[border-radius:50%]",
            "transition-transform duration-150 ease-[cubic-bezier(.2,.9,.1,1.06)]",
            "translate-x-1 data-[state=checked]:translate-x-[1.85rem]",
          )}
        />
      </SwitchPrimitive.Root>
      <label htmlFor={switchId} className="cursor-pointer select-none text-[0.9375rem] font-medium">
        {label}
      </label>
    </div>
  );
}

/* ---------------------------------------------------------------- checkbox */

export function Checkbox({
  label,
  hint,
  checked,
  onCheckedChange,
  disabled,
  id,
}: {
  label: ReactNode;
  hint?: string;
  checked?: boolean | "indeterminate";
  onCheckedChange?: (v: boolean | "indeterminate") => void;
  disabled?: boolean;
  id?: string;
}) {
  const auto = useId();
  const boxId = id ?? auto;
  return (
    <div className="flex items-start gap-2.5">
      <CheckboxPrimitive.Root
        id={boxId}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className={cx(
          "mt-0.5 grid h-[22px] w-[22px] shrink-0 place-items-center border-2 border-ink bg-paper",
          "[border-radius:5px_2px_6px_3px]",
          "transition-colors duration-150",
          "data-[state=checked]:bg-accent data-[state=indeterminate]:bg-flag",
          "disabled:cursor-not-allowed disabled:opacity-55",
        )}
      >
        <CheckboxPrimitive.Indicator className="text-ink">
          <Check size={16} />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      <div className="leading-tight">
        <label htmlFor={boxId} className="cursor-pointer select-none text-[0.9375rem] font-medium">
          {label}
        </label>
        {hint && <p className="mt-1 text-[0.8125rem] text-ink/70">{hint}</p>}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- radio group */

export function RadioGroup({
  label,
  options,
  value,
  onValueChange,
  className,
}: {
  label: string;
  options: Array<{ value: string; label: string; hint?: string }>;
  value?: string;
  onValueChange?: (v: string) => void;
  className?: string;
}) {
  return (
    <RadioGroupPrimitive.Root
      aria-label={label}
      value={value}
      onValueChange={onValueChange}
      className={cx("grid gap-3", className)}
    >
      {options.map((o) => (
        <div key={o.value} className="flex items-start gap-2.5">
          <RadioGroupPrimitive.Item
            id={`radio-${o.value}`}
            value={o.value}
            className={cx(
              "mt-0.5 grid h-[22px] w-[22px] shrink-0 place-items-center border-2 border-ink bg-paper [border-radius:50%]",
              "data-[state=checked]:bg-accent",
            )}
          >
            <RadioGroupPrimitive.Indicator className="block h-2.5 w-2.5 bg-ink [border-radius:50%]" />
          </RadioGroupPrimitive.Item>
          <div className="leading-tight">
            <label
              htmlFor={`radio-${o.value}`}
              className="cursor-pointer select-none text-[0.9375rem] font-medium"
            >
              {o.label}
            </label>
            {o.hint && <p className="mt-1 text-[0.8125rem] text-ink/70">{o.hint}</p>}
          </div>
        </div>
      ))}
    </RadioGroupPrimitive.Root>
  );
}

/* ------------------------------------------------------------------ slider */

export function Slider({
  label,
  value,
  onValueChange,
  min = 1,
  max = 10,
  step = 1,
  suffix,
  disabled,
}: {
  label: string;
  value: number[];
  onValueChange: (v: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  disabled?: boolean;
}) {
  const id = useId();
  return (
    <div className="w-full">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="label text-[0.7rem] text-ink">
          {label}
        </label>
        <output
          htmlFor={id}
          className="display text-lg leading-none tabular-nums text-ink"
        >
          {value[0]}
          {suffix && <span className="ml-0.5 font-sans text-xs font-semibold">{suffix}</span>}
        </output>
      </div>
      <SliderPrimitive.Root
        id={id}
        value={value}
        onValueChange={onValueChange}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className="relative flex h-6 w-full touch-none items-center select-none"
      >
        <SliderPrimitive.Track className="relative h-3 w-full grow overflow-hidden border-2 border-ink bg-paper-2 [border-radius:3px]">
          <span aria-hidden="true" className="dots-fine absolute inset-0 opacity-30" />
          <SliderPrimitive.Range className="absolute inset-y-0 bg-accent" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          aria-label={label}
          className={cx(
            "block h-5 w-5 border-2 border-ink bg-paper",
            "shadow-[1px_1px_0_0_var(--color-ink)]",
            "[border-radius:2px] rotate-45",
            "hover:bg-flag data-[state=active]:bg-flag",
          )}
        />
      </SliderPrimitive.Root>
    </div>
  );
}

/* ------------------------------------------------------------------ select */

const selectItem = cx(
  "relative flex cursor-pointer select-none items-center gap-2 px-3 py-2 text-[0.9375rem] font-medium",
  "outline-none data-[highlighted]:bg-flag data-[highlighted]:text-on-flag",
  "[border-radius:3px_2px_4px_2px]",
);

export function Select({
  label,
  options,
  value,
  onValueChange,
  placeholder = "Pick one",
  disabled,
}: {
  label?: string;
  options: Array<{ value: string; label: string }>;
  value?: string;
  onValueChange?: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  const id = useId();
  return (
    <div className="w-full">
      {label && <Label htmlFor={id}>{label}</Label>}
      <SelectPrimitive.Root value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectPrimitive.Trigger
          id={id}
          className="field mt-1.5 flex items-center justify-between gap-3 text-left data-[placeholder]:text-ink/65"
        >
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon>
            <ChevronDown size={18} />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            position="popper"
            sideOffset={7}
            className={cx(
              "panel panel-plate z-50 max-h-72 min-w-[var(--radix-select-trigger-width)] overflow-hidden p-1.5",
              "data-[state=open]:animate-[rise_180ms_var(--ease-snap)]",
            )}
          >
            <SelectPrimitive.Viewport>
              {options.map((o) => (
                <SelectPrimitive.Item key={o.value} value={o.value} className={selectItem}>
                  <SelectPrimitive.ItemText>{o.label}</SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator className="ml-auto">
                    <Check size={16} />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    </div>
  );
}

/* ------------------------------------------------------------- toggle group */

export function ToggleGroup({
  label,
  options,
  value,
  onValueChange,
}: {
  label: string;
  options: string[];
  value: string;
  onValueChange: (v: string) => void;
}) {
  return (
    <ToggleGroupPrimitive.Root
      type="single"
      aria-label={label}
      value={value}
      onValueChange={(v) => v && onValueChange(v)}
      className="inline-flex border-2 border-ink bg-paper [border-radius:6px_3px_7px_3px]"
    >
      {options.map((o, i) => (
        <ToggleGroupPrimitive.Item
          key={o}
          value={o}
          className={cx(
            "label px-3 py-2 text-[0.65rem] text-ink transition-colors",
            i > 0 && "border-l-2 border-ink",
            "hover:bg-flag/60",
            "data-[state=on]:bg-ink data-[state=on]:text-paper",
          )}
        >
          {o}
        </ToggleGroupPrimitive.Item>
      ))}
    </ToggleGroupPrimitive.Root>
  );
}
