"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { toast } from "react-toastify";

interface SeminarsScheduledTableProps {
  seminars: any[];
  formatDate: (dateString: string) => string;
  formatTime: (dateString: string) => string;
  onViewDetails: (seminar: any) => void;
}

const SeminarsScheduledTable = ({
  seminars,
  formatDate,
  formatTime,
  onViewDetails,
}: SeminarsScheduledTableProps) => {
  console.log(seminars);

  return (
    <Card className="bg-white">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <CardTitle className="text-2xl -mb-1 font-heading font-black text-primary-800">
              Seminar Proposal Dijadwalkan
            </CardTitle>
            <CardDescription className="text-primary">
              Seminar proposal yang telah dijadwalkan
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-sm overflow-x-auto border border-primary">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-primary text-primary-foreground font-heading font-medium">
                <th className="p-4 w-[35%]">Judul Penelitian</th>
                <th className="p-4 w-[20%]">Mahasiswa</th>
                <th className="p-4 w-[20%]">Jadwal Seminar</th>
                <th className="p-4 w-[10%]">Tempat</th>
                <th className="p-4 w-[15%] text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {seminars.length > 0 ? (
                seminars.map((seminar: any) => (
                  <tr
                    key={seminar.id}
                    className="border-b border-primary-200 text-primary-800"
                  >
                    <td className="p-4">
                      <div className="font-medium">{seminar.title}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-primary-800">
                        {seminar.student?.name || "N/A"}
                      </div>
                      <div className="text-sm text-primary-600">
                        {seminar.studentNIM}
                      </div>
                    </td>
                    <td className="p-4">
                      <div>{formatDate(seminar.time)}</div>
                      <div className="text-sm text-primary-600">
                        {formatTime(seminar.time)}
                      </div>
                    </td>
                    <td className="p-4">{seminar.room || "TBD"}</td>
                    <td className="p-4 text-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-primary-400 text-primary-700"
                        onClick={() => onViewDetails(seminar)}
                      >
                        Lihat
                      </Button>
                      <Button
                        size="sm"
                        className="bg-primary-600 text-white hover:bg-primary-700"
                        onClick={() => {
                          if (seminar.folderId) {
                            window.open(
                              `https://drive.google.com/drive/u/4/folders/${seminar.folderId}`,
                              "_blank"
                            );
                          } else {
                            toast.error("Link Google Drive tidak tersedia.");
                          }
                        }}
                      >
                        Folder
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-primary-600">
                    Tidak ada seminar proposal yang dijadwalkan ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default SeminarsScheduledTable;
