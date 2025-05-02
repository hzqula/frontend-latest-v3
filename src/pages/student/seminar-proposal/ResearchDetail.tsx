"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useApiData } from "../../../hooks/useApiData";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Plus, Minus } from "lucide-react";
import { toast } from "react-toastify";

const formSchema = z.object({
  researchTitle: z
    .string()
    .min(10, "Research title must be at least 10 characters."),
  advisor1: z.string().min(1, "First supervisor is required."),
  advisor2: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface ResearchDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FormData) => void;
  initialData: {
    researchTitle: string;
    advisor1: string;
    advisor2: string;
  };
}

const ResearchDetailsModal = ({
  open,
  onOpenChange,
  onSubmit,
  initialData,
}: ResearchDetailsModalProps) => {
  const [showSecondSupervisor, setShowSecondSupervisor] = useState<boolean>(
    !!initialData.advisor2
  );

  const lecturersQuery = useApiData({ type: "lecturers" });
  const availableSupervisors = lecturersQuery.data || [];

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      researchTitle: initialData.researchTitle || "",
      advisor1: initialData.advisor1 || "",
      advisor2: initialData.advisor2 || "",
    },
  });

  const handleSubmit = async (data: FormData) => {
    if (isSubmitting) return; // Cegah double submit

    setIsSubmitting(true);
    try {
      await onSubmit(data);
      onOpenChange(false); // Tutup modal setelah sukses
    } catch (error) {
      toast.error("Gagal menyimpan detail seminar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSecondSupervisor = () => {
    setShowSecondSupervisor(!showSecondSupervisor);
    if (showSecondSupervisor) {
      form.setValue("advisor2", "");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] w-[95%] max-h-[90vh] overflow-y-auto mx-auto p-4 sm:p-6">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl sm:text-2xl font-heading font-black text-primary-800">
            Detail Seminar Proposal
          </DialogTitle>
          <DialogDescription className="text-primary text-xs sm:text-sm">
            Masukkan judul penelitian dan dosen pembimbing Anda.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 sm:space-y-6 mt-2"
          >
            <FormField
              control={form.control}
              name="researchTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs sm:text-sm font-bold font-heading text-primary-800">
                    Judul Penelitian
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan judul penelitian Anda"
                      className="text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <div className="space-y-3 sm:space-y-4">
              <div className="flex justify-end items-center">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs sm:text-sm py-1 h-auto"
                  onClick={toggleSecondSupervisor}
                  disabled={showSecondSupervisor && !form.getValues("advisor2")}
                >
                  {showSecondSupervisor ? (
                    <Minus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  ) : (
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  )}
                  <span className="whitespace-nowrap">
                    {showSecondSupervisor
                      ? "Hapus Dosen Pembimbing"
                      : "Tambah Dosen Pembimbing"}
                  </span>
                </Button>
              </div>

              <FormField
                control={form.control}
                name="advisor1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs sm:text-sm font-bold font-heading text-primary-800">
                      Dosen Pembimbing I
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="text-sm">
                          <SelectValue placeholder="Pilih dosen" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-60">
                        {availableSupervisors.map(
                          (supervisor: { nip: string; name: string }) => (
                            <SelectItem
                              key={supervisor.nip}
                              value={supervisor.nip}
                              className="text-sm"
                            >
                              <span className="truncate block">
                                {supervisor.name}
                              </span>
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {showSecondSupervisor && (
                <FormField
                  control={form.control}
                  name="advisor2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm font-bold font-heading text-primary-800">
                        Dosen Pembimbing II
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="text-sm">
                            <SelectValue placeholder="Pilih dosen" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-60">
                          {availableSupervisors
                            .filter(
                              (supervisor: { nip: string }) =>
                                supervisor.nip !== form.getValues("advisor1")
                            )
                            .map(
                              (supervisor: { nip: string; name: string }) => (
                                <SelectItem
                                  key={supervisor.nip}
                                  value={supervisor.nip}
                                  className="text-sm"
                                >
                                  <span className="truncate block">
                                    {supervisor.name}
                                  </span>
                                </SelectItem>
                              )
                            )}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <DialogFooter className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 px-4 sm:px-6 py-4 sm:py-6 border-t">
              <Button
                type="button"
                variant="destructive"
                className="w-full sm:w-1/2 order-2 sm:order-1"
                onClick={() => onOpenChange(false)}
              >
                Batal
              </Button>
              <Button
                className="w-full sm:w-1/2 bg-primary hover:bg-primary-700 text-primary-foreground"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Menyimpan..." : "Simpan"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ResearchDetailsModal;
