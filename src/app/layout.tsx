import { Toaster } from "@/components/ui/toaster";
import type { Metadata, Viewport } from "next";
import { Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Stellar Health Aid — Sua saúde, seu dinheiro",
    template: "%s — Stellar Health Aid",
  },
  description:
    "Carteira de saúde digital na Stellar: deposite, proteja contra a inflação, gere rendimentos e pague em pontos de saúde.",
  keywords: [
    "Stellar",
    "Saúde",
    "Carteira Digital",
    "Onboarding",
    "Pagamentos em Saúde",
    "Stablecoin",
    "Rendimentos",
    "Web3",
    "Soroban",
  ],
  openGraph: {
    title: "Stellar Health Aid — Sua saúde, seu dinheiro",
    description:
      "Carteira de saúde digital na Stellar: deposite, proteja contra a inflação, gere rendimentos e pague em pontos de saúde.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    siteName: "Stellar Health Aid",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Stellar Health Aid — Sua saúde, seu dinheiro",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stellar Health Aid — Sua saúde, seu dinheiro",
    description:
      "Carteira de saúde digital na Stellar: deposite, proteja contra a inflação, gere rendimentos e pague em pontos de saúde.",
    images: ["/images/og-image.png"],
  },
  category: "health",
  applicationName: "Stellar Health Aid",
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`${poppins.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <Providers>
          {/* <AuthProvider>
            <WalletProvider>
              <DonationQueueProvider> */}
                {children}
                <Toaster />
              {/* </DonationQueueProvider>
            </WalletProvider>
          </AuthProvider> */}
        </Providers>
      </body>
    </html>
  );
}
