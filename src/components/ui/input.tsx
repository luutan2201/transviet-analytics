import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-12 w-full rounded-[var(--radius-button)] border border-[var(--input)] bg-[var(--glass-bg)] px-4 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] transition-colors duration-[var(--duration-fast)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:border-[var(--primary)]",
        "disabled:cursor-not-allowed disabled:opacity-40",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
