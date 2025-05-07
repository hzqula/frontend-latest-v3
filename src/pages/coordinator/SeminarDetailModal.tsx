import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { ScrollArea } from "../../components/ui/scroll-area";

interface SeminarDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  seminar: any;
  formatDate: (dateString: string) => string;
  formatTime: (dateString: string) => string;
}

const SeminarDetailsModal = ({
  open,
  onOpenChange,
  seminar,
  formatDate,
  formatTime,
}: SeminarDetailsModalProps) => {
  if (!seminar) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] sm:max-w-[500px] md:max-w-[600px] p-4 sm:p-6">
        <DialogHeader className="space-y-1 sm:space-y-2">
          <DialogTitle className="text-xl sm:text-2xl font-heading font-black text-primary-800 text-center sm:text-left">
            Detail Seminar
          </DialogTitle>
          <DialogDescription className="text-primary text-sm text-center sm:text-left">
            Informasi lengkap tentang seminar proposal
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="space-y-4 mt-3 sm:mt-4 max-h-[60vh] pr-1">
          {/* Judul Penelitian - Full width on all screens */}
          <div className="border-b pb-3 border-gray-100">
            <h3 className="text-sm font-bold font-heading text-primary-800 mb-1">
              Judul Penelitian
            </h3>
            <p className="text-primary-800 text-base sm:text-lg font-bold break-words">
              {seminar.title}
            </p>
          </div>

          {/* Responsive grid for student and schedule info */}
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
            {/* Mahasiswa */}
            <div>
            <h3 className="text-sm font-bold font-heading text-primary-800 mb-1">
            Mahasiswa
              </h3>
              <p className="text-primary-800">
                <span className="block">
                {seminar.student?.name || "N/A"}
                </span>
              <span className="text-sm text-primary-600">
                {seminar.studentNIM}
              </span>
              </p>
            </div>
              {/* Jadwal Seminar */}
              <div>
                <h3 className="text-sm font-bold font-heading text-primary-800 mb-1">
                  Jadwal Seminar
                </h3>
                <p className="text-primary-800">
                  <span className="block">
                    {formatDate(seminar.time) || "TBD"}
                  </span>
                  <span className="text-sm text-primary-600">
                    Pukul {formatTime(seminar.time) || "TBD"}
                  </span>
                </p>
              </div>

            {/* Tempat Seminar */}
            <div className="border-t border-b py-3 border-gray-100">
              <h3 className="text-sm font-bold font-heading text-primary-800 mb-1">
                Tempat Seminar
              </h3>
              <p className="text-primary-800 text-base">
                {seminar.room || "TBD"}
              </p>
            </div>
          </div>

          {/* Responsive grid for advisors and assessors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Pembimbing */}
            <div>
              <h3 className="text-sm font-bold font-heading text-primary-800 mb-2">
                Pembimbing
              </h3>
              {seminar.advisors && seminar.advisors.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1">
                  {seminar.advisors.map((advisor: any, index: any) => (
                    <li
                      key={index}
                      className="text-primary-800 text-sm sm:text-base break-words"
                    >
                      {advisor.lecturer?.name || "N/A"}
                      <span className="block text-xs sm:text-sm text-primary-600">
                        {advisor.lecturer?.nip || "N/A"}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-primary-800">Belum ditentukan</p>
              )}
            </div>

            {/* Penguji */}
            <div>
              <h3 className="text-sm font-bold font-heading text-primary-800 mb-2">
                Penguji
              </h3>
              {seminar.assessors && seminar.assessors.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1">
                  {seminar.assessors.map((assessor: any, index: any) => (
                    <li
                      key={index}
                      className="text-primary-800 text-sm sm:text-base break-words"
                    >
                      {assessor.lecturer?.name || "N/A"}
                      <span className="block text-xs sm:text-sm text-primary-600">
                        {assessor.lecturer?.nip || "N/A"}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-primary-800">Belum ditentukan</p>
              )}
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="mt-6">
          <Button
            type="button"
            variant="outline"
            className="w-full border-primary-400 text-primary-800 hover:bg-primary-50"
            onClick={() => onOpenChange(false)}
          >
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SeminarDetailsModal;
