#!/usr/bin/env node
/**
 * Checks the contrast claim in DESIGN.md / README.md against the palette that is
 * actually shipped: "Every pairing is audited at 4.5:1 body / 3:1 large text
 * across all four sets."
 *
 * WHAT GATES, AND WHAT IS ONLY REPORTED
 * WCAG 2.1 1.4.3 (Contrast, Minimum) is the text criterion: every pair a reader has
 * to read holds 4.5:1 — 3:1 where it is large text — in all four sets and the
 * fallback sheet. WCAG 2.1
 * 1.4.11 (Non-text Contrast) is the one that applies to the parts of a control a
 * user must perceive to operate it: the ink key line on an input and the dashed
 * focus crop mark, at 3:1. Both of those are GATING: a failure exits 1.
 *
 * Two pairs are DECORATIVE and are reported only. `accent/paper` is the
 * registration plate a panel is printed over, and
 * `paper/field` is a pale stock printed on a pale ground in mustard and newsprint.
 * Neither is text and neither is the only thing that identifies a control, so no
 * WCAG threshold applies to it: a 1.4.11 threshold copied onto them measures art,
 * not usability. Their ratios still print and still FAIL loudly in the log, so a
 * palette drifting stays visible; they do not set the exit code. Do not "fix" a
 * red row by lowering a threshold — decide which criterion the pair actually
 * answers to, and say so in `role`.
 *
 * THREE COPIES OF THE PALETTE, AND THIS SCRIPT WATCHES ALL OF THEM
 * The colours live in the `@theme` fallback, in each `html[data-ink="…"]` block of
 * src/index.css, and in the `INKS` array of src/lib/inks.ts that prints the ink
 * room and its swatches. A drifted `inks.ts` would print one set while the sheet
 * resolved another, so it is compared token by token and any disagreement exits 1.
 *
 * WHAT IS MEASURED
 * - the base pairings (text, error text, display headings, the 1.4.11 marks);
 * - every reduced-opacity text alpha that src/ actually paints, discovered from
 *   the `text-ink/NN` and `text-on-field/NN` utilities Tailwind compiles. The list
 *   is scanned, not hand-written, so a new alpha starts gating on the next run
 *   instead of slipping past the audit (the failure this file was rewritten for).
 *   Each row prints the call sites it protects;
 * - the two colours that are mixed in CSS rather than written as a token:
 *   `.ink-accent` (spot ink mixed toward the key line so it reads on stock) and
 *   `.field::placeholder` (ink mixed into the paper);
 * - the `@theme` block as the `fallback` set, since DESIGN.md sells it as the
 *   sheet a document with no `data-ink` prints;
 * - the DESIGN.md Inks rule that the error ink "stays clearly apart" from the
 *   set's spot ink, as a CIEDE2000 floor of 10.
 *
 * SURFACES, AND THE ONE PAIR THAT IS MEASURED BUT DOES NOT GATE
 * Every reduced alpha is measured over both surfaces of its family — ink over
 * paper and paper-2, on-field over field and field-deep. One pair is printed and
 * not gated: `text-ink/60` on paper-2 measures 4.41:1 (plum) to 4.60:1, and no
 * className puts a label that light on the shaded stock. It is an INFO row with
 * its real number, and the scan exits 1 if a `bg-paper-2` className ever carries
 * `text-ink/60` or lighter — "raise to /65 or this pair must move to gating".
 * Data-driven backgrounds are beyond a regex; the INFO row stays visible for them.
 *
 * Ratios are WCAG 2.1 relative luminance. Reduced-opacity and mixed text is
 * composited over the surface behind it first (that is what the browser paints),
 * then measured. Colour separation is CIEDE2000.
 *
 *   node scripts/audit-contrast.mjs          aligned table, exit 1 on a gating failure
 *   node scripts/audit-contrast.mjs --json   the same checks as JSON
 */
