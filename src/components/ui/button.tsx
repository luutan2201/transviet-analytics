import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-button)] text-sm font-medium transition-all duration-[var(--duration-fast)] ease-[var(--ease-default)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[var(--shadow-card)] hover:brightness-110 hover:shadow-[var(--shadow-hover)] hover:-translate-y-0.5 active:translate-y-0",
        secondary:
          "glass-surface text-[var(--foreground)] hover:bg-[var(--glass-hover)] hover:-translate-y-0.5 active:translate-y-0",
        outline:
          "border border-[var(--border)] bg-transparent text-[var(--foreground)] hover:bg-[var(--glass-hover)]",
        ghost: "bg-transparent text-[var(--foreground)] hover:bg-[var(--glass-hover)]",
        danger:
          "bg-[var(--destructive)] text-[var(--destructive-foreground)] hover:brightness-110 hover:-translate-y-0.5",
        icon: "bg-transparent text-[var(--foreground)] hover:bg-[var(--glass-hover)] rounded-full",
      },
      size: {
        sm: "h-10 px-4 text-sm",
        md: "h-11 px-5 text-sm",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-7 text-base",
        iconOnly: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  readonly asChild?: boolean;
  readonly loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, loading = false, disabled, children, ...props },
    ref
  ) => {
    if (asChild) {
      return (
        <Slot ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props}>
          {children}
        </Slot>
      );
    }

    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled ?? loading}
        {...props}
      >
        {loading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
