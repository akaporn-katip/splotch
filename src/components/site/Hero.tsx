import { useEffect, useRef, useState } from "react";
import { Button, Badge, RegMark } from "../ui/primitives";
import { Slider, Switch } from "../ui/form";
import { Dialog, DialogContent, DialogTrigger } from "../ui/overlay";
import { ArrowUpRight, Star } from "../ui/icons";
import { cx } from "../../lib/cx";
import { Mascot } from "./Mascot";

type Mood = "idle" | "boing" | "wobble" | "dots" | "bounce";

const LINES: Record<Mood, string> = {
  idle: "go on — press something.",
  boing: "wheee! that's the press.",
  wobble: "careful — mind the register.",
  dots: "dots. my favourite.",
  bounce: "that's how hard it bounces.",
};

const SWATCHES = [
  { name: "Field", var: "--color-field" },
  { name: "Spot", var: "--color-accent" },
  { name: "Flag", var: "--color-flag" },
  { name: "Bone", var: "--color-paper" },
  { name: "Key", var: "--color-ink" },
];

export function Hero() {
  const [hopKey, setHopKey] = useState(0);
  const [wobble, setWobble] = useState(false);
  const [bounce, setBounce] = useState([6]);
  const [mood, setMood] = useState<Mood>("idle");
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function flash(next: Mood) {
    setMood(next);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMood("idle"), 3200);
  }

  return (
    <section id="top" className="relative overflow-hidden pb-16 pt-8 sm:pb-24 sm:pt-12">
      {/* printed halftone field behind the proof */}
      <div
        aria-hidden="true"
        className="dots pointer-events-none absolute -right-32 -top-24 h-[38rem] w-[38rem] rounded-full opacity-30"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-1/3 hidden h-72 w-72 rotate-12 border-2 border-ink/25 lg:block"
        style={{ borderRadius: "60% 40% 45% 55% / 50% 55% 45% 50%" }}
      />

      <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6">
        <div className="grid items-end lg:grid-cols-[minmax(0,270px)_minmax(0,1fr)]">
          {/* ---------------------------------------------------- mascot */}
          <div className="relative z-20 order-2 flex items-start gap-3 lg:order-1 lg:-mr-16 lg:block">
            <div className="w-32 shrink-0 sm:w-40 lg:w-full">
              <Mascot hopKey={hopKey} wobble={wobble} mood={mood} />
            </div>
            <div
              aria-live="polite"
              className={cx(
                "balloon mt-1 max-w-52 text-[0.9375rem] font-medium leading-snug lg:absolute lg:bottom-full lg:right-0 lg:mb-2 lg:mt-0",
                mood !== "idle" && "font-semibold",
              )}
            >
              <span className="text-[0.8rem] italic text-ink/70">Splotch says: </span>
              {LINES[mood]}
            </div>
          </div>

          {/* ------------------------------------------------ proof sheet */}
          <div className="relative order-1 lg:order-2">
            <div className="paper cut relative z-10 rotate-[-1.1deg] border-2 border-ink px-5 pb-6 pt-4 sm:px-8 sm:pb-8 lg:pl-24 lg:pr-10">
              <div className="flex items-center justify-between gap-4 border-b-2 border-ink/30 pb-3">
                <span className="label flex items-center gap-2 text-ink/70">
                  <RegMark className="scale-75" />
                  Proof no. 001
                </span>
                <span className="label hidden text-ink/70 sm:block">Splotch &amp; Co. · Vol. 1</span>
                <span className="label text-ink/70">Est. today</span>
              </div>

              <svg
                aria-hidden="true"
                viewBox="0 0 120 120"
                className="absolute right-6 top-16 hidden w-24 rotate-[7deg] text-[color-mix(in_oklab,var(--color-accent)_72%,var(--color-ink))] opacity-90 xl:block"
              >
                <circle cx="60" cy="60" r="55" fill="none" stroke="currentColor" strokeWidth="3" />
                <circle cx="60" cy="60" r="47" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <text
                  x="60"
                  y="44"
                  fill="currentColor"
                  fontFamily="Jost, sans-serif"
                  fontSize="8"
                  fontWeight="600"
                  letterSpacing="2.2"
                  textAnchor="middle"
                >
                  PRINT PROOF
                </text>
                <text
                  x="60"
                  y="69"
                  fill="currentColor"
                  fontFamily="Alfa Slab One, serif"
                  fontSize="23"
                  textAnchor="middle"
                >
                  No. 1
                </text>
                <text
                  x="60"
                  y="85"
                  fill="currentColor"
                  fontFamily="Jost, sans-serif"
                  fontSize="7"
                  fontWeight="600"
                  letterSpacing="1.8"
                  textAnchor="middle"
                >
                  SPLOTCH &amp; CO
                </text>
              </svg>

              <h1 className="display mt-5 text-[clamp(2.6rem,7.6vw,5.6rem)] text-ink">
                Press
                <span className="inline-block w-3" />
                the
                <br />
                paper<span className="text-accent">.</span>
              </h1>

              <p className="mt-4 max-w-[46ch] text-[1.0625rem] leading-relaxed text-ink/85 sm:text-[1.125rem]">
                A cartoon component kit for React. Radix primitives underneath, cut paper
                on top — twenty-two parts, every one keyboard-first, and every one that
                answers back when you press it.
              </p>

              {/* live control cluster */}
              <div className="mt-7 border-2 border-ink bg-paper-2/70 p-4 sm:p-5 [border-radius:10px_3px_11px_4px]">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <span className="label text-ink/65">The press · live</span>
                  <Badge tone="ink">4 controls</Badge>
                </div>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-4">
                  <Button
                    tone="solid"
                    onClick={() => {
                      setHopKey((k) => k + 1);
                      flash("boing");
                    }}
                  >
                    <Star size={17} />
                    Boing
                  </Button>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button tone="ink">
                        Take the kit
                        <ArrowUpRight size={16} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent
                      title="Take the kit"
                      description="On npm as splotch-ui, published from a GitHub release — or copy src/ into your app. The source is the deliverable either way."
                      kicker="Imprint"
                    >
                      <ol className="grid gap-3 text-[0.9375rem] leading-snug text-ink/85">
                        <li className="flex gap-3">
                          <span className="display ink-accent shrink-0 text-lg">1</span>
                          <span>
                            Install it:{" "}
                            <code className="border-b-2 border-ink/30 font-semibold">npm i splotch-ui</code>
                            .
                          </span>
                        </li>
                        <li className="flex gap-3">
                          <span className="display ink-accent shrink-0 text-lg">2</span>
                          <span>
                            Import the sheet once:{" "}
                            <code className="border-b-2 border-ink/30 font-semibold">
                              splotch-ui/index.css
                            </code>
                            .
                          </span>
                        </li>
                        <li className="flex gap-3">
                          <span className="display ink-accent shrink-0 text-lg">3</span>
                          Keep the focus rings. They are the point.
                        </li>
                      </ol>
                    </DialogContent>
                  </Dialog>

                  <div className="ml-auto flex items-center gap-3">
                    <Switch
                      label="Wobble"
                      checked={wobble}
                      onCheckedChange={(v) => {
                        setWobble(v);
                        flash("wobble");
                      }}
                    />
                  </div>
                </div>

                <div className="mt-5 max-w-sm">
                  <Slider
                    label="Bounce"
                    value={bounce}
                    onValueChange={(v) => {
                      setBounce(v);
                      flash("bounce");
                    }}
                    min={1}
                    max={10}
                  />
                </div>
              </div>

              {/* ink bar */}
              <div className="mt-6 flex items-end justify-between gap-3">
                <div className="flex gap-1.5">
                  {SWATCHES.map((s) => (
                    <span
                      key={s.name}
                      title={s.name}
                      className="block h-5 w-9 border-2 border-ink sm:h-6 sm:w-12"
                      style={{ background: `var(${s.var})` }}
                    />
                  ))}
                </div>
                <span className="label text-right text-[0.6rem] leading-tight text-ink/60">
                  22 parts
                  <br />
                  0 grey boxes
                </span>
              </div>
            </div>

            {/* sheet's own spot plate */}
            <div
              aria-hidden="true"
              className="absolute inset-0 z-0 translate-x-2 translate-y-2 rotate-[-1.1deg] bg-accent [border-radius:var(--radius-cut)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
