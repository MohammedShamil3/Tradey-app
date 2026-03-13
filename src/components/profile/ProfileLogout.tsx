import { LogOut } from "lucide-react";

interface ProfileLogoutProps {
  onLogout: () => void;
}

const ProfileLogout = ({ onLogout }: ProfileLogoutProps) => {
  return (
    <button
      onClick={onLogout}
      className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-destructive/10 py-3.5 font-semibold text-destructive transition-colors active:bg-destructive/20"
    >
      <LogOut className="h-4.5 w-4.5" />
      Log Out
    </button>
  );
};

export default ProfileLogout;
