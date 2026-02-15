import { useState, useRef } from "react";
import { Upload, X, FileText, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Document {
  id: string;
  type: string;
  name: string;
  url: string;
  file: File;
}

interface DocumentUploadProps {
  documents: Document[];
  onDocumentsChange: (documents: Document[]) => void;
  requiredTypes?: string[];
}

const DocumentUpload = ({ documents, onDocumentsChange, requiredTypes = [] }: DocumentUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newDocuments: Document[] = files.map((file) => ({
      id: `doc_${Date.now()}_${Math.random()}`,
      type: getDocumentType(file.name),
      name: file.name,
      url: URL.createObjectURL(file),
      file,
    }));
    onDocumentsChange([...documents, ...newDocuments]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getDocumentType = (fileName: string): string => {
    const lower = fileName.toLowerCase();
    if (lower.includes("aadhar") || lower.includes("pan") || lower.includes("id")) return "Identity";
    if (lower.includes("license") || lower.includes("certificate")) return "Certificate";
    if (lower.includes("business") || lower.includes("gst")) return "Business";
    return "Other";
  };

  const removeDocument = (id: string) => {
    onDocumentsChange(documents.filter((doc) => doc.id !== id));
  };

  const hasRequiredType = (type: string) => {
    return requiredTypes.some((req) => type.toLowerCase().includes(req.toLowerCase()));
  };

  const hasRequiredDocuments = () => {
    if (requiredTypes.length === 0) return true;
    return requiredTypes.every((reqType) =>
      documents.some((doc) => doc.type.toLowerCase().includes(reqType.toLowerCase()))
    );
  };

  return (
    <div className="space-y-4">
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-border/50 rounded-2xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors bg-muted/20"
      >
        <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm font-semibold text-foreground mb-1">Upload Documents</p>
        <p className="text-xs text-muted-foreground">Tap to select files (PDF, JPG, PNG)</p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {documents.length > 0 && (
        <div className="space-y-3">
          {documents.map((doc) => {
            const isRequired = hasRequiredType(doc.type);
            return (
              <div
                key={doc.id}
                className={cn(
                  "bg-white rounded-xl p-4 border-2 flex items-center gap-3",
                  isRequired ? "border-primary/30" : "border-border/30"
                )}
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">{doc.type}</p>
                </div>
                {isRequired && (
                  <div className="h-5 w-5 rounded-full bg-success/15 flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 text-success" />
                  </div>
                )}
                <button
                  onClick={() => removeDocument(doc.id)}
                  className="h-8 w-8 rounded-lg bg-muted hover:bg-destructive/10 flex items-center justify-center shrink-0 transition-colors"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {requiredTypes.length > 0 && (
        <div className="bg-muted/30 rounded-xl p-4">
          <p className="text-xs font-semibold text-foreground mb-2">Required Documents:</p>
          <ul className="space-y-1">
            {requiredTypes.map((type) => {
              const hasDoc = documents.some((doc) =>
                doc.type.toLowerCase().includes(type.toLowerCase())
              );
              return (
                <li key={type} className="flex items-center gap-2 text-xs">
                  {hasDoc ? (
                    <Check className="h-3 w-3 text-success" />
                  ) : (
                    <div className="h-3 w-3 rounded-full border-2 border-muted-foreground" />
                  )}
                  <span className={cn(hasDoc ? "text-success" : "text-muted-foreground")}>
                    {type} Proof
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
