import Link from "next/link";
import { BrandMark } from "@/components/brand/BrandMark";

type BrandLogoProps = {
  /** `dark` = light text for dark surfaces; `light` = dark text for light surfaces */
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  /** Navbar-safe: mark + wordmark only (no tiny stacked lines) */
  compact?: boolean;
  href?: string | null;
  className?: string;
  /** Kept for API compatibility with prior Image-based logo */
  priority?: boolean;
  testId?: string;
};

const SIZE = {
  sm: {
    wrap: "gap-2",
    icon: "h-8 w-8",
    brand: "text-[15px] leading-none tracking-tight",
    partner: "text-[8px] leading-none tracking-[0.12em]",
    services: "text-[6.5px] leading-none tracking-[0.14em]",
    stack: "gap-1",
  },
  md: {
    wrap: "gap-2.5",
    icon: "h-10 w-10",
    brand: "text-lg leading-none tracking-tight",
    partner: "text-[9px] leading-none tracking-[0.12em]",
    services: "text-[7px] leading-none tracking-[0.14em]",
    stack: "gap-1",
  },
  lg: {
    wrap: "gap-3",
    icon: "h-12 w-12",
    brand: "text-xl leading-none tracking-tight",
    partner: "text-[10px] leading-none tracking-[0.12em]",
    services: "text-[7.5px] leading-none tracking-[0.14em]",
    stack: "gap-1.5",
  },
} as const;

export function BrandLogo({
  variant = "dark",
  size = "md",
  compact = false,
  href = "/",
  className = "",
  testId,
}: BrandLogoProps) {
  const s = SIZE[size];
  const onDark = variant === "dark";

  const mark = (
    <span className={`inline-flex items-center ${s.wrap} ${className}`}>
      <BrandMark className={`${s.icon} shrink-0`} />
      {compact ? (
        <span
          className={`font-heading font-extrabold ${s.brand} ${
            onDark ? "text-white" : "text-ink-dark"
          }`}
        >
          perfai
        </span>
      ) : (
        <span className={`flex min-w-0 flex-col justify-center ${s.stack}`}>
          <span
            className={`font-heading font-extrabold ${s.brand} ${
              onDark ? "text-white" : "text-ink-dark"
            }`}
          >
            perfai
          </span>
          <span
            className={`font-heading font-bold uppercase ${s.partner} ${
              onDark ? "text-mint-accent" : "text-green-primary"
            }`}
          >
            Channel Partner
          </span>
          <span
            className={`font-sans font-medium uppercase ${s.services} ${
              onDark ? "text-white/55" : "text-[#62766E]"
            }`}
          >
            Building Management Services
          </span>
        </span>
      )}
    </span>
  );

  if (!href) {
    return (
      <span
        className="inline-flex"
        role="img"
        aria-label="perfai — Channel Partner, Building Management Services"
        data-testid={testId}
      >
        {mark}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className="inline-flex items-center rounded-md focus-visible:outline-2 focus-visible:outline-mint-accent"
      data-testid={testId}
      aria-label="perfai home"
    >
      {mark}
    </Link>
  );
}
