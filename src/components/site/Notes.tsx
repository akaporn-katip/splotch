import { ArrowUpRight, Splat } from "../ui/icons";
import { Badge, RegMark } from "../ui/primitives";
import { Kbd } from "../ui/primitives";

const NOTES = [
  {
    title: "Built on Radix",
    body: "Dialog, Menu, Popover, Tooltip, Tabs, Accordion, Select, Slider, Switch, Checkbox, Radio, Progress, Avatar, Toast. The behaviour is theirs. The paper is ours.",
  },
  {
    title: "Keyboard first",
    body: "Tab to anything on this page and a dashed crop mark appears. Escape closes. Arrows move. The focus ring is part of the design, not a browser afterthought.",
  },
  {
    title: "Theme in four lines",
    body: "Field, spot, flag, bone. Set them on the root element and the whole kit reprints — hover, focus, disabled and error states included.",
  },
  {
    title: "What it isn't",
    body: "Not a promises page and not a paid product. It is on npm as @katipwork/splotch-ui, released from a git tag; the press operator is still a drawing.",
  },
];

export function Notes() {
  return (
    <section id="notes" className="paper relative overflow-hidden pt-16 text-ink sm:pt-24">
      <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <RegMark className="scale-75 text-ink" />
              <span className="label text-[0.6rem] text-ink/60">Plate 05 · Notes</span>
            </div>
            <h2 className="display text-[clamp(2.1rem,5vw,3.4rem)]">
              Notes from
              <br />
              the press.
            </h2>
            <p className="mt-4 max-w-[38ch] text-[1rem] leading-relaxed text-ink/75">
              The short version of what you are looking at, and what to do with it on a
              Monday morning.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <Badge tone="ink">4 inks</Badge>
              <Badge tone="solid">22 parts</Badge>
              <Badge tone="paper">0 images</Badge>
            </div>

            <div className="mt-8 border-2 border-dashed border-ink/30 p-4 [border-radius:10px_3px_11px_4px]">
              <p className="label text-[0.58rem] text-ink/60">Try these</p>
              <ul className="mt-2.5 grid gap-2 text-[0.875rem] text-ink/75">
                <li className="flex items-center gap-2">
                  <Kbd>Tab</Kbd> walk the crop marks
                </li>
                <li className="flex items-center gap-2">
                  <Kbd>Esc</Kbd> close any proof card
                </li>
                <li className="flex items-center gap-2">
                  <Kbd>↑</Kbd>
                  <Kbd>↓</Kbd> move through the menu
                </li>
              </ul>
            </div>
          </div>

          <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {NOTES.map((n, i) => (
              <div key={n.title} className="border-t-2 border-ink/20 pt-4">
                <dt className="flex items-baseline gap-2">
                  <span className="display ink-accent text-[0.8rem] leading-none">
                    0{i + 1}
                  </span>
                  <span className="label text-[0.68rem] text-ink">{n.title}</span>
                </dt>
                <dd className="mt-2 max-w-[42ch] text-[0.9375rem] leading-relaxed text-ink/75">
                  {n.body}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <footer className="mt-16 border-t-2 border-ink/25 sm:mt-24">
        <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-6 py-8">
            <div className="flex items-center gap-3">
              <Splat size={30} className="text-accent" />
              <p className="max-w-[52ch] text-[0.875rem] leading-relaxed text-ink/75">
                Set in Alfa Slab One and Jost. Printed in the browser with Tailwind CSS 4
                and Radix primitives. Every mark on this page is CSS or inline SVG — there
                are no raster images anywhere in the kit.
              </p>
            </div>
            <div className="flex flex-col items-start gap-2 sm:items-end">
              <a
                href="#top"
                className="label inline-flex items-center gap-2 border-b-2 border-ink/30 pb-1 text-[0.65rem] text-ink hover:border-ink"
              >
                Back to the top
                <ArrowUpRight size={15} />
              </a>
              <span className="label text-[0.55rem] text-ink/60">
                Splotch &amp; Co. · A demo, printed in the browser
              </span>
            </div>
          </div>

          <div aria-hidden="true" className="overflow-hidden pb-8">
            <p className="display select-none whitespace-nowrap text-[clamp(3.4rem,17vw,15rem)] leading-[0.86] text-ink/12">
              SPLOTCH
            </p>
          </div>
        </div>
      </footer>
    </section>
  );
}
