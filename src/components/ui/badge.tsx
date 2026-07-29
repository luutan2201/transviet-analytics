import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
  {
    variants: {
      variant: {
        neutral: "bg-[var(--muted)] text-[var(--muted-foreground)]",
        success:
          "bg-[color-mix(in_srgb,var(--color-success)_16%,transparent)] text-[var(--color-success)]",
        warning:
          "bg-[color-mix(in_srgb,var(--color-warning)_16%,transparent)] text-[var(--color-warning)]",
        danger:
          "bg-[color-mix(in_srgb,var(--color-danger)_16%,transparent)] text-[var(--color-danger)]",
        info: "bg-[color-mix(in_srgb,var(--color-info)_16%,transparent)] text-[var(--color-info)]",
        outstanding: "bg-[color-mix(in_srgb,#8b5cf6_16%,transparent)] text-[#8b5cf6]",
        primary: "bg-[color-mix(in_srgb,var(--primary)_16%,transparent)] text-[var(--primary)]",
      },
    },
    defaultVariants: { variant: "neutral" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
