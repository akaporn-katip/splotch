import { useState } from "react";
import type { ReactNode } from "react";
import { Button, IconButton, Badge, Avatar, Progress } from "../ui/primitives";
import {
  Checkbox,
  Input,
  RadioGroup,
  Select,
  Slider,
  Switch,
  Textarea,
  ToggleGroup,
} from "../ui/form";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Tooltip,
  Accordion,
  AccordionItem,
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../ui/overlay";
import {
  ArrowUpRight,
  Code,
  Copy,
  Hand,
  Info,
  Star,
  Sun,
  Splat,
  Bolt,
} from "../ui/icons";
import { cx } from "../../lib/cx";
import { useShop } from "../../lib/shop";

/* --------------------------------------------------------------- apparatus */

function Spec({
  n,
  name,
  note,
  code,
  children,
  wide,
}: {
  n: number;
  name: string;
  note: string;
  code: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <article className={cx("group relative flex flex-col bg-paper p-4 sm:p-5", wide && "sm:col-span-2")}>
      <div
        aria-hidden="true"
        className="dots pointer-events-none absolute inset-0 opacity-[0.06]"
      />
      <header className="relative flex items-baseline gap-2.5">
        <span className="display ink-accent text-[0.8rem] leading-none">
          {String(n).padStart(2, "0")}
        </span>
        <h3 className="label text-[0.68rem] tracking-[0.14em] text-ink">{name}</h3>
      </header>
      <p className="relative mt-1 text-[0.8125rem] leading-snug text-ink/70">{note}</p>

      <div className="relative flex min-h-[7.5rem] flex-1 flex-wrap content-center items-center gap-3 py-5">
        {children}
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <button
            type="button"
            aria-label={`Read the markup for ${name}`}
            className="label relative -mb-1 inline-flex w-fit items-center gap-1.5 text-[0.6rem] text-ink/65 transition-colors hover:text-ink"
          >
            <Code size={13} />
            read the markup
          </button>
        </DialogTrigger>
        <DialogContent title={name} description={note} kicker={`Part ${String(n).padStart(2, "0")}`}>
          <pre className="overflow-x-auto border-2 border-ink bg-ink p-4 text-[0.78rem] leading-relaxed text-on-field">
            <code className="font-mono">{code.trim()}</code>
          </pre>
          <p className="label mt-3 text-[0.58rem] text-ink/65">
            Radix handles the keys. The ink is the wrapper.
          </p>
        </DialogContent>
      </Dialog>
    </article>
  );
}

function SpecGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid gap-[2px] border-2 border-ink bg-ink sm:grid-cols-2 xl:grid-cols-3">
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------- parts */

