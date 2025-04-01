"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { CheckCircle2, AlertCircle } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../../../components/ui/alert";

const documentLabels: { [key: string]: string } = {
  THESIS_PROPOSAL: "Thesis Proposal",
  ADVISOR_AVAILABILITY: "Advisor Availability",
  KRS: "Kartu Rencana Studi",
  ADVISOR_ASSISTANCE: "Advisor Assistance",
  SEMINAR_ATTENDANCE: "Seminar Attendance",
};

interface ReviewSubmitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  formData: {
    researchTitle: string;
    advisor1: string;
    advisor2: string;
    uploadedDocuments: Record<string, File | null>;
  };
}

const ReviewSubmitModal = ({
  open,
  onOpenChange,
  onSubmit,
  formData,
}: ReviewSubmitModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Review & Submit</DialogTitle>
          <DialogDescription>
            Review your information before final submission.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Research Details</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Research Title
                </p>
                <p>{formData.researchTitle}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  First Supervisor
                </p>
                <p>{formData.advisor1}</p>
              </div>
              {formData.advisor2 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Second Supervisor
                  </p>
                  <p>{formData.advisor2}</p>
                </div>
              )}
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Uploaded Documents</h3>
            <ul className="space-y-2">
              {Object.entries(formData.uploadedDocuments).map(
                ([key, value]) => (
                  <li key={key} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>{documentLabels[key]}</span>
                    <span className="text-sm text-muted-foreground ml-auto">
                      {value?.name || "File uploaded"}
                    </span>
                  </li>
                )
              )}
            </ul>
          </div>

          <Alert className="bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800">Important Note</AlertTitle>
            <AlertDescription className="text-amber-700">
              After submission, your registration will be reviewed by the
              coordinator.
            </AlertDescription>
          </Alert>

          <Alert className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">
              Submission Confirmation
            </AlertTitle>
            <AlertDescription className="text-blue-700">
              By clicking "Submit Registration", you confirm that all
              information provided is correct and complete.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button onClick={onSubmit}>Submit Registration</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewSubmitModal;
