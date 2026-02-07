import { useId } from "react";

export function CloudIcon({ className }: { className?: string }) {
  const id = useId();
  const clipId = `clip0-cloud-${id.replace(/:/g, "")}`;
  const maskId = `mask0-cloud-${id.replace(/:/g, "")}`;

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
            d="M20.4798 10.6899L2.00977 15.7199C2.11977 14.1299 3.10977 12.4599 5.10977 11.9699C4.51977 9.63986 5.01977 7.44986 6.53977 5.85986C8.26977 4.04986 11.0298 3.32986 13.4098 4.06986C15.5998 4.73986 17.1398 6.53986 17.6898 9.03986C18.7798 9.28986 19.7498 9.85986 20.4798 10.6899Z"
            fill="currentColor"
          />
          <path
            opacity="0.4"
            d="M20.17 18.7404C19.13 19.6904 17.77 20.2204 16.35 20.2204H5.97C3.23 20.0204 2 17.9104 2 16.0304C2 15.9304 2 15.8304 2.01 15.7204L20.48 10.6904C21.05 11.3004 21.48 12.0504 21.74 12.9104C22.4 15.0804 21.8 17.3104 20.17 18.7404Z"
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
