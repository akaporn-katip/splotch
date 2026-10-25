import * as AccordionPrimitive from "@radix-ui/react-accordion";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as ToastPrimitive from "@radix-ui/react-toast";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cx } from "../../lib/cx";
import { Button, IconButton } from "./primitives";
import { Check, Close, Minus, Plus, Star } from "./icons";

const panel =
  "panel panel-plate z-50 bg-paper text-ink";

/* ------------------------------------------------------------------ dialog */

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export function DialogContent({
  children,
  className,
  title,
  description,
  kicker = "Proof sheet",
}: {
  children: ReactNode;
  className?: string;
  title: string;
  description: string;
  kicker?: string;
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        className={cx(
          "fixed inset-0 z-40 bg-ink/55",
          "data-[state=open]:animate-[rise_160ms_ease-out]",
        )}
      />
      <DialogPrimitive.Content
        className={cx(
          panel,
          "fixed left-1/2 top-1/2 z-50 w-[min(92vw,34rem)] -translate-x-1/2 -translate-y-1/2",
          "data-[state=open]:animate-[rise_220ms_var(--ease-snap)]",
          className,
        )}
      >
        <div className="flex items-center justify-between gap-4 border-b-2 border-ink bg-flag px-5 py-3 text-on-flag">
          <span className="label">{kicker}</span>
          <DialogPrimitive.Close asChild>
            <IconButton tone="ghost" size="sm" label="Close" className="text-ink">
              <Close size={18} />
            </IconButton>
          </DialogPrimitive.Close>
        </div>
        <div className="p-5 sm:p-7">
          <DialogPrimitive.Title className="display text-[clamp(1.6rem,4vw,2.25rem)]">
            {title}
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="mt-2 max-w-[46ch] text-[0.9375rem] leading-relaxed text-ink/80">
            {description}
          </DialogPrimitive.Description>
          <div className="mt-5">{children}</div>
        </div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

/* ------------------------------------------------------------ dropdown menu */

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

export function DropdownMenuContent({ children }: { children: ReactNode }) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        sideOffset={8}
        align="start"
        className={cx(
          panel,
          "min-w-56 p-1.5",
          "data-[state=open]:animate-[rise_170ms_var(--ease-snap)]",
        )}
      >
        {children}
      </DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>
  );
}

export function DropdownMenuItem({
  children,
  hint,
  danger,
  onSelect,
}: {
  children: ReactNode;
  hint?: string;
  danger?: boolean;
  onSelect?: () => void;
}) {
  return (
    <DropdownMenuPrimitive.Item
      onSelect={onSelect}
      className={cx(
        "flex cursor-pointer select-none items-center justify-between gap-6 px-2.5 py-2 text-[0.9375rem] font-medium outline-none",
        "[border-radius:3px_2px_5px_2px]",
        danger
          ? "text-error data-[highlighted]:bg-error data-[highlighted]:text-paper"
          : "data-[highlighted]:bg-flag data-[highlighted]:text-on-flag",
      )}
    >
      <span>{children}</span>
      {hint && <span className="label text-[0.6rem] opacity-60">{hint}</span>}
    </DropdownMenuPrimitive.Item>
  );
}

export function DropdownMenuLabel({ children }: { children: ReactNode }) {
  return (
    <DropdownMenuPrimitive.Label className="label px-2.5 pb-1 pt-2 text-[0.6rem] text-ink/60">
      {children}
    </DropdownMenuPrimitive.Label>
  );
}

export function DropdownMenuSeparator() {
  return <DropdownMenuPrimitive.Separator className="my-1.5 h-0.5 bg-ink/25" />;
}

