import { Button, RegMark } from "../ui/primitives";
import { Star } from "../ui/icons";
import { cx } from "../../lib/cx";

const NOTES = [
  {
    n: 1,
    name: "Key line",
    body: "Two pixels of ink. The only real border in the kit — and the only thing that is ever perfectly straight.",
  },
  {
    n: 2,
    name: "Spot plate",
    body: "A second ink laid five pixels out of register. This is the depth system. No blur, no black shadow.",
  },
  {
    n: 3,
    name: "Halftone",
    body: "Screen tone stands in for shade. Dots scale with the part, so a small button still reads as printed.",
  },
  {
    n: 4,
    name: "Register",
    body: "On press the plate slides in and overshoots. Release it and the plate drifts back out.",
  },
  {
    n: 5,
    name: "Type",
    body: "Jost 600, uppercase, tracked 0.1em. A display face never goes inside a control.",
  },
];

function Note({ note, align = "left" }: { note: (typeof NOTES)[number]; align?: "left" | "right" | "center" }) {
  return (
    <div
      className={cx(
        "text-[0.875rem] leading-snug",
        align === "right" && "text-right",
        align === "center" && "text-center",
      )}
    >
      <div
        className={cx(
          "flex items-baseline gap-2",
          align === "right" && "justify-end",
          align === "center" && "justify-center",
        )}
      >
        <span className="display ink-accent text-lg leading-none">{note.n}</span>
        <h3 className="label text-[0.68rem] text-ink">{note.name}</h3>
      </div>
      <p className="mt-1.5 text-ink/70">{note.body}</p>
    </div>
  );
}

function Tick({ side }: { side: "left" | "right" | "up" }) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        "absolute border-dashed border-ink/30",
        side === "left" && "right-[-3rem] top-3 h-0 w-12 border-t-2",
        side === "right" && "left-[-3rem] top-3 h-0 w-12 border-t-2",
        side === "up" && "left-1/2 top-[-1.75rem] h-7 w-0 border-l-2",
      )}
    />
  );
}

const ButtonSpecimen = (
  <div className="relative">
    <span aria-hidden="true" className="regmark absolute -left-9 -top-6 text-ink/40" />
    <span aria-hidden="true" className="regmark absolute -right-9 -top-6 text-ink/40" />
    <span aria-hidden="true" className="regmark absolute -bottom-6 -left-9 text-ink/40" />
    <span aria-hidden="true" className="regmark absolute -bottom-6 -right-9 text-ink/40" />
    <Button
      tone="solid"
      className="px-10 py-8 text-[1.05rem] tracking-[0.14em] sm:px-12 sm:py-9 sm:text-xl"
    >
      <Star size={20} />
      Press me
      <Star size={20} />
    </Button>
  </div>
);

export function Anatomy() {
  return (
    <section id="anatomy" className="paper relative overflow-hidden py-16 text-ink sm:py-24">
      <div
        aria-hidden="true"
        className="dots pointer-events-none absolute -left-40 top-1/4 h-[30rem] w-[30rem] rounded-full opacity-[0.13]"
      />
      <div className="relative mx-auto w-full max-w-[1240px] px-4 sm:px-6">
        <div className="mx-auto max-w-[58ch] text-center">
          <div className="flex items-center justify-center gap-3">
            <RegMark className="scale-75 text-ink" />
            <span className="label text-[0.6rem] text-ink/60">Plate 03 · Anatomy</span>
            <RegMark className="scale-75 text-ink" />
          </div>
          <h2 className="display mt-3 text-[clamp(2.1rem,5.4vw,3.9rem)]">
            One button,
            <br />
            taken apart.
          </h2>
          <p className="mx-auto mt-4 max-w-[52ch] text-[1rem] leading-relaxed text-ink/75">
            Five decisions, and not one of them is a shadow. Hover the button to watch the
            spot plate come into register, then press it to watch it overshoot.
          </p>
        </div>

        {/* ------------------------------------------------------- diagram */}
        <div className="relative mx-auto mt-12 hidden aspect-[16/8] w-full max-w-[880px] lg:block">
          <div className="absolute left-0 top-4 w-[248px]">
            <div className="relative">
              <Note note={NOTES[0]} align="right" />
              <Tick side="left" />
            </div>
          </div>

          <div className="absolute right-0 top-4 w-[248px]">
            <div className="relative">
              <Note note={NOTES[1]} />
              <Tick side="right" />
            </div>
          </div>

          <div className="absolute left-0 top-1/2 w-[248px] -translate-y-1/2">
            <div className="relative">
              <Note note={NOTES[2]} align="right" />
              <Tick side="left" />
            </div>
          </div>

          <div className="absolute right-0 top-1/2 w-[248px] -translate-y-1/2">
            <div className="relative">
              <Note note={NOTES[3]} />
              <Tick side="right" />
            </div>
          </div>

          <div className="absolute bottom-0 left-1/2 w-[320px] -translate-x-1/2">
            <div className="relative">
              <Note note={NOTES[4]} align="center" />
              <Tick side="up" />
            </div>
          </div>

          <div className="absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2">
            {ButtonSpecimen}
          </div>
        </div>

        {/* mobile + tablet: button first, then the same notes as a list */}
        <div className="mt-10 flex flex-col items-center gap-5 lg:hidden">
          {ButtonSpecimen}
          <p className="label max-w-56 text-center text-[0.58rem] leading-relaxed text-ink/65">
            The whole kit is this one decision, repeated
          </p>
        </div>

        <ol className="mt-8 grid gap-5 border-t-2 border-ink/20 pt-6 sm:grid-cols-2 lg:hidden">
          {NOTES.map((n) => (
            <li key={n.n} className="flex gap-3">
              <span className="display ink-accent shrink-0 text-lg leading-none">{n.n}</span>
              <div>
                <h3 className="label text-[0.66rem] text-ink">{n.name}</h3>
                <p className="mt-1 text-[0.875rem] leading-snug text-ink/70">{n.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
