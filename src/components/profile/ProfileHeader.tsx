import { ChevronRight, AlertCircle, CheckCircle2 } from "lucide-react";
import AvatarUpload from "./AvatarUpload";

interface ProfileHeaderProps {
  profile: any;
  onEditPress: () => void;
}

const ProfileHeader = ({ profile, onEditPress }: ProfileHeaderProps) => {
  const isVerified = profile?.kyc_status === "verified";
  const completionPercent = getProfileCompletion(profile);

  return (
    <div className="mb-5 rounded-2xl bg-card p-4 card-shadow">
      <div className="flex w-full items-center gap-4 text-left">
        {/* Avatar with upload */}
        <AvatarUpload />

        {/* Info — tapping navigates to edit */}
        <button onClick={onEditPress} className="flex flex-1 items-center gap-2 min-w-0 text-left">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-bold text-foreground truncate">
                {profile?.full_name || "Complete Your Profile"}
              </h2>
              {isVerified && <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />}
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {profile?.email || "Add your details to get started"}
            </p>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
        </button>
      </div>

      {/* Completion bar */}
      {completionPercent < 100 && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5 text-destructive" />
              <span className="text-[10px] font-semibold text-foreground">Profile {completionPercent}% complete</span>
            </div>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

function getProfileCompletion(profile: any): number {
  if (!profile) return 0;
  const fields = ["full_name", "email", "phone", "date_of_birth", "street", "city", "postcode", "avatar_url"];
  const filled = fields.filter((f) => profile[f]).length;
  return Math.round((filled / fields.length) * 100);
}

export default ProfileHeader;
