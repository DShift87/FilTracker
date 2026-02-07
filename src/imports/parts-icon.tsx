import { useId } from "react";

interface PartsIconProps {
  className?: string;
  active?: boolean;
}

export function PartsIcon({ className = "", active = false }: PartsIconProps) {
  const id = useId();
  const clipIdActive = `clip0-parts-active-${id.replace(/:/g, "")}`;
  const maskIdActive = `mask0-parts-active-${id.replace(/:/g, "")}`;
  const clipIdInactive = `clip0-parts-inactive-${id.replace(/:/g, "")}`;
  const maskIdInactive = `mask0-parts-inactive-${id.replace(/:/g, "")}`;

  if (active) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className={className}
      >
        <g clipPath={`url(#${clipIdActive})`}>
          <mask id={maskIdActive} style={{ maskType: "luminance" }} maskUnits="userSpaceOnUse" x="-1" y="0" width="25" height="24">
            <path d="M23.999 0H-0.000976562V24H23.999V0Z" fill="white" />
          </mask>
          <g mask={`url(#${maskIdActive})`}>
            <path opacity="0.4" d="M21.0395 7.19L11.9995 12.42L2.95947 7.19C3.35947 6.45 3.93947 5.8 4.58947 5.44L9.92947 2.48C11.0695 1.84 12.9295 1.84 14.0695 2.48L19.4095 5.44C20.0595 5.8 20.6395 6.45 21.0395 7.19Z" fill="currentColor" />
            <path opacity="0.6" d="M11.9996 12.4195V21.9995C11.2496 21.9995 10.4996 21.8395 9.92965 21.5195L4.58965 18.5595C3.37965 17.8895 2.38965 16.2095 2.38965 14.8295V9.16945C2.38965 8.52945 2.60965 7.82945 2.95965 7.18945L11.9996 12.4195Z" fill="currentColor" />
            <path d="M21.6095 9.16945V14.8295C21.6095 16.2095 20.6195 17.8895 19.4095 18.5595L14.0695 21.5195C13.4995 21.8395 12.7495 21.9995 11.9995 21.9995V12.4195L21.0395 7.18945C21.3895 7.82945 21.6095 8.52945 21.6095 9.16945Z" fill="currentColor" />
          </g>
        </g>
        <defs>
          <clipPath id={clipIdActive}>
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
    );
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <g clipPath={`url(#${clipIdInactive})`}>
        <mask id={maskIdInactive} style={{ maskType: "luminance" }} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
          <path d="M24 0H0V24H24V0Z" fill="white" />
        </mask>
        <g mask={`url(#${maskIdInactive})`}>
          <path d="M3.17004 7.43945L12 12.5495L20.77 7.46945" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 21.6091V12.5391" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9.93001 2.4793L4.59001 5.4393C3.38001 6.1093 2.39001 7.7893 2.39001 9.1693V14.8193C2.39001 16.1993 3.38001 17.8793 4.59001 18.5493L9.93001 21.5193C11.07 22.1493 12.94 22.1493 14.08 21.5193L19.42 18.5493C20.63 17.8793 21.62 16.1993 21.62 14.8193V9.1693C21.62 7.7893 20.63 6.1093 19.42 5.4393L14.08 2.4693C12.93 1.8393 11.07 1.8393 9.93001 2.4793Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>
      <defs>
        <clipPath id={clipIdInactive}>
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
