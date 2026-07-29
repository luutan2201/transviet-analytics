"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ProgressProps extends React.ComponentPropsWithoutRef<
  typeof ProgressPrimitive.Root
> {
  readonly value?: number;
  readonly indicatorClassName?: string;
}

export const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value = 0, indicatorClassName, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn("relative h-2 w-full overflow-hidden rounded-full bg-[var(--muted)]", className)}
    {...props}
  >
    <motion.div
      className={cn("h-full rounded-full bg-[var(--primary)]", indicatorClassName)}
      initial={{ width: 0 }}
      animate={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = "Progress";
