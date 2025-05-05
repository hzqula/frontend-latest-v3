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
import { Badge } from "../../components/ui/badge";
import {
  Calendar,
  CheckCircle,
  FileCheck,
  GraduationCap,
  LayoutDashboard,
  Users,
} from "lucide-react";

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
          className="font-bold font-display text-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-3 mt-10"
        >
          Jadwal Seminar
        </motion.h1>
        <motion.div
          variants={fadeInUp}
          className="w-24 h-1 bg-primary mb-10"
        ></motion.div>
        <motion.div variants={cardVariants} className="container mx-auto">
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
          className="font-bold font-display text-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-3 mt-10"
        >
          Fitur Sistem
        </motion.h1>
        <motion.div
          variants={fadeInUp}
          className="w-24 h-1 bg-primary mb-10"
        ></motion.div>

        <div className="container px-4 md:px-6 mb-10">
          <div className="grid md:grid-cols-3 gap-8">
            {/* MAHASISWA */}
            <motion.div
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50 h-full">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-t-3xl"></div>
                <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 p-3 rounded-2xl w-fit mb-6">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Untuk Mahasiswa</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Kemudahan dalam pendaftaran seminar, pelacakan progres, dan
                  mendapatkan umpan balik dari dosen.
                </p>
                <ul className="space-y-3">
                  {[
                    "Proses pendaftaran seminar yang mudah dan cepat",
                    "Portal unggah dokumen seminar dan revisi",
                    "Pelacakan umpan balik dan penilaian dari dosen",
                  ].map((item) => (
                    <li className="flex items-start" key={item}>
                      <CheckCircle className="h-5 w-5 text-emerald-500 mr-2 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* KOORDINATOR */}
            <motion.div
              className="group relative mt-10 md:mt-0"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50 h-full">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-t-3xl"></div>
                <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 p-3 rounded-2xl w-fit mb-6">
                  <LayoutDashboard className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Untuk Koordinator</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Mengelola seluruh rangkaian seminar secara efisien dan
                  terpusat.
                </p>
                <br />
                <ul className="space-y-3">
                  {[
                    "Dashboard ringkas dan menyeluruh",
                    "Penjadwalan seminar & alokasi ruangan",
                    "Penugasan dosen pembimbing & penguji",
                    "Fitur riwayat seminar",
                  ].map((item) => (
                    <li className="flex items-start" key={item}>
                      <CheckCircle className="h-5 w-5 text-emerald-500 mr-2 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* DOSEN */}
            <motion.div
              className="group relative mt-10 md:mt-0"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50 h-full">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-t-3xl"></div>
                <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 p-3 rounded-2xl w-fit mb-6">
                  <FileCheck className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Untuk Dosen</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Menilai seminar, memberikan masukan, dan memantau progres
                  mahasiswa secara mudah.
                </p>
                <ul className="space-y-3">
                  {[
                    "Antarmuka penilaian yang praktis",
                    "Penilaian dan umpan balik digital",
                    "Riwayat penilaian terdokumentasi",
                  ].map((item) => (
                    <li className="flex items-start" key={item}>
                      <CheckCircle className="h-5 w-5 text-emerald-500 mr-2 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>

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
          className="font-bold font-display text-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-3 mt-10"
        >
          Alur Kerja Sistem
        </motion.h1>
        <motion.div
          variants={fadeInUp}
          className="w-24 h-1 bg-primary mb-10"
        ></motion.div>

        <div className="container mx-auto px-4">
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true }}
          >
            {/* Garis penghubung */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 transform -translate-y-1/2 hidden md:block"></div>

            <div className="grid md:grid-cols-4 gap-8 relative">
              {[
                {
                  step: 1,
                  user: "Mahasiswa",
                  title: "Pendaftaran",
                  description:
                    "Mahasiswa mendaftar seminar tugas akhir dan mengunggah dokumen yang diperlukan melalui sistem.",
                  icon: GraduationCap,
                },
                {
                  step: 2,
                  user: "Koordinator",
                  title: "Penjadwalan",
                  description:
                    "Koordinator mengatur jadwal seminar dan menetapkan dosen penguji berdasarkan ketersediaan.",
                  icon: Calendar,
                },
                {
                  step: 3,
                  user: "Mahasiswa",
                  title: "Presentasi",
                  description:
                    "Mahasiswa mempresentasikan tugas akhir sesuai jadwal yang telah ditentukan.",
                  icon: Users,
                },
                {
                  step: 4,
                  user: "Dosen",
                  title: "Penilaian",
                  description:
                    "Dosen penguji memberikan penilaian dan umpan balik melalui sistem secara transparan.",
                  icon: FileCheck,
                },
              ].map((item, index) => (
                <div key={index} className="relative z-10">
                  <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50 h-full relative">
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-cyan-500 h-12 w-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {item.step}
                    </div>

                    <div className="pt-6 text-center">
                      <Badge className="mb-4 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400">
                        {item.user}
                      </Badge>
                      <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 p-4 rounded-2xl w-fit mx-auto mb-4">
                        <item.icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
      <Footer />
    </div>
  );
};

export default LandingPage;
