import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { catBServices } from "@/data/services";
import { ArrowLeft, Camera, MapPin, FileText, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import VoiceNoteRecorder from "@/components/booking/VoiceNoteRecorder";


const PostJob = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedService = searchParams.get("service") || "";

  const [serviceType, setServiceType] = useState(preselectedService);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [expectedDuration, setExpectedDuration] = useState("");
  const [expectedPrice, setExpectedPrice] = useState("");
  const [address, setAddress] = useState({ street: "", city: "", postcode: "" });
  const [photos, setPhotos] = useState<string[]>([]);
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [voiceNote, setVoiceNote] = useState<{ blob: Blob; duration: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedService = catBServices.find((s) => s.id === serviceType);

  const handlePhotoAdd = () => {
    // Mock photo addition
    const mockPhotos = [
      "📸 Photo 1", "📸 Photo 2", "📸 Photo 3",
    ];
    if (photos.length < 5) {
      setPhotos([...photos, mockPhotos[photos.length] || `📸 Photo ${photos.length + 1}`]);
    }
  };

  const handleSubmit = () => {
    if (!title.trim() || !description.trim() || !address.street.trim() || !address.city.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Job posted successfully! 🎉", {
        description: "You'll start receiving quotes from tradesmen soon.",
      });
      navigate("/jobs", { replace: true });
    }, 1000);
  };

  return (
    <MobileLayout>
      <div className="px-4 pt-6">
        {/* Header */}
        <div className="mb-5 flex items-center gap-3">
          <button
            onClick={() => navigate("/services")}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-foreground font-heading">Post a Job</h1>
            <p className="text-xs text-muted-foreground">Describe your project to get quotes</p>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {/* Service type selector */}
          {!preselectedService && (
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Service type</label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full rounded-2xl border border-border bg-card px-4 py-3.5 text-sm text-foreground outline-none"
              >
                <option value="">Select a service...</option>
                {catBServices.map((s) => (
                  <option key={s.id} value={s.id}>{s.icon} {s.name}</option>
                ))}
                <option value="other">Other</option>
              </select>
            </div>
          )}

          {selectedService && (
            <div className="flex items-center gap-3 rounded-2xl bg-accent/50 p-3">
              <span className="text-2xl">{selectedService.icon}</span>
              <div>
                <p className="text-sm font-bold text-foreground">{selectedService.name}</p>
                <p className="text-xs text-muted-foreground">{selectedService.description}</p>
              </div>
            </div>
          )}

          {/* Job title */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
              <FileText className="mr-1 inline h-3.5 w-3.5" />
              Job title *
            </label>
            <input
              type="text"
              placeholder="e.g. Bathroom renovation - complete remodel"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-2xl border border-border bg-card px-4 py-3.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Description *</label>
            <textarea
              placeholder="Describe the work you need done in detail. Include dimensions, materials, or any special requirements..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full rounded-2xl border border-border bg-card px-4 py-3.5 text-sm text-foreground outline-none placeholder:text-muted-foreground resize-none"
            />
          </div>

          {/* Photos */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
              <Camera className="mr-1 inline h-3.5 w-3.5" />
              Photos (optional, up to 5)
            </label>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {photos.map((photo, i) => (
                <div key={i} className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-card text-xs card-shadow">
                  {photo}
                </div>
              ))}
              {photos.length < 5 && (
                <button
                  onClick={handlePhotoAdd}
                  className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <Camera className="h-6 w-6" />
                </button>
              )}
            </div>
          </div>

          {/* Expected duration */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
              How long do you think this might take?
            </label>
            <input
              type="text"
              placeholder="e.g. 2-3 days, 1 week, a few hours"
              value={expectedDuration}
              onChange={(e) => setExpectedDuration(e.target.value)}
              className="w-full rounded-2xl border border-border bg-card px-4 py-3.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>

          {/* Expected price */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
              What price are you expecting? (£)
            </label>
            <input
              type="text"
              placeholder="e.g. 500, 1000-1500, Not sure"
              value={expectedPrice}
              onChange={(e) => setExpectedPrice(e.target.value)}
              className="w-full rounded-2xl border border-border bg-card px-4 py-3.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>

          {/* Voice note */}
          <VoiceNoteRecorder
            label="Add a voice note (optional)"
            onRecorded={(blob, duration) => setVoiceNote({ blob, duration })}
          />

          {/* Additional notes */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
              <MessageSquare className="mr-1 inline h-3.5 w-3.5" />
              Additional notes for the trader (optional)
            </label>
            <textarea
              placeholder="Anything else the trader should know? Access instructions, parking, pets, preferred materials..."
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              rows={3}
              className="w-full rounded-2xl border border-border bg-card px-4 py-3.5 text-sm text-foreground outline-none placeholder:text-muted-foreground resize-none"
            />
          </div>

          {/* Address */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
              <MapPin className="mr-1 inline h-3.5 w-3.5" />
              Job location *
            </label>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Street + house number"
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                className="w-full rounded-2xl border border-border bg-card px-4 py-3.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Postcode"
                  value={address.postcode}
                  onChange={(e) => setAddress({ ...address, postcode: e.target.value })}
                  className="flex-1 rounded-2xl border border-border bg-card px-4 py-3.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
                <input
                  type="text"
                  placeholder="City"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="flex-1 rounded-2xl border border-border bg-card px-4 py-3.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mb-4 w-full rounded-2xl bg-primary py-4 text-base font-bold text-primary-foreground transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Posting..." : "Post Job & Get Quotes"}
          </button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default PostJob;
