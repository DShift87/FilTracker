import { useId } from "react";

export function PartsEmptyIcon({ className }: { className?: string }) {
  const id = useId();
  const clipId = `clip0-parts-empty-${id.replace(/:/g, "")}`;
  const maskId = `mask0-parts-empty-${id.replace(/:/g, "")}`;

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
          x="-1"
          y="0"
          width="25"
          height="24"
        >
          <path d="M23.999 0H-0.000976562V24H23.999V0Z" fill="white" />
        </mask>
        <g mask={`url(#${maskId})`}>
          <path
            opacity="0.4"
            d="M21.0395 7.19L11.9995 12.42L2.95947 7.19C3.35947 6.45 3.93947 5.8 4.58947 5.44L9.92947 2.48C11.0695 1.84 12.9295 1.84 14.0695 2.48L19.4095 5.44C20.0595 5.8 20.6395 6.45 21.0395 7.19Z"
            fill="currentColor"
          />
          <path
            opacity="0.6"
            d="M11.9996 12.4195V21.9995C11.2496 21.9995 10.4996 21.8395 9.92965 21.5195L4.58965 18.5595C3.37965 17.8895 2.38965 16.2095 2.38965 14.8295V9.16945C2.38965 8.52945 2.60965 7.82945 2.95965 7.18945L11.9996 12.4195Z"
            fill="currentColor"
          />
          <path
            d="M21.6095 9.16945V14.8295C21.6095 16.2095 20.6195 17.8895 19.4095 18.5595L14.0695 21.5195C13.4995 21.8395 12.7495 21.9995 11.9995 21.9995V12.4195L21.0395 7.18945C21.3895 7.82945 21.6095 8.52945 21.6095 9.16945Z"
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
