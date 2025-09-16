import { Plus, Shield, Users, Heart, ArrowDownRight, ArrowUpRight } from "lucide-react";

const features = [
  {
    icon: <Shield className="text-yellow-500" size={32} />,
    title: "Always Yours",
    description: "Self-custodial wallet. No intermediaries, no hidden rules.",
  },
  {
    icon: <Plus className="text-yellow-500" size={32} />,
    title: "Beats Inflation",
    description: "Funds automatically swapped into USDC, generating yield that grows over time.",
  },
  {
    icon: <Heart className="text-yellow-500" size={32} />,
    title: "For Health Only",
    description: "Spend only at authorized providers and pharmacies via QR code.",
  },
  {
    icon: <ArrowDownRight className="text-yellow-500" size={32} />,
    title: "Funds That Work",
    description: "If unused, your balance accumulates + interest, unlike traditional plans.",
  },
  {
    icon: <ArrowUpRight className="text-yellow-500" size={32} />,
    title: "Transparent & Secure",
    description: "Built on Stellar blockchain with real-time traceability.",
  },
  {
    icon: <Users className="text-yellow-500" size={32} />,
    title: "Community Support",
    description: "Launch crowdfunding campaigns for urgent treatments, powered by smart escrow.",
  },
];

export default function Features() {
  return (
    <section className="w-full px-4 py-8 flex flex-col items-center">
      <div className="mb-8 text-center">
        <span className="block text-sm md:text-base font-medium text-gray-400 mb-2 tracking-wide">INTRODUCING STELLAR HEALTH AID</span>
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight mb-3">
          Your Health.<br />Your Money.<br />Always in Your Control.
        </h1>
        <p className="text-base md:text-lg text-gray-700 max-w-lg mx-auto">
          We created a decentralized, self-custodial wallet designed for healthcare.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 w-full">
        {features.map((feature) => (
          <div key={feature.title} className="bg-white rounded-xl border border-gray-200 p-4 flex gap-3 items-center w-full">
            <div className="flex-shrink-0">{feature.icon}</div>
            <div>
              <span className="font-semibold text-gray-900 text-base">{feature.title}</span>
              <div className="text-sm text-gray-600 mt-1">{feature.description}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
