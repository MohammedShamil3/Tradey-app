import MobileLayout from "@/components/layout/MobileLayout";
import { ArrowLeft, Monitor, Smartphone, Globe, LogOut, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";

const ActiveSessions = () => {
  const navigate = useNavigate();
  const { session, signOut } = useAuth();

  // Supabase doesn't expose a multi-session list via client SDK,
  // so we show the current session info and allow sign-out.
  const currentSession = session;
  const userAgent = navigator.userAgent;

  const getDeviceInfo = () => {
    if (/iPhone|iPad|iPod/.test(userAgent)) return { icon: Smartphone, name: "iOS Device", browser: "Safari" };
    if (/Android/.test(userAgent)) return { icon: Smartphone, name: "Android Device", browser: "Chrome" };
    if (/Mac/.test(userAgent)) return { icon: Monitor, name: "Mac", browser: getBrowser() };
    if (/Windows/.test(userAgent)) return { icon: Monitor, name: "Windows PC", browser: getBrowser() };
    if (/Linux/.test(userAgent)) return { icon: Monitor, name: "Linux", browser: getBrowser() };
    return { icon: Globe, name: "Unknown Device", browser: getBrowser() };
  };

  function getBrowser() {
    if (/Firefox/.test(userAgent)) return "Firefox";
    if (/Edg/.test(userAgent)) return "Edge";
    if (/Chrome/.test(userAgent)) return "Chrome";
    if (/Safari/.test(userAgent)) return "Safari";
    return "Browser";
  }

  const device = getDeviceInfo();
  const DeviceIcon = device.icon;

  const handleSignOutAll = async () => {
    await signOut();
    toast({ title: "Signed out", description: "You have been signed out from all sessions." });
    navigate("/welcome");
  };

  const sessionCreated = currentSession?.user?.last_sign_in_at
    ? new Date(currentSession.user.last_sign_in_at).toLocaleDateString("en-GB", {
        day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
      })
    : "Unknown";

  return (
    <MobileLayout>
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <button onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5 text-foreground" /></button>
        <h1 className="text-lg font-bold text-foreground font-heading">Active Sessions</h1>
      </div>

      <div className="px-4 py-5 flex flex-col gap-5">
        {/* Current session */}
        <div>
          <h3 className="mb-2 px-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Current Session
          </h3>
          <div className="rounded-2xl bg-card p-4 card-shadow">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-success/20">
                <DeviceIcon className="h-5 w-5 text-success" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">{device.name}</p>
                  <span className="rounded-full bg-success/20 px-2 py-0.5 text-[9px] font-bold text-success">Active</span>
                </div>
                <p className="text-[11px] text-muted-foreground">{device.browser}</p>
                <div className="mt-2 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  Last sign-in: {sessionCreated}
                </div>
                {currentSession?.user?.email && (
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    {currentSession.user.email}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Security info */}
        <div className="rounded-xl bg-accent/50 p-4">
          <p className="text-xs font-semibold text-foreground mb-1">Session Security</p>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            For your security, we recommend signing out of devices you no longer use. If you notice any unfamiliar activity, change your password immediately.
          </p>
        </div>

        {/* Sign out all */}
        <button
          onClick={handleSignOutAll}
          className="flex items-center justify-center gap-2 rounded-xl border border-destructive py-3 text-sm font-bold text-destructive transition-transform active:scale-95"
        >
          <LogOut className="h-4 w-4" />
          Sign Out of All Sessions
        </button>
      </div>
    </MobileLayout>
  );
};

export default ActiveSessions;
