import React from "react";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { DotButton, useDotButton } from "./dot-button";
import styles from "./styles.module.css";
import { StepDef } from "../steps";
import Image from "next/image";
import { CardDescription, CardTitle } from "@/components/ui/card";

type PropType = {
  slides: StepDef[];
  options?: EmblaOptionsType;
};

const OPTIONS: EmblaOptionsType = {};

export const Carousel: React.FC<PropType> = (props) => {
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  return (
    <section className={`${styles.embla}`}>
      <div className={`${styles.embla__viewport}`} ref={emblaRef}>
        <div className={`${styles.embla__container}`}>
          {slides.map((slide, index) => (
            <div className={`${styles.embla__slide}`} key={index}>
              <div className={`${styles.embla__slide__number}`}>
                <div className="w-full">
                  <Image
                    src={slide.img}
                    alt={slide.title}
                    width={400}
                    height={400}
                    className="w-auto h-full"
                  />
                </div>
                <CardTitle>{slide.title}</CardTitle>
                <CardDescription>{slide.subtitle}</CardDescription>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`${styles.embla__controls}`}>
        <div className={`${styles.embla__dots}`}>
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={`${styles.embla__dot}`.concat(
                index === selectedIndex
                  ? ` ${styles["embla__dot--selected"]}`
                  : ""
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
