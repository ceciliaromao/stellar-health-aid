import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    question: "How is Stellar Health Aid different from traditional health insurance?",
    answer:
      "Unlike insurance, your money is always yours. It grows with yield, it’s protected against inflation, and can only be spent at authorized healthcare providers.",
  },
  {
    question: "Where can I use my funds?",
    answer:
      "At verified healthcare providers and pharmacies authorized in our network. Payments are made easily via QR code.",
  },
  {
    question: "What happens if I don’t use my balance for months?",
    answer:
      "Your money accumulates, and earns yield in the meantime. Unlike health plans, you don’t lose what you don’t use.",
  },
  {
    question: "How does Stellar Health Aid fight fraud?",
    answer:
      "We integrate KYC, linking one identity to one wallet. This prevents duplicate accounts or unfair distribution of subsidies.",
  },
  {
    question: "Can NGOs or companies use Stellar Health Aid?",
    answer:
      "Yes. NGOs can securely airdrop subsidies, and private companies can offer it as part of employee health benefits, with full transparency.",
  },
  {
    question: "Is my money safe?",
    answer:
      "Yes. Funds are self-custodial (you own them), swapped into stable USDC, and secured by the Stellar blockchain.",
  },
];

export default function Faq() {
  return (
    <section className="w-full px-4 py-10 flex flex-col items-center">
      <h2 className="text-base md:text-lg font-semibold text-gray-500 text-center mb-6 tracking-wide">
        FREQUENTLY ASKED QUESTIONS
      </h2>
      <Accordion type="single" collapsible className="w-full rounded-xl border border-gray-200 bg-white gap-4">
        {faqs.map((faq) => (
          <AccordionItem key={faq.question} value={faq.question} className="border-b last:border-b-0">
            <AccordionTrigger className="font-semibold text-gray-900 text-base px-4">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-gray-600 px-4">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