export function DropdownMenuCheckboxItem({
  children,
  checked,
  onCheckedChange,
}: {
  children: ReactNode;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      checked={checked}
      onCheckedChange={onCheckedChange}
      className={cx(
        "group flex cursor-pointer select-none items-center gap-2.5 px-2.5 py-2 text-[0.9375rem] font-medium outline-none",
        "[border-radius:3px_2px_5px_2px]",
        "data-[highlighted]:bg-flag data-[highlighted]:text-on-flag",
      )}
    >
      <span className="grid h-4 w-4 place-items-center border-2 border-ink bg-paper group-data-[state=checked]:bg-accent">
        <DropdownMenuPrimitive.ItemIndicator>
          <Check size={12} />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

/* ----------------------------------------------------------------- tooltip */

export function Tooltip({
  children,
  label,
  side = "top",
}: {
  children: ReactNode;
  label: string;
  side?: "top" | "right" | "bottom" | "left";
}) {
  return (
    <TooltipPrimitive.Root delayDuration={220}>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side={side}
          sideOffset={10}
          className="z-50 max-w-56 border-2 border-ink bg-ink px-2.5 py-1.5 text-[0.8125rem] font-medium leading-snug text-paper data-[state=delayed-open]:animate-[rise_140ms_ease-out]"
          style={{ borderRadius: "4px 2px 5px 2px" }}
        >
          {label}
          <TooltipPrimitive.Arrow className="fill-ink" width={12} height={6} />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}

/* ----------------------------------------------------------------- popover */

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;

export function PopoverContent({ children }: { children: ReactNode }) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        sideOffset={8}
        align="start"
        className={cx(panel, "w-72 p-4 data-[state=open]:animate-[rise_170ms_var(--ease-snap)]")}
      >
        {children}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  );
}

/* ------------------------------------------------------------------- toast */

export const ToastProvider = ToastPrimitive.Provider;

export type ToastItem = {
  id: number;
  title: string;
  body: string;
};

export const ToastViewport = forwardRef<
  React.ComponentRef<typeof ToastPrimitive.Viewport>,
  ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(function ToastViewport({ className, ...rest }, ref) {
  return (
    <ToastPrimitive.Viewport
      ref={ref}
      className={cx(
        "fixed bottom-0 right-0 z-50 flex w-[min(94vw,25rem)] flex-col gap-3 p-4 sm:p-6",
        className,
      )}
      {...rest}
    />
  );
});

export function ToastCard({
  item,
  onOpenChange,
}: {
  item: ToastItem;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <ToastPrimitive.Root
      open
      onOpenChange={onOpenChange}
      duration={4200}
      className={cx(
        "panel relative bg-paper p-4 pr-12",
        "data-[state=open]:animate-[rise_240ms_var(--ease-snap)]",
      )}
      style={{ ["--plate" as string]: "var(--color-flag)" }}
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="grid h-5 w-5 place-items-center border-2 border-ink bg-accent text-on-accent">
          <Star size={11} />
        </span>
        <span className="label text-[0.55rem] text-ink/60">Wet ink</span>
      </div>
      <ToastPrimitive.Title className="display text-lg leading-none">
        {item.title}
      </ToastPrimitive.Title>
      <ToastPrimitive.Description className="mt-1.5 text-[0.875rem] leading-snug text-ink/80">
        {item.body}
      </ToastPrimitive.Description>
      <ToastPrimitive.Close asChild>
        <IconButton
          size="sm"
          tone="ghost"
          label="Dismiss"
          className="absolute right-2 top-2"
        >
          <Close size={16} />
        </IconButton>
      </ToastPrimitive.Close>
    </ToastPrimitive.Root>
  );
}

/* -------------------------------------------------------------------- tabs */

export const Tabs = TabsPrimitive.Root;

export function TabsList({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <TabsPrimitive.List
      aria-label={label}
      className="flex flex-wrap items-end gap-x-1 gap-y-2"
    >
      {children}
    </TabsPrimitive.List>
  );
}

export function TabsTrigger({ value, children }: { value: string; children: ReactNode }) {
  return (
    <TabsPrimitive.Trigger
      value={value}
      className={cx(
        "label relative -mb-0.5 border-2 border-ink px-3 py-2.5 text-[0.65rem] text-ink transition-[translate] duration-150",
        "[border-radius:7px_3px_0_0]",
        "bg-paper-2 hover:bg-flag/50",
        "data-[state=active]:translate-y-0 data-[state=active]:bg-paper data-[state=active]:pb-3.5",
        "data-[state=inactive]:translate-y-1",
      )}
    >
      {children}
    </TabsPrimitive.Trigger>
  );
}

export function TabsContent({
  value,
  children,
  className,
}: {
  value: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <TabsPrimitive.Content
      value={value}
      className={cx("outline-none", className)}
    >
      {children}
    </TabsPrimitive.Content>
  );
}

/* --------------------------------------------------------------- accordion */

export const Accordion = AccordionPrimitive.Root;

/* ------------------------------------------------------------- context menu */

export const ContextMenu = ContextMenuPrimitive.Root;
export const ContextMenuTrigger = ContextMenuPrimitive.Trigger;

export function ContextMenuContent({ children }: { children: ReactNode }) {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        className={cx(panel, "min-w-52 p-1.5 data-[state=open]:animate-[rise_150ms_var(--ease-snap)]")}
      >
        {children}
      </ContextMenuPrimitive.Content>
    </ContextMenuPrimitive.Portal>
  );
}

export function ContextMenuItem({
  children,
  hint,
}: {
  children: ReactNode;
  hint?: string;
}) {
  return (
    <ContextMenuPrimitive.Item
      className={cx(
        "flex cursor-pointer select-none items-center justify-between gap-6 px-2.5 py-2 text-[0.9375rem] font-medium outline-none",
        "[border-radius:3px_2px_5px_2px]",
        "data-[highlighted]:bg-flag data-[highlighted]:text-on-flag",
      )}
    >
      <span>{children}</span>
      {hint && <span className="label text-[0.6rem] opacity-60">{hint}</span>}
    </ContextMenuPrimitive.Item>
  );
}

export function ContextMenuSeparator() {
  return <ContextMenuPrimitive.Separator className="my-1.5 h-0.5 bg-ink/25" />;
}

export function AccordionItem({
  value,
  question,
  children,
}: {
  value: string;
  question: string;
  children: ReactNode;
}) {
  return (
    <AccordionPrimitive.Item value={value} className="border-b-2 border-ink/25">
      <AccordionPrimitive.Header>
        <AccordionPrimitive.Trigger
          className={cx(
            "group flex w-full items-center justify-between gap-4 py-4 text-left",
            "text-[1.0625rem] font-medium text-ink hover:text-[color-mix(in_oklab,var(--color-accent)_74%,var(--color-ink))]",
          )}
        >
          {question}
          <span className="grid h-7 w-7 shrink-0 place-items-center border-2 border-ink bg-paper [border-radius:4px_2px_5px_2px] group-data-[state=open]:bg-accent">
            <Plus size={14} className="group-data-[state=open]:hidden" />
            <Minus size={14} className="hidden group-data-[state=open]:block" />
          </span>
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Content className="overflow-hidden data-[state=open]:animate-[rise_220ms_ease-out]">
        <div className="max-w-[62ch] pb-5 text-[0.9375rem] leading-relaxed text-ink/80">
          {children}
        </div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  );
}

export { Button };
