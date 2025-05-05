"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Upload, Download, FileText, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { Input } from "../../../components/ui/input";
import { ScrollArea } from "../../../components/ui/scroll-area";

const requiredDocuments = [
  {
    id: "THESIS_PROPOSAL",
    name: "Proposal Tugas Akhir",
    description: "Dokumen Proposal Tugas Akhir",
    template: "/templates/thesis_proposal_template.docx",
  },
  {
    id: "ADVISOR_AVAILABILITY",
    name: "Kesediaan Pembimbing",
    description: "Surat kesediaan dosen pembimbing yang ditandatangani",
    template: "/templates/advisor_availability_template.docx",
  },
  {
    id: "KRS",
    name: "Kartu Rencana Studi",
    description:
      "Kartu Rencana Studi (KRS) di semester ini yang sudah disetujui",
    template: "/templates/krs_template.pdf",
  },
  {
    id: "ADVISOR_ASSISTANCE",
    name: "Asistensi Pembimbing",
    description: "Bukti asistensi dengan dosen pembimbing",
    template: "/templates/advisor_assistance_template.pdf",
  },
  {
    id: "SEMINAR_ATTENDANCE",
    name: "Kehadiran Seminar",
    description: "Bukti kehadiran seminar proposal",
    template: "/templates/seminar_attendance_template.pdf",
  },
];

interface DocumentUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (documents: Record<string, File | null>) => void;
  initialData: Record<string, File | null>;
  uploadedStatus: Record<string, boolean>;
}

const DocumentUploadModal = ({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  uploadedStatus,
}: DocumentUploadModalProps) => {
  const [uploadedDocuments, setUploadedDocuments] =
    useState<Record<string, File | null>>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingDocId, setUploadingDocId] = useState<string | null>(null);

  const handleFileUpload = async (documentId: string, file: File | null) => {
    if (file) {
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error("File terlalu besar! Maksimal 5MB.");
        return;
      }

      // Menampilkan status uploading
      setUploadingDocId(documentId);
      
      // Simulasi delay upload (hapus pada implementasi asli)
      // Pada implementasi asli, ini akan digantikan dengan kode upload asli Anda
      try {
        // Tampilkan toast bahwa dokumen sedang diupload
        const uploadToastId = toast.info("Dokumen sedang diupload...", {
          autoClose: false,
          closeOnClick: false,
        });
        
        // Simulasi delay upload (ganti dengan kode upload sebenarnya)
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
        // Update state dengan file yang diupload
        setUploadedDocuments((prev) => ({ ...prev, [documentId]: file }));
        
        // Update toast menjadi sukses
        toast.update(uploadToastId, {
          render: "Dokumen berhasil diupload!",
          type: "success",
          autoClose: 2000,
        });
      } catch (error) {
        toast.error("Gagal mengupload dokumen. Silakan coba lagi.");
      } finally {
        setUploadingDocId(null);
      }
    } else {
      // Jika file adalah null (hapus file)
      setUploadedDocuments((prev) => ({ ...prev, [documentId]: null }));
    }
  };

  const allDocumentsUploaded = () =>
    requiredDocuments.every(
      (doc) => uploadedDocuments[doc.id] !== null || uploadedStatus[doc.id]
    );

  const handleSubmit = async () => {
    if (!allDocumentsUploaded()) {
      toast.error("Silakan unggah semua dokumen yang dibutuhkan.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Tampilkan toast bahwa dokumen sedang disimpan
      const saveToastId = toast.info("Menyimpan dokumen...", {
        autoClose: false,
        closeOnClick: false,
      });
      
      await onSubmit(uploadedDocuments);
      
      // Update toast menjadi sukses
      toast.update(saveToastId, {
        render: "Dokumen berhasil disimpan!",
        type: "success",
        autoClose: 2000,
      });
      
      setIsSubmitting(false);
      onOpenChange(false); // Tutup modal setelah sukses
    } catch (error) {
      setIsSubmitting(false);
      toast.error("Gagal menyimpan dokumen.");
    }
  };

  // Komponen overlay untuk menampilkan status upload
  const UploadingOverlay = ({ documentId }: { documentId: string }) => (
    <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] rounded-lg flex items-center justify-center z-10">
      <div className="bg-white p-2 rounded-md flex items-center gap-2 shadow-md">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-xs font-medium">Mengupload dokumen...</span>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] w-[95%] max-h-[90vh] mx-auto p-4 sm:p-6">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-lg sm:text-2xl font-heading font-black text-primary-800">
            Upload Dokumen yang Dibutuhkan
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Unggah semua dokumen yang diperlukan untuk seminar proposal Anda.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="space-y-3 max-h-[50vh] sm:max-h-[60vh] pr-2 mt-3">
          {requiredDocuments.map((document) => (
            <div key={document.id} className="border rounded-lg p-3 sm:p-4 relative">
              {/* Overlay saat dokumen sedang diupload */}
              {uploadingDocId === document.id && (
                <UploadingOverlay documentId={document.id} />
              )}
              
              <div className="flex justify-between items-start gap-2 mb-2">
                <div className="flex-1">
                  <h3 className="text-xs sm:text-sm font-bold font-heading text-primary-800">
                    {document.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {document.description}
                  </p>
                </div>
                {uploadedStatus[document.id] && (
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 text-green-600" />
                )}
              </div>

              <div className="flex flex-col gap-2 mt-3">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 text-xs sm:text-sm py-1 h-auto"
                    onClick={() => window.open(document.template, "_blank")}
                    disabled={uploadingDocId === document.id || isSubmitting}
                  >
                    <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="whitespace-nowrap">Download Template</span>
                  </Button>

                  <div className="relative flex-1">
                    <Button
                      variant={
                        uploadedStatus[document.id] ||
                        uploadedDocuments[document.id]
                          ? "outline"
                          : "default"
                      }
                      size="sm"
                      className="flex items-center gap-2 text-xs sm:text-sm py-1 h-auto w-full"
                      disabled={uploadingDocId === document.id || isSubmitting}
                    >
                      {uploadingDocId === document.id ? (
                        <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                      ) : (
                        <Upload className="h-3 w-3 sm:h-4 sm:w-4" />
                      )}
                      <span className="whitespace-nowrap">
                        {uploadingDocId === document.id 
                          ? "Mengupload..." 
                          : uploadedStatus[document.id]
                            ? "Perbarui Dokumen"
                            : "Unggah Dokumen"}
                      </span>
                      <Input
                        type="file"
                        accept=".pdf"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          handleFileUpload(document.id, file);
                        }}
                        disabled={uploadingDocId === document.id || isSubmitting}
                      />
                    </Button>
                  </div>
                </div>

                {(uploadedDocuments[document.id] || uploadedStatus[document.id]) && (
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground bg-gray-50 p-2 rounded-md overflow-hidden">
                    <FileText className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="truncate">
                      {uploadedDocuments[document.id]?.name || "Dokumen tersimpan"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </ScrollArea>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4 pt-2 border-t">
          <Button
            type="button"
            variant="destructive"
            className="w-full sm:w-1/3 text-xs sm:text-sm py-2 order-2 sm:order-1"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting || uploadingDocId !== null}
          >
            Batal
          </Button>
          <Button
            className="w-full sm:w-2/3 text-xs sm:text-sm py-2"
            onClick={handleSubmit}
            disabled={!allDocumentsUploaded() || isSubmitting || uploadingDocId !== null}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Menyimpan...
              </span>
            ) : (
              "Simpan"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentUploadModal;