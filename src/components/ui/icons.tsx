import type { SVGProps } from "react";

/**
 * Icons are drawn in the kit's own grammar: one 2px ink stroke, square joins,
 * slightly uneven terminals. No borrowed icon font, no emoji.
 */
type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Icon({ size = 20, children, ...rest }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const Star = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3.4 14.3 9l5.9.3-4.6 3.7 1.5 5.7L12 15.6l-5 3.1 1.4-5.7L3.8 9.3 9.7 9Z" />
  </Icon>
);

export const Splat = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 2.8c1.6 2.5 2.3 3.2 4.9 2.6-.6 2.4 0 3.3 2.6 4.1-1.9 1.8-2 2.6-.6 4.8 2.6.4 3.3 1 3.3 1s-1.5 1.8-4.2 1.6c-.8 2.6-1.6 3.2-1.6 3.2s-2.2-2-4.4-1.2c-1 2.4-1 2.9-1 2.9s-1.9-1.5-1.9-4.3C5.6 18.6 4 17 4 17s2.4-1.5 2.2-3.7C3.8 12.1 3 11 3 11s2.2-1 2.2-3C2.8 6.6 2.6 6 2.6 6s3.4-.7 5.4-2.4" />
  </Icon>
);

export const ArrowRight = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 12h15" />
    <path d="m13.4 6.2 5.9 5.8-5.9 5.8" />
  </Icon>
);

export const ArrowUpRight = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6.5 17.5 17.5 6.5" />
    <path d="M8.6 6.3h9.3v9.3" />
  </Icon>
);

export const Check = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4.6 13.2 9.3 18 19.4 6.6" />
  </Icon>
);

export const ChevronDown = (p: IconProps) => (
  <Icon {...p}>
    <path d="m5.4 9.2 6.6 6.4 6.6-6.4" />
  </Icon>
);

export const Close = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 6.3 18 18" />
    <path d="M18.1 6.1 6.2 17.9" />
  </Icon>
);

export const Code = (p: IconProps) => (
  <Icon {...p}>
    <path d="m8.4 6.6-6 5.4 6 5.4" />
    <path d="m15.6 6.6 6 5.4-6 5.4" />
    <path d="M13.4 4.4 10.6 19.6" />
  </Icon>
);

export const Copy = (p: IconProps) => (
  <Icon {...p}>
    <path d="M8.4 8.4h11.2v11.2H8.4z" />
    <path d="M5.8 15.6H4.4V4.4h11.2v1.4" />
  </Icon>
);

export const Plus = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 4.8v14.4" />
    <path d="M4.8 12h14.4" />
  </Icon>
);

export const Minus = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4.8 12h14.4" />
  </Icon>
);

export const Grid = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 4h6.4v6.4H4z" />
    <path d="M13.6 4H20v6.4h-6.4z" />
    <path d="M4 13.6h6.4V20H4z" />
    <path d="M13.6 13.6H20V20h-6.4z" />
  </Icon>
);

export const Sliders = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 3.6v16.8" />
    <path d="M12 3.6v16.8" />
    <path d="M19 3.6v16.8" />
    <path d="M2.6 8.4h4.8" />
    <path d="M9.6 15.2h4.8" />
    <path d="M16.6 7h4.8" />
  </Icon>
);

export const Hand = (p: IconProps) => (
  <Icon {...p}>
    <path d="M8.6 12.4V5.6a1.7 1.7 0 0 1 3.4 0v5.6" />
    <path d="M12 11.2V4.4a1.7 1.7 0 0 1 3.4 0v6.8" />
    <path d="M15.4 11.6V7.4a1.7 1.7 0 0 1 3.4 0v8.2c0 3-2.5 5.4-5.6 5.4h-1.1c-2.1 0-3.3-.9-4.4-2.6l-3-4.6a1.8 1.8 0 0 1 2.9-2.1l2.8 2.7" />
  </Icon>
);

export const Bolt = (p: IconProps) => (
  <Icon {...p}>
    <path d="M13.6 2.6 5.4 13.4h5.2l-1 8 8.2-10.8h-5.2Z" />
  </Icon>
);

export const Info = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 4.2a7.8 7.8 0 1 0 .1 15.6 7.8 7.8 0 0 0-.1-15.6Z" />
    <path d="M12 10.8v5.4" />
    <path d="M12 7.9v.2" />
  </Icon>
);

export const Sound = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4.2 9.4h3.2L12.4 5v14l-5-4.4H4.2z" />
    <path d="M16 9.2a4 4 0 0 1 0 5.6" />
    <path d="M18.6 6.4a7.6 7.6 0 0 1 0 11.2" />
  </Icon>
);

export const Sun = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 8.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6Z" />
    <path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M18.8 5.2l-1.6 1.6M6.8 17.2l-1.6 1.6" />
  </Icon>
);

export const Eye = (p: IconProps) => (
  <Icon {...p}>
    <path d="M2.6 12S6 6.4 12 6.4 21.4 12 21.4 12 18 17.6 12 17.6 2.6 12 2.6 12Z" />
    <path d="M12 9.4a2.6 2.6 0 1 0 0 5.2 2.6 2.6 0 0 0 0-5.2Z" />
  </Icon>
);
