import { useState, useEffect } from "react";
import Header from "../../components/landing/Header";
import Stack from "../../components/landing/Stack";
import Carousel from "../../components/landing/Carousel";
import Footer from "../../components/landing/Footer";

const Galeri: React.FC = () => {
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Initial check
    handleResize();

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Responsive dimensions based on screen size
  const getCardDimensions = () => {
    if (windowWidth < 640) {
      // sm
      return { width: 250, height: 250 };
    } else if (windowWidth < 768) {
      // md
      return { width: 220, height: 220 };
    } else if (windowWidth < 1024) {
      // lg
      return { width: 300, height: 300 };
    } else {
      return { width: 300, height: 300 };
    }
  };

  // Responsive carousel size based on screen size
  const getCarouselWidth = () => {
    if (windowWidth < 640) {
      // sm
      return 320;
    } else if (windowWidth < 768) {
      // md
      return 320;
    } else if (windowWidth < 1024) {
      // lg
      return 400;
    } else {
      return 500;
    }
  };

  const images = [
    {
      id: 1,
      img: "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=500&auto=format",
    },
    {
      id: 2,
      img: "https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=500&auto=format",
    },
    {
      id: 3,
      img: "https://images.unsplash.com/photo-1452626212852-811d58933cae?q=80&w=500&auto=format",
    },
    {
      id: 4,
      img: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=500&auto=format",
    },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen w-full px-2 sm:px-4 md:px-6 py-6 md:py-10 pt-30 sm:pt-46 md:pt-46">
        {/* Mobile and Tablet Layout (Carousel -> Stack) for small and medium screens */}
        <div className="lg:hidden container mx-auto flex flex-col items-center gap-6 sm:gap-8">
          {/* Carousel on top */}
          <div className="w-full flex justify-center">
            <div className="relative h-auto flex items-center justify-center">
              <Carousel
                baseWidth={getCarouselWidth()}
                autoplay={true}
                autoplayDelay={3000}
                pauseOnHover={true}
                loop={true}
                round={false}
              />
            </div>
          </div>

          {/* Stacks below with justify-between for sm and md screens */}
          <div className="w-full flex flex-col sm:flex-row justify-center mt-4 sm:mt-8 md:gap-20">
            {/* Left Stack (sm/md) */}
            <div className="w-full sm:w-auto mb-6 sm:mb-0 flex justify-center md:justify-start md:ml-10">
              <Stack
                randomRotation={true}
                sensitivity={150}
                sendToBackOnClick={true}
                cardDimensions={getCardDimensions()}
                cardsData={images}
              />
            </div>

            {/* Right Stack (sm/md) */}
            <div className="w-full sm:w-auto mt-2 sm:mt-0 flex justify-center md:justify-end md:mr-10">
              <Stack
                randomRotation={true}
                sensitivity={150}
                sendToBackOnClick={true}
                cardDimensions={getCardDimensions()}
                cardsData={images}
              />
            </div>
          </div>
        </div>

        {/* Desktop Layout (Side by Side) */}
        <div className="hidden lg:flex container mx-auto px-4 flex-row items-center justify-between gap-6 xl:gap-10">
          {/* Left Stack */}
          <div className="w-full md:w-1/3 lg:w-1/4 flex justify-center">
            <Stack
              randomRotation={true}
              sensitivity={180}
              sendToBackOnClick={false}
              cardDimensions={getCardDimensions()}
              cardsData={images}
            />
          </div>

          {/* Center Carousel */}
          <div className="w-full md:w-1/3 lg:w-2/4 flex justify-center my-6 md:my-0">
            <div className="relative h-auto flex items-center justify-center">
              <Carousel
                baseWidth={getCarouselWidth()}
                autoplay={true}
                autoplayDelay={3000}
                pauseOnHover={true}
                loop={true}
                round={false}
              />
            </div>
          </div>

          {/* Right Stack */}
          <div className="w-full md:w-1/3 lg:w-1/4 flex justify-center">
            <Stack
              randomRotation={true}
              sensitivity={180}
              sendToBackOnClick={false}
              cardDimensions={getCardDimensions()}
              cardsData={images}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Galeri;
