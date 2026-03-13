import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Home, Wrench } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const RoleSelection = () => {
  const navigate = useNavigate();
  const { user, updateProfile, refreshProfile } = useAuth();
  const [selected, setSelected] = useState<"customer" | "trader" | null>(null);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!selected || !user) return;
    setLoading(true);

    const { error } = await updateProfile({
      role: selected,
      onboarding_status: "profile_setup",
    });

    if (!error) {
      await supabase.from("user_roles").upsert({
        user_id: user.id,
        role: selected,
      });
    }

    setLoading(false);
    if (error) {
      toast.error("Something went wrong. Please try again.");
    } else {
      await refreshProfile();
      navigate("/onboarding/profile", { replace: true });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      <div className="relative mx-auto w-full max-w-[390px] h-[844px] rounded-[3rem] border-[6px] border-foreground/90 bg-background shadow-2xl overflow-hidden">
        <div className="absolute left-1/2 top-0 z-50 -translate-x-1/2">
          <div className="h-[34px] w-[126px] rounded-b-[1.2rem] bg-foreground/90" />
        </div>

        <div className="flex h-full flex-col px-6 pt-14">
          <h1 className="mb-1 text-2xl font-bold text-foreground font-heading">Who are you?</h1>
          <p className="mb-2 text-sm text-muted-foreground">Choose your role to continue</p>

          <div className="mb-8 flex gap-2">
            <div className="h-1 flex-1 rounded-full bg-primary" />
            <div className="h-1 flex-1 rounded-full bg-primary" />
            <div className="h-1 flex-1 rounded-full bg-muted" />
          </div>

          <div className="flex flex-1 flex-col gap-4">
            <button
              onClick={() => setSelected("customer")}
              className={`flex items-start gap-4 rounded-2xl border-2 p-5 text-left transition-all active:scale-[0.98] ${
                selected === "customer"
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border bg-card"
              }`}
            >
              <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${
                selected === "customer" ? "bg-primary" : "bg-muted"
              }`}>
                <Home className={`h-7 w-7 ${selected === "customer" ? "text-primary-foreground" : "text-muted-foreground"}`} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">I'm looking for a tradesman</h3>
                <p className="mt-1 text-sm text-muted-foreground">Book services and find reliable tradesmen near you</p>
              </div>
            </button>

            <button
              onClick={() => setSelected("trader")}
              className={`flex items-start gap-4 rounded-2xl border-2 p-5 text-left transition-all active:scale-[0.98] ${
                selected === "trader"
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border bg-card"
              }`}
            >
              <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${
                selected === "trader" ? "bg-primary" : "bg-muted"
              }`}>
                <Wrench className={`h-7 w-7 ${selected === "trader" ? "text-primary-foreground" : "text-muted-foreground"}`} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">I offer services</h3>
                <p className="mt-1 text-sm text-muted-foreground">Find jobs, create quotes and grow your business</p>
              </div>
            </button>
          </div>

          <div className="pb-12">
            <button
              onClick={handleContinue}
              disabled={!selected || loading}
              className="w-full rounded-2xl bg-primary py-4 text-base font-bold text-primary-foreground transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Loading..." : "Continue"}
            </button>
          </div>
        </div>

        <div className="absolute bottom-2 left-1/2 z-50 h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-foreground/30" />
      </div>
    </div>
  );
};

export default RoleSelection;
