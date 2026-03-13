import { Camera, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import Avatar from "boring-avatars";

const avatarPalette = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8"];

const AvatarUpload = () => {
  const { user, profile, updateProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please select an image.", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Too large", description: "Max 5 MB.", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${user.id}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true, contentType: file.type });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
      // Bust cache with timestamp
      const url = `${publicUrl}?t=${Date.now()}`;

      const { error: updateError } = await updateProfile({ avatar_url: url });
      if (updateError) throw updateError;

      toast({ title: "Updated", description: "Profile photo saved." });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message || "Try again.", variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="relative shrink-0">
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="relative flex h-16 w-16 items-center justify-center rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-accent"
      >
        {uploading ? (
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        ) : profile?.avatar_url ? (
          <img src={profile.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
        ) : (
          <Avatar
            size={64}
            name={profile?.full_name || user?.email || "User"}
            variant="beam"
            colors={avatarPalette}
          />
        )}
      </button>
      <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-card shadow">
        <Camera className="h-3 w-3 text-muted-foreground" />
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
};

export default AvatarUpload;
