"use client";

import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { CalendarDays, Clock, University } from "lucide-react";
import { CardContent } from "../ui/card";
import { fetchSeminars } from "../../api/apiClient";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";

// Interfaces
interface Advisor {
  lecturer: {
    name: string;
    nip: string;
    profilePicture?: string;
  };
}

interface Assessor {
  lecturer: {
    name: string;
    nip: string;
    profilePicture?: string;
  };
}

interface Student {
  name: string;
  nim: string;
  profilePicture?: string;
}

interface Seminar {
  id: number;
  type: "PROPOSAL" | "HASIL";
  title: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  studentNIM: string;
  student: Student;
  folderId: string;
  time: string | null;
  room: string | null;
  advisors: Advisor[];
  assessors: Assessor[];
}

// Helper functions
const formatDate = (dateString: string | number | Date | null) => {
  if (!dateString) return "TBD";
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (dateString: string | number | Date | null) => {
  if (!dateString) return "TBD";
  const date = new Date(dateString);
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function SeminarScrollerGrid() {
  const [activeTab, setActiveTab] = useState("proposal");
  const [seminars, setSeminars] = useState<Seminar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeminar, setSelectedSeminar] = useState<Seminar | null>(null);

  useEffect(() => {
    const getSeminars = async () => {
      try {
        setLoading(true);
        const seminarData = await fetchSeminars();
        const scheduledSeminars = seminarData.filter(
          (seminar: { status: string }) => seminar.status === "SCHEDULED"
        );
        setSeminars(scheduledSeminars);
      } catch (err) {
        setError("Error fetching seminars");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getSeminars();
  }, []);

  const proposalSeminars = seminars.filter((s) => s.type === "PROPOSAL");
  const hasilSeminars = seminars.filter((s) => s.type === "HASIL");

  const handleTabChange = (value: string) => setActiveTab(value);
  const handleOpenModal = (seminar: Seminar) => setSelectedSeminar(seminar);
  const handleCloseModal = () => setSelectedSeminar(null);

  if (loading)
    return <div className="w-full text-center py-12">Loading seminars...</div>;
  if (error)
    return <div className="w-full text-center py-12 text-red-500">{error}</div>;

  return (
    <>
      <Tabs
        defaultValue="proposal"
        className="w-full"
        onValueChange={handleTabChange}
      >
        <TabsList className="grid grid-cols-2 mb-6 bg-primary">
          <TabsTrigger
            value="proposal"
            className={`text-primary-foreground ${
              activeTab === "proposal" ? "text-primary-800" : ""
            }`}
          >
            Proposal
          </TabsTrigger>
          <TabsTrigger
            value="hasil"
            className={`text-primary-foreground ${
              activeTab === "hasil" ? "text-primary-800" : ""
            }`}
          >
            Hasil
          </TabsTrigger>
        </TabsList>

        <TabsContent value="proposal">
          <div className="h-[600px] w-full lg:w-[1300px] mx-auto px-4">
            <ScrollingColumn
              items={proposalSeminars}
              onClickDetail={handleOpenModal}
            />
          </div>
        </TabsContent>

        <TabsContent value="hasil">
          <div className="h-[600px] w-full lg:w-[1300px] mx-auto px-4">
            <ScrollingColumn
              items={hasilSeminars}
              onClickDetail={handleOpenModal}
            />
          </div>
        </TabsContent>
      </Tabs>

      <Dialog
        open={!!selectedSeminar}
        onOpenChange={(open) => !open && handleCloseModal()}
      >
        {selectedSeminar && (
          <DialogContent className="sm:max-w-lg">
            <DialogHeader className="bg-gradient-to-r from-primary-500 to-primary-700 p-4 -m-4 mb-4 rounded-t-lg text-white">
              <DialogTitle className="text-base sm:text-xl md:text-2xl font-bold break-words text-center">
                {selectedSeminar.title.split(" ").slice(0, 10).join(" ") +
                  (selectedSeminar.title.split(" ").length > 10 ? "..." : "")}
              </DialogTitle>

              <DialogDescription className="text-gray-100 mt-2 flex items-center gap-2">
                <img
                  src={
                    selectedSeminar.student.profilePicture
                      ? selectedSeminar.student.profilePicture
                      : "https://robohash.org/mail@ashallendesign.co.uk"
                  }
                  alt="student-image"
                  className="w-12 h-12 border rounded-full bg-white"
                />
                <span className="break-words">
                  {selectedSeminar.student.name} ({selectedSeminar.studentNIM})
                </span>
              </DialogDescription>
            </DialogHeader>

            <ScrollArea className="max-h-[60vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-3 bg-muted p-3 rounded-lg">
                  <CalendarDays className="h-5 w-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Tanggal</p>
                    <p className="font-medium">
                      {formatDate(selectedSeminar.time)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 bg-muted p-3 rounded-lg">
                  <Clock className="h-5 w-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Waktu</p>
                    <p className="font-medium">
                      {formatTime(selectedSeminar.time)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 bg-muted p-3 rounded-lg">
                  <University className="h-5 w-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Ruangan</p>
                    <p className="font-medium">
                      {selectedSeminar.room || "TBD"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Badge
                      variant="outline"
                      className="mr-2 bg-primary-100 text-primary-700 border-primary-200"
                    >
                      Pembimbing
                    </Badge>
                  </h3>
                  <ul className="space-y-3">
                    {selectedSeminar.advisors.map((advisor, idx) => (
                      <li
                        key={idx}
                        className="pl-4 border-l-2 border-primary-200 dark:border-primary-800"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              advisor.lecturer.profilePicture
                                ? advisor.lecturer.profilePicture
                                : `https://robohash.org/${advisor.lecturer.name}`
                            }
                            alt="advisor-image"
                            className="w-12 h-12 border rounded-full bg-white"
                          />
                          <div>
                            <p className="font-medium break-words">
                              {advisor.lecturer.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {advisor.lecturer.nip}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Badge
                      variant="outline"
                      className="mr-2 bg-primary-100 text-primary-700 border-primary-200"
                    >
                      Penguji
                    </Badge>
                  </h3>
                  <ul className="space-y-3">
                    {selectedSeminar.assessors.map((assessor, idx) => (
                      <li
                        key={idx}
                        className="pl-4 border-l-2 border-primary-200 dark:border-primary-800"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              assessor.lecturer.profilePicture
                                ? assessor.lecturer.profilePicture
                                : `https://robohash.org/${assessor.lecturer.name}`
                            }
                            alt="advisor-image"
                            className="w-12 h-12 border rounded-full bg-white"
                          />
                          <div>
                            <p className="font-medium break-words">
                              {assessor.lecturer.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {assessor.lecturer.nip}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </ScrollArea>

            <DialogFooter className="border-t border-border pt-4 mt-4">
              <Button onClick={handleCloseModal}>Tutup</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}

// ScrollingColumn
function ScrollingColumn({
  items,
  onClickDetail,
}: {
  items: Seminar[];
  onClickDetail: (seminar: Seminar) => void;
}) {
  const controls = useAnimation();
  const [paused, setPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const shouldScroll =
    (isMobile && items.length > 1) || (!isMobile && items.length >= 5);

  useEffect(() => {
    if (paused || !shouldScroll || items.length === 0) {
      controls.stop();
    } else {
      controls.start({
        y: ["0%", "-50%"],
        transition: {
          repeat: Number.POSITIVE_INFINITY,
          duration: 20,
          ease: "linear",
        },
      });
    }
  }, [paused, controls, shouldScroll, items.length]);

  if (items.length === 0) {
    return <div className="text-center py-12">Tidak ada seminar saat ini</div>;
  }

  return (
    <div
      className="overflow-hidden h-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <motion.div
        animate={shouldScroll ? controls : { y: 0 }}
        className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      >
        {(shouldScroll ? [...items, ...items] : items).map((seminar, index) => (
          <SeminarCard
            key={`${seminar.id}-${index}`}
            seminar={seminar}
            onClickDetail={onClickDetail}
          />
        ))}
      </motion.div>
    </div>
  );
}

// SeminarCard
function SeminarCard({
  seminar,
  onClickDetail,
}: {
  seminar: Seminar;
  onClickDetail: (seminar: Seminar) => void;
}) {
  return (
<CardContent className="group overflow-hidden relative border-0 shadow-xl rounded-lg h-96">
  <div className="absolute inset-[1px] bg-primary-50 dark:bg-gray-800 rounded-lg z-0"></div>
  <div className="relative z-10 p-6 h-full flex flex-col">
    <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 text-center group-hover:text-emerald-600 dark:group-hover:text-primary-600 transition-colors">
      {seminar.title.split(" ").slice(0, 10).join(" ") +
        (seminar.title.split(" ").length > 10 ? "..." : "")}
    </h3>

    <div className="flex items-center gap-2 mb-4">
      <img
        src={
          seminar.student.profilePicture
            ? seminar.student.profilePicture
            : "https://robohash.org/mail@ashallendesign.co.uk"
        }
        alt="student-image"
        className="w-8 h-8 border rounded-full bg-white"
      />
      <p className="text-gray-600 dark:text-gray-300">
        {seminar.student.name} ({seminar.studentNIM})
      </p>
    </div>

    <div className="space-y-2 mb-6">
      <div className="flex items-center text-sm">
        <CalendarDays className="h-4 w-4 mr-2 text-emerald-600 dark:text-emerald-400" />
        <span>{formatDate(seminar.time)}</span>
      </div>
      <div className="flex items-center text-sm">
        <Clock className="h-4 w-4 mr-2 text-emerald-600 dark:text-emerald-400" />
        <span>{formatTime(seminar.time)}</span>
      </div>
      <div className="flex items-center text-sm">
        <University className="h-4 w-4 mr-2 text-emerald-600 dark:text-emerald-400" />
        <span>{seminar.room || "TBD"}</span>
      </div>
    </div>
    <button
      onClick={() => onClickDetail(seminar)}
      className="w-full py-2 px-4 rounded-md bg-gradient-to-r from-primary-300 to-primary-600 hover:from-primary-700 hover:to-primary-400 text-white font-medium transition-colors mt-auto"
    >
      Detail
    </button>
  </div>
</CardContent>
  );
}
