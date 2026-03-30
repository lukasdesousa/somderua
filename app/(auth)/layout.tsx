import type { Metadata } from "next";
import PageIllustration from "@/components/page-illustration";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative flex grow flex-col">
      <PageIllustration multiple />
      {children}
    </main>
  );
}
