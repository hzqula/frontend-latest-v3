import { motion } from "framer-motion";
import Header from "../../components/landing/Header";
import Logo from "../../assets/img/logo-white.png";
import LogoUniv from "../../assets/img/logo.png";
import LogoFakultas from "../../assets/img/logo-ft.png";
import LogoProdi from "../../assets/img/logo-tl.png";
import Video from "../../assets/video/profile.mp4";
import { ScrollLogoBar } from "../../components/landing/Scrolllogo";
import SeminarScroller from "../../components/landing/ScrollJadwal";
import Footer from "../../components/landing/Footer";
import { useEffect } from "react";

const LandingPage = () => {
  // Menambahkan efek untuk mencegah scrolling horizontal
  useEffect(() => {
    // Tambahkan style ke body untuk mencegah scrolling horizontal
    document.body.style.overflowX = "hidden";
    document.documentElement.style.overflowX = "hidden";

    // Cleanup saat komponen unmount
    return () => {
      document.body.style.overflowX = "";
      document.documentElement.style.overflowX = "";
    };
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    initial: { opacity: 0, y: 30 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="overflow-x-hidden w-full">
      <Header />
      <motion.div
        className="relative flex items-center justify-center pt-24 h-screen w-full px-4 sm:px-6 lg:px-8"
        initial="initial"
        animate="animate"
        variants={staggerChildren}
      >
        <div className="flex z-20 flex-col items-center justify-center text-center px-4">
          <motion.div variants={fadeInUp}>
            <img
              src={Logo}
              alt="logo-unri"
              className="w-32 h-32 sm:w-44 sm:h-44 mb-4"
            />
          </motion.div>
          <motion.h1
            variants={fadeInUp}
            className="font-display text-white font-black text-3xl sm:text-5xl"
          >
            LATEST
          </motion.h1>
          <motion.h2
            variants={fadeInUp}
            className="font-display text-white font-black italic text-lg sm:text-xl mb-4"
          >
            Linear Administration of Thesis
            <span className="text-primary-600">Enviromental</span> System
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="font-body text-white text-sm sm:text-base w-full max-w-xl"
          >
            Memudahkan Koordinator Tugas Akhir, Dosen, dan Mahasiswa dalam
            menyelesaikan proses administrasi Tugas Akhir di Program Studi S1
            Teknik Lingkungan Universitas Riau.
          </motion.p>
        </div>
        <video
          className="absolute top-24 brightness-50 w-full h-full object-cover"
          src={Video}
          loop
          autoPlay
          muted
        />
      </motion.div>

      <motion.div
        id="features"
        className="flex flex-col items-center justify-center py-24 bg-slate-50 w-full"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerChildren}
      >
        <div className="w-full overflow-hidden">
          <ScrollLogoBar
            className="py-6 bg-primary-600 text-white"
            itemClassName="text-xl font-medium"
            items={[
              { type: "logo", content: "UNRI", logo: LogoUniv },
              { type: "text", content: "UNIVERSITAS RIAU" },
              { type: "logo", content: "UNRI", logo: LogoUniv },
              { type: "logo", content: "LATEST", logo: LogoFakultas },
              { type: "text", content: "FAKULTAS TEKNIK" },
              { type: "logo", content: "LATEST", logo: LogoFakultas },
              { type: "logo", content: "LATEST", logo: LogoProdi },
              { type: "text", content: "PROGRAM STUDI TEKNIK LINGKUNGAN" },
              { type: "logo", content: "LATEST", logo: LogoProdi },
            ]}
            velocity={50}
            numCopies={4}
          />
        </div>
        <motion.h1
          variants={fadeInUp}
          className="font-bold font-display text-black text-5xl mb-3 mt-10"
        >
          Jadwal Seminar
        </motion.h1>
        <motion.div
          variants={fadeInUp}
          className="w-24 h-1 bg-primary mb-10"
        ></motion.div>
        <motion.div variants={cardVariants}>
          <SeminarScroller />
        </motion.div>

        <div className="w-full overflow-hidden mt-4">
          <ScrollLogoBar
            className="py-6 bg-primary text-white"
            itemClassName="text-xl font-medium"
            items={[
              { type: "logo", content: "UNRI", logo: LogoUniv },
              { type: "text", content: "UNIVERSITAS RIAU" },
              { type: "logo", content: "UNRI", logo: LogoUniv },
              { type: "logo", content: "LATEST", logo: LogoFakultas },
              { type: "text", content: "FAKULTAS TEKNIK" },
              { type: "logo", content: "LATEST", logo: LogoFakultas },
              { type: "logo", content: "LATEST", logo: LogoProdi },
              { type: "text", content: "PROGRAM STUDI TEKNIK LINGKUNGAN" },
              { type: "logo", content: "LATEST", logo: LogoProdi },
            ]}
            velocity={50}
            numCopies={4}
          />
        </div>

        <motion.h1
          variants={fadeInUp}
          className="font-bold font-display text-black text-6xl mb-3 mt-10"
        >
          Fitur Sistem
        </motion.h1>
        <motion.div
          variants={fadeInUp}
          className="w-24 h-1 bg-primary mb-10"
        ></motion.div>

        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              variants={cardVariants}
              className="bg-primary-50 rounded-lg shadow-lg p-8 text-center hover:transform hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="text-5xl mb-6">📝</div>
              <h3 className="text-xl font-bold mb-4">Pendaftaran TA</h3>
              <p className="text-gray-600">
                Proses pendaftaran tugas akhir yang mudah dan terstruktur.
                Mahasiswa dapat mengajukan judul dan dosen pembimbing secara
                online melalui sistem yang terintegrasi.
              </p>
            </motion.div>

            <motion.div
              variants={cardVariants}
              className="bg-primary-50 rounded-lg shadow-lg p-8 text-center hover:transform hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="text-5xl mb-6">🗓️</div>
              <h3 className="text-xl font-bold mb-4">Penjadwalan</h3>
              <p className="text-gray-600">
                Pengaturan jadwal seminar dan sidang yang efisien. Sistem akan
                mengkoordinasikan ketersediaan dosen penguji dan ruangan untuk
                menghindari konflik jadwal.
              </p>
            </motion.div>

            <motion.div
              variants={cardVariants}
              className="bg-primary-50 rounded-lg shadow-lg p-8 text-center hover:transform hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="text-5xl mb-6">📋</div>
              <h3 className="text-xl font-bold mb-4">Penilaian</h3>
              <p className="text-gray-600">
                Sistem penilaian yang transparan dan terstruktur. Dosen dapat
                memberikan nilai sesuai dengan ketentuan yang berlaku.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
      <Footer />
    </div>
  );
};

export default LandingPage;
