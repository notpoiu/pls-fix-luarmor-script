import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { DarkLuaProvider } from "@/components/darklua-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Please fix my luarmor script 😔",
  description:
    "A website designed to automatically fix your luau syntax into lua so that luarmor can understand it.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressContentEditableWarning suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <DarkLuaProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster />
            {children}
          </ThemeProvider>
        </DarkLuaProvider>
      </body>
    </html>
  );
}
