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
  FormDescription,
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

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      researchTitle: initialData.researchTitle || "",
      advisor1: initialData.advisor1 || "",
      advisor2: initialData.advisor2 || "",
    },
  });

  const handleSubmit = (data: FormData) => {
    onSubmit(data);
  };

  const toggleSecondSupervisor = () => {
    setShowSecondSupervisor(!showSecondSupervisor);
    if (showSecondSupervisor) {
      form.setValue("advisor2", "");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl -mb-1 font-heading font-black text-primary-800">
            Detail Seminar Proposal
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="researchTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-bold font-heading text-primary-800">
                    Judul Penelitian
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan judul penelitian Anda"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex justify-end items-center">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={toggleSecondSupervisor}
                  disabled={showSecondSupervisor && !form.getValues("advisor2")}
                >
                  {showSecondSupervisor ? (
                    <Minus className="h-4 w-4 mr-2" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  {showSecondSupervisor
                    ? "Hapus Dosen Pembimbing"
                    : "Tambah Dosen Pembimbing"}
                </Button>
              </div>

              <FormField
                control={form.control}
                name="advisor1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-bold font-heading text-primary-800">
                      Dosen Pembimbing I
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih dosen" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableSupervisors.map(
                          (supervisor: { nip: string; name: string }) => (
                            <SelectItem
                              key={supervisor.nip}
                              value={supervisor.nip}
                            >
                              {supervisor.name} ({supervisor.nip})
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {showSecondSupervisor && (
                <FormField
                  control={form.control}
                  name="advisor2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-bold font-heading text-primary-800">
                        Dosen Pembimbing II
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih dosen" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
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
                                >
                                  {supervisor.name} ({supervisor.nip})
                                </SelectItem>
                              )
                            )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="destructive"
                className="w-1/3"
                onClick={() => onOpenChange(false)}
              >
                Batal
              </Button>
              <Button className="w-2/3" type="submit">
                Simpan
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ResearchDetailsModal;
