import Header from "../../components/landing/Header";
import BackgroundHeader from "../../assets/img/bg-ft.png";
import BackgroundPage from "../../assets/img/bg-page.png";
import Footer from "../../components/landing/Footer";

export default function FormatPenulisanTa() {

  return (
    <>
      <Header />
      <div className="relative h-[400px]">
        <div
          className="absolute inset-0 bg-cover bg-center brightness-50"
          style={{ backgroundImage: `url(${BackgroundHeader})` }}
        ></div>
        <div className="relative flex items-center justify-center h-full">
          <h1 className="text-white text-7xl font-light">FormatPenulisanTa</h1>
        </div>
      </div>

      <div
        className="flex-grow py-12"
        style={{ backgroundImage: `url(${BackgroundPage})` }}
      >
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="pdf-container w-full flex flex-col items-center">
                <iframe
                  src="https://drive.google.com/file/d/1cccAVXFQYDYgAJA5fMKVDRaWFoAqfEMo/preview"
                  className="w-full"
                  style={{
                    width: "748px",
                    height: "968px",
                    maxWidth: "100%",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
