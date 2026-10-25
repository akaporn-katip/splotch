# Splotch — design system

Recorded from the built surface, not from intention. Source of truth:
`src/index.css`, `src/lib/inks.ts`, `src/components/ui/*`.

## The world

A cartoon component kit printed as a mid-century UPA proof sheet. Misregistered
spot inks, cut-paper shapes, halftone screen tone and drawn key lines do every job
that borders and drop shadows do in other systems. The refused default is the
neubrutalist skin: identical grey Radix parts with a 4px black outline and a black
offset shadow.

Every decision below should be explainable in ink-on-paper terms. If a pattern only
works because "UI kits do it that way", it does not belong.

## Inks

Four sets, each trading a different ground against a different spot. All values are
CSS custom properties on `<html data-ink="…">`; `:root` carries the `workshop`
default so the kit still works if the attribute is missing.

| role            | token                | workshop  | mustard   | plum      | newsprint |
| --------------- | -------------------- | --------- | --------- | --------- | --------- |
| ground          | `--color-field`      | `#0f5a54` | `#e8b02f` | `#481f45` | `#e9dfc8` |
| ground, deep    | `--color-field-deep` | `#0a3f3b` | `#c9901c` | `#331530` | `#d6c9ad` |
| spot ink        | `--color-accent`     | `#f0553b` | `#124a42` | `#f2b134` | `#bf3a21` |
| second ink      | `--color-flag`       | `#efb93b` | `#f4ede0` | `#e6c3d8` | `#1d4b63` |
| error ink       | `--color-error`      | `#a8331c` | `#9e4213` | `#9b2b4a` | `#8a2230` |
| stock           | `--color-paper`      | `#f3ecdc` | `#fdf6e6` | `#f6ecd9` | `#fbf7ee` |
| stock, shaded   | `--color-paper-2`    | `#e6dcc6` | `#f0e3c8` | `#e8dac0` | `#efe7d6` |
| text on ground  | `--color-on-field`   | paper     | ink       | paper     | ink       |
| heading accent  | `--color-highlight`  | `#efb93b` | `#0e3d36` | `#f2b134` | `#1d4b63` |
| text on spot    | `--color-on-accent`  | ink       | paper     | ink       | paper     |
| text on second  | `--color-on-flag`    | ink       | ink       | ink       | paper     |

Rules:

- `--color-flag` is a **surface** ink (header bands, selected states). When it
  becomes text on the field, use `--color-highlight` instead — the two diverge in
  the mustard and newsprint sets precisely so the heading keeps its contrast.
- Destructive ink is `--color-error`, and it is an ink of the set, not a utility
  red: each set carries its own drawn from that palette (brick, sienna, wine,
  oxblood), never grey and never pure black. It lands on stock — error messages,
  and anything printed in it reversed — so it holds ≥4.5:1 against both
  `--color-paper` and `--color-paper-2` in every set: legible as text on the
  sheet, and a legible sheet for stock-coloured text on top of it. It also stays
  clearly apart from that set's `--color-accent`, so an error never reads as a
  highlight: a CIEDE2000 distance of at least 10 in every set, measured 16.7 in
  newsprint (the closest pair), 18.4 workshop, 42.5 mustard, 55.8 plum. The
  `@theme` value is the workshop fallback for a sheet with no `data-ink`.
- Ink is never grey. Secondary text is the ink colour at reduced opacity over the
  stock, or the ground's text ink at reduced opacity over the ground. The lightest
  the sheet prints is `text-ink/60` on the sheet and `text-on-field/80` on the
  ground; nothing under `/65` is printed on shaded stock.
- Every pairing the sheet prints is audited at 4.5:1 body / 3:1 large text across
  all four sets and the `@theme` fallback: the base pairings, every
  reduced-opacity `text-ink/NN` and `text-on-field/NN` the components use (scanned
  from the source, so a new alpha cannot skip the audit), `.ink-accent`,
  `.field::placeholder`, and the error/spot separation. `npm run audit:contrast`
  exits non-zero on any gating failure, on any drift between `src/lib/inks.ts` and
  the `data-ink` blocks, and on a label at `text-ink/60` or lighter placed on
  shaded stock.

## Type

- **Display — Alfa Slab One.** Only for headings, numerals, wordmark, mark. Leading
  0.90, tracking −0.02em. Never inside a control.
- **Text — Jost 400/500/600/700 + italic.** Everything else: body, labels, buttons,
  form values. Body measure 46–65ch.
- **Labelling convention:** small caps, 600 weight, 0.16em tracking, 11px — the
  `.label` class. Numbers in prose and specimen indices are the display face.
