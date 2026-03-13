import { MapPin, Plus, CheckCircle2, Home, Building2, MessageSquare } from "lucide-react";
import VoiceNoteRecorder from "@/components/booking/VoiceNoteRecorder";
import { useAddressStore, SavedAddress } from "@/stores/addressStore";
import { useState } from "react";

interface AddressStepProps {
  address: { street: string; city: string; postcode: string };
  setAddress: (addr: { street: string; city: string; postcode: string }) => void;
  notes: string;
  setNotes: (notes: string) => void;
  onContinue: () => void;
  subtitle?: string;
}

const AddressStep = ({ address, setAddress, notes, setNotes, onContinue, subtitle }: AddressStepProps) => {
  const { addresses } = useAddressStore();
  const [selectedSavedId, setSelectedSavedId] = useState<string | null>(null);
  const [useManual, setUseManual] = useState(addresses.length === 0);

  const handleSelectSaved = (saved: SavedAddress) => {
    setSelectedSavedId(saved.id);
    setAddress({ street: saved.street, city: saved.city, postcode: saved.postcode });
    setUseManual(false);
  };

  const handleUseManual = () => {
    setSelectedSavedId(null);
    setAddress({ street: "", city: "", postcode: "" });
    setUseManual(true);
  };

  const isValid = address.street.trim() && address.postcode.trim() && address.city.trim();

  const getLabelIcon = (label: string) => {
    if (label === "Home") return Home;
    if (label === "Office") return Building2;
    return MapPin;
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="flex items-center gap-2 font-bold text-foreground">
        <MapPin className="h-5 w-5 text-primary" />
        Service Address
      </h3>
      {subtitle && <p className="text-xs text-muted-foreground -mt-2">{subtitle}</p>}

      {/* Saved addresses */}
      {addresses.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold text-muted-foreground">Saved addresses</p>
          <div className="flex flex-col gap-2">
            {addresses.map((saved) => {
              const isSelected = selectedSavedId === saved.id && !useManual;
              const Icon = getLabelIcon(saved.label);
              return (
                <button
                  key={saved.id}
                  onClick={() => handleSelectSaved(saved)}
                  className={`flex items-center gap-3 rounded-2xl p-3.5 text-left transition-all active:scale-[0.98] ${
                    isSelected
                      ? "bg-primary/10 border-2 border-primary"
                      : "bg-card card-shadow border-2 border-transparent"
                  }`}
                >
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${isSelected ? "bg-primary" : "bg-accent"}`}>
                    <Icon className={`h-4 w-4 ${isSelected ? "text-primary-foreground" : "text-primary"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-semibold text-foreground">{saved.label}</h4>
                      {saved.isDefault && (
                        <span className="rounded-full bg-muted px-1.5 py-0.5 text-[8px] font-bold text-muted-foreground">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground truncate">{saved.street}, {saved.postcode} {saved.city}</p>
                  </div>
                  {isSelected && <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />}
                </button>
              );
            })}
          </div>

          {/* Use different address toggle */}
          <button
            onClick={handleUseManual}
            className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold transition-all ${
              useManual
                ? "bg-primary/10 text-primary border border-primary"
                : "bg-card card-shadow text-foreground border border-transparent"
            }`}
          >
            <Plus className="h-3.5 w-3.5" />
            Use a different address
          </button>
        </div>
      )}

      {/* Manual input */}
      {useManual && (
        <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Street + house number *</label>
            <input
              type="text"
              placeholder="Keizersgracht 123"
              value={address.street}
              onChange={(e) => setAddress({ ...address, street: e.target.value })}
              className="w-full rounded-2xl border border-border bg-card px-4 py-3.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary transition-all"
            />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Postcode *</label>
              <input
                type="text"
                placeholder="1015 CJ"
                value={address.postcode}
                onChange={(e) => setAddress({ ...address, postcode: e.target.value })}
                className="w-full rounded-2xl border border-border bg-card px-4 py-3.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary transition-all"
              />
            </div>
            <div className="flex-1">
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">City *</label>
              <input
                type="text"
                placeholder="Amsterdam"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                className="w-full rounded-2xl border border-border bg-card px-4 py-3.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary transition-all"
              />
            </div>
          </div>
        </div>
      )}

      {/* Voice note */}
      <VoiceNoteRecorder
        label="Add a voice note for the trader (optional)"
        onRecorded={() => {}}
      />

      {/* Notes */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
          <MessageSquare className="mr-1 inline h-3.5 w-3.5" />
          Additional notes for the trader
        </label>
        <textarea
          placeholder="Access instructions, parking, pets, preferred materials, anything else the trader should know..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full rounded-2xl border border-border bg-card px-4 py-3.5 text-sm text-foreground outline-none placeholder:text-muted-foreground resize-none focus:border-primary transition-all"
        />
      </div>

      <button
        onClick={onContinue}
        disabled={!isValid}
        className="mt-2 w-full rounded-2xl bg-primary py-4 text-base font-bold text-primary-foreground transition-all active:scale-[0.98] disabled:opacity-50"
      >
        Continue
      </button>
    </div>
  );
};

export default AddressStep;
