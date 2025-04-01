import type * as React from "react";
import { cn } from "../../lib/utils";
import {
  FileText,
  File,
  FileImage,
  FileArchive,
  FileSpreadsheet,
} from "lucide-react";

interface DocumentCardProps extends React.HTMLAttributes<HTMLDivElement> {
  fileName: string;
  documentType: string;
  fileSize?: string;
  fileType?: string;
  iconColor?: string;
  variant?: "default" | "outline" | "ghost";
}

const getFileIcon = (fileType: string) => {
  const type = fileType.toLowerCase();

  if (type.includes("pdf")) return FileText;
  if (
    type.includes("image") ||
    type.includes("png") ||
    type.includes("jpg") ||
    type.includes("jpeg")
  )
    return FileImage;
  if (type.includes("zip") || type.includes("rar")) return FileArchive;
  if (
    type.includes("excel") ||
    type.includes("spreadsheet") ||
    type.includes("csv")
  )
    return FileSpreadsheet;

  return File;
};

const formatDocumentType = (type: string) => {
  return type
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
};

export function DocumentCard({
  fileName,
  documentType,
  fileSize,
  fileType = "application/pdf",
  iconColor = "text-primary-600",
  variant = "default",
  className,
  ...props
}: DocumentCardProps) {
  const FileIcon = getFileIcon(fileType);
  const formattedType = formatDocumentType(documentType);

  return (
    <div
      className={cn(
        "flex items-center rounded-lg transition-colors",
        variant === "default" &&
          "p-3 border border-primary-100 bg-primary-50/30 hover:bg-primary-50",
        variant === "outline" && "p-3 border border-border hover:bg-accent",
        variant === "ghost" && "p-3 hover:bg-muted",
        className
      )}
      {...props}
    >
      <div className="p-2 bg-white rounded-md shadow-sm mr-3 flex items-center justify-center">
        <FileIcon className={cn("h-5 w-5", iconColor)} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{formattedType}</p>
        <p className="text-xs text-muted-foreground truncate">
          {fileName || "Document uploaded"}
          {fileSize && (
            <span className="ml-1 text-muted-foreground">({fileSize})</span>
          )}
        </p>
      </div>
    </div>
  );
}
