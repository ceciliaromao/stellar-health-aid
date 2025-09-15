// "use client";

// import { AuthCrossmint } from "@/components/organisms/AuthCrossmint";
// import { useAuth, useWallet } from "@crossmint/client-sdk-react-ui";
// import { useRef } from "react";
// import { CSSTransition, SwitchTransition } from "react-transition-group";

// export default function Home() {
//   const { wallet, status: walletStatus } = useWallet();
//   const { status: authStatus } = useAuth();
//   const nodeRef = useRef(null);

//   const isLoggedIn = wallet != null && authStatus === "logged-in";
//   const isLoading =
//     walletStatus === "in-progress" || authStatus === "initializing";

//   return (
//     <div className="min-h-screen flex flex-col">
//       <main className="flex-1">
//         <SwitchTransition mode="out-in">
//           <CSSTransition
//             key={isLoggedIn ? "dashboard" : "landing"}
//             nodeRef={nodeRef}
//             timeout={400}
//             classNames="page-transition"
//             unmountOnExit
//           >
//             <div ref={nodeRef}>
//               {isLoggedIn ? (
//                 // <Passkey />
//                 <h1>Olá</h1>
//               ) : (
//                 <AuthCrossmint isLoading={isLoading} />
//               )}
//             </div>
//           </CSSTransition>
//         </SwitchTransition>
//       </main>
//     </div>
//   );
// }

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Shield, Coins, Users, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-health-primary" />
            <span className="text-2xl font-bold text-gray-900">HealthAid</span>
          </div>
          <Link href="/onboarding">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-4 bg-health-primary/10 text-health-primary border-health-primary/20">
            Powered by Stellar Blockchain
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 text-balance">Your Health, Your Money, Your Control</h1>
          <p className="text-xl text-gray-600 mb-8 text-pretty max-w-2xl mx-auto">
            A decentralized health wallet that grows your funds through DeFi while ensuring they're only used for
            healthcare. When emergencies strike, our community has your back.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/onboarding">
              <Button size="lg">
                Start Your Health Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/donation-queue">
              <Button size="lg" variant="outline">
                View Community Support
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">How HealthAid Works</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center border-2 hover:border-health-primary/20 transition-colors">
              <CardHeader>
                <Shield className="h-12 w-12 text-health-primary mx-auto mb-4" />
                <CardTitle className="text-lg">Self-Custody</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Your funds stay in your control. No intermediaries, no hidden fees, just pure ownership.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:border-health-primary/20 transition-colors">
              <CardHeader>
                <Coins className="h-12 w-12 text-health-secondary mx-auto mb-4" />
                <CardTitle className="text-lg">Earn Yield</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Your health funds automatically earn interest through secure DeFi protocols on Stellar.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:border-health-primary/20 transition-colors">
              <CardHeader>
                <Heart className="h-12 w-12 text-health-accent mx-auto mb-4" />
                <CardTitle className="text-lg">Health-Only</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Smart restrictions ensure funds can only be spent at verified healthcare providers.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:border-health-primary/20 transition-colors">
              <CardHeader>
                <Users className="h-12 w-12 text-health-primary mx-auto mb-4" />
                <CardTitle className="text-lg">Community Support</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Transparent donation system helps community members during medical emergencies.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose HealthAid?</h2>
            <p className="text-lg text-gray-600">Traditional health plans vs. decentralized health wallets</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Traditional Health Plans</h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                  High monthly premiums
                </div>
                <div className="flex items-center text-gray-600">
                  <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                  Limited provider networks
                </div>
                <div className="flex items-center text-gray-600">
                  <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                  Complex claim processes
                </div>
                <div className="flex items-center text-gray-600">
                  <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                  No control over funds
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">HealthAid Wallet</h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-health-primary mr-3" />
                  Funds earn yield while unused
                </div>
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-health-primary mr-3" />
                  Use at any healthcare provider
                </div>
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-health-primary mr-3" />
                  Instant payments, no claims
                </div>
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-health-primary mr-3" />
                  Complete fund ownership
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-health-primary text-white">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Take Control of Your Health Finances?</h2>
          <p className="text-xl mb-8 text-green-100">
            Join thousands who have already started their decentralized health journey.
          </p>
          <Link href="/onboarding">
            <Button size="lg" variant="secondary" className="bg-white text-health-primary hover:bg-gray-100">
              Create Your Health Wallet
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="h-6 w-6 text-health-primary" />
                <span className="text-xl font-bold">HealthAid</span>
              </div>
              <p className="text-gray-400">Decentralized health wallet powered by Stellar blockchain.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/dashboard" className="hover:text-white">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/wallet" className="hover:text-white">
                    Wallet
                  </Link>
                </li>
                <li>
                  <Link href="/donation-queue" className="hover:text-white">
                    Community
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Disclaimer
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Stellar HealthAid. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
