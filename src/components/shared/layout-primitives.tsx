import { cn } from "@/lib/utils";

export function Container({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mx-auto w-full max-w-[1440px] px-4 md:px-6 lg:px-8", className)}
      {...props}
    />
  );
}

export function Section({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return <section className={cn("w-full py-8 md:py-12", className)} {...props} />;
}

export function PageTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn(
        "text-3xl font-bold tracking-tight text-[var(--foreground)] md:text-4xl",
        className
      )}
      {...props}
    />
  );
}

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  readonly title: string;
  readonly subtitle?: string;
  readonly actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, actions, className, ...props }: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-1.5">
        <PageTitle>{title}</PageTitle>
        {subtitle && (
          <p className="text-sm text-[var(--muted-foreground)] md:text-base">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}
