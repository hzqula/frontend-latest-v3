import { useState, useMemo, SetStateAction } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Search, Copy, CopyCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Button } from "../../components/ui/button";

interface Student {
  id: string;
  name: string;
  nim: string;
  semester: string | number;
  phoneNumber: string;
}

const PaginatedStudentsCard = ({ students }: { students: Student[] }) => {
  const [searchStudent, setSearchStudent] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage, setStudentsPerPage] = useState(10);

  const handleCopy = (text: string, id: string | null) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };  

  // Filter students based on search query
  const filteredStudents = useMemo(() => {
    return students.filter(
      (student) =>
        student.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
        student.nim.toLowerCase().includes(searchStudent.toLowerCase()) ||
        (typeof student.semester === "string" &&
          student.semester.toLowerCase().includes(searchStudent.toLowerCase())) ||
        (typeof student.semester === "number" &&
          student.semester.toString().includes(searchStudent))
    );
  }, [students, searchStudent]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  // Change page
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Calculate page numbers to show
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages are less than maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always add first page
      pageNumbers.push(1);
      
      // Calculate start and end pages
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust to show maxPagesToShow - 2 pages (excluding first and last)
      if (endPage - startPage < maxPagesToShow - 3) {
        if (currentPage < totalPages / 2) {
          endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 3);
        } else {
          startPage = Math.max(2, endPage - (maxPagesToShow - 3));
        }
      }
      
      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pageNumbers.push("...");
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push("...");
      }
      
      // Always add last page
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  return (
    <Card className="bg-white">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <CardTitle className="text-2xl -mb-1 font-heading font-black text-primary-800">
              Mahasiswa
            </CardTitle>
            <CardDescription className="text-primary">
              Telah terdaftar di sistem
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-3 h-4 w-4 text-primary-600" />
              <Input
                type="search"
                placeholder="Cari mahasiswa berdasarkan nama | nim | semester"
                className="w-full md:w-[500px] pl-8 border-primary-400"
                value={searchStudent}
                onChange={(e) => setSearchStudent(e.target.value)}
              />
            </div>
            <Select 
              value={studentsPerPage.toString()} 
              onValueChange={(value) => {
                setStudentsPerPage(Number(value));
                setCurrentPage(1); // Reset to first page when changing items per page
              }}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="10 per halaman" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-6">
        {/* Desktop View */}
        <div className="hidden md:block rounded-sm overflow-x-auto border border-primary">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-primary text-primary-foreground font-heading font-medium text-xs lg:text-sm">
                <th className="p-3 lg:p-4 w-[30%]">Mahasiswa</th>
                <th className="p-3 lg:p-4 w-[30%]">NIM</th>
                <th className="p-3 lg:p-4 w-[20%]">Semester</th>
                <th className="p-3 lg:p-4 w-[20%]">No. HP</th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.length > 0 ? (
                currentStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="border-b border-primary-200 text-primary-800 text-xs lg:text-sm"
                  >
                    <td className="p-3 lg:p-4">
                      <div className="font-medium">{student.name}</div>
                    </td>
                    <td className="p-3 lg:p-4">{student.nim}</td>
                    <td className="p-3 lg:p-4">{student.semester}</td>
                    <td className="p-3 lg:p-4">
                      {student.phoneNumber}
                      <button
                        onClick={() => handleCopy(student.phoneNumber, student.id)}
                        className="ml-4 p-1 text-xs text-primary-600 hover:text-primary-800 focus:outline-none focus:ring-1 focus:ring-primary-300 rounded"
                        aria-label="Copy phone number"
                      >
                        {copied === student.id ? (
                          <span className="flex items-center">
                            <CopyCheck className="h-3.5 w-3.5 mr-1" />
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <Copy className="h-3.5 w-3.5 mr-1" />
                          </span>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-primary-600">
                    Tidak ada mahasiswa yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden">
          <div className="space-y-3 sm:space-y-4">
            {currentStudents.length > 0 ? (
              currentStudents.map((student) => (
                <div
                  key={student.id}
                  className="border border-primary rounded-sm p-2 sm:p-3 text-primary-800 shadow-sm"
                >
                  <div className="grid grid-cols-2 gap-2 sm:gap-4">
                    <div className="space-y-2 sm:space-y-3">
                      <div>
                        <h3 className="text-xs font-bold text-primary-600">
                          Nama
                        </h3>
                        <p className="font-medium text-xs sm:text-sm break-words line-clamp-2 sm:line-clamp-none">
                          {student.name}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-primary-600">
                          Semester
                        </h3>
                        <p className="text-xs sm:text-sm">{student.semester}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:gap-4">
                      <div className="space-y-2 sm:space-y-3">
                        <div>
                          <h3 className="text-xs font-bold text-primary-600">
                            NIM
                          </h3>
                          <p className="font-medium text-xs sm:text-sm break-words line-clamp-2 sm:line-clamp-none">
                            {student.nim}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-primary-600">
                            No. HP
                          </h3>
                          <div className="flex items-center">
                            <p className="text-xs sm:text-sm">
                              {student.phoneNumber}
                            </p>
                            <button
                              onClick={() => handleCopy(student.phoneNumber, student.id)}
                              className="ml-2 p-1 text-xs text-primary-600 hover:text-primary-800 focus:outline-none focus:ring-1 focus:ring-primary-300 rounded"
                              aria-label="Copy phone number"
                            >
                              {copied === student.id ? (
                                <CopyCheck className="h-3.5 w-3.5" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="border border-primary rounded-sm p-3 text-center text-primary-600 text-xs sm:text-sm">
                Tidak ada mahasiswa yang ditemukan.
              </div>
            )}
          </div>
        </div>

        {/* Pagination Controls */}
        {filteredStudents.length > 0 && (
          <div className="flex items-center justify-between mt-4 px-2">
            <div className="text-xs text-primary-600">
              Menampilkan {indexOfFirstStudent + 1}-
              {Math.min(indexOfLastStudent, filteredStudents.length)} dari{" "}
              {filteredStudents.length} mahasiswa
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0 flex items-center justify-center"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              {getPageNumbers().map((page, index) => (
                page === "..." ? (
                  <span key={`ellipsis-${index}`} className="px-2 text-primary-600">...</span>
                ) : (
                  <Button
                    key={`page-${page}`}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(Number(page))}
                    className="h-8 w-8 p-0"
                  >
                    {page}
                  </Button>
                )
              ))}
              
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0 flex items-center justify-center"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaginatedStudentsCard;