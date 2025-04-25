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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl -mb-1 font-heading font-black text-primary-800">
            Detail Seminar Proposal
          </DialogTitle>
          <DialogDescription className="text-primary text-sm">
            Informasi lengkap tentang seminar proposal
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold font-heading text-primary-800">
              Judul Penelitian
            </h3>
            <p className="text-primary-800 text-lg font-bold">
              {seminar.title}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-bold font-heading text-primary-800">
              Mahasiswa
            </h3>
            <p className="text-primary-800">
              {seminar.student?.name || "N/A"} ({seminar.studentNIM})
            </p>
          </div>
          <div>
            <h3 className="text-sm font-bold font-heading text-primary-800">
              Jadwal Seminar
            </h3>
            <p className="text-primary-800">
              {formatDate(seminar.time)} {formatTime(seminar.time)}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-bold font-heading text-primary-800">
              Tempat Seminar
            </h3>
            <p className="text-primary-800">{seminar.room || "TBD"}</p>
          </div>
          <div>
            <h3 className="text-sm font-bold font-heading text-primary-800">
              Pembimbing
            </h3>
            {seminar.advisors && seminar.advisors.length > 0 ? (
              <ul className="list-disc pl-5">
                {seminar.advisors.map((Advisor: any, index: number) => (
                  <li key={index} className="text-primary-800">
                    {Advisor.lecturer?.name || "N/A"} (
                    {Advisor.lecturer?.nip || "N/A"})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-primary-800">Belum ditentukan</p>
            )}
          </div>
          <div>
            <h3 className="text-sm font-bold font-heading text-primary-800">
              Penguji
            </h3>
            {seminar.assessors && seminar.assessors.length > 0 ? (
              <ul className="list-disc pl-5">
                {seminar.assessors.map((assessor: any, index: number) => (
                  <li key={index} className="text-primary-800">
                    {assessor.lecturer?.name || "N/A"} (
                    {assessor.lecturer?.nip || "N/A"})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-primary-800">Belum ditentukan</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            className="w-full border-primary-400 text-primary-800"
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
