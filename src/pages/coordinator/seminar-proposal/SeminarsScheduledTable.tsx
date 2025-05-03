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
      <CardHeader className="px-4 py-4 sm:px-6 sm:py-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 sm:gap-4">
          <div>
            <CardTitle className="text-lg sm:text-xl md:text-2xl -mb-1 font-heading font-black text-primary-800">
              Seminar Proposal Dijadwalkan
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-primary">
              Seminar proposal yang telah dijadwalkan
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-6">
        {/* Desktop view - Full table */}
        <div className="hidden md:block rounded-sm overflow-x-auto border border-primary">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-primary text-primary-foreground font-heading font-medium text-xs lg:text-sm">
                <th className="p-3 lg:p-4 w-[35%]">Judul Penelitian</th>
                <th className="p-3 lg:p-4 w-[20%]">Mahasiswa</th>
                <th className="p-3 lg:p-4 w-[20%]">Jadwal Seminar</th>
                <th className="p-3 lg:p-4 w-[10%]">Tempat</th>
                <th className="p-3 lg:p-4 w-[15%] text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {seminars.length > 0 ? (
                seminars.map((seminar: any) => (
                  <tr
                    key={seminar.id}
                    className="border-b border-primary-200 text-primary-800 text-xs lg:text-sm"
                  >
                    <td className="p-3 lg:p-4">
                      <div className="font-medium line-clamp-2">
                        {seminar.title}
                      </div>
                    </td>
                    <td className="p-3 lg:p-4">
                      <div className="font-medium text-primary-800">
                        {seminar.student?.name || "N/A"}
                      </div>
                      <div className="text-xs text-primary-600">
                        {seminar.studentNIM}
                      </div>
                    </td>
                    <td className="p-3 lg:p-4">
                      <div>{formatDate(seminar.time)}</div>
                      <div className="text-xs text-primary-600">
                        {formatTime(seminar.time)} WIB
                      </div>
                    </td>
                    <td className="p-3 lg:p-4">{seminar.room || "TBD"}</td>
                    <td className="p-3 lg:p-4 text-center space-x-1 lg:space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-primary-400 text-primary-700 text-xs px-2 py-1 h-8"
                        onClick={() => onViewDetails(seminar)}
                      >
                        Lihat
                      </Button>
                      <Button
                        size="sm"
                        className="bg-primary-600 text-white hover:bg-primary-700 text-xs px-2 py-1 h-8"
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
                  <td colSpan={6} className="p-4 text-center text-primary-600">
                    Tidak ada seminar proposal yang dijadwalkan ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile view - Card style */}
        <div className="md:hidden">
          <div className="space-y-4">
            {seminars.length > 0 ? (
              seminars.map((seminar: any) => (
                <div
                  key={seminar.id}
                  className="border border-primary rounded-sm p-3 text-primary-800"
                >
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-xs font-bold text-primary-600">
                        Judul Penelitian
                      </h3>
                      <p className="font-medium text-sm break-words">
                        {seminar.title}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:gap-4">
                      <div>
                        <h3 className="text-xs font-bold text-primary-600">
                          Mahasiswa
                        </h3>
                        <p className="text-sm">
                          {seminar.student?.name || "N/A"}
                        </p>
                        <p className="text-xs text-primary-600">
                          {seminar.studentNIM}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-xs font-bold text-primary-600">
                          Jadwal Seminar
                        </h3>
                        <p className="text-sm">{formatDate(seminar.time)}</p>
                        <p className="text-xs text-primary-600">
                          {formatTime(seminar.time)} WIB
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-primary-600">
                        Tempat
                      </h3>
                      <p className="text-sm">{seminar.room || "TBD"}</p>
                    </div>

                    <div className="flex flex-col xs:flex-row gap-2 pt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-primary-400 text-primary-700 text-xs"
                        onClick={() => onViewDetails(seminar)}
                      >
                        Lihat Detail
                      </Button>
                      <Button
                        size="sm"
                        className="w-full bg-primary-600 text-white hover:bg-primary-700 text-xs"
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
                        Buka Folder
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="border border-primary rounded-sm p-4 text-center text-primary-600 text-sm">
                Tidak ada seminar proposal yang dijadwalkan ditemukan.
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SeminarsScheduledTable;