import { readFileSync, readdirSync } from "node:fs";
import { relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const BODY = 4.5; // WCAG 2.1 AA, 1.4.3: text under 24px (or under 19px bold)
const LARGE = 3.0; // WCAG 2.1 AA, 1.4.3: text at 24px+, or 19px+ at bold
const BOUNDARY = 3.0; // WCAG 2.1 AA, 1.4.11: marks a user needs in order to operate a control
const SEPARATION = 10; // DESIGN.md Inks: error ink stays apart from the spot (CIEDE2000)

/**
 * Pairs that decide the exit code: 1.4.3 text, plus the 1.4.11 marks a control is
 * operated by. `alpha` marks text the CSS paints at reduced opacity (`text-ink/70`),
 * which is composited over `bg` before measuring; `mix` marks a `color-mix()` in
 * the sheet, resolved in Oklab the way the CSS resolves it.
 */
const GATING = [
  { fg: "on-field", bg: "field", min: BODY, role: "body text on the ground" },
  { fg: "on-field", bg: "field-deep", min: BODY, role: "body text on deep ground" },
  { fg: "on-accent", bg: "accent", min: BODY, role: "body text on the spot" },
  { fg: "on-flag", bg: "flag", min: BODY, role: "body text on the second ink" },
  { fg: "highlight", bg: "field", min: LARGE, role: "display heading, 24px+" },
  { fg: "ink", bg: "paper", min: BODY, role: "text on stock" },
  { fg: "ink", bg: "paper-2", min: BODY, role: "text on shaded stock" },
  { fg: "error", bg: "paper", min: BODY, role: "error text on stock" },
  { fg: "error", bg: "paper-2", min: BODY, role: "error text on shaded stock" },
  { fg: "ink", bg: "paper", min: BOUNDARY, role: "1.4.11: input key line and focus crop mark on stock" },
  // On the ground the crop mark is painted in on-field (`.ring-on-field`, or
  // currentColor on on-field text), never in ink — so that is the pair to measure.
  { fg: "on-field", bg: "field", min: BOUNDARY, role: "1.4.11: focus crop mark on the ground" },
];

/**
 * The two colours the sheet mixes rather than names, read out of their own rules so
 * their weights cannot drift away from what is audited either.
 */
function readMix(css, selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const block = new RegExp(`${escaped}\\s*\\{([^}]*)\\}`).exec(css);
  if (!block) throw new Error(`${sourcePath}: no ${selector} rule to read the mixed ink from`);
  const mix = /color-mix\(\s*in oklab,\s*var\(--color-([a-z0-9-]+)\)\s*([\d.]+)%,\s*var\(--color-([a-z0-9-]+)\)\s*\)/.exec(
    block[1],
  );
  if (!mix) throw new Error(`${sourcePath}: ${selector} is not an Oklab color-mix of two tokens`);
  return { fg: mix[1], mix: { with: mix[3], weight: Number(mix[2]) / 100 } };
}

function mixChecks(css) {
  const inkAccent = readMix(css, ".ink-accent");
  const placeholder = readMix(css, ".field::placeholder");
  return [
    {
      ...inkAccent,
      bg: "paper",
      min: BODY,
      pair: "ink-accent on paper",
      role: "`.ink-accent` — specimen index numerals (Anatomy.tsx:49,167; Hero.tsx:176-186; Lab.tsx:80; Notes.tsx:71)",
    },
    {
      ...inkAccent,
      bg: "paper-2",
      min: BODY,
      pair: "ink-accent on paper-2",
      role: "`.ink-accent` when the specimen sits on shaded stock",
    },
    {
      ...placeholder,
      bg: "paper",
      min: BODY,
      pair: "placeholder on paper",
      role: "`.field::placeholder` — every empty Input, Textarea and Select",
    },
  ];
}

/**
 * Decorative pairs: printed art, not text and not a control boundary. Their ratio
 * and threshold still print and still FAIL, so palette drift stays visible; they
 * are excluded from the exit code. See the header for why.
 */
const DECORATIVE = [
  { fg: "accent", bg: "paper", min: BOUNDARY, role: "registration plate under a panel (decorative)" },
  { fg: "paper", bg: "field", min: BOUNDARY, role: "stock printed on the ground (decorative)" },
];

/**
 * The surfaces each token's reduced-opacity text is printed over. `text-ink/NN`
 * sits on a sheet (`paper` or the shaded `paper-2`); `text-on-field/NN` sits on
 * the ground (`field` or the deeper `field-deep`). Both are measured so a label
 * moved between the two still has a number.
 */
const TEXT_SURFACES = {
  ink: ["paper", "paper-2"],
  "on-field": ["field", "field-deep"],
};

/**
 * Alphas that are printed art rather than text, so 1.4.3 does not apply. Both sit
 * on `aria-hidden` elements: the watermark wordmark (Notes.tsx:111, ink/12) and the
 * registration marks plus the empty-state splat (Anatomy.tsx:73-76, Lab.tsx:423,
 * ink/40). They are measured and printed as INFO; they never set the exit code.
 */
const PRINTED_ART = new Set(["ink/12", "ink/40"]);

const SOURCE = fileURLToPath(new URL("../src/index.css", import.meta.url));
const INKS_SOURCE = fileURLToPath(new URL("../src/lib/inks.ts", import.meta.url));
const SRC_DIR = fileURLToPath(new URL("../src", import.meta.url));
const sourcePath = relative(process.cwd(), SOURCE);
const inksPath = relative(process.cwd(), INKS_SOURCE);

/** `--color-*` declarations of one CSS block, last value winning. */
function tokens(body) {
  const declared = {};
  for (const match of body.matchAll(/--color-([a-z0-9-]+)\s*:\s*([^;}]+)/g)) {
    declared[match[1]] = match[2].trim();
  }
  return declared;
}

