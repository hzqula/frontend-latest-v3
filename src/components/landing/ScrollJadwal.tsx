import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { User, CalendarDays, Clock, University } from "lucide-react";
import { CardContent } from "../ui/card";
import { fetchSeminars } from "../../api/apiClient"; 

// Define the interface for the API response
interface Advisor {
  lecturer: {
    name: string;
    nip: string;
  };
}

interface Assessor {
  lecturer: {
    name: string;
    nip: string;
  };
}

interface Student {
  name: string;
  nim: string;
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

// Helper function to format date
const formatDate = (dateString: string | number | Date | null) => {
  if (!dateString) return "TBD";
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// Helper function to format time
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

  useEffect(() => {
    const getSeminars = async () => {
      try {
        setLoading(true);
        const seminarData = await fetchSeminars();
        
        // Filter to only include SCHEDULED seminars
        const scheduledSeminars = seminarData.filter((seminar: { status: string; }) => seminar.status === "SCHEDULED");
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

  // Filter seminars by type
  const proposalSeminars = seminars.filter(seminar => seminar.type === "PROPOSAL");
  const hasilSeminars = seminars.filter(seminar => seminar.type === "HASIL");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  if (loading) {
    return <div className="w-full text-center py-12">Loading seminars...</div>;
  }

  if (error) {
    return <div className="w-full text-center py-12 text-red-500">{error}</div>;
  }

  return (
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
          <ScrollingColumn items={proposalSeminars} />
        </div>
      </TabsContent>

      <TabsContent value="hasil">
        <div className="h-[600px] w-full lg:w-[1300px] mx-auto px-4">
          <ScrollingColumn items={hasilSeminars} />
        </div>
      </TabsContent>
    </Tabs>
  );
}

function ScrollingColumn({ items }: { items: Seminar[] }) {
  const controls = useAnimation();
  const [paused, setPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const shouldScroll = (isMobile && items.length > 1) || (!isMobile && items.length >= 5);

  useEffect(() => {
    if (paused || !shouldScroll || items.length === 0) {
      controls.stop();
    } else {
      controls.start({
        y: ["0%", "-50%"],
        transition: {
          repeat: Infinity,
          duration: 20,
          ease: "linear",
        },
      });
    }
  }, [paused, controls, shouldScroll, items.length]);

  if (items.length === 0) {
    return <div className="text-center py-12">No scheduled seminars available</div>;
  }

  return (
    <div
      className="overflow-hidden h-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <motion.div
        animate={shouldScroll ? controls : { y: 0 }}
        className="flex flex-col gap-6"
      >
        {shouldScroll
          ? [...items, ...items].map((seminar, index) => (
              <SeminarCard key={`${seminar.id}-${index}`} seminar={seminar} />
            ))
          : items.map((seminar) => (
              <SeminarCard key={seminar.id} seminar={seminar} />
            ))}
      </motion.div>
    </div>
  );
}

// Extracted SeminarCard component for better readability
function SeminarCard({ seminar }: { seminar: Seminar }) {
  return (
    <CardContent className="w-full p-4 sm:p-6 rounded-xl shadow-md bg-primary-50 text-black">
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between border-b pb-4 gap-4">
          <div className="basis-full md:basis-1/3">
            <div className="flex items-center text-sm font-medium text-primary-800">
                <CalendarDays className="h-3 w-3 mr-1" />{formatDate(seminar.time)}
            </div>
            <h4 className="font-medium mt-1 text-primary-800">
              {seminar.title}
            </h4>
            <div className="flex items-center gap-4 mt-1 text-sm text-primary-600">
              <div className="flex items-center">
                <User className="h-3 w-3 mr-1" />
                {seminar.student.name}
              </div>
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {formatTime(seminar.time)}
              </div>
              <div className="flex items-center">
                <University className="h-3 w-3 mr-1" />
                {seminar.room || "TBD"}
              </div>
            </div>
          </div>

          {/* Dosen Pembimbing (Middle Section) */}
          <div className="basis-full md:basis-1/3 border-t md:border-t-0 md:border-l md:border-r px-0 md:px-4 pt-4 md:pt-0">
            <h5 className="font-medium text-sm text-primary-800">
              Dosen Pembimbing
            </h5>
            <div className="mt-2 text-sm text-primary-600">
              {seminar.advisors.map((advisor, index) => (
                <div key={index} className="flex items-center mt-1">
                  <User className="h-3 w-3 mr-1" />
                  {advisor.lecturer.name || "TBD"}
                </div>
              ))}
              {seminar.advisors.length === 0 && (
                <div className="flex items-center">
                  <User className="h-3 w-3 mr-1" />
                  TBD
                </div>
              )}
            </div>
          </div>

          {/* Dosen Penguji (Right Section) */}
          <div className="basis-full md:basis-1/3 pt-4 md:pt-0 md:pl-4 border-t md:border-t-0">
            <h5 className="font-medium text-sm text-primary-800">
              Dosen Penguji
            </h5>
            <div className="mt-2 text-sm text-primary-600">
              {seminar.assessors.map((assessor, index) => (
                <div key={index} className="flex items-center mt-1">
                  <User className="h-3 w-3 mr-1" />
                  {assessor.lecturer.name || "TBD"}
                </div>
              ))}
              {seminar.assessors.length === 0 && (
                <div className="flex items-center">
                  <User className="h-3 w-3 mr-1" />
                  TBD
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  );
}