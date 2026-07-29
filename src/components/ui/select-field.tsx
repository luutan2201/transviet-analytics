import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  readonly options: readonly { readonly value: string; readonly label: string }[];
}

export const SelectField = React.forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ className, options, ...props }, ref) => (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          "h-11 w-full appearance-none rounded-[var(--radius-button)] border border-[var(--input)] bg-[var(--glass-bg)] pl-4 pr-9 text-sm text-[var(--foreground)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
    </div>
  )
);
SelectField.displayName = "SelectField";
