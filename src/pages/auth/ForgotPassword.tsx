import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Mail } from "lucide-react";
import { toast } from "sonner";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      setSent(true);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      <div className="relative mx-auto w-full max-w-[390px] h-[844px] rounded-[3rem] border-[6px] border-foreground/90 bg-background shadow-2xl overflow-hidden">
        <div className="absolute left-1/2 top-0 z-50 -translate-x-1/2">
          <div className="h-[34px] w-[126px] rounded-b-[1.2rem] bg-foreground/90" />
        </div>

        <div className="flex h-full flex-col px-6 pt-14">
          <button onClick={() => navigate("/auth/signin")} className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>

          <h1 className="mb-1 text-2xl font-bold text-foreground font-heading">Forgot Password</h1>
          <p className="mb-8 text-sm text-muted-foreground">
            {sent ? "We've sent a recovery link to your email." : "Enter your email address to reset your password."}
          </p>

          {!sent ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-primary py-4 text-base font-bold text-primary-foreground transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Recovery Link"}
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center gap-4 pt-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <p className="text-center text-sm text-muted-foreground">Check your inbox and click the link to reset your password.</p>
              <button onClick={() => navigate("/auth/signin")} className="mt-4 font-bold text-primary">
                Back to Sign In
              </button>
            </div>
          )}
        </div>

        <div className="absolute bottom-2 left-1/2 z-50 h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-foreground/30" />
      </div>
    </div>
  );
};

export default ForgotPassword;