function ControlParts() {
  const [bounce, setBounce] = useState([4]);
  const [wobble, setWobble] = useState(true);
  const [strip, setStrip] = useState("Cut");

  return (
    <SpecGrid>
      <Spec
        n={1}
        name="Button"
        note="Four tones. It sits 1px into the sheet when pressed."
        code={`
<Button tone="solid">Boing</Button>
<Button tone="flag">Flag</Button>
<Button tone="ink">Ink</Button>
<Button tone="ghost">Ghost</Button>`}
      >
        <Button tone="solid" size="sm">
          Boing
        </Button>
        <Button tone="flag" size="sm">
          Flag
        </Button>
        <Button tone="ink" size="sm">
          Ink
        </Button>
        <Button tone="ghost" size="sm">
          Ghost
        </Button>
        <Button size="sm" disabled>
          Spent
        </Button>
      </Spec>

      <Spec
        n={2}
        name="Icon button"
        note="Square, labelled, and never a mystery meat control."
        code={`
<IconButton label="Stamp it" tone="solid">
  <Splat />
</IconButton>
<Tooltip label="Star this part">
  <IconButton label="Star"><Star /></IconButton>
</Tooltip>`}
      >
        <Tooltip label="Stamp it">
          <IconButton label="Stamp it" tone="solid" size="sm">
            <Splat size={17} />
          </IconButton>
        </Tooltip>
        <Tooltip label="Star this part">
          <IconButton label="Star this part" size="sm">
            <Star size={17} />
          </IconButton>
        </Tooltip>
        <Tooltip label="Copy the ink">
          <IconButton label="Copy the ink" size="sm">
            <Copy size={17} />
          </IconButton>
        </Tooltip>
        <Tooltip label="Read the notes">
          <IconButton label="Read the notes" size="sm">
            <Info size={17} />
          </IconButton>
        </Tooltip>
      </Spec>

      <Spec
        n={3}
        name="Toggle strip"
        note="A ticket strip: one of three, never none."
        code={`
<ToggleGroup
  label="Finish"
  options={["Cut", "Torn", "Dotted"]}
  value={strip}
  onValueChange={setStrip}
/>`}
      >
        <ToggleGroup
          label="Finish"
          options={["Cut", "Torn", "Dotted"]}
          value={strip}
          onValueChange={setStrip}
        />
      </Spec>

      <Spec
        n={4}
        name="Switch"
        note="On is printed in the spot ink. Off stays on bare stock."
        code={`
<Switch
  label="Wobble"
  checked={wobble}
  onCheckedChange={setWobble}
/>`}
      >
        <Switch label="Wobble" checked={wobble} onCheckedChange={setWobble} />
        <Switch label="Halftone" checked={false} onCheckedChange={() => {}} />
        <Switch label="Locked" checked disabled />
      </Spec>

      <Spec
        n={5}
        name="Slider"
        note="Diamond thumb, halftone track, and the value printed beside it."
        code={`
<Slider
  label="Bounce"
  value={bounce}
  onValueChange={setBounce}
  min={1}
  max={10}
/>`}
      >
        <Slider
          label="Bounce"
          value={bounce}
          onValueChange={setBounce}
          min={1}
          max={10}
          suffix="/10"
        />
      </Spec>

      <Spec
        n={6}
        name="Progress"
        note="Dots for the work left, spot ink for the work done."
        code={`
<Progress label="Pressing" value={64} />`}
      >
        <Progress label="Pressing" value={64} />
        <Progress label="Drying" value={92} />
      </Spec>
    </SpecGrid>
  );
}

function InputParts() {
  const [radio, setRadio] = useState("cut");
  const [ink, setInk] = useState("teal");
  const [agree, setAgree] = useState<boolean | "indeterminate">(true);

  return (
    <SpecGrid>
      <Spec
        n={7}
        name="Text input"
        note="Label, hint, and an error that names the way out."
        code={`
<Input
  label="Plate name"
  placeholder="e.g. Splotch No. 9"
  hint="Printable, twelve characters or fewer."
/>
<Input
  label="Imprint"
  defaultValue="splotch & co"
  error="Use the press name, not the studio name."
  aria-invalid
/>`}
      >
        <div className="w-full space-y-4">
          <Input label="Plate name" placeholder="e.g. Splotch No. 9" hint="Twelve characters or fewer." />
          <Input
            label="Imprint"
            defaultValue="splotch & co"
            error="Use the press name, not the studio name."
          />
        </div>
      </Spec>

      <Spec
        n={8}
        name="Textarea"
        note="Long notes. Counted, not scolded."
        code={`
<Textarea
  label="Press notes"
  placeholder="What was off register today?"
  hint="Up to 240 characters."
  maxLength={240}
/>`}
      >
        <div className="w-full">
          <Textarea
            label="Press notes"
            placeholder="What was off register today?"
            hint="Up to 240 characters."
            maxLength={240}
          />
        </div>
      </Spec>

      <Spec
        n={9}
        name="Checkbox"
        note="Check, indeterminate, and disabled all drawn, not borrowed."
        code={`
<Checkbox
  label="Trim the sheet"
  hint="Removes 3mm from every edge."
  checked={agree}
  onCheckedChange={setAgree}
/>
<Checkbox label="Overprint" checked />
<Checkbox label="Locked" disabled />`}
      >
        <div className="w-full space-y-4">
          <Checkbox
            label="Trim the sheet"
            hint="Removes 3mm from every edge."
            checked={agree}
            onCheckedChange={setAgree}
          />
          <Checkbox label="Overprint" checked onCheckedChange={() => {}} />
          <Checkbox label="Locked" disabled />
        </div>
      </Spec>

      <Spec
        n={10}
        name="Radio group"
        note="One finish only. The dot is the ink."
        code={`
<RadioGroup
  label="Finish"
  value={radio}
  onValueChange={setRadio}
  options={[
    { value: "cut", label: "Cut paper" },
    { value: "halftone", label: "Halftone" },
    { value: "bleed", label: "Ink bleed" },
  ]}
/>`}
      >
        <div className="w-full">
          <RadioGroup
            label="Finish"
            value={radio}
            onValueChange={setRadio}
            options={[
              { value: "cut", label: "Cut paper", hint: "Clean edges, four radii." },
              { value: "halftone", label: "Halftone" },
              { value: "bleed", label: "Ink bleed" },
            ]}
          />
        </div>
      </Spec>

      <Spec
        n={11}
        name="Select"
        note="A little press drawer that opens in the same paper."
        code={`
<Select
  label="Ink drawer"
  value={ink}
  onValueChange={setInk}
  options={[
    { value: "teal", label: "Deep teal" },
    { value: "coral", label: "Coral spot" },
    { value: "mustard", label: "Mustard flag" },
    { value: "bone", label: "Bone stock" },
  ]}
/>`}
      >
        <div className="w-full">
          <Select
            label="Ink drawer"
            value={ink}
            onValueChange={setInk}
            options={[
              { value: "teal", label: "Deep teal" },
              { value: "coral", label: "Coral spot" },
              { value: "mustard", label: "Mustard flag" },
              { value: "bone", label: "Bone stock" },
            ]}
          />
        </div>
      </Spec>

      <Spec
        n={12}
        name="Empty state"
        note="Nothing pinned is still a printed statement."
        code={`
<div className="border-2 border-dashed border-ink/40 p-6 text-center">
  <Splat />
  <h4>Nothing pinned yet</h4>
  <p>Pinned parts stay on this sheet.</p>
  <Button tone="flag">Pin a part</Button>
</div>`}
      >
        <div className="w-full border-2 border-dashed border-ink/35 px-5 py-6 text-center [border-radius:10px_3px_11px_4px]">
          <Splat size={26} className="mx-auto text-ink/40" />
          <h4 className="mt-2 font-sans text-[0.9375rem] font-semibold tracking-normal text-ink">
            Nothing pinned yet
          </h4>
          <p className="mx-auto mt-1 max-w-48 text-[0.8125rem] leading-snug text-ink/60">
            Pinned parts stay on this sheet until you unpin them.
          </p>
          <Button tone="flag" size="sm" className="mt-3">
            Pin a part
          </Button>
        </div>
      </Spec>
    </SpecGrid>
  );
}