/** `@theme` is the fallback sheet; each `html[data-ink]` block overrides it. */
function readPalette(css) {
  const theme = css.match(/@theme\s*\{([^}]*)\}/);
  if (!theme) throw new Error(`${sourcePath}: no @theme block to read the fallback inks from`);
  const fallback = tokens(theme[1]);

  const sets = [...css.matchAll(/html\[data-ink="([^"]+)"\]\s*\{([^}]*)\}/g)].map((match) => ({
    id: match[1],
    colours: { ...fallback, ...tokens(match[2]) },
  }));
  if (sets.length === 0) throw new Error(`${sourcePath}: no html[data-ink] blocks to audit`);

  // DESIGN.md sells `@theme` as the sheet printed when no data-ink is set, so it
  // is audited as its own set instead of hiding behind the values it repeats.
  return [{ id: "fallback", colours: fallback }, ...sets];
}

/** The ink room's own copy of the palette, entry by entry. */
function readInkModule() {
  const text = readFileSync(INKS_SOURCE, "utf8");
  return [...text.matchAll(/\{\s*id:\s*"([^"]+)"([\s\S]*?)\}/g)].map((match) => {
    const read = (key) =>
      match[2].match(new RegExp(`(?:^|\\s)${key}:\\s*"(#[0-9a-fA-F]+)"`))?.[1]?.toLowerCase();
    return {
      id: match[1],
      field: read("field"),
      accent: read("accent"),
      flag: read("flag"),
      paper: read("paper"),
      error: read("error"),
    };
  });
}

/** Every `{ entry, token }` where src/lib/inks.ts and src/index.css disagree. */
function readDrift(sets, inks) {
  const drift = [];
  const byId = new Map(sets.filter((set) => set.id !== "fallback").map((set) => [set.id, set]));
  for (const ink of inks) {
    const set = byId.get(ink.id);
    if (!set) {
      drift.push({ set: ink.id, token: "id", inks: ink.id, css: "no html[data-ink] block" });
      continue;
    }
    for (const key of ["field", "accent", "flag", "paper", "error"]) {
      const css = (set.colours[key] ?? "").toLowerCase();
      if (ink[key] !== css) drift.push({ set: ink.id, token: key, inks: ink[key], css });
    }
    byId.delete(ink.id);
  }
  for (const id of byId.keys()) {
    drift.push({ set: id, token: "id", inks: "missing from INKS", css: id });
  }
  return drift;
}

/** Source files whose utility classes Tailwind compiles. */
function sourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return /\.(tsx|ts)$/.test(entry.name) ? [path] : [];
  });
}

/**
 * The reduced-opacity text alphas the sheet prints, discovered from the class
 * names in src/ rather than from a list kept here: `text-ink/60`, `text-on-field/75`.
 * Returns token → alpha (percent) → the call sites that paint it.
 */
function readTextAlphas() {
  const alphas = new Map();
  for (const file of sourceFiles(SRC_DIR).sort()) {
    const lines = readFileSync(file, "utf8").split("\n");
    lines.forEach((line, at) => {
      for (const match of line.matchAll(/text-(ink|on-field)\/(\d+)/g)) {
        const [, token, percent] = match;
        if (!alphas.has(token)) alphas.set(token, new Map());
        const byAlpha = alphas.get(token);
        if (!byAlpha.has(Number(percent))) byAlpha.set(Number(percent), new Set());
        byAlpha.get(Number(percent)).add(`${relative(process.cwd(), file)}:${at + 1}`);
      }
    });
  }
  return alphas;
}

