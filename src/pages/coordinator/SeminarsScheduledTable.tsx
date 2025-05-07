"use client";

import { useState } from "react";
import { Button } from "../../components/ui/button";
import { toast } from "react-toastify";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

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
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(
    null
  );

  const handleSort = () => {
    const newDirection =
      sortDirection === "asc"
        ? "desc"
        : sortDirection === "desc"
        ? null
        : "asc";
    setSortDirection(newDirection);
  };

  const sortedSeminars = [...seminars].sort((a, b) => {
    const dateA = new Date(a.time);
    const dateB = new Date(b.time);
    if (sortDirection === "asc") {
      return dateA.getTime() - dateB.getTime();
    } else if (sortDirection === "desc") {
      return dateB.getTime() - dateA.getTime();
    }
    return 0;
  });

  return (
    <>
      <div className="rounded-sm overflow-x-auto border border-primary">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-primary text-primary-foreground font-heading font-medium">
              <th className="p-4 w-[1%]">No.</th>
              <th className="px-2 py-4 w-[40%]">Judul Penelitian</th>
              <th className="px-2 py-4 w-[25%]">Mahasiswa</th>
              <th className="p-4 w-[10%] ">
                <div className="flex justify-center items-center gap-1">
                  Jadwal
                  <button
                    onClick={handleSort}
                    className="focus:outline-none hover:text-primary-200"
                  >
                    {sortDirection === "asc" && <ArrowUp className="w-4 h-4" />}
                    {sortDirection === "desc" && (
                      <ArrowDown className="w-4 h-4" />
                    )}
                    {sortDirection === null && (
                      <ArrowUpDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </th>
              <th className="p-4 w-[10%] text-center">Tempat</th>
              <th className="p-4 w-[14%] text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {sortedSeminars.length > 0 ? (
              sortedSeminars.map((seminar: any, index: number) => (
                <tr
                  key={seminar.id}
                  className="border-b bg-white border-primary-200 text-primary-800"
                >
                  <td className="p-2">
                    <div className="font-medium text-center text-primary-800">
                      {index + 1}
                    </div>
                  </td>
                  <td className="p-2">
                    <div className="font-medium">{seminar.title}</div>
                  </td>
                  <td className="p-2">
                    <div className="font-medium text-primary-800">
                      {seminar.student?.name || "N/A"}
                    </div>
                    <div className="text-sm text-primary">
                      {seminar.studentNIM}
                    </div>
                  </td>
                  <td className="p-2 flex flex-col justify-center items-center">
                    <div className="text-center">
                      {formatDate(seminar.time)}
                    </div>
                    <div className="text-sm text-center text-primary">
                      {formatTime(seminar.time)}
                    </div>
                  </td>
                  <td className="p-2 text-center">{seminar.room || "TBD"}</td>
                  <td className="p-2 text-center space-x-2">
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
                <td colSpan={6} className="p-4 text-center text-primary-600">
                  Tidak ada seminar proposal yang dijadwalkan ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
    </>
  );
};

export default SeminarsScheduledTable;
