"use client";
import { useState } from "react";
import KYCIdentification from "./_components/kyc-identification";
import KYCPersonalData from "./_components/kyc-personal-data";
import KYCAdditionalInfo from "./_components/kyc-additional-info";
import KYCIdentityPhoto from "./_components/kyc-identity-photo";

export default function KYCScreen() {
  const [step, setStep] = useState(0);
  const next = () => setStep(s => s + 1);
  const back = () => setStep(s => Math.max(0, s - 1));

  return (
    <div className="flex flex-col h-full">
      {step === 0 && <KYCIdentification onContinue={next} />}
      {step === 1 && <KYCPersonalData onContinue={next} onBack={back} />}
      {step === 2 && <KYCAdditionalInfo onContinue={next} onBack={back} />}
      {step === 3 && <KYCIdentityPhoto onContinue={next} onBack={back} />}
    </div>
  );
}
