import MobileLayout from "@/components/layout/MobileLayout";
import {
  ArrowLeft, Shield, CheckCircle2, AlertCircle, Clock, XCircle,
  FileText, Upload, Download, ChevronDown, AlertTriangle, Calendar,
  RefreshCw, Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { toast } from "sonner";

interface DocumentItem {
  id: string;
  label: string;
  description: string;
  status: "uploaded" | "pending" | "rejected" | "missing" | "expired";
  uploadedAt?: string;
  fileName?: string;
  expiresAt?: string;
  isExpiring?: boolean;
  isExpired?: boolean;
}

const statusMeta: Record<string, { icon: any; label: string; color: string; bg: string }> = {
  verified: { icon: CheckCircle2, label: "Verified", color: "text-green-600", bg: "bg-green-500/10" },
  pending: { icon: Clock, label: "Pending Review", color: "text-yellow-600", bg: "bg-yellow-500/10" },
  manual_review: { icon: Clock, label: "Under Review", color: "text-blue-600", bg: "bg-blue-500/10" },
  failed: { icon: XCircle, label: "Action Required", color: "text-destructive", bg: "bg-destructive/10" },
};

const docStatusMeta: Record<string, { icon: any; label: string; color: string; bg: string }> = {
  uploaded: { icon: CheckCircle2, label: "Uploaded", color: "text-green-600", bg: "bg-green-500/10" },
  pending: { icon: Clock, label: "Under Review", color: "text-yellow-600", bg: "bg-yellow-500/10" },
  rejected: { icon: XCircle, label: "Rejected", color: "text-destructive", bg: "bg-destructive/10" },
  missing: { icon: AlertCircle, label: "Not uploaded", color: "text-muted-foreground", bg: "bg-muted" },
  expired: { icon: AlertTriangle, label: "Expired", color: "text-destructive", bg: "bg-destructive/10" },
};

const agencyDocs: DocumentItem[] = [
  { id: "company-reg", label: "Company Registration (KVK)", description: "Chamber of Commerce extract", status: "uploaded", uploadedAt: "1 Jan 2026", fileName: "kvk_extract.pdf", expiresAt: "1 Jan 2027" },
  { id: "liability-insurance", label: "Liability Insurance", description: "Public liability insurance certificate", status: "uploaded", uploadedAt: "15 Feb 2026", fileName: "insurance_cert.pdf", expiresAt: "15 Apr 2026", isExpiring: true },
  { id: "trade-licence", label: "Trade Licence", description: "Gas Safe, NICEIC, or other trade certifications", status: "uploaded", uploadedAt: "10 Jan 2026", fileName: "gas_safe_cert.pdf", expiresAt: "10 Jan 2027" },
  { id: "vat-cert", label: "VAT Certificate (BTW)", description: "BTW registration confirmation", status: "uploaded", uploadedAt: "5 Jan 2026", fileName: "btw_cert.pdf" },
  { id: "employer-liability", label: "Employer's Liability Insurance", description: "Required for agencies with workers", status: "pending", uploadedAt: "6 Mar 2026", fileName: "employer_liability.pdf", expiresAt: "6 Mar 2027" },
  { id: "director-id", label: "Director's Government ID", description: "Passport or driving licence of company director", status: "uploaded", uploadedAt: "2 Mar 2026", fileName: "director_passport.pdf" },
  { id: "health-safety", label: "Health & Safety Policy", description: "Company H&S compliance document", status: "missing" },
];

const individualTraderDocs: DocumentItem[] = [
  { id: "gov-id", label: "Government ID", description: "Passport or driving licence", status: "uploaded", uploadedAt: "2 Jan 2026", fileName: "passport_scan.pdf" },
  { id: "right-to-work", label: "Right to Work", description: "Proof of right to work in the Netherlands", status: "pending", uploadedAt: "5 Feb 2026", fileName: "right_to_work.pdf" },
  { id: "trade-cert", label: "Trade Certificates", description: "Gas Safe, NICEIC, or other trade qualifications", status: "uploaded", uploadedAt: "10 Jan 2026", fileName: "gas_safe_cert.pdf", expiresAt: "10 Jan 2027" },
  { id: "proof-address", label: "Proof of Address", description: "Utility bill or bank statement (less than 3 months old)", status: "missing" },
  { id: "dbs-check", label: "Background Check (VOG)", description: "Certificate of Good Conduct", status: "uploaded", uploadedAt: "1 Dec 2025", fileName: "vog_cert.pdf", expiresAt: "1 Dec 2026" },
];

const customerDocs: DocumentItem[] = [
  { id: "gov-id", label: "Government ID", description: "Passport or driving licence", status: "missing" },
  { id: "selfie", label: "Biometric Selfie", description: "Photo for identity match", status: "missing" },
  { id: "proof-address", label: "Proof of Address", description: "Utility bill or bank statement", status: "missing" },
];

const Verification = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const isTrader = profile?.role === "trader";
  const isAgency = profile?.trader_type === "agency";
  const kycStatus = profile?.kyc_status || "pending";
  const cfg = statusMeta[kycStatus] || statusMeta.pending;
  const StatusIcon = cfg.icon;

  const getInitialDocs = () => {
    if (!isTrader) return customerDocs;
    return isAgency ? agencyDocs : individualTraderDocs;
  };

  const [documents, setDocuments] = useState<DocumentItem[]>(getInitialDocs());
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);

  const uploadedCount = documents.filter((d) => d.status !== "missing").length;
  const totalCount = documents.length;
  const completionPct = Math.round((uploadedCount / totalCount) * 100);
  const expiringCount = documents.filter((d) => d.isExpiring || d.isExpired || d.status === "expired").length;

  const handleUpload = (docId: string) => {
    // Simulate file upload
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === docId
          ? {
              ...d,
              status: "pending" as const,
              uploadedAt: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
              fileName: `${d.id}_upload.pdf`,
            }
          : d
      )
    );
    toast.success("Document uploaded!", { description: "It will be reviewed within 1–2 business days." });
  };

  const handleDownload = (doc: DocumentItem) => {
    toast.success(`Downloading ${doc.fileName}...`, { description: "File download started (demo)." });
  };

  const handleReupload = (docId: string) => {
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === docId
          ? {
              ...d,
              status: "pending" as const,
              uploadedAt: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
            }
          : d
      )
    );
    toast.success("Document updated!", { description: "New version submitted for review." });
  };

  return (
    <MobileLayout role={isTrader ? "trader" : "customer"}>
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground font-heading">
          {isTrader ? (isAgency ? "Company Documents" : "Verification & Documents") : "Identity Verification"}
        </h1>
      </div>

      <div className="px-4 py-5 flex flex-col gap-5">
        {/* Status banner */}
        <div className={`flex items-center gap-4 rounded-2xl p-4 ${cfg.bg}`}>
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${cfg.bg}`}>
            <StatusIcon className={`h-6 w-6 ${cfg.color}`} />
          </div>
          <div className="flex-1">
            <h2 className={`text-sm font-bold ${cfg.color}`}>{cfg.label}</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {kycStatus === "verified"
                ? (isAgency ? "Your company documents have been verified." : "Your documents have been verified.")
                : kycStatus === "failed"
                ? "Some documents need attention. Please review below."
                : "Your documents are being reviewed. This usually takes 1–2 business days."}
            </p>
          </div>
        </div>

        {/* Expiring warning */}
        {isTrader && expiringCount > 0 && (
          <div className="flex items-center gap-3 rounded-2xl bg-destructive/5 border border-destructive/20 p-3.5">
            <AlertTriangle className="h-5 w-5 shrink-0 text-destructive" />
            <div>
              <p className="text-xs font-bold text-destructive">{expiringCount} document{expiringCount > 1 ? "s" : ""} expiring soon</p>
              <p className="text-[11px] text-muted-foreground">Renew before expiry to maintain your verified status.</p>
            </div>
          </div>
        )}

        {/* Completion progress */}
        {isTrader && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-foreground">
                Documents: {uploadedCount}/{totalCount} uploaded
              </span>
              <span className="text-xs font-bold text-primary">{completionPct}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${completionPct}%` }}
              />
            </div>
          </div>
        )}

        {/* Document list */}
        <div>
          <h3 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            {isTrader ? (isAgency ? "Company Documents" : "Your Documents") : "Required Documents"}
          </h3>
          <div className="flex flex-col gap-2.5">
            {documents.map((doc) => {
              const ds = docStatusMeta[doc.status];
              const DsIcon = ds.icon;
              const isExpanded = expandedDoc === doc.id;
              const canUpload = doc.status === "missing" || doc.status === "rejected" || doc.status === "expired";
              const canUpdate = doc.status === "uploaded" || doc.status === "pending";
              const canDownload = doc.fileName && doc.status !== "missing";

              return (
                <div key={doc.id} className="rounded-2xl bg-card card-shadow overflow-hidden">
                  {/* Doc header */}
                  <button
                    onClick={() => setExpandedDoc(isExpanded ? null : doc.id)}
                    className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors active:bg-muted/40"
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${ds.bg}`}>
                      <FileText className={`h-4 w-4 ${ds.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{doc.label}</p>
                      <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                        <DsIcon className={`h-3 w-3 ${ds.color}`} />
                        <span className={`text-[10px] font-semibold ${ds.color}`}>{ds.label}</span>
                        {doc.expiresAt && (
                          <span className={`flex items-center gap-0.5 text-[10px] font-semibold ${doc.isExpiring || doc.isExpired ? "text-destructive" : "text-muted-foreground"}`}>
                            · <Calendar className="h-2.5 w-2.5" /> {doc.isExpiring ? "Expiring" : "Exp"}: {doc.expiresAt}
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                  </button>

                  {/* Expanded details & actions */}
                  {isExpanded && (
                    <div className="border-t border-border bg-muted/20 px-4 py-3.5">
                      <p className="text-xs text-muted-foreground mb-3">{doc.description}</p>

                      {/* File info */}
                      {doc.fileName && (
                        <div className="flex items-center gap-2 mb-3 rounded-xl bg-background border border-border p-3">
                          <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-foreground truncate">{doc.fileName}</p>
                            {doc.uploadedAt && (
                              <p className="text-[10px] text-muted-foreground">Uploaded: {doc.uploadedAt}</p>
                            )}
                          </div>
                          {doc.expiresAt && (
                            <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${doc.isExpiring || doc.isExpired ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"}`}>
                              {doc.isExpiring ? "Expiring Soon" : doc.isExpired ? "Expired" : `Exp: ${doc.expiresAt}`}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Rejected notice */}
                      {doc.status === "rejected" && (
                        <div className="mb-3 flex items-start gap-2 rounded-xl bg-destructive/5 border border-destructive/20 p-3">
                          <XCircle className="h-4 w-4 shrink-0 text-destructive mt-0.5" />
                          <p className="text-xs text-destructive">This document was rejected. Please upload a new version that meets the requirements.</p>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex gap-2">
                        {canDownload && (
                          <button
                            onClick={() => handleDownload(doc)}
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border bg-background py-2.5 text-xs font-bold text-foreground transition-colors active:bg-muted"
                          >
                            <Download className="h-3.5 w-3.5" />
                            Download
                          </button>
                        )}
                        {canUpload && (
                          <button
                            onClick={() => handleUpload(doc.id)}
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground transition-transform active:scale-95"
                          >
                            <Upload className="h-3.5 w-3.5" />
                            Upload
                          </button>
                        )}
                        {canUpdate && (
                          <button
                            onClick={() => handleReupload(doc.id)}
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-secondary py-2.5 text-xs font-bold text-secondary-foreground transition-colors active:bg-muted"
                          >
                            <RefreshCw className="h-3.5 w-3.5" />
                            Update
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit for verification */}
        {isTrader && kycStatus !== "verified" && (
          <button
            onClick={() => toast.success("Verification request submitted!")}
            className="w-full rounded-2xl bg-primary py-3.5 text-sm font-bold text-primary-foreground transition-transform active:scale-[0.98]"
          >
            {kycStatus === "failed" ? "Re-submit for Verification" : "Request Verification"}
          </button>
        )}

        {!isTrader && kycStatus !== "verified" && (
          <button
            onClick={() => toast.success("Verification started (demo)")}
            className="w-full rounded-2xl bg-primary py-3.5 text-sm font-bold text-primary-foreground transition-transform active:scale-[0.98]"
          >
            {kycStatus === "failed" ? "Re-submit Documents" : "Start Verification"}
          </button>
        )}

        {/* Help note */}
        <div className="flex items-start gap-2 rounded-2xl bg-accent/50 p-4">
          <Shield className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            {isTrader
              ? (isAgency 
                ? "Company documents are stored securely and verified for compliance. Keep certificates and insurance up-to-date to avoid service interruptions."
                : "Your documents are stored securely and verified for compliance. Keep certificates up-to-date to maintain your verified status.")
              : "Your documents are stored securely and only used to verify your identity in compliance with Dutch regulations (Wwft)."}
          </p>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Verification;
