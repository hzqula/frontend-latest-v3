import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ScrollArea } from "../../components/ui/scroll-area";

const PaginatedChart = ({
  data,
  title,
  description,
}: {
  data: { dosen: string; mahasiswa: number }[];
  title: string;
  description: string;
}) => {
  // Number of items per page
  const itemsPerPage = 10;

  // Calculate total number of pages
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // State for current page
  const [currentPage, setCurrentPage] = useState(1);

  // Get current page data
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  // Handle pagination
  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-center">
        <div>
          <CardTitle className="text-primary-700">{title}</CardTitle>
          <CardDescription className="text-primary-600">
            {description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Small screen scrollable chart */}
          <div className="block sm:hidden max-h-[300px] overflow-y-auto">
            <div className="min-w-full h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={getCurrentPageData()}
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis
                    dataKey="dosen"
                    type="category"
                    width={145}
                    tick={{ fontSize: 9 }}
                    tickLine={false}
                  />
                  <Tooltip contentStyle={{ fontSize: "12px" }} />
                  <Bar
                    dataKey="mahasiswa"
                    fill="var(--color-primary-600)"
                    radius={[0, 4, 4, 0]}
                    label={{ position: "right", fontSize: 12 }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Medium to large screen chart */}
          <ScrollArea className="hidden sm:block max-h-[400px]">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={getCurrentPageData()}
                  layout="vertical"
                  margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" />
                  <YAxis
                    dataKey="dosen"
                    type="category"
                    width={150}
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="mahasiswa"
                    fill="var(--color-primary-600)"
                    radius={[0, 4, 4, 0]}
                    label={{ position: "right", fill: "#666" }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ScrollArea>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-4">
        <div className="text-sm text-gray-500">
          Showing {(currentPage - 1) * itemsPerPage + 1}-
          {Math.min(currentPage * itemsPerPage, data.length)} of {data.length}
        </div>
        {totalPages > 1 && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={goToPrevPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <div className="text-sm font-medium">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default PaginatedChart;