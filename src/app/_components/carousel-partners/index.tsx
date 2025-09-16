
import Image from "next/image";
import { EmblaCarousel } from "./carousel";

const partners = [
  { src: "/images/partners/defindex.png", alt: "Defindex" },
  { src: "/images/partners/stellar.png", alt: "Stellar" },
  { src: "/images/partners/reflector.png", alt: "Reflector" },
  { src: "/images/partners/crossmint.png", alt: "Crossmint" },
  { src: "/images/partners/soro-swap.png", alt: "Soro Swap" },
  { src: "/images/partners/trustless-work.png", alt: "Trustless Work" },
];

export default function CarouselPartners() {
  return (
    <section className="w-full bg-black flex flex-col items-center justify-center py-8 px-2">
      <span className="text-sm text-gray-300 mb-4 tracking-wide text-center">powered by</span>
      <div className="w-full max-w-5xl mx-auto flex items-center justify-center">
        <EmblaCarousel
          slides={partners.map((partner) => (
            <div
              key={partner.alt}
              className="flex items-center justify-center h-32 sm:h-28 md:h-36 px-4 md:px-8"
            >
              <Image
                src={partner.src}
                alt={partner.alt}
                width={220}
                height={80}
                className="object-contain drop-shadow-none"
                style={{ maxWidth: '180px', width: '100%', height: 'auto' }}
              />
            </div>
          ))}
        />
      </div>
    </section>
  );
}
