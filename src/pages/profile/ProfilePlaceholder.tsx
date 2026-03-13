import MobileLayout from "@/components/layout/MobileLayout";
import { ArrowLeft, Construction } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const titles: Record<string, string> = {
  "/profile/earnings": "Earnings & Payouts",
  "/profile/language": "Language & Region",
  "/profile/favourites": "Saved Traders",
  "/profile/help": "Help Centre",
  "/profile/feedback": "Give Feedback",
  "/profile/legal": "Legal",
  "/profile/edit": "Edit Profile",
};

const ProfilePlaceholder = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const title = titles[pathname] || "Profile";

  return (
    <MobileLayout>
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <button onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5 text-foreground" /></button>
        <h1 className="text-lg font-bold text-foreground font-heading">{title}</h1>
      </div>
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent">
          <Construction className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-lg font-bold text-foreground">Coming Soon</h2>
        <p className="text-sm text-muted-foreground max-w-xs">
          This feature is under development and will be available shortly.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="mt-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-transform active:scale-95"
        >
          Go Back
        </button>
      </div>
    </MobileLayout>
  );
};

export default ProfilePlaceholder;
