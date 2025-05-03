import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";

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
      <DialogContent className="w-full max-w-[90vw] sm:max-w-[500px] md:max-w-[600px] p-4 sm:p-6">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl sm:text-2xl font-heading font-black text-primary-800">
            Detail Seminar Proposal
          </DialogTitle>
          <DialogDescription className="text-primary text-xs sm:text-sm">
            Informasi lengkap tentang seminar proposal
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 sm:space-y-4 mt-2 sm:mt-4">
          <div>
            <h3 className="text-xs sm:text-sm font-bold font-heading text-primary-800">
              Judul Penelitian
            </h3>
            <p className="text-primary-800 text-base sm:text-lg font-bold break-words">
              {seminar.title}
            </p>
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold font-heading text-primary-800">
              Mahasiswa
            </h3>
            <p className="text-primary-800 text-sm sm:text-base break-words">
              {seminar.student?.name || "N/A"} ({seminar.studentNIM})
            </p>
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold font-heading text-primary-800">
              Jadwal Seminar
            </h3>
            <p className="text-primary-800 text-sm sm:text-base">
              {formatDate(seminar.time)} {formatTime(seminar.time)}
            </p>
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold font-heading text-primary-800">
              Tempat Seminar
            </h3>
            <p className="text-primary-800 text-sm sm:text-base">
              {seminar.room || "TBD"}
            </p>
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold font-heading text-primary-800">
              Pembimbing
            </h3>
            {seminar.advisors && seminar.advisors.length > 0 ? (
              <ul className="list-disc pl-4 sm:pl-5 text-sm sm:text-base">
                {seminar.advisors.map((Advisor: any, index: number) => (
                  <li key={index} className="text-primary-800 break-words">
                    {Advisor.lecturer?.name || "N/A"} (
                    {Advisor.lecturer?.nip || "N/A"})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-primary-800 text-sm sm:text-base">
                Belum ditentukan
              </p>
            )}
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold font-heading text-primary-800">
              Penguji
            </h3>
            {seminar.assessors && seminar.assessors.length > 0 ? (
              <ul className="list-disc pl-4 sm:pl-5 text-sm sm:text-base">
                {seminar.assessors.map((assessor: any, index: number) => (
                  <li key={index} className="text-primary-800 break-words">
                    {assessor.lecturer?.name || "N/A"} (
                    {assessor.lecturer?.nip || "N/A"})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-primary-800 text-sm sm:text-base">
                Belum ditentukan
              </p>
            )}
          </div>
        </div>
        <DialogFooter className="mt-4 sm:mt-6">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto border-primary-400 text-primary-800 text-sm sm:text-base"
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