- Code (only inside markup dialogs) is the system mono. Mono is never used as a
  costume for "technical".

## Geometry

- **Cut corners, not rounded rectangles.** `--radius-cut`
  (`18px 5px 20px 7px / 7px 20px 5px 18px`) and `--radius-cut-sm` for controls.
  Four different radii per shape so nothing reads as a stock card.
- **Controls:** 2px ink key line, 44px minimum height, cut radius, uppercase 0.1em
  tracked label.
- **Panels:** 2px ink key line, cut radius, paper face.
- **Balloons and captions:** asymmetric cut radius with a clipped tail.
- **Grid:** 2px gutters that read as comic-panel rules; sections separate with a
  2px ink rule rather than a shadow.

## Materials

- **Paper** — flat stock plus a fibre texture (SVG `feTurbulence`, multiplied).
- **Grain** — one fixed overlay over the whole document at 24% `overlay`.
- **Halftone** — radial-gradient dots. Used for screen tone: disabled faces,
  progress tracks, the printed shadow, section fields. Never a blur.
- **Registration plate** — the depth system. `box-shadow: calc(var(--reg) * -1)
  calc(var(--reg) * 1.4) 0 0 var(--plate)`. Solid ink, zero blur, zero black.
  `--reg` is user-controllable from 0–12px.
- **Registration marks** — drawn crosshairs, never an icon font.
- **Stamps** — rotated ring + display numeral, low-opacity spot ink.

## Components and states

Depth is always the plate; state is always register.

| state    | treatment                                                              |
| -------- | ---------------------------------------------------------------------- |
| rest     | plate 5px out of register                                              |
| hover    | plate moves toward register (≈60%) and the part lifts 1px              |
| press    | plate overshoots *past* register; the part translates 1px down         |
| focus    | 2px dashed crop mark at 4px offset — ink on stock (`--color-ring`), the ground's text ink on the ground (`.ring-on-field`). Two exceptions: tab panels draw it inset (`-4px`) because they sit inside a framed sheet, and menu/select items draw none — the highlight band is their state |
| disabled | halftone face, no plate, ink text at 68%                               |
| error    | error-ink key line + halftone tint + a message that names the recovery |
| empty    | dashed key line, drawn mark, one action                                |
| selected | the part is printed in the spot ink, not merely highlighted            |

Inventory (21): Button (4 tones, 2 sizes), IconButton, Badge (4 tones), Avatar,
Progress, ToggleGroup, Switch, Slider (diamond thumb), Checkbox, RadioGroup,
Select, Input, Textarea, Empty state, Dialog, DropdownMenu, ContextMenu, Popover,
Tooltip, Toast, Tabs, Accordion.

## Motion

Limited animation, not easing decoration. One authored moment per interaction:

- `--ease-snap` = `cubic-bezier(.2,.9,.1,1.15)` — a slight overshoot, as a plate
  snapping into register. Used for plates, dialogs, popovers, toasts.
- Hover/press translate: 160ms.
- The character hops once (620ms) and holds; its idle is a slow 5s blink.
- Nothing animates on scroll. `prefers-reduced-motion` collapses all of it.

## Browser surfaces

Selection is spot ink on its opposite. The caret is spot ink. Focus is a dashed
crop mark. Scrollbars are ink thumbs on a deep field track. Underlines on the
colophon link are 2px ink. Numerals in values, progress and the slider readout are
tabular.

## Layout and responsive

- Container 1240px; sections 64–96px vertical padding; more space above a heading
  than below it.
- Hero: proof sheet + character. The character sits half off the sheet at ≥1024px,
  and stacks below the sheet with its balloon beside it on phones.
- Lab: panel-gutter grid 3 columns → 2 at tablet → 1 on phones.
- Anatomy: a fixed-position diagram stage at ≥1024px; button-then-list on smaller
  screens.
- Ink room: 2×2 ink cards + press panel side by side, stacked under 1024px.
- No horizontal overflow at 390, 768, 1024, 1280, 1440.

## Known gaps

- Published to npm as `splotch-ui` by `.github/workflows/release.yml` when a GitHub
  release is published; the tag must equal `package.json`. Pushes publish nothing.
  The library build lands in `dist-lib/`, the tests are Playwright specs run by
  `npm test`, and CI runs the build, the contrast audit and the tests on every push.
  The demo page itself is not deployed anywhere — it is built, not hosted.
- The 1930s "boiling line" is approximated by static displacement-free geometry and
  a tremble on the character only; there is no per-frame line boil.
