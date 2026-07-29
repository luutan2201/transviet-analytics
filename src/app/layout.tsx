import type { Metadata, Viewport } from "next";
import { AppProviders } from "@/providers/app-providers";
import { APP_NAME } from "@/config/constants";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: "Nền tảng Analytics chuyên nghiệp cho hiệu suất marketing.",
};

export const viewport: Viewport = {
  themeColor: "#07161a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
