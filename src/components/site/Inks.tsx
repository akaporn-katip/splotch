import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { useState } from "react";
import { Button, Badge } from "../ui/primitives";
import { Slider, Switch } from "../ui/form";
import { Check, Star } from "../ui/icons";
import { INKS, useShop } from "../../lib/shop";
import { cx } from "../../lib/cx";

export function Inks() {
  const { ink, setInk, reg, setReg, dots, setDots, toast } = useShop();
  const [pass, setPass] = useState(0);
  const current = INKS.find((i) => i.id === ink) ?? INKS[0];

  return (
    <section id="inks" className="relative overflow-hidden py-16 sm:py-24">
      <div
        aria-hidden="true"
        className="dots pointer-events-none absolute -right-24 bottom-0 h-[26rem] w-[26rem] rounded-full opacity-20"
      />
      <div className="relative mx-auto w-full max-w-[1240px] px-4 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-end">
          <div>
            <div className="mb-3 flex items-center gap-3 text-highlight">
              <span className="label text-[0.6rem] text-on-field/80">Plate 04 · Inks</span>
              <span aria-hidden="true" className="h-0.5 w-10 bg-current" />
            </div>
            <h2 className="display text-[clamp(2.1rem,5.4vw,3.9rem)] text-on-field">
              The ink room.
              <br />
              <span className="text-highlight">Four taps and a reprint.</span>
            </h2>
          </div>
          <p className="max-w-[46ch] text-[1rem] leading-relaxed text-on-field/80 lg:pb-2">
            Every coloured thing on this page reads from four variables. Change the inks
            here and the whole sheet reprints under you — nothing is hard-coded, and every
            pairing keeps its contrast.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          {/* ------------------------------------------------------ drawers */}
          <div>
            <RadioGroupPrimitive.Root
              aria-label="Ink set"
              value={ink}
              onValueChange={setInk}
              className="grid gap-3 sm:grid-cols-2"
            >
              {INKS.map((i) => {
                const active = i.id === ink;
                return (
                  <RadioGroupPrimitive.Item
                    key={i.id}
                    value={i.id}
                    data-active={active}
                    aria-labelledby={`ink-name-${i.id}`}
                    aria-describedby={`ink-note-${i.id}`}
                    style={
                      active
                        ? {
                            boxShadow:
                              "calc(var(--reg) * -1.4) calc(var(--reg) * 1.4) 0 0 var(--color-accent)",
                          }
                        : undefined
                    }
                    className={cx(
                      "group relative border-2 border-ink bg-paper p-4 text-left transition-[transform,box-shadow] duration-200",
                      "ring-on-field",
                      "[border-radius:10px_3px_12px_4px]",
                      "data-[state=checked]:-translate-y-0.5",
                      "hover:-translate-y-0.5",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p id={`ink-name-${i.id}`} className="label text-[0.68rem] text-ink">
                          {i.name}
                        </p>
                        <p
                          id={`ink-note-${i.id}`}
                          className="mt-1 max-w-44 text-[0.8125rem] leading-snug text-ink/60"
                        >
                          {i.note}
                        </p>
                      </div>
                      <span
                        className={cx(
                          "grid h-5 w-5 shrink-0 place-items-center border-2 border-ink",
                          active ? "bg-accent text-on-accent" : "bg-paper text-transparent",
                        )}
                        style={{ borderRadius: "4px 2px 5px 2px" }}
                        aria-hidden="true"
                      >
                        <Check size={12} />
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-1">
                      {[i.field, i.accent, i.flag, i.paper, i.error].map((c) => (
                        <span
                          key={c}
                          className="h-6 w-6 border-2 border-ink/70"
                          style={{ background: c }}
                        />
                      ))}
                      <span aria-hidden="true" className="label ml-1 shrink-0 text-[0.52rem] text-ink/65">
                        error
                      </span>
                    </div>
                  </RadioGroupPrimitive.Item>
                );
              })}
            </RadioGroupPrimitive.Root>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t-2 border-on-field/20 pt-3 text-on-field/85">
              <span className="label text-[0.58rem]">Now printing</span>
              <span className="label text-[0.6rem] text-on-field">
                {current.name} · {current.field} · {current.accent}
              </span>
            </div>
          </div>

          {/* ------------------------------------------------- press panel */}
          <div className="paper panel relative overflow-hidden border-2 border-ink p-5 sm:p-6">
            {pass > 0 && (
              <span
                key={pass}
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-10 animate-[press-pass_700ms_ease-in-out] bg-flag/70"
              />
            )}
            <div className="flex items-center justify-between gap-3">
              <span className="label text-[0.62rem] text-ink/60">Press controls</span>
              <Badge tone="ink">{reg}px out</Badge>
            </div>

            <div className="mt-6 space-y-6">
              <Slider
                label="Registration"
                value={[reg]}
                onValueChange={(v) => setReg(v[0])}
                min={0}
                max={12}
                suffix="px"
              />
              <Switch
                label="Halftone over everything"
                checked={dots}
                onCheckedChange={setDots}
              />
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  tone="solid"
                  onClick={() => {
                    setPass((p) => p + 1);
                    toast("Reprinted", `${current.name} is running. Register ${reg}px out.`);
                  }}
                >
                  <Star size={16} />
                  Reprint
                </Button>
                <Button
                  tone="ghost"
                  size="sm"
                  onClick={() => {
                    setReg(5);
                    setDots(true);
                  }}
                >
                  Reset
                </Button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-4 gap-2 border-t-2 border-ink/15 pt-4">
              {[
                ["Field", "--color-field"],
                ["Spot", "--color-accent"],
                ["Flag", "--color-flag"],
                ["Bone", "--color-paper"],
              ].map(([name, v]) => (
                <div key={name}>
                  <span
                    className="block h-8 w-full border-2 border-ink"
                    style={{ background: `var(${v})` }}
                  />
                  <span className="label mt-1 block text-[0.52rem] text-ink/65">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
