import { useId } from "react";

interface FilamentIconProps {
  className?: string;
  active?: boolean;
}

export function FilamentIcon({ className = "", active = false }: FilamentIconProps) {
  const id = useId();
  const clipId = `clip0-fil-${id.replace(/:/g, "")}`;
  const maskId = `mask0-fil-${id.replace(/:/g, "")}`;

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
              d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 14.5C10.62 14.5 9.5 13.38 9.5 12C9.5 10.62 10.62 9.5 12 9.5C13.38 9.5 14.5 10.62 14.5 12C14.5 13.38 13.38 14.5 12 14.5Z"
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

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 13.9995C13.1046 13.9995 14 13.1041 14 11.9995C14 10.8949 13.1046 9.99951 12 9.99951C10.8954 9.99951 10 10.8949 10 11.9995C10 13.1041 10.8954 13.9995 12 13.9995Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
