import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Lock } from "lucide-react";
import { toast } from "sonner";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.includes("type=recovery")) {
      navigate("/auth/signin", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password changed successfully!");
      navigate("/auth/signin", { replace: true });
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

          <h1 className="mb-1 text-2xl font-bold text-foreground font-heading">New Password</h1>
          <p className="mb-8 text-sm text-muted-foreground">Choose a new password</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5">
              <Lock className="h-5 w-5 text-muted-foreground" />
              <input
                type="password"
                placeholder="New password (min. 8 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5">
              <Lock className="h-5 w-5 text-muted-foreground" />
              <input
                type="password"
                placeholder="Confirm password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-primary py-4 text-base font-bold text-primary-foreground transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Updating..." : "Change Password"}
            </button>
          </form>
        </div>

        <div className="absolute bottom-2 left-1/2 z-50 h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-foreground/30" />
      </div>
    </div>
  );
};

export default ResetPassword;