/**
 * The lightest reduced ink a label may sit on the shaded stock. `text-ink/60`
 * measures 4.41:1 (plum) to 4.60:1 on `--color-paper-2`, so the sheet prints those
 * labels on paper only. The pair is still measured and printed, as INFO, and
 * findShadedStockLabels() below exits 1 if a className ever puts one on bg-paper-2.
 */
const LIGHTEST_SHEET_ONLY = 60;

/** One gating row per (token, alpha, surface) the sheet actually paints. */
function reducedTextChecks(alphas) {
  const checks = [];
  for (const [token, byAlpha] of alphas) {
    const surfaces = TEXT_SURFACES[token];
    if (!surfaces) throw new Error(`no surface rule for text-${token}`);
    for (const [percent, sites] of [...byAlpha].sort(([a], [b]) => a - b)) {
      const callSites = [...sites].sort();
      const decorative = PRINTED_ART.has(`${token}/${percent}`);
      const sheetOnly = token === "ink" && percent <= LIGHTEST_SHEET_ONLY;
      const shown = callSites.slice(0, 2).join(", ");
      const more = callSites.length > 2 ? ` (+${callSites.length - 2} more)` : "";
      for (const bg of surfaces) {
        const unshipped = !decorative && sheetOnly && bg === "paper-2";
        const role = decorative
          ? `printed art, aria-hidden — ${shown}${more}`
          : unshipped
            ? `never printed on shaded stock; use /65 there — ${shown}${more}`
            : `reduced-opacity text — ${shown}${more}`;
        checks.push({
          fg: token,
          alpha: percent / 100,
          bg,
          min: decorative ? BOUNDARY : BODY,
          gating: !decorative && !unshipped,
          pair: `text-${token}/${percent} on ${bg}`,
          role,
        });
      }
    }
  }
  return checks;
}

/**
 * The structural guard behind the INFO row above: a className string that prints
 * `text-ink/60` (or lighter) on `bg-paper-2` would measure 4.41-4.60, so it is a
 * real failure, not an unshipped pair. Data-driven backgrounds are out of reach of
 * a regex, which is why the INFO row stays visible either way.
 */
function findShadedStockLabels() {
  const found = [];
  for (const file of sourceFiles(SRC_DIR).sort()) {
    const lines = readFileSync(file, "utf8").split("\n");
    lines.forEach((line, at) => {
      for (const literal of line.matchAll(/"([^"]*)"|`([^`]*)`/g)) {
        const text = literal[1] ?? literal[2] ?? "";
        if (!/bg-paper-2/.test(text)) continue;
        const light = /text-ink\/(\d+)/.exec(text);
        if (light && Number(light[1]) <= LIGHTEST_SHEET_ONLY) {
          found.push({
            where: `${relative(process.cwd(), file)}:${at + 1}`,
            label: light[0],
          });
        }
      }
    });
  }
  return found;
}

/**
 * The whole check list: the named pairings, the two mixed inks read from their own
 * rules, the reduced-opacity alphas discovered in src/, and the decorative rows
 * that are printed but do not gate. `readTextAlphas` is the reason a new
 * `text-ink/55` cannot slip past this file the way `/65` and `/75` once did.
 */
function buildChecks(css) {
  const base = GATING.map((check) => ({ ...check, gating: true }));
  const mixed = mixChecks(css).map((check) => ({ ...check, gating: true }));
  const alphas = reducedTextChecks(readTextAlphas());
  const decorative = DECORATIVE.map((check) => ({ ...check, gating: false }));
  return { all: [...base, ...mixed, ...alphas, ...decorative], base, mixed, alphas };
}

function rgb(value, token) {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(value ?? "");
  if (!match) throw new Error(`${sourcePath}: ${token} is not a hex colour (${value ?? "missing"})`);
  const hex = match[1].length === 3 ? [...match[1]].map((c) => c + c).join("") : match[1];
  return [0, 2, 4].map((at) => parseInt(hex.slice(at, at + 2), 16));
}

/** sRGB channel (0-255) to linear light (0-1). */
const toLinear = (channel) => {
  const s = channel / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};

/** Linear light (0-1) back to an sRGB channel (0-255). */
const fromLinear = (channel) => {
  const v = Math.min(1, Math.max(0, channel));
  return 255 * (v <= 0.0031308 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - 0.055);
};

