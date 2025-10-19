import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import heroImage1 from "@/assets/IMG-20251016-WA0015.jpg";
import heroImage2 from "@/assets/IMG-20251016-WA0022.jpg";
import heroImage3 from "@/assets/IMG-20251016-WA0008.jpg";
import logo from "@/assets/salem-logo-new.jpg";

const slides = [
  {
    image: heroImage1,
    title: "Excellence in Education",
    subtitle: "Nurturing Future Leaders with Christian Values",
  },
  {
    image: heroImage2,
    title: "Character Development",
    subtitle: "Building Strong Foundations for Tomorrow",
  },
  {
    image: heroImage3,
    title: "Embracing Cultural Heritage",
    subtitle: "State-of-the-Art Facilities for Quality Education",
  },
];

const Hero = () => {
  const [emblaRef] = useEmblaCarousel(
    { loop: true },
    [Autoplay({ delay: 3800, stopOnInteraction: false })]
  );

  return (
    <section
      ref={emblaRef}
      className="relative h-[55vh] md:h-[60vh] overflow-hidden w-full"
    >
      <div className="flex h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className="relative flex-[0_0_100%] h-full flex justify-center items-center"
          >
            {/* Background image with contained fit */}
            <div
              className="absolute inset-0 bg-no-repeat bg-center bg-contain md:bg-cover transition-all duration-700"
              style={{ backgroundImage: `url(${slide.image})` }}
            />

            {/* Soft overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40" />

            {/* Content */}
            <div className="relative z-10 text-white text-center px-6 md:px-10">
              <div className="mb-4 md:mb-6">
                <img
                  src={logo}
                  alt="Salem Group of Schools"
                  className="h-16 md:h-20 w-auto mx-auto drop-shadow-2xl"
                />
              </div>

              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 drop-shadow-md">
                {slide.title}
              </h1>

              <p className="text-sm md:text-lg lg:text-xl mb-6 md:mb-8 max-w-2xl mx-auto drop-shadow-sm">
                {slide.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button size="lg" variant="secondary" className="text-base" asChild>
                  <Link to="/contact">Apply Now</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/90 text-primary hover:bg-white border-white text-base"
                  asChild
                >
                  <Link to="/vision-mission">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Hero;