function OverlayParts() {
  const [menuChecked, setMenuChecked] = useState(true);
  const { toast } = useShop();

  return (
    <SpecGrid>
      <Spec
        n={13}
        name="Dialog"
        note="A proof card laid over the sheet. Escape closes it."
        code={`
<Dialog>
  <DialogTrigger asChild>
    <Button>Open the proof</Button>
  </DialogTrigger>
  <DialogContent
    title="Proof 14"
    description="Signed off on the third pass."
    kicker="Proof sheet"
  >
    …any content…
  </DialogContent>
</Dialog>`}
      >
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm">Open the proof</Button>
          </DialogTrigger>
          <DialogContent
            title="Proof 14"
            description="Signed off on the third pass. The register is 4px out on the left plate, which is exactly what was asked for."
            kicker="Proof sheet"
          >
            <div className="flex items-center gap-3">
              <Avatar name="Ada Ink" />
              <div>
                <p className="text-[0.9375rem] font-semibold leading-tight">Ada Ink</p>
                <p className="text-[0.8125rem] text-ink/65">Press operator</p>
              </div>
              <Badge className="ml-auto" tone="solid">
                Signed
              </Badge>
            </div>
            <div className="mt-4 flex gap-2">
              <Button size="sm" tone="solid" onClick={() => toast("Proof 14 signed", "Ada put it through the press.")}>
                Sign it
              </Button>
              <DialogClose asChild>
                <Button size="sm" tone="ghost">
                  Later
                </Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </Spec>

      <Spec
        n={14}
        name="Menu"
        note="A press drawer: labels, a separator, and a destructive item."
        code={`
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button>Actions</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>This plate</DropdownMenuLabel>
    <DropdownMenuItem>Duplicate</DropdownMenuItem>
    <DropdownMenuCheckboxItem
      checked={menuChecked}
      onCheckedChange={setMenuChecked}
    >
      Show crop marks
    </DropdownMenuCheckboxItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem danger>Scrap plate</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm">
              Actions
              <ArrowUpRight size={15} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>This plate</DropdownMenuLabel>
            <DropdownMenuItem hint="⌘D">Duplicate</DropdownMenuItem>
            <DropdownMenuItem hint="⌘R">Re-ink</DropdownMenuItem>
            <DropdownMenuCheckboxItem
              checked={menuChecked}
              onCheckedChange={setMenuChecked}
            >
              Show crop marks
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem danger>Scrap plate</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Spec>

      <Spec
        n={15}
        name="Popover"
        note="A margin note that stays put while you work."
        code={`
<Popover>
  <PopoverTrigger asChild>
    <Button size="sm">Margin note</Button>
  </PopoverTrigger>
  <PopoverContent>
    <p>Named parts stay on the sheet.</p>
    <Checkbox label="Notify me" />
  </PopoverContent>
</Popover>`}
      >
        <Popover>
          <PopoverTrigger asChild>
            <Button size="sm">Margin note</Button>
          </PopoverTrigger>
          <PopoverContent>
            <p className="label text-[0.6rem] text-ink/65">Note to self</p>
            <p className="mt-1.5 text-[0.9375rem] leading-snug">
              The coral plate is the one that drifts. Check it before you send the file.
            </p>
            <div className="mt-3 border-t-2 border-ink/15 pt-3">
              <Checkbox label="Remind me at 4pm" checked onCheckedChange={() => {}} />
            </div>
          </PopoverContent>
        </Popover>
      </Spec>

      <Spec
        n={16}
        name="Tooltip"
        note="A caption box. Never the only label for anything."
        code={`
<Tooltip label="Halftone at 40%">
  <IconButton label="Halftone"><Sun /></IconButton>
</Tooltip>`}
      >
        <Tooltip label="Halftone at 40%" side="top">
          <IconButton label="Halftone density" size="sm">
            <Sun size={17} />
          </IconButton>
        </Tooltip>
        <Tooltip label="Bleed the edge" side="top">
          <IconButton label="Bleed the edge" size="sm">
            <Bolt size={17} />
          </IconButton>
        </Tooltip>
        <Tooltip label="Hand-set type" side="top">
          <IconButton label="Hand-set type" size="sm">
            <Hand size={17} />
          </IconButton>
        </Tooltip>
        <p className="mt-2 w-full text-[0.8125rem] leading-snug text-ink/65">
          Hover one, or tab to it and wait — focus opens it too. Nothing here relies on the
          tooltip for its name.
        </p>
      </Spec>

      <Spec
        n={17}
        name="Accordion"
        note="Notes folded under a rule. Keyboard: arrows and Home."
        code={`
<Accordion type="single" collapsible defaultValue="a">
  <AccordionItem value="a" question="Why is it out of register?">
    Because that is the whole idea.
  </AccordionItem>
</Accordion>`}
      >
        <Accordion className="w-full" type="single" collapsible defaultValue="a">
          <AccordionItem value="a" question="Why is it out of register?">
            Because that is the whole idea. The misregistration is the depth system: it
            replaces the border and the drop shadow, and it tells you the part is raised
            without pretending the screen is made of glass.
          </AccordionItem>
          <AccordionItem value="b" question="Does it survive a real app?">
            Yes. Every wrapper is a thin pass over a Radix primitive, so focus order, roving
            tabindex, escape handling, and screen-reader wiring are already solved.
          </AccordionItem>
        </Accordion>
      </Spec>

      <Spec
        n={18}
        name="Context menu"
        note="Right-click the swatch. Same drawer, different finger."
        code={`
<ContextMenu>
  <ContextMenuTrigger asChild>
    <div className="swatch">Right-click me</div>
  </ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem hint="⌘C">Copy hex</ContextMenuItem>
    <ContextMenuSeparator />
    <ContextMenuItem>Set as field</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>`}
      >
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <button
              type="button"
              className="group/sw grid w-full max-w-52 grid-cols-4 gap-1 border-2 border-dashed border-ink/30 p-2"
              aria-label="Ink swatches — right-click for options"
              onKeyDown={(event) => {
                // Context menus have no keyboard trigger of their own; open this one
                // at the swatch's centre, the way the platform menu key would.
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                const box = event.currentTarget.getBoundingClientRect();
                event.currentTarget.dispatchEvent(
                  new MouseEvent("contextmenu", {
                    bubbles: true,
                    clientX: box.left + box.width / 2,
                    clientY: box.top + box.height / 2,
                  }),
                );
              }}
            >
              {["var(--color-field)", "var(--color-accent)", "var(--color-flag)", "var(--color-paper)"].map(
                (c) => (
                  <span
                    key={c}
                    className="block h-10 border-2 border-ink"
                    style={{ background: c }}
                  />
                ),
              )}
              <span className="label col-span-4 pt-1.5 text-center text-[0.55rem] text-ink/60">
                right-click the swatches
              </span>
            </button>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem hint="⌘C">Copy hex</ContextMenuItem>
            <ContextMenuItem hint="⌘F">Set as field</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>Reset to workshop</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </Spec>
    </SpecGrid>
  );
}

function FeedbackParts() {
  const { toast } = useShop();

  return (
    <SpecGrid>
      <Spec
        n={19}
        name="Toast"
        note="Bottom right, four seconds, dismissible by keyboard."
        code={`
<ToastProvider swipeDirection="right">
  <ToastCard item={item} onOpenChange={dismiss} />
  <ToastViewport />
</ToastProvider>`}
      >
        <Button
          size="sm"
          tone="solid"
          onClick={() => toast("Reprinted", "The plum plate is back in register.")}
        >
          Fire a toast
        </Button>
        <Button
          size="sm"
          onClick={() => toast("Plate saved", "Splotch No. 9 is on the drying rack.")}
        >
          Save the plate
        </Button>
      </Spec>

      <Spec
        n={20}
        name="Avatar"
        note="Initials in the display face, cut from a wobbly circle."
        code={`
<Avatar name="Ada Ink" />
<Avatar name="Ray Halftone" />
<Avatar name="Mo Spot" src="/mo.jpg" />`}
      >
        <Avatar name="Ada Ink" />
        <Avatar name="Ray Halftone" />
        <Avatar name="Mo Spot" />
        <div className="flex items-center gap-2">
          <span className="label text-[0.6rem] text-ink/65">+3 on press</span>
        </div>
      </Spec>

      <Spec
        n={21}
        name="Badges"
        note="Four stamps. Short words, always."
        code={`
<Badge tone="flag">New</Badge>
<Badge tone="solid">Ink</Badge>
<Badge tone="ink">v0.1</Badge>
<Badge tone="paper">Paper</Badge>`}
      >
        <Badge tone="flag">New</Badge>
        <Badge tone="solid">Ink</Badge>
        <Badge tone="ink">v0.1</Badge>
        <Badge tone="paper">Paper</Badge>
      </Spec>
    </SpecGrid>
  );
}

/* --------------------------------------------------------------------- lab */

export function Lab() {
  return (
    <section id="parts" className="relative bg-field-deep py-16 sm:py-24">
      <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6">
        <div className="mb-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-end">
          <div>
            <div className="mb-3 flex items-center gap-3 text-highlight">
              <span className="label text-[0.6rem] text-on-field/80">Plate 02</span>
              <span aria-hidden="true" className="h-0.5 w-10 bg-current" />
            </div>
            <h2 className="display text-[clamp(2.1rem,5.4vw,3.9rem)] text-on-field">
              Twenty-one parts,
              <br />
              <span className="text-highlight">no grey boxes.</span>
            </h2>
          </div>
          <p className="max-w-[46ch] text-[1rem] leading-relaxed text-on-field/80 lg:pb-2">
            Every part below is live. Tab into it, press it, open it — the markup is one
            dialog away. Four tabs, twenty-one specimens, one paper stock.
          </p>
        </div>

        <Tabs defaultValue="controls" className="w-full">
          <TabsList label="Parts by kind">
            <TabsTrigger value="controls" className="ring-on-field">Controls</TabsTrigger>
            <TabsTrigger value="inputs" className="ring-on-field">Inputs</TabsTrigger>
            <TabsTrigger value="overlays" className="ring-on-field">Overlays</TabsTrigger>
            <TabsTrigger value="feedback" className="ring-on-field">Feedback</TabsTrigger>
          </TabsList>

          <div className="relative border-2 border-ink bg-ink p-0">
            <TabsContent value="controls">
              <ControlParts />
            </TabsContent>
            <TabsContent value="inputs">
              <InputParts />
            </TabsContent>
            <TabsContent value="overlays">
              <OverlayParts />
            </TabsContent>
            <TabsContent value="feedback">
              <FeedbackParts />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </section>
  );
}
