import { useId } from "react";

export function PrintTimeIcon({ className }: { className?: string }) {
  const id = useId();
  const clipId = `clip0-printtime-${id.replace(/:/g, "")}`;
  const maskId = `mask0-printtime-${id.replace(/:/g, "")}`;

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
            d="M12.0001 22.0002C16.7884 22.0002 20.6701 18.1185 20.6701 13.3302C20.6701 8.54185 16.7884 4.66016 12.0001 4.66016C7.21177 4.66016 3.33008 8.54185 3.33008 13.3302C3.33008 18.1185 7.21177 22.0002 12.0001 22.0002Z"
            fill="currentColor"
          />
          <path
            d="M12 13.75C11.59 13.75 11.25 13.41 11.25 13V8C11.25 7.59 11.59 7.25 12 7.25C12.41 7.25 12.75 7.59 12.75 8V13C12.75 13.41 12.41 13.75 12 13.75Z"
            fill="currentColor"
          />
          <path
            d="M14.8901 3.45H9.11014C8.71014 3.45 8.39014 3.13 8.39014 2.73C8.39014 2.33 8.71014 2 9.11014 2H14.8901C15.2901 2 15.6101 2.32 15.6101 2.72C15.6101 3.12 15.2901 3.45 14.8901 3.45Z"
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
