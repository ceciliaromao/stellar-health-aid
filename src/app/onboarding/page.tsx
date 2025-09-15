"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Shield,
  Fingerprint,
  ArrowRight,
  CheckCircle,
  User,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { AuthCrossmint } from "@/components/organisms/AuthCrossmint";
import { EmbeddedAuthForm } from "@crossmint/client-sdk-react-ui";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const { register, isLoading } = useAuth();

  const handlePasskeySetup = async () => {
    try {
      await register("user@healthaid.com", "HealthAid User");
      // Redirect to dashboard on success
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Passkey setup failed:", error);
    }
  };

  const handleSkipPasskey = () => {
    // Skip passkey setup and go to dashboard
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-8 w-8 text-health-primary" />
            <span className="text-2xl font-bold text-gray-900">HealthAid</span>
          </div>
          <Badge className="bg-health-primary/10 text-health-primary border-health-primary/20">
            Step {step} of 3
          </Badge>
        </div>

        {step === 1 && (
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Welcome to HealthAid</CardTitle>
              <CardDescription>
                Let's create your decentralized health wallet in just a few
                steps
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Shield className="h-5 w-5 text-health-primary" />
                  <span className="text-sm text-gray-700">
                    Your funds, your control
                  </span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-indigo-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-health-secondary" />
                  <span className="text-sm text-gray-700">
                    Earn yield while saving
                  </span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-blue-100 rounded-lg">
                  <Heart className="h-5 w-5 text-health-accent" />
                  <span className="text-sm text-gray-700">
                    Community support available
                  </span>
                </div>
              </div>
              <Button onClick={() => setStep(2)} className="w-full">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <p className="text-xs text-gray-500 text-center">
                By continuing, you agree to our Terms of Service and Privacy
                Policy
              </p>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Create Your Account</CardTitle>
              <CardDescription>
                Sign up with Google through our secure Crossmint integration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-health-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-10 w-10 text-health-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">
                  Google Authentication
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Connect your Google account to create your HealthAid wallet
                  securely
                </p>
              </div>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-health-primary" />
                  <span>Secure Google OAuth integration</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-health-primary" />
                  <span>Powered by Crossmint technology</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-health-primary" />
                  <span>Instant wallet creation</span>
                </div>
              </div>

              {/* Placeholder for Crossmint embed */}
              {/* <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"> */}
              {/* <AuthCrossmint /> */}
              {/* Embbedd */}
              {/* </div> */}

              <EmbeddedAuthForm />

              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="w-full"
              >
                Back
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Secure Authentication</CardTitle>
              <CardDescription>
                Optionally set up passwordless login with your device's
                biometric authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-health-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Fingerprint className="h-10 w-10 text-health-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">
                  Passkey Authentication
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Use your fingerprint, face ID, or device PIN for secure,
                  passwordless access
                </p>
              </div>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-health-primary" />
                  <span>No passwords to remember</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-health-primary" />
                  <span>Biometric security</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-health-primary" />
                  <span>Works across all your devices</span>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={handleSkipPasskey}
                  className="flex-1 bg-transparent"
                >
                  Configure Later
                </Button>
                <Button
                  onClick={handlePasskeySetup}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? "Setting up..." : "Setup Passkey"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-health-primary hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
