import MobileLayout from "@/components/layout/MobileLayout";
import { ArrowLeft, Smartphone, ShieldCheck, ShieldOff, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";

const TwoFactorAuth = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [factorData, setFactorData] = useState<{ qr: string; secret: string; factorId: string } | null>(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [checking, setChecking] = useState(true);

  // Check existing factors
  useState(() => {
    const check = async () => {
      const { data } = await supabase.auth.mfa.listFactors();
      const totp = data?.totp?.find((f) => f.status === "verified");
      if (totp) setIsEnrolled(true);
      setChecking(false);
    };
    check();
  });

  const handleEnroll = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.mfa.enroll({ factorType: "totp", friendlyName: "truFindo App" });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    if (data) {
      setFactorData({ qr: data.totp.qr_code, secret: data.totp.secret, factorId: data.id });
    }
  };

  const handleVerify = async () => {
    if (!factorData) return;
    setVerifying(true);
    const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId: factorData.factorId });
    if (challengeError) {
      toast({ title: "Error", description: challengeError.message, variant: "destructive" });
      setVerifying(false);
      return;
    }
    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId: factorData.factorId,
      challengeId: challenge.id,
      code: verifyCode,
    });
    setVerifying(false);
    if (verifyError) {
      toast({ title: "Invalid code", description: "Please check and try again.", variant: "destructive" });
    } else {
      toast({ title: "2FA Enabled", description: "Two-factor authentication is now active." });
      setIsEnrolled(true);
      setFactorData(null);
    }
  };

  const handleUnenroll = async () => {
    const { data } = await supabase.auth.mfa.listFactors();
    const totp = data?.totp?.find((f) => f.status === "verified");
    if (!totp) return;
    setLoading(true);
    const { error } = await supabase.auth.mfa.unenroll({ factorId: totp.id });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "2FA Disabled", description: "Two-factor authentication has been removed." });
      setIsEnrolled(false);
    }
  };

  return (
    <MobileLayout>
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <button onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5 text-foreground" /></button>
        <h1 className="text-lg font-bold text-foreground font-heading">Two-Factor Authentication</h1>
      </div>

      <div className="px-4 py-5 flex flex-col gap-5">
        {/* Status card */}
        <div className="flex items-center gap-4 rounded-2xl bg-card p-4 card-shadow">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${isEnrolled ? "bg-success/20" : "bg-accent"}`}>
            {isEnrolled ? <ShieldCheck className="h-6 w-6 text-success" /> : <ShieldOff className="h-6 w-6 text-muted-foreground" />}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">{isEnrolled ? "2FA is enabled" : "2FA is disabled"}</p>
            <p className="text-[11px] text-muted-foreground">
              {isEnrolled ? "Your account has an extra layer of security" : "Enable 2FA for better account protection"}
            </p>
          </div>
        </div>

        {/* Info banner */}
        <div className="flex items-start gap-3 rounded-xl bg-accent/50 p-3">
          <Info className="h-4 w-4 mt-0.5 text-primary shrink-0" />
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Two-factor authentication adds security by requiring a code from an authenticator app (like Google Authenticator or Authy) each time you sign in.
          </p>
        </div>

        {!checking && !factorData && (
          <>
            {!isEnrolled ? (
              <button
                onClick={handleEnroll}
                disabled={loading}
                className="rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground transition-transform active:scale-95 disabled:opacity-50"
              >
                {loading ? "Setting up..." : "Enable 2FA"}
              </button>
            ) : (
              <button
                onClick={handleUnenroll}
                disabled={loading}
                className="rounded-xl border border-destructive py-3 text-sm font-bold text-destructive transition-transform active:scale-95 disabled:opacity-50"
              >
                {loading ? "Removing..." : "Disable 2FA"}
              </button>
            )}
          </>
        )}

        {/* QR setup flow */}
        {factorData && (
          <div className="flex flex-col items-center gap-4 rounded-2xl bg-card p-5 card-shadow">
            <p className="text-sm font-semibold text-foreground text-center">
              Scan this QR code with your authenticator app
            </p>
            <div className="rounded-xl bg-background p-3">
              <img src={factorData.qr} alt="2FA QR Code" className="h-48 w-48" />
            </div>
            <div className="w-full">
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Or enter manually
              </label>
              <p className="rounded-lg bg-muted px-3 py-2 text-xs font-mono text-foreground break-all select-all">
                {factorData.secret}
              </p>
            </div>
            <div className="w-full">
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Enter verification code
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="w-full rounded-xl bg-muted px-4 py-3 text-center text-lg font-bold tracking-[0.3em] text-foreground placeholder:text-muted-foreground outline-none border border-border focus:border-primary transition-colors"
              />
            </div>
            <button
              onClick={handleVerify}
              disabled={verifying || verifyCode.length !== 6}
              className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground transition-transform active:scale-95 disabled:opacity-50"
            >
              {verifying ? "Verifying..." : "Verify & Enable"}
            </button>
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default TwoFactorAuth;
