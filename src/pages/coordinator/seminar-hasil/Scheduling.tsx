"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../../components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "../../../lib/utils";

// Schema validasi menggunakan Zod
const scheduleSchema = z.object({
  time: z.string().min(1, "Waktu seminar wajib diisi."),
  room: z.string().min(1, "Ruangan wajib diisi."),
  assessor1: z.string().min(1, "Dosen penguji 1 wajib dipilih."),
  assessor2: z.string().min(1, "Dosen penguji 2 wajib dipilih."),
});

type ScheduleFormData = z.infer<typeof scheduleSchema>;

interface SchedulingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  seminar: any;
  lecturers: any[];
  token: string;
  onScheduleSuccess: () => void;
}

const SchedulingModal = ({
  open,
  onOpenChange,
  seminar,
  lecturers,
  token,
  onScheduleSuccess,
}: SchedulingModalProps) => {
  const [activeTab, setActiveTab] = useState("schedule");

  // Setup form dengan react-hook-form
  const form = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      time: "",
      room: "",
      assessor1: "",
      assessor2: "",
    },
  });

  // State untuk Combobox
  const [assessor1Open, setAssessor1Open] = useState(false);
  const [assessor2Open, setAssessor2Open] = useState(false);

  // Format tanggal untuk tab detail
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const formatTime = (dateString: string) =>
    new Date(dateString).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });

  // Handle submit jadwal
  const handleScheduleSubmit = async (data: ScheduleFormData) => {
    try {
      const response = await axios.put(
        "http://localhost:5500/api/seminars/result-schedule",
        {
          seminarId: seminar.id,
          time: new Date(data.time).toISOString(),
          room: data.room,
          assessorNIPs: [data.assessor1, data.assessor2],
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Seminar berhasil dijadwalkan!");
      onScheduleSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Gagal menjadwalkan seminar:", error);
      toast.error(
        "Gagal menjadwalkan seminar: " +
          (error.response?.data?.error || error.message)
      );
    }
  };

  // Custom Combobox untuk Dosen Penguji 1
  const Assessor1Combobox = () => {
    const currentValue = form.getValues("assessor1");
    return (
      <Popover open={assessor1Open} onOpenChange={setAssessor1Open}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={assessor1Open}
            className={cn(
              "w-full justify-between border-primary-400 text-primary-800",
              !currentValue && "text-muted-foreground"
            )}
          >
            <span className="truncate">
              {currentValue
                ? lecturers.find((l: any) => l.nip === currentValue)?.name
                : "Pilih dosen penguji 1"}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popper-anchor-width)] p-0 z-[50]">
          <Command className="bg-white">
            <CommandInput placeholder="Cari dosen..." className="h-9" />
            <CommandList className="max-h-[200px] overflow-y-auto">
              <CommandEmpty>Tidak ada dosen ditemukan.</CommandEmpty>
              <CommandGroup>
                {lecturers
                  .filter(
                    (lecturer: any) =>
                      lecturer.nip !== form.getValues("assessor2")
                  )
                  .map((lecturer: any) => (
                    <CommandItem
                      key={lecturer.nip}
                      value={lecturer.nip}
                      onSelect={(selectedValue) => {
                        form.setValue(
                          "assessor1",
                          selectedValue === currentValue ? "" : selectedValue
                        );
                        setAssessor1Open(false);
                      }}
                      className="cursor-pointer pointer-events-auto"
                    >
                      <div className="truncate">
                        {lecturer.name} ({lecturer.nip})
                      </div>
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4 flex-shrink-0",
                          currentValue === lecturer.nip
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  };

  // Custom Combobox untuk Dosen Penguji 2
  const Assessor2Combobox = () => {
    const currentValue = form.getValues("assessor2");
    return (
      <Popover open={assessor2Open} onOpenChange={setAssessor2Open}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={assessor2Open}
            className={cn(
              "w-full justify-between border-primary-400 text-primary-800",
              !currentValue && "text-muted-foreground"
            )}
          >
            <span className="truncate">
              {currentValue
                ? lecturers.find((l: any) => l.nip === currentValue)?.name
                : "Pilih dosen penguji 2"}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popper-anchor-width)] p-0 z-[50]">
          <Command className="bg-white">
            <CommandInput placeholder="Cari dosen..." className="h-9" />
            <CommandList className="max-h-[200px] overflow-y-auto">
              <CommandEmpty>Tidak ada dosen ditemukan.</CommandEmpty>
              <CommandGroup>
                {lecturers
                  .filter(
                    (lecturer: any) =>
                      lecturer.nip !== form.getValues("assessor1")
                  )
                  .map((lecturer: any) => (
                    <CommandItem
                      key={lecturer.nip}
                      value={lecturer.nip}
                      onSelect={(selectedValue) => {
                        form.setValue(
                          "assessor2",
                          selectedValue === currentValue ? "" : selectedValue
                        );
                        setAssessor2Open(false);
                      }}
                      className="cursor-pointer pointer-events-auto"
                    >
                      <div className="truncate">
                        {lecturer.name} ({lecturer.nip})
                      </div>
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4 flex-shrink-0",
                          currentValue === lecturer.nip
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[600px] p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl -mb-1 font-heading font-black text-primary-800">
            Penjadwalan Seminar Proposal
          </DialogTitle>
          <DialogDescription className="text-primary text-xs sm:text-sm">
            Atur jadwal seminar atau lihat detail seminar.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4 bg-primary-100">
            <TabsTrigger
              value="schedule"
              className="text-primary-800 text-xs sm:text-sm"
            >
              Jadwalkan
            </TabsTrigger>
            <TabsTrigger
              value="details"
              className="text-primary-800 text-xs sm:text-sm"
            >
              Detail Seminar
            </TabsTrigger>
          </TabsList>

          {/* Tab Jadwalkan */}
          <TabsContent value="schedule">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleScheduleSubmit)}
                className="space-y-4 sm:space-y-6"
              >
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm font-bold font-heading text-primary-800">
                        Waktu Seminar
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          {...field}
                          className="border-primary-400 text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="room"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm font-bold font-heading text-primary-800">
                        Ruangan
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Masukkan nama ruangan"
                          {...field}
                          className="border-primary-400 text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="assessor1"
                  render={() => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm font-bold font-heading text-primary-800">
                        Dosen Penguji 1
                      </FormLabel>
                      <FormControl>
                        <Assessor1Combobox />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="assessor2"
                  render={() => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm font-bold font-heading text-primary-800">
                        Dosen Penguji 2
                      </FormLabel>
                      <FormControl>
                        <Assessor2Combobox />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4 sm:mt-6">
                  <Button
                    type="button"
                    variant="destructive"
                    className="w-full sm:w-1/3 text-sm order-1 sm:order-2"
                    onClick={() => onOpenChange(false)}
                  >
                    Batal
                  </Button>
                  <Button className="w-full sm:w-2/3 text-sm" type="submit">
                    Simpan
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>

          {/* Tab Detail Seminar */}
          <TabsContent value="details">
            <div className="space-y-3 sm:space-y-4 text-sm">
              <div>
                <h3 className="text-xs sm:text-sm font-bold font-heading text-primary-800">
                  Judul Penelitian
                </h3>
                <p className="text-primary-800 text-base sm:text-lg font-bold break-words">
                  {seminar.title}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold font-heading text-primary-800">
                    Mahasiswa
                  </h3>
                  <p className="text-primary-800 break-words">
                    {seminar.student?.name || "N/A"}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold font-heading text-primary-800">
                    NIM
                  </h3>
                  <p className="text-primary-800 break-words">
                    {seminar.studentNIM}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold font-heading text-primary-800">
                    Dosen Pembimbing
                  </h3>
                  <ul className="list-disc pl-5">
                    {seminar.advisors.map((advisor: any) => (
                      <li
                        key={advisor.lecturer.nip}
                        className="text-primary-800 break-words"
                      >
                        {advisor.lecturer.name}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold font-heading text-primary-800">
                    Tanggal Pengajuan
                  </h3>
                  <p className="text-primary-800">
                    {formatDate(seminar.createdAt)}{" "}
                    {formatTime(seminar.createdAt)}
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter className="mt-4 sm:mt-6">
              <Button
                type="button"
                variant="outline"
                className="w-full border-primary-400 text-primary-800 text-sm"
                onClick={() => onOpenChange(false)}
              >
                Tutup
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SchedulingModal;
