import MobileLayout from "@/components/layout/MobileLayout";
import { ArrowLeft, Globe, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

const languages = [
  { code: "en", label: "English", native: "English" },
  { code: "nl", label: "Dutch", native: "Nederlands" },
  { code: "de", label: "German", native: "Deutsch" },
  { code: "fr", label: "French", native: "Français" },
  { code: "es", label: "Spanish", native: "Español" },
  { code: "pt", label: "Portuguese", native: "Português" },
  { code: "it", label: "Italian", native: "Italiano" },
  { code: "pl", label: "Polish", native: "Polski" },
];

const regions = [
  { code: "NL", label: "Netherlands", flag: "🇳🇱", currency: "EUR (€)" },
  { code: "BE", label: "Belgium", flag: "🇧🇪", currency: "EUR (€)" },
  { code: "DE", label: "Germany", flag: "🇩🇪", currency: "EUR (€)" },
  { code: "FR", label: "France", flag: "🇫🇷", currency: "EUR (€)" },
  { code: "GB", label: "United Kingdom", flag: "🇬🇧", currency: "GBP (£)" },
  { code: "IE", label: "Ireland", flag: "🇮🇪", currency: "EUR (€)" },
  { code: "ES", label: "Spain", flag: "🇪🇸", currency: "EUR (€)" },
  { code: "PT", label: "Portugal", flag: "🇵🇹", currency: "EUR (€)" },
];

const LanguageRegion = () => {
  const navigate = useNavigate();
  const [selectedLang, setSelectedLang] = useState("en");
  const [selectedRegion, setSelectedRegion] = useState("NL");

  const handleSave = () => {
    toast({ title: "Saved", description: "Language & region preferences updated." });
    navigate(-1);
  };

  return (
    <MobileLayout>
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground font-heading">Language & Region</h1>
      </div>

      <div className="px-4 py-5 flex flex-col gap-5">
        {/* Language */}
        <div>
          <div className="flex items-center gap-2 mb-2 px-1">
            <Globe className="h-4 w-4 text-primary" />
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Language</h3>
          </div>
          <div className="rounded-2xl bg-card card-shadow overflow-hidden divide-y divide-border">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setSelectedLang(lang.code)}
                className="flex w-full items-center justify-between px-4 py-3.5 text-left active:bg-muted/60 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{lang.label}</p>
                  <p className="text-[10px] text-muted-foreground">{lang.native}</p>
                </div>
                {selectedLang === lang.code && (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                    <Check className="h-3.5 w-3.5 text-primary-foreground" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Region */}
        <div>
          <div className="flex items-center gap-2 mb-2 px-1">
            <span className="text-sm">🌍</span>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Region</h3>
          </div>
          <div className="rounded-2xl bg-card card-shadow overflow-hidden divide-y divide-border">
            {regions.map((region) => (
              <button
                key={region.code}
                onClick={() => setSelectedRegion(region.code)}
                className="flex w-full items-center justify-between px-4 py-3.5 text-left active:bg-muted/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{region.flag}</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{region.label}</p>
                    <p className="text-[10px] text-muted-foreground">{region.currency}</p>
                  </div>
                </div>
                {selectedRegion === region.code && (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                    <Check className="h-3.5 w-3.5 text-primary-foreground" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          className="rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground transition-transform active:scale-95"
        >
          Save Preferences
        </button>
      </div>
    </MobileLayout>
  );
};

export default LanguageRegion;
