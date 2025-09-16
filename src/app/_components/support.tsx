import { Check } from "lucide-react";

const supportItems = [
  {
    title: "NGOs",
    description:
      "Airdrop health subsidies directly to verified individuals. With KYC, each wallet = unique identity. No fraud, no duplicates.",
  },
  {
    title: "Private Companies",
    description:
      "Offer Stellar Health Aid as employee health benefits. Funds are flexible, transparent, and always available.",
  },
  {
    title: "Governments & Programs",
    description:
      "Enable conditional health assistance distribution with blockchain-backed transparency and traceability.",
  },
];

export default function Support() {
  return (
    <section
      className="w-full px-4 py-10 flex flex-col items-center"
      style={{
        background: "linear-gradient(135deg, #F7E06D 0%, #F2D43D 100%)"
      }}
    >
      <div className="max-w-lg w-full">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-4">
          Healthcare support that’s<br />secure, transparent,<br />and scalable.
        </h2>
        <p className="text-base md:text-lg text-gray-900 text-center mb-8">
          Stellar Health Aid is not just for individuals, it’s also a solution for organizations and employees that want to empower communities.
        </p>
        <div className="space-y-6">
          {supportItems.map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <Check className="mt-1 text-black" size={20} />
              <div>
                <span className="font-semibold text-black text-base">{item.title}</span>
                <div className="text-sm text-black mt-1">{item.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
