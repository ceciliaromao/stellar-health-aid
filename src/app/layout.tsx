import type { Metadata } from "next";
import { Geist_Mono, Poppins } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";
import { AuthProvider } from "@/context/AuthProvider";
import { WalletProvider } from "@/context/WalletProvider";
import { DonationQueueProvider } from "@/context/DonationQueueProvider";
import { Toaster } from "@/components/ui/toaster";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stellar Health Aid",
  description: "Your health, your money",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${geistMono.variable} font-sans antialiased`}
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
