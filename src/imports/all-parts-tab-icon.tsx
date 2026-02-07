import { useId } from "react";

interface AllPartsTabIconProps {
  className?: string;
  active?: boolean;
}

export function AllPartsTabIcon({ className = "", active = false }: AllPartsTabIconProps) {
  const id = useId();
  const clipId = `clip0-allparts-${id.replace(/:/g, "")}`;
  const maskId = `mask0-allparts-${id.replace(/:/g, "")}`;

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
        <g clipPath={`url(#${clipId})`}>
          <mask id={maskId} style={{ maskType: "luminance" }} maskUnits="userSpaceOnUse" x="-1" y="0" width="25" height="24">
            <path d="M23.999 0H-0.000976562V24H23.999V0Z" fill="white" />
          </mask>
          <g mask={`url(#${maskId})`}>
            <path opacity="0.4" d="M21.0395 7.19L11.9995 12.42L2.95947 7.19C3.35947 6.45 3.93947 5.8 4.58947 5.44L9.92947 2.48C11.0695 1.84 12.9295 1.84 14.0695 2.48L19.4095 5.44C20.0595 5.8 20.6395 6.45 21.0395 7.19Z" fill="currentColor" />
            <path opacity="0.6" d="M11.9996 12.4195V21.9995C11.2496 21.9995 10.4996 21.8395 9.92965 21.5195L4.58965 18.5595C3.37965 17.8895 2.38965 16.2095 2.38965 14.8295V9.16945C2.38965 8.52945 2.60965 7.82945 2.95965 7.18945L11.9996 12.4195Z" fill="currentColor" />
            <path d="M21.6095 9.16945V14.8295C21.6095 16.2095 20.6195 17.8895 19.4095 18.5595L14.0695 21.5195C13.4995 21.8395 12.7495 21.9995 11.9995 21.9995V12.4195L21.0395 7.18945C21.3895 7.82945 21.6095 8.52945 21.6095 9.16945Z" fill="currentColor" />
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
        <mask id={maskId} style={{ maskType: "luminance" }} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
          <path d="M24 0H0V24H24V0Z" fill="white" />
        </mask>
        <g mask={`url(#${maskId})`}>
          <path d="M11.9996 13.3008C11.8696 13.3008 11.7396 13.2708 11.6196 13.2008L2.7896 8.09083C2.4396 7.88083 2.3096 7.42083 2.5196 7.06083C2.7296 6.70083 3.1896 6.58083 3.5496 6.79083L11.9996 11.6808L20.3996 6.82083C20.7596 6.61083 21.2196 6.74083 21.4296 7.09083C21.6396 7.45083 21.5096 7.91083 21.1596 8.12083L12.3896 13.2008C12.2596 13.2608 12.1296 13.3008 11.9996 13.3008Z" fill="currentColor" />
          <path d="M12 22.3591C11.59 22.3591 11.25 22.0191 11.25 21.6091V12.5391C11.25 12.1291 11.59 11.7891 12 11.7891C12.41 11.7891 12.75 12.1291 12.75 12.5391V21.6091C12.75 22.0191 12.41 22.3591 12 22.3591Z" fill="currentColor" />
          <path d="M11.9997 22.75C11.1197 22.75 10.2497 22.56 9.55965 22.18L4.21965 19.21C2.76965 18.41 1.63965 16.48 1.63965 14.82V9.17C1.63965 7.51 2.76965 5.59 4.21965 4.78L9.55965 1.82C10.9297 1.06 13.0697 1.06 14.4397 1.82L19.7797 4.79C21.2297 5.59 22.3597 7.52 22.3597 9.18V14.83C22.3597 16.49 21.2297 18.41 19.7797 19.22L14.4397 22.18C13.7497 22.56 12.8797 22.75 11.9997 22.75ZM11.9997 2.75C11.3697 2.75 10.7497 2.88 10.2897 3.13L4.94965 6.1C3.98965 6.63 3.13965 8.07 3.13965 9.17V14.82C3.13965 15.92 3.98965 17.36 4.94965 17.9L10.2897 20.87C11.1997 21.38 12.7997 21.38 13.7097 20.87L19.0497 17.9C20.0097 17.36 20.8597 15.93 20.8597 14.82V9.17C20.8597 8.07 20.0097 6.63 19.0497 6.09L13.7097 3.12C13.2497 2.88 12.6297 2.75 11.9997 2.75Z" fill="currentColor" />
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
