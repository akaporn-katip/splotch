import { cx } from "../../lib/cx";

type Mood = "idle" | "boing" | "wobble" | "dots" | "bounce";

/**
 * Splotch: the kit's cut-paper imp. Drawn as one ink plate over one spot plate;
 * the spot plate is deliberately out of register, like the rest of the world.
 */
export function Mascot({
  hopKey,
  wobble,
  mood,
  className,
}: {
  hopKey: number;
  wobble: boolean;
  mood: Mood;
  className?: string;
}) {
  const mouth =
    mood === "boing"
      ? "M116 160c8 16 22 16 30 0"
      : mood === "wobble"
        ? "M114 164c6-7 12 7 18 0s12 7 18 0"
        : mood === "dots"
          ? "M116 162c7 10 21 10 28 0"
          : mood === "bounce"
            ? "M114 160c9 14 23 14 32-2"
            : "M115 160c8 12 22 12 30-2";

  return (
    <svg
      viewBox="0 0 260 320"
      className={cx("h-auto w-full overflow-visible", className)}
      role="img"
      aria-label="Splotch, a cut-paper character wearing a beret and holding a paint brush"
    >
      <g
        key={hopKey}
        className={cx("animate-hop", wobble && "animate-wobble")}
        style={{ transformOrigin: "130px 300px" }}
      >
        {/* printed shadow */}
        <ellipse cx="132" cy="294" rx="72" ry="12" fill="var(--color-ink)" opacity="0.17" />
        <ellipse cx="132" cy="294" rx="48" ry="7" fill="var(--color-ink)" opacity="0.15" />

        {/* legs */}
        <g stroke="var(--color-ink)" strokeWidth="7" strokeLinecap="round">
          <path d="M104 208v44" />
          <path d="M156 208v44" />
        </g>
        <g stroke="var(--color-ink)" strokeWidth="3.5" fill="var(--color-accent)">
          <path d="M80 250h38v13H80z" />
          <path d="M146 250h38v13h-38z" />
        </g>

        {/* spot plate, out of register */}
        <path
          d="M126 46c40-10 78 24 82 72 4 48-22 92-68 96-44 4-80-24-84-72-4-46 28-86 70-96Z"
          fill="var(--color-accent)"
          transform="translate(-9 10)"
        />

        {/* body */}
        <path
          d="M126 46c40-10 78 24 82 72 4 48-22 92-68 96-44 4-80-24-84-72-4-46 28-86 70-96Z"
          fill="var(--color-flag)"
          stroke="var(--color-ink)"
          strokeWidth="3.5"
        />

        {/* arms */}
        <g stroke="var(--color-ink)" strokeWidth="8" strokeLinecap="round" fill="none">
          <path d="M58 158c-20-4-32-18-34-34" />
          <path d="M200 150c18-8 26-22 28-36" />
        </g>

        {/* brush, held up */}
        <g transform="rotate(22 228 108)">
          <rect
            x="222"
            y="60"
            width="10"
            height="48"
            rx="4"
            fill="var(--color-flag)"
            stroke="var(--color-ink)"
            strokeWidth="3.5"
          />
          <rect
            x="218"
            y="46"
            width="18"
            height="15"
            fill="var(--color-paper)"
            stroke="var(--color-ink)"
            strokeWidth="3.5"
          />
          <path
            d="M218 47c-2-11 4-21 9-28 5 7 11 17 9 28Z"
            fill="var(--color-accent)"
            stroke="var(--color-ink)"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <path d="M223 30v10M232 27v13" stroke="var(--color-ink)" strokeWidth="2" opacity="0.5" />
          <circle cx="250" cy="68" r="4.5" fill="var(--color-accent)" stroke="var(--color-ink)" strokeWidth="2.5" />
        </g>

        {/* gloved hands */}
        <circle cx="22" cy="120" r="9" fill="var(--color-ink)" />
        <circle cx="228" cy="108" r="9" fill="var(--color-ink)" />

        {/* beret */}
        <g transform="rotate(-16 118 44)">
          <ellipse
            cx="118"
            cy="46"
            rx="48"
            ry="17"
            fill="var(--color-accent)"
            stroke="var(--color-ink)"
            strokeWidth="3.5"
          />
          <path d="M118 30v-9" stroke="var(--color-ink)" strokeWidth="4" strokeLinecap="round" />
          <circle cx="118" cy="18" r="4" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="3" />
        </g>

        {/* eyes */}
        <g className="mood-blink" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          <ellipse cx="102" cy="130" rx="17" ry="19" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="3.5" />
          <ellipse cx="158" cy="125" rx="15" ry="17" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="3.5" />
          <circle cx={mood === "bounce" ? 107 : 105} cy={mood === "dots" ? 136 : 132} r="6.5" fill="var(--color-ink)" />
          <circle cx={mood === "bounce" ? 155 : 157} cy={mood === "dots" ? 131 : 127} r="6" fill="var(--color-ink)" />
        </g>

        {/* brows */}
        <g stroke="var(--color-ink)" strokeWidth="4" strokeLinecap="round">
          <path d={mood === "boing" ? "M89 104l20 4" : "M90 108l20-4"} />
          <path d={mood === "boing" ? "M170 100l-18 4" : "M169 103l-18-4"} />
        </g>

        {/* mouth */}
        <path d={mouth} stroke="var(--color-ink)" strokeWidth="4.5" fill="none" strokeLinecap="round" />

        {/* cheek */}
        <circle cx="78" cy="166" r="6.5" fill="var(--color-accent)" opacity="0.9" />
      </g>
    </svg>
  );
}
