import * as React from "react";
import { cn } from "@/app/components/ui/utils";

interface MaterialChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  /** Optional variant for filled vs outlined style */
  variant?: "filled" | "outlined";
}

/**
 * Material-style chip for displaying metadata (material type, diameter, date, etc.).
 * Matches Figma design: pill shape, light background, subtle border.
 */
export function MaterialChip({
  children,
  variant = "filled",
  className,
  ...props
}: MaterialChipProps) {
  const baseStyles = {
    display: "flex",
    height: 20,
    padding: "10px 8px",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    borderRadius: 8,
  } as const;

  return (
    <span
      role="status"
      style={{
        ...baseStyles,
        ...(variant === "filled"
          ? { background: "#454545", color: "#FFF" }
          : { background: "#FFF", border: "1px solid #E5E5E5", color: "#424242" }),
      }}
      className={cn(
        "inline-flex text-xs font-medium w-fit whitespace-nowrap shrink-0",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
