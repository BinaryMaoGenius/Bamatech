import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

const AUTOPLAY_INTERVAL = 7000;

export default function Carousel({ items = [] }) {
  const slides = useMemo(() => items ?? [], [items]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!slides.length) {
      return undefined;
    }

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, AUTOPLAY_INTERVAL);

    return () => clearInterval(timer);
  }, [slides]);

  useEffect(() => {
    if (activeIndex >= slides.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, slides.length]);

  if (!slides.length) {
    return null;
  }

  return (
    <div className="carousel">
      <div
        className="carousel-inner"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div className="carousel-item" key={slide.id ?? index}>
            <Image
              src={slide.image}
              alt={slide.title}
              width={1100}
              height={350}
              priority={index === 0}
            />
            <div className="carousel-caption">
              <h4>{slide.title}</h4>
              <p>
                {slide.date && new Date(slide.date).toLocaleDateString("fr-FR")}
                {slide.location ? ` - ${slide.location}` : null}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button
        className="carousel-nav carousel-prev"
        aria-label="Précédent"
        onClick={() =>
          setActiveIndex(
            (prevIndex) => (prevIndex - 1 + slides.length) % slides.length
          )
        }
      >
        <i className="fas fa-chevron-left" />
      </button>

      <button
        className="carousel-nav carousel-next"
        aria-label="Suivant"
        onClick={() =>
          setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length)
        }
      >
        <i className="fas fa-chevron-right" />
      </button>

      <div className="carousel-indicators">
        {slides.map((slide, index) => (
          <button
            key={slide.id ?? index}
            aria-label={`Aller à la diapositive ${index + 1}`}
            onClick={() => setActiveIndex(index)}
            className={index === activeIndex ? "active" : ""}
          />
        ))}
      </div>
    </div>
  );
}
