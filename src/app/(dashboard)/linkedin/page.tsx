import type { Metadata } from "next";
import { LinkedInContent } from "@/features/linkedin/components/linkedin-content";

export const metadata: Metadata = { title: "LinkedIn" };

export default function LinkedInPage() {
  return <LinkedInContent />;
}
