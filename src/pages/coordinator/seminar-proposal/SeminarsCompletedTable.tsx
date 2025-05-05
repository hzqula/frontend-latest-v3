"use client";

import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface SeminarsCompletedTableProps {
  seminars: any[];
  formatDate: (dateString: string) => string;
  formatTime: (dateString: string) => string;
  onViewDetails: (seminar: any) => void;
}

const SeminarsCompletedTable = ({
  seminars,
  formatDate,
  formatTime,
  onViewDetails,
}: SeminarsCompletedTableProps) => {
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(
    null
  );

  const handleSort = () => {
    setSortDirection((prev) => {
      if (prev === null || prev === "desc") return "asc";
      return "desc";
    });
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
    <div className="rounded-sm overflow-x-auto border border-primary">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-primary text-primary-foreground font-heading font-medium">
            <th className="p-4 w-[1%] text-center">No.</th>
            <th className="px-2 py-4 w-[40%]">Judul Penelitian</th>
            <th className="px-2 py-4 w-[25%]">Mahasiswa</th>
            <th className="p-4 w-[10%] ">
              <div className="flex justify-center items-center gap-1">
                Pada
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
                className="border-b border-primary-200 text-primary-800"
              >
                <td className="p-2 text-center">
                  <div className="font-medium text-primary-800">
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
                  <div>{formatDate(seminar.time)}</div>
                  <div className="text-sm text-primary-600">
                    {formatTime(seminar.time)}
                  </div>
                </td>
                <td className="p-2">{seminar.room || "TBD"}</td>
                <td className="p-2 text-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-primary-400 text-primary-700"
                    onClick={() => onViewDetails(seminar)}
                  >
                    Lihat
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="p-4 text-center text-primary-600">
                Belum ada seminar proposal yang selesai.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SeminarsCompletedTable;
