import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { StoreHydration } from "./store-hydration";

import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Memora",
  description: "Vocabulary learning through images and sound associations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <StoreHydration />
          {children}
        </Providers>
      </body>
    </html>
  );
}
