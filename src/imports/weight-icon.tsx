import { useId } from "react";

export function WeightIcon({ className }: { className?: string }) {
  const id = useId();
  const clipId = `clip0-weight-${id.replace(/:/g, "")}`;
  const maskId = `mask0-weight-${id.replace(/:/g, "")}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <g clipPath={`url(#${clipId})`}>
        <mask
          id={maskId}
          style={{ maskType: "luminance" }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <path d="M24 0H0V24H24V0Z" fill="white" />
        </mask>
        <g mask={`url(#${maskId})`}>
          <path
            opacity="0.4"
            d="M8 22H16C19 22 21 20 21 17V7C21 4 19 2 16 2H8C5 2 3 4 3 7V17C3 20 5 22 8 22Z"
            fill="currentColor"
          />
          <path
            d="M17.5 8.0007C14.37 5.2107 9.63998 5.2107 6.49998 8.0007C6.35998 8.1307 6.32998 8.3307 6.42998 8.4807L8.60998 11.9807C8.66998 12.0707 8.76998 12.1407 8.86998 12.1507C8.97998 12.1707 9.08998 12.1307 9.16998 12.0607C10.78 10.6307 13.2 10.6307 14.81 12.0607C14.88 12.1207 14.97 12.1507 15.06 12.1507C15.08 12.1507 15.1 12.1507 15.11 12.1507C15.22 12.1307 15.32 12.0707 15.37 11.9807L17.55 8.4807C17.67 8.3307 17.64 8.1307 17.5 8.0007Z"
            fill="currentColor"
          />
        </g>
      </g>
      <defs>
        <clipPath id={clipId}>
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
