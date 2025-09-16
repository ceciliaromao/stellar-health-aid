import React from "react";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { DotButton, useDotButton } from "./dot-button";
import styles from "./styles.module.css";
import { StepDef } from "../steps";
import Image from "next/image";
import { CardDescription, CardTitle } from "@/components/ui/card";

type PropType = {
  slides: StepDef[];
  options?: EmblaOptionsType;
};

const OPTIONS: EmblaOptionsType = { 
  loop: true,
  align: 'center'
};

export const Carousel: React.FC<PropType> = (props) => {
  const { slides, options } = props;
  
  // Configurar autoplay
  const autoplayOptions = {
    delay: 4000, // 4 segundos
    resetOnInteraction: true, // Reinicia autoplay após interação
    playOnInit: true // Inicia automaticamente
  };

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { ...OPTIONS, ...options },
    [Autoplay(autoplayOptions)]
  );

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  return (
    <section className={`embla ${styles.embla}`}>
      <div className={`embla__viewport ${styles.embla__viewport}`} ref={emblaRef}>
        <div className={`embla__container ${styles.embla__container}`}>
          {slides.map((slide, index) => (
            <div className={`embla__slide ${styles.embla__slide}`} key={index}>
              <div className={`embla__slide__number ${styles.embla__slide__number}`}>
                {/* Imagem no topo, ocupando o espaço disponível */}
                <div className={`embla__media ${styles.embla__media}`}>
                  <Image
                    src={slide.img}
                    alt={slide.title}
                    width={800}
                    height={800}
                    className={`embla__slide__image ${styles.embla__slide__image}`}
                    priority={index === 0} // Prioridade para primeira imagem
                  />
                </div>
                {/* Texto abaixo da imagem */}
                <div className={`embla__slide__content ${styles.embla__slide__content}`}>
                  <CardTitle className="text-lg text-black sm:text-xl">{slide.title}</CardTitle>
                  <CardDescription className="text-black/80 text-sm sm:text-base">{slide.subtitle}</CardDescription>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`embla__controls ${styles.embla__controls}`}>
        <div className={`embla__dots ${styles.embla__dots}`}>
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={`embla__dot ${styles.embla__dot}`.concat(
                index === selectedIndex
                  ? ` embla__dot--selected ${styles["embla__dot--selected"]}`
                  : ""
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
