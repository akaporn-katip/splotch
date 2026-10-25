# Splotch

A cartoon component kit for React. Radix primitives underneath, cut paper on top:
21 parts, printed in misregistered spot inks, themed by four CSS variables.

**This is a demo surface, not a published package.** There is no install command and
nothing here is for sale. The component source is the deliverable — copy it.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + static build into dist/
npm run preview
```

## What's in it

```
src/
  index.css                 the whole material system: inks, paper, plates, halftone, motion
  components/
    ui/
      primitives.tsx        Button, IconButton, Badge, Avatar, Progress, Kbd, RegMark
      form.tsx              Input, Textarea, Label, Help, ErrorText, Switch, Checkbox,
                            RadioGroup, Slider, Select, ToggleGroup
      overlay.tsx           Dialog, DropdownMenu, ContextMenu, Popover, Tooltip, Toast,
                            Tabs, Accordion
      icons.tsx             14 icons drawn in one 2px ink stroke
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

## The ink system

Four variables decide the entire page. They live on `<html data-ink="…">`:

| token                | role                                            |
| -------------------- | ----------------------------------------------- |
| `--color-field`      | the page ground                                 |
| `--color-accent`     | the spot ink: plates, fills, destructive states |
| `--color-flag`       | the second ink: headers, selected states        |
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
