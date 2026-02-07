import { useId } from "react";

export function AddImageIcon({ className }: { className?: string }) {
  const id = useId();
  const clipId = `clip0-addimage-${id.replace(/:/g, "")}`;
  const maskId = `mask0-addimage-${id.replace(/:/g, "")}`;

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
            d="M22.0201 16.8203L18.8901 9.50027C18.3201 8.16027 17.4701 7.40027 16.5001 7.35027C15.5401 7.30027 14.6101 7.97027 13.9001 9.25027L12.0001 12.6603C11.6001 13.3803 11.0301 13.8103 10.4101 13.8603C9.78014 13.9203 9.15014 13.5903 8.64014 12.9403L8.42014 12.6603C7.71014 11.7703 6.83014 11.3403 5.93014 11.4303C5.03014 11.5203 4.26014 12.1403 3.75014 13.1503L2.02014 16.6003C1.40014 17.8503 1.46014 19.3003 2.19014 20.4803C2.92014 21.6603 4.19014 22.3703 5.58014 22.3703H18.3401C19.6801 22.3703 20.9301 21.7003 21.6701 20.5803C22.4301 19.4603 22.5501 18.0503 22.0201 16.8203Z"
            fill="currentColor"
          />
          <path
            d="M6.96984 8.38012C8.83657 8.38012 10.3498 6.86684 10.3498 5.00012C10.3498 3.13339 8.83657 1.62012 6.96984 1.62012C5.10312 1.62012 3.58984 3.13339 3.58984 5.00012C3.58984 6.86684 5.10312 8.38012 6.96984 8.38012Z"
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
