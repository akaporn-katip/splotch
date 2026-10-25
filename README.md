# Splotch

A cartoon component kit for React. Radix primitives underneath, cut paper on top:
21 parts, printed in misregistered spot inks, themed by four CSS variables.

**Not on npm, and never will be: `"private": true` is deliberate.** You install the
kit from this folder with a `file:` specifier, or by copying the source. Nothing here
is for sale.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + static build into dist/
npm run build:lib  # the installable kit into dist-lib/
npm run preview
```

## What's in it

```
src/
  index.ts                  the public entry: the ui parts + lib/inks, nothing else
  index.css                 the whole material system: inks, paper, plates, halftone, motion
  components/
    ui/
      primitives.tsx        Button, IconButton, Badge, Avatar, Progress, Kbd, RegMark
      form.tsx              Input, Textarea, Label, Help, ErrorText, Switch, Checkbox,
                            RadioGroup, Slider, Select, ToggleGroup
      overlay.tsx           Dialog, DropdownMenu, ContextMenu, Popover, Tooltip, Toast,
                            Tabs, Accordion
      icons.tsx             19 icons drawn in one 2px ink stroke
    site/
      Masthead.tsx          sticky printed masthead + mobile contents dialog
      Hero.tsx              the proof sheet; live controls drive the character
      Mascot.tsx            Splotch, drawn as one ink plate over one spot plate
      Lab.tsx               the parts sheet: 4 tabs, 21 live specimens, markup dialogs
      Anatomy.tsx           one button, taken apart
      Inks.tsx              the ink room: four ink sets, registration, reprint
      Notes.tsx             notes from the press + colophon
  lib/
    inks.ts                 4 ink sets
    shop.ts                 ink / registration / halftone / toast state
```

## Tests

```bash
npm test         # Playwright, against a fresh production build
npm run test:ui  # the same suite, in the inspector
```

Chromium, the built sheet, fourteen specs: no console or page errors, no horizontal
overflow at 390–1440, the four ink sets re-inking the page, the hero's live controls
by keyboard, dialog focus trapping, the registration slider, and
`prefers-reduced-motion`. `npm run audit:contrast` re-checks the palette; CI
(`.github/workflows/ci.yml`) runs build, audit and tests on every push and pull
request.

## Use it in your project

Nothing is on npm — `private` is set on purpose — so point a project at your local
copy of this repo. Then import the sheet once and the parts you need:

```bash
npm install file:../cartoon-ui    # or: npm link ../cartoon-ui
```

```tsx
import "splotch-ui/index.css";
import { Button, Dialog, INKS } from "splotch-ui";
```

`npm run build:lib` is what gets installed: `dist-lib/index.js`, `dist-lib/index.d.ts`
and `dist-lib/style.css` — the last is what the `./index.css` subpath points at.
React 19 is a peer dependency; Radix and the two `@fontsource` faces are ordinary
dependencies. The sheet sets `--font-display` and `--font-sans` but does not carry
the faces, so import the `@fontsource` CSS the way `src/main.tsx` does if you want
the printed type; without it they fall back to Georgia and system-ui.

Rather not depend on it? Copy `src/index.css`, `src/components/ui` and `src/lib`
into your app and the markup keeps working — that is the kit. `src/components/site`
is the proof sheet it is printed on.

## The ink system

Four variables decide the entire page. They live on `<html data-ink="…">`:

| token                | role                                            |
| -------------------- | ----------------------------------------------- |
| `--color-field`      | the page ground                                 |
| `--color-accent`     | the spot ink: plates, fills                     |
| `--color-flag`       | the second ink: headers, selected states        |
| `--color-error`      | the set's destructive ink: error messages, danger fills |
| `--color-paper`      | the stock every component is printed on         |
| `--color-on-field`   | text that sits directly on the field            |
| `--color-highlight`  | the second voice in a display heading           |
| `--reg`              | registration offset in px (one slider, whole page) |

Swap the set in the ink room, or set `data-ink` yourself. Every pair was checked
for 4.5:1 body / 3:1 large-text contrast in all four sets.

Reusing the look elsewhere?

```css
@import "tailwindcss";
/* copy the @theme block and the four html[data-ink] blocks from src/index.css */
```

## Notes on the build

- **Two builds.** `npm run build` bakes the demo into `dist/`; `npm run build:lib`
  bakes the kit into `dist-lib/` — one ESM entry, its declarations, one stylesheet.
  The demo sections never reach the kit.
- **Private on purpose.** `"private": true` stops `npm publish` dead, which is why
  there is no `prepublishOnly` script to run a build nobody can ship. `files`,
  `exports`, `main`, `module`, `types` and `peerDependencies` are there for the one
  consumer that exists — a `file:` install — and `sideEffects` marks the shipped
  stylesheet as side-effectful so it is not tree-shaken away.
- **No raster images.** Every mark — grain, halftone, registration targets, the
  character, the icons, the stamp — is CSS or inline SVG.
- **Depth is a second ink, not a shadow.** Raised parts carry a spot-colour plate
  out of register (`box-shadow: calc(var(--reg) * -1) var(--reg) 0 0 …`). Hover
  brings it into register; press overshoots past it.
- **Corners are cut, not rounded:** four different radii per shape
  (`--radius-cut`), so nothing reads as a default card.
- **Behaviour is Radix.** Focus order, escape, roving tabindex, typeahead, and
  screen-reader wiring come from the primitive. Only the paper is ours.
- **Accessibility:** every control is reachable and named, focus is a visible
  dashed crop mark, motion respects `prefers-reduced-motion`, and text contrast was
  audited against all four ink sets.

Set in Alfa Slab One (display) and Jost (everything else), both self-hosted via
`@fontsource`.
