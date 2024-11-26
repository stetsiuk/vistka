import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "next-themes";
import { extractRouterConfig } from "uploadthing/server";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { GoogleTagManager } from "@next/third-parties/google";

import { ourFileRouter } from "@/app/api/uploadthing/core";
import { Toaster } from "@/components/ui/toaster";
import ReactQueryProvider from "@/app/ReactQueryProvider";

import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  display: "swap",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  display: "swap",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Vistka",
    default: "Vistka",
  },
  description: "The social app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.className} ${geistMono.className}`}
        suppressHydrationWarning={true}
      >
        <GoogleTagManager gtmId="GTM-WPZSZTHZ" />
        <GoogleTagManager gtmId="GTM-5LKCPF22" />
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </ReactQueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