/** WCAG 2.1 relative luminance. */
function luminance([red, green, blue]) {
  const linear = (channel) => {
    const s = channel / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * linear(red) + 0.7152 * linear(green) + 0.0722 * linear(blue);
}

function contrast(a, b) {
  const [bright, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (bright + 0.05) / (dark + 0.05);
}

/** Source-over compositing in sRGB, which is how opacity on text reaches the screen. */
function over(top, bottom, alpha) {
  return top.map((channel, at) => channel * alpha + bottom[at] * (1 - alpha));
}

/* ------------------------------------------------ Oklab, for the color-mix() rows */

function linearToOklab([red, green, blue]) {
  const l = Math.cbrt(0.4122214708 * red + 0.5363325363 * green + 0.0514459929 * blue);
  const m = Math.cbrt(0.2119034982 * red + 0.6806995451 * green + 0.1073969566 * blue);
  const s = Math.cbrt(0.0883024619 * red + 0.2817188376 * green + 0.6299787005 * blue);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function oklabToLinear([L, a, b]) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

/** `color-mix(in oklab, top <weight>, bottom)` resolved into sRGB. */
function mixOklab(top, bottom, weight) {
  const a = linearToOklab(top.map(toLinear));
  const b = linearToOklab(bottom.map(toLinear));
  return oklabToLinear(a.map((value, at) => value * weight + b[at] * (1 - weight))).map(fromLinear);
}

/* --------------------------------------------- CIEDE2000, for the error/accent rule */

function rgbToLab([red, green, blue]) {
  const [r, g, b] = [red, green, blue].map(toLinear);
  const x = (0.4124564 * r + 0.3575761 * g + 0.1804375 * b) / 0.95047;
  const y = 0.2126729 * r + 0.7151522 * g + 0.072175 * b;
  const z = (0.0193339 * r + 0.119192 * g + 0.9503041 * b) / 1.08883;
  const delta = (6 / 29) ** 3;
  const f = (t) => (t > delta ? Math.cbrt(t) : t / (3 * (6 / 29) ** 2) + 4 / 29);
  const [fx, fy, fz] = [x, y, z].map(f);
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}

/** CIEDE2000 colour difference (Sharma et al., 2005). */
function deltaE00(first, second) {
  const [L1, a1, b1] = first;
  const [L2, a2, b2] = second;
  const radians = Math.PI / 180;
  const c1 = Math.hypot(a1, b1);
  const c2 = Math.hypot(a2, b2);
  const cBar = (c1 + c2) / 2;
  const g = 0.5 * (1 - Math.sqrt(cBar ** 7 / (cBar ** 7 + 25 ** 7)));
  const a1p = (1 + g) * a1;
  const a2p = (1 + g) * a2;
  const c1p = Math.hypot(a1p, b1);
  const c2p = Math.hypot(a2p, b2);
  const hue = (a, b) => (a === 0 && b === 0 ? 0 : (Math.atan2(b, a) / radians + 360) % 360);
  const h1p = hue(a1p, b1);
  const h2p = hue(a2p, b2);
  const dLp = L2 - L1;
  const dCp = c2p - c1p;
  let dhp = 0;
  if (c1p * c2p !== 0) {
    const difference = h2p - h1p;
    if (Math.abs(difference) <= 180) dhp = difference;
    else dhp = difference > 180 ? difference - 360 : difference + 360;
  }
  const dHp = 2 * Math.sqrt(c1p * c2p) * Math.sin((dhp * radians) / 2);
  const lBarP = (L1 + L2) / 2;
  const cBarP = (c1p + c2p) / 2;
  let hBarP = h1p + h2p;
  if (c1p * c2p !== 0) {
    if (Math.abs(h1p - h2p) <= 180) hBarP = (h1p + h2p) / 2;
    else if (h1p + h2p < 360) hBarP = (h1p + h2p + 360) / 2;
    else hBarP = (h1p + h2p - 360) / 2;
  }
  const t =
    1 -
    0.17 * Math.cos((hBarP - 30) * radians) +
    0.24 * Math.cos(2 * hBarP * radians) +
    0.32 * Math.cos((3 * hBarP + 6) * radians) -
    0.2 * Math.cos((4 * hBarP - 63) * radians);
  const dTheta = 30 * Math.exp(-(((hBarP - 275) / 25) ** 2));
  const rC = 2 * Math.sqrt(cBarP ** 7 / (cBarP ** 7 + 25 ** 7));
  const sL = 1 + (0.015 * (lBarP - 50) ** 2) / Math.sqrt(20 + (lBarP - 50) ** 2);
  const sC = 1 + 0.045 * cBarP;
  const sH = 1 + 0.015 * cBarP * t;
  const rT = -Math.sin(2 * dTheta * radians) * rC;
  return Math.sqrt(
    (dLp / sL) ** 2 + (dCp / sC) ** 2 + (dHp / sH) ** 2 + rT * (dCp / sC) * (dHp / sH),
  );
}

const toHex = (channels) =>
  `#${channels.map((c) => Math.round(c).toString(16).padStart(2, "0")).join("")}`;

const label = (check) => check.pair ?? `${check.fg}/${check.bg}`;

function audit(sets, checks) {
  const rows = [];
  for (const set of sets) {
    for (const check of checks) {
      const ink = rgb(set.colours[check.fg], `--color-${check.fg}`);
      const surface = rgb(set.colours[check.bg], `--color-${check.bg}`);
      const painted = check.mix
        ? mixOklab(ink, rgb(set.colours[check.mix.with], `--color-${check.mix.with}`), check.mix.weight)
        : check.alpha
          ? over(ink, surface, check.alpha)
          : ink;
      const ratio = contrast(painted, surface);
      rows.push({
        set: set.id,
        pair: label(check),
        gating: check.gating ?? true,
        role: check.role,
        ink: toHex(ink),
        surface: toHex(surface),
        painted: toHex(painted),
        ratio: Number(ratio.toFixed(2)),
        threshold: check.min,
        pass: ratio >= check.min,
      });
    }
  }
  return rows;
}

/** DESIGN.md Inks: the error ink stays clearly apart from that set's spot ink. */
function auditSeparation(sets) {
  return sets.map((set) => {
    const error = rgb(set.colours.error, "--color-error");
    const accent = rgb(set.colours.accent, "--color-accent");
    const difference = deltaE00(rgbToLab(error), rgbToLab(accent));
    return {
      set: set.id,
      pair: "error/accent",
      error: toHex(error),
      accent: toHex(accent),
      deltaE: Number(difference.toFixed(1)),
      threshold: SEPARATION,
      pass: difference >= SEPARATION,
      role: "error ink vs spot ink (CIEDE2000)",
    };
  });
}

function table(columns, rows) {
  const widths = columns.map(([title, read]) =>
    Math.max(title.length, ...rows.map((row) => read(row).length)),
  );
  const line = (cells) =>
    cells.map((cell, at) => cell.padEnd(widths[at])).join("  ").trimEnd();
  console.log(line(columns.map(([title]) => title)));
  console.log(line(widths.map((width) => "-".repeat(width))));
  rows.forEach((row, at) => {
    if (at > 0 && row.set !== rows[at - 1].set) console.log("");
    console.log(line(columns.map(([, read]) => read(row))));
  });
}

const CONTRAST_COLUMNS = [
  ["set", (row) => row.set],
  ["pair", (row) => row.pair],
  ["ratio", (row) => row.ratio.toFixed(2)],
  ["needs", (row) => row.threshold.toFixed(1)],
  ["", (row) => (row.pass ? "PASS" : "FAIL")],
  ["role", (row) => row.role],
];

function printTable(rows, sets, checks) {
  const gatingRows = rows.filter((row) => row.gating);
  const informationalRows = rows.filter((row) => !row.gating);

  console.log(`WCAG 2.1 contrast audit — ${sourcePath}`);
  console.log(`${sets.length} ink sets: ${sets.map((set) => set.id).join(", ")}`);
  console.log(
    `${gatingRows.length} gating rows over ${sets.length} sets: ${checks.base.length} base + ${checks.mixed.length} mixed inks` +
      ` + ${checks.alphas.length} reduced-opacity alphas scanned from src/;` +
      ` ${informationalRows.length} informational rows`,
  );
  console.log("\nGATING — 1.4.3 text and the 1.4.11 marks a control is operated by");
  table(CONTRAST_COLUMNS, gatingRows);
  if (informationalRows.length > 0) {
    console.log(
      "\nINFO — decorative pairs, printed art and pairs no selector prints: no WCAG threshold",
    );
    table(CONTRAST_COLUMNS, informationalRows);
  }
}

function printSeparation(rows) {
  console.log(`\nINK SEPARATION — error vs spot, CIEDE2000 >= ${SEPARATION} (DESIGN.md Inks)`);
  table(
    [
      ["set", (row) => row.set],
      ["pair", (row) => `${row.pair} ${row.error} vs ${row.accent}`],
      ["dE00", (row) => row.deltaE.toFixed(1)],
      ["needs", (row) => row.threshold.toFixed(1)],
      ["", (row) => (row.pass ? "PASS" : "FAIL")],
    ],
    rows,
  );
}

function printDrift(drift) {
  if (drift.length === 0) return;
  console.log(`\nPALETTE DRIFT — ${inksPath} disagrees with ${sourcePath}`);
  for (const row of drift) {
    console.log(`  ${row.set} ${row.token}: inks.ts ${row.inks} vs index.css ${row.css}`);
  }
}

function describe(row) {
  return (
    `  ${row.set} ${row.pair} ${row.ratio.toFixed(2)} < ${row.threshold.toFixed(1)}` +
    ` (${row.painted} on ${row.surface}) — ${row.role}`
  );
}

let sets;
let checks;
let rows;
let separation;
let drift;
let shadedStockLabels;
try {
  const css = readFileSync(SOURCE, "utf8");
  sets = readPalette(css);
  checks = buildChecks(css);
  rows = audit(sets, checks.all);
  separation = auditSeparation(sets);
  drift = readDrift(sets, readInkModule());
  shadedStockLabels = findShadedStockLabels();
} catch (error) {
  console.error(`audit-contrast: ${error.message}`);
  process.exit(2);
}

const gatingFailures = rows.filter((row) => row.gating && !row.pass);
const informationalFailures = rows.filter((row) => !row.gating && !row.pass);
const separationFailures = separation.filter((row) => !row.pass);
const failed =
  gatingFailures.length + separationFailures.length + drift.length + shadedStockLabels.length;

function printSummary() {
  console.log(`\nGating: ${rows.filter((row) => row.gating).length - gatingFailures.length}/${rows.filter((row) => row.gating).length} pass.`);
  if (gatingFailures.length > 0) {
    console.log(`\n${gatingFailures.length} gating pairs below threshold:`);
    for (const row of gatingFailures) console.log(describe(row));
  }

  console.log(
    `Separation: ${separation.length - separationFailures.length}/${separation.length} pass.`,
  );
  for (const row of separationFailures) {
    console.log(
      `  ${row.set} ${row.pair} dE00 ${row.deltaE.toFixed(1)} < ${SEPARATION} — error must not read as a highlight`,
    );
  }

  if (drift.length > 0) {
    console.log(`\n${drift.length} palette values disagree between inks.ts and index.css:`);
    printDrift(drift);
  }

  if (shadedStockLabels.length > 0) {
    console.log(`\n${shadedStockLabels.length} label(s) print ink at /${LIGHTEST_SHEET_ONLY} or lighter on bg-paper-2 (4.41-4.60:1):`);
    for (const label of shadedStockLabels) {
      console.log(`  ${label.where} ${label.label} — raise to /65 or this pair must move to gating`);
    }
  }

  if (informationalFailures.length > 0) {
    console.log("\nInformational, not gating:");
    for (const row of informationalFailures) console.log(describe(row));
  }
  console.log(
    `\n${informationalFailures.length} informational pairs below threshold — decorative, printed art, or a surface no selector uses; see header`,
  );
}

if (process.argv.includes("--json")) {
  console.log(
    JSON.stringify(
      {
        source: sourcePath,
        inks: inksPath,
        sets: sets.map((set) => set.id),
        thresholds: { body: BODY, large: LARGE, boundary: BOUNDARY, separation: SEPARATION },
        gatingRows: rows.filter((row) => row.gating).length,
        checks: rows,
        separation,
        drift,
        shadedStockLabels,
        failures: gatingFailures.length,
        separationFailures: separationFailures.length,
        informationalFailures: informationalFailures.length,
        ok: failed === 0,
      },
      undefined,
      2,
    ),
  );
} else {
  printTable(rows, sets, checks);
  printSeparation(separation);
  printDrift(drift);
  if (shadedStockLabels.length > 0) {
    console.log(
      `\nSHADED-STOCK LABELS — a /${LIGHTEST_SHEET_ONLY}-or-lighter ink label on bg-paper-2, measured at 4.41-4.60:1`,
    );
    for (const label of shadedStockLabels) {
      console.log(`  ${label.where} ${label.label} — raise to /65 or this pair must move to gating`);
    }
  }
  printSummary();
}

process.exit(failed === 0 ? 0 : 1);
