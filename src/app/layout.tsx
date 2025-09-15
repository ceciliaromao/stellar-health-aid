import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";
import { AuthProvider } from "@/context/AuthProvider";
import { WalletProvider } from "@/context/WalletProvider";
import { DonationQueueProvider } from "@/context/DonationQueueProvider";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wallets Quickstart",
  description: "A quickstart for wallets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <AuthProvider>
            <WalletProvider>
              <DonationQueueProvider>
                {children}
                <Toaster />
              </DonationQueueProvider>
            </WalletProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
