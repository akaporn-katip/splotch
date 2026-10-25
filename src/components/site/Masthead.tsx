import { Button, Badge, IconButton } from "../ui/primitives";
import { Dialog, DialogContent, DialogTrigger } from "../ui/overlay";
import { ArrowUpRight, Close, Grid, Splat } from "../ui/icons";

const LINKS = [
  { href: "#parts", label: "Parts" },
  { href: "#anatomy", label: "Anatomy" },
  { href: "#inks", label: "Inks" },
  { href: "#notes", label: "Notes" },
];

export function Masthead() {
  return (
    <header className="sticky top-0 z-30 border-b-2 border-ink/25 bg-field">
      <div className="mx-auto flex w-full max-w-[1240px] items-center justify-between gap-4 px-4 py-3 text-on-field sm:px-6">
        <a href="#top" className="group flex items-center gap-2.5">
          <Splat size={26} className="text-flag transition-transform duration-300 group-hover:rotate-45" />
          <span className="display text-[1.5rem] leading-none tracking-tight">Splotch</span>
          <span className="label hidden max-w-[7.5rem] text-[0.55rem] leading-[1.3] text-on-field/80 lg:block">
            cartoon components
          </span>
        </a>

        <nav aria-label="Sections" className="hidden items-center gap-6 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="label relative text-[0.65rem] text-on-field/85 transition-colors hover:text-on-field"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-flag transition-[width] duration-200 hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Badge tone="ink" className="hidden border-on-field/40 text-on-field sm:inline-flex">
            v0.1
          </Badge>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" tone="flag" className="hidden sm:inline-flex">
                Take the kit
                <ArrowUpRight size={15} />
              </Button>
            </DialogTrigger>
            <DialogContent
              title="Take the kit"
              description="Splotch is a demo surface, not a published package. The source is the deliverable."
              kicker="Imprint"
            >
              <p className="text-[0.9375rem] leading-relaxed text-ink/85">
                Copy <code className="border-b-2 border-ink/30 font-semibold">src/components/ui</code>{" "}
                into your app and lift the ink variables from{" "}
                <code className="border-b-2 border-ink/30 font-semibold">src/index.css</code>. Every
                part is a thin wrapper over a Radix primitive, so keyboard behaviour comes
                with it.
              </p>
            </DialogContent>
          </Dialog>

          {/* Mobile menu reuses the kit's own dialog. */}
          <Dialog>
            <DialogTrigger asChild>
              <IconButton tone="ghost" label="Open menu" className="text-on-field md:hidden">
                <Grid size={20} />
              </IconButton>
            </DialogTrigger>
            <DialogContent title="This issue" description="Four sections, one page." kicker="Contents">
              <nav aria-label="Sections" className="grid divide-y-2 divide-ink/20 border-y-2 border-ink/20">
                {LINKS.map((l, i) => (
                  <DialogTrigger key={l.href} asChild>
                    <a
                      href={l.href}
                      className="flex items-center justify-between py-3.5 text-[1.0625rem] font-medium"
                    >
                      <span>
                        <span className="label mr-3 text-[0.6rem] text-ink/60">0{i + 1}</span>
                        {l.label}
                      </span>
                      <ArrowUpRight size={18} />
                    </a>
                  </DialogTrigger>
                ))}
              </nav>
              <DialogTrigger asChild>
                <Button className="mt-5 w-full" tone="solid">
                  Close
                  <Close size={16} />
                </Button>
              </DialogTrigger>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
}
