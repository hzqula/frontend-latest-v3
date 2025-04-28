import Header from "../../components/landing/Header";
import Stack from "../../components/landing/Stack";
import Carousel from "../../components/landing/Carousel";
import Footer from "../../components/landing/Footer";

const Galeri: React.FC = () => {
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
      <div className="min-h-screen flex flex-col justify-center items-center py-10">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center justify-center gap-10 text-center">
          {/* Left Stack */}
          <div className="w-full lg:w-1/4 flex justify-center">
            <Stack
              randomRotation={true}
              sensitivity={180}
              sendToBackOnClick={false}
              cardDimensions={{ width: 300, height: 300 }}
              cardsData={images}
            />
          </div>
          {/* Center Carousel */}
          <div className="w-full lg:w-2/4 flex justify-center">
            <div className="relative h-[300px] flex items-center justify-center">
              <Carousel
                baseWidth={500}
                autoplay={true}
                autoplayDelay={3000}
                pauseOnHover={true}
                loop={true}
                round={false}
              />
            </div>
          </div>
          {/* Right Stack */}
          <div className="w-full lg:w-1/4 flex justify-center">
            <Stack
              randomRotation={true}
              sensitivity={180}
              sendToBackOnClick={false}
              cardDimensions={{ width: 300, height: 300 }}
              cardsData={images}
            />
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Galeri;
