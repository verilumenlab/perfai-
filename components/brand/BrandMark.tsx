/** Architectural P + partnership mark — transparent SVG, no background plate. */
export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {/* Left tower */}
      <path d="M6 66V22h22v44H6Z" fill="#23A875" />
      {/* Right tower */}
      <path d="M30 66V12h26v54H30Z" fill="#75E6AE" />

      {/* Window grid — left */}
      <g fill="#F1FAF6">
        <rect x="11" y="27" width="4" height="4" rx="0.5" />
        <rect x="19" y="27" width="4" height="4" rx="0.5" />
        <rect x="11" y="36" width="4" height="4" rx="0.5" />
        <rect x="19" y="36" width="4" height="4" rx="0.5" />
        <rect x="11" y="45" width="4" height="4" rx="0.5" />
        <rect x="19" y="45" width="4" height="4" rx="0.5" />
      </g>
      {/* Window slits — right */}
      <g fill="#071B17" opacity="0.28">
        <rect x="36" y="18" width="14" height="2.5" rx="0.5" />
        <rect x="36" y="26" width="14" height="2.5" rx="0.5" />
        <rect x="36" y="34" width="14" height="2.5" rx="0.5" />
        <rect x="36" y="42" width="14" height="2.5" rx="0.5" />
      </g>

      {/* Stylized P stem + bowl */}
      <path
        d="M14 66V30.5c0-1.2.9-2.2 2.1-2.2h14.2c7.4 0 12.2 4.1 12.2 10.4 0 6.1-4.7 10.2-12 10.2H27.2V66H14Z"
        fill="#071B17"
      />
      <path
        d="M27.2 45.2h4.8c3.5 0 5.6-1.9 5.6-4.7s-2.1-4.7-5.6-4.7h-4.8v9.4Z"
        fill="#102C25"
      />

      {/* Handshake / channel pathway */}
      <path
        d="M24 48c7.5-4.2 14.8-2.4 20.6 3.2 3.2 3.1 7.1 4 11.4 2.2"
        stroke="#75E6AE"
        strokeWidth="3.6"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M26.5 52.2c6.6-3.4 13.2-1.8 18.2 2.6 2.7 2.4 5.9 3.1 9.5 1.8"
        stroke="#23A875"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />

      {/* Connectivity nodes */}
      <circle cx="24" cy="48" r="3" fill="#75E6AE" />
      <circle cx="56" cy="53.4" r="3" fill="#23A875" />
      <circle cx="24" cy="48" r="1.35" fill="#071B17" />
      <circle cx="56" cy="53.4" r="1.35" fill="#F1FAF6" />
    </svg>
  );
}
