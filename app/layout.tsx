// @/app/layout.tsx
import "@/styles/globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s [I Can Sings]",
    default: "I Can Sings",
  },
  description: "Saito's page by Saito for Saito",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
