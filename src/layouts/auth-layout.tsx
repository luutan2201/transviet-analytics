export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-gradient-bg flex min-h-screen items-center justify-center p-4">
      {children}
    </div>
  );
}
