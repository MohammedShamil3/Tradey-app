import { useState } from "react";
import { CreditCard, Building2, Smartphone, CheckCircle2, Lock, ChevronDown, Shield } from "lucide-react";

const paymentMethods = [
  { id: "ideal", label: "iDEAL", desc: "Pay via your Dutch bank", icon: Building2 },
  { id: "card", label: "Credit / Debit Card", desc: "Visa, Mastercard, Amex", icon: CreditCard },
  { id: "applepay", label: "Apple Pay", desc: "Quick mobile payment", icon: Smartphone },
];

const dutchBanks = [
  { id: "abn", name: "ABN AMRO", color: "bg-[#004C2F]" },
  { id: "ing", name: "ING", color: "bg-[#FF6200]" },
  { id: "rabo", name: "Rabobank", color: "bg-[#0068B4]" },
  { id: "sns", name: "SNS Bank", color: "bg-[#E4003A]" },
  { id: "asn", name: "ASN Bank", color: "bg-[#00A84F]" },
  { id: "triodos", name: "Triodos Bank", color: "bg-[#2E3640]" },
  { id: "knab", name: "Knab", color: "bg-[#FF5F00]" },
  { id: "bunq", name: "bunq", color: "bg-[#30C381]" },
];

interface PaymentStepProps {
  selectedPayment: string | null;
  onPaymentSelect: (id: string) => void;
  onContinue: () => void;
  amount: number;
  currency?: string;
  label?: string;
}

const PaymentStep = ({
  selectedPayment,
  onPaymentSelect,
  onContinue,
  amount,
  currency = "€",
  label = "this service",
}: PaymentStepProps) => {
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [bankDropdownOpen, setBankDropdownOpen] = useState(false);

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const detectCardBrand = (num: string) => {
    const d = num.replace(/\s/g, "");
    if (d.startsWith("4")) return "Visa";
    if (/^5[1-5]/.test(d) || /^2[2-7]/.test(d)) return "Mastercard";
    if (/^3[47]/.test(d)) return "Amex";
    return null;
  };

  const cardBrand = detectCardBrand(cardNumber);
  const cleanCard = cardNumber.replace(/\s/g, "");

  const isCardValid =
    cardName.trim().length >= 2 &&
    cleanCard.length >= 15 &&
    expiry.length === 5 &&
    cvv.length >= 3;

  const isIdealValid = !!selectedBank;

  const canContinue =
    selectedPayment === "card"
      ? isCardValid
      : selectedPayment === "ideal"
      ? isIdealValid
      : selectedPayment === "applepay";

  return (
    <div className="flex flex-col gap-4">
      <h3 className="flex items-center gap-2 font-bold text-foreground">
        <CreditCard className="h-5 w-5 text-primary" />
        Payment Method
      </h3>
      <p className="text-xs text-muted-foreground -mt-2">
        Choose how you'd like to pay for {label}
      </p>

      {/* Amount summary */}
      <div className="flex items-center justify-between rounded-2xl bg-accent/50 p-4">
        <span className="text-sm text-muted-foreground">Amount to pay</span>
        <span className="text-lg font-extrabold text-primary">{currency}{amount}</span>
      </div>

      {/* Payment method selection — compact horizontal scroll */}
      <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedPayment === method.id;
          return (
            <button
              key={method.id}
              onClick={() => onPaymentSelect(method.id)}
              className={`flex shrink-0 flex-col items-center gap-1.5 rounded-2xl p-3 transition-all active:scale-[0.96] ${
                isSelected
                  ? "bg-primary/10 border-2 border-primary"
                  : "bg-card card-shadow border-2 border-transparent"
              }`}
              style={{ width: "calc((100% - 20px) / 2.5)" }}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isSelected ? "bg-primary" : "bg-accent"}`}>
                <Icon className={`h-5 w-5 ${isSelected ? "text-primary-foreground" : "text-primary"}`} />
              </div>
              <span className="text-[11px] font-semibold text-foreground text-center leading-tight">{method.label}</span>
              {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-primary" />}
            </button>
          );
        })}
      </div>

      {/* iDEAL bank selection */}
      {selectedPayment === "ideal" && (
        <div className="flex flex-col gap-3 rounded-2xl bg-card p-4 card-shadow animate-in fade-in slide-in-from-top-2 duration-200">
          <h4 className="text-sm font-bold text-foreground">Select your bank</h4>
          
          <button
            onClick={() => setBankDropdownOpen(!bankDropdownOpen)}
            className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3.5 text-sm"
          >
            {selectedBank ? (
              <div className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${dutchBanks.find(b => b.id === selectedBank)?.color}`} />
                <span className="font-medium text-foreground">{dutchBanks.find(b => b.id === selectedBank)?.name}</span>
              </div>
            ) : (
              <span className="text-muted-foreground">Choose your bank...</span>
            )}
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${bankDropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {bankDropdownOpen && (
            <div className="flex flex-col gap-1 rounded-xl border border-border bg-background p-2 max-h-48 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150">
              {dutchBanks.map((bank) => (
                <button
                  key={bank.id}
                  onClick={() => {
                    setSelectedBank(bank.id);
                    setBankDropdownOpen(false);
                  }}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all ${
                    selectedBank === bank.id ? "bg-primary/10" : "hover:bg-accent"
                  }`}
                >
                  <div className={`h-4 w-4 rounded-full ${bank.color}`} />
                  <span className="text-sm font-medium text-foreground">{bank.name}</span>
                  {selectedBank === bank.id && <CheckCircle2 className="ml-auto h-4 w-4 text-primary" />}
                </button>
              ))}
            </div>
          )}

          <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
            <Lock className="h-3 w-3" />
            You'll be redirected to your bank to authorise the payment
          </p>
        </div>
      )}

      {/* Card details form */}
      {selectedPayment === "card" && (
        <div className="flex flex-col gap-3 rounded-2xl bg-card p-4 card-shadow animate-in fade-in slide-in-from-top-2 duration-200">
          <h4 className="text-sm font-bold text-foreground">Card Details</h4>

          {/* Card number */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Card number</label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                className="w-full rounded-xl border border-border bg-background px-4 py-3.5 pr-20 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                {cardBrand && (
                  <span className="rounded bg-accent px-1.5 py-0.5 text-[10px] font-bold text-foreground">
                    {cardBrand}
                  </span>
                )}
                {cleanCard.length >= 15 && (
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                )}
              </div>
            </div>
          </div>

          {/* Cardholder name */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Cardholder name</label>
            <input
              type="text"
              placeholder="J. van der Berg"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
            />
          </div>

          {/* Expiry + CVV */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Expiry date</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                maxLength={5}
                className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
              />
            </div>
            <div className="w-28">
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">CVV</label>
              <div className="relative">
                <input
                  type="password"
                  inputMode="numeric"
                  placeholder="•••"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  maxLength={4}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                />
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Save card toggle */}
          <label className="flex items-center gap-3 rounded-xl bg-accent/50 px-4 py-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-border text-primary accent-primary" />
            <div>
              <span className="text-xs font-semibold text-foreground">Save card for future payments</span>
              <p className="text-[10px] text-muted-foreground">Securely stored & encrypted</p>
            </div>
          </label>
        </div>
      )}

      {/* Apple Pay info */}
      {selectedPayment === "applepay" && (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-card p-6 card-shadow animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-foreground">
            <Smartphone className="h-7 w-7 text-background" />
          </div>
          <h4 className="text-sm font-bold text-foreground">Apple Pay</h4>
          <p className="text-center text-xs text-muted-foreground leading-relaxed">
            When you confirm, you'll be prompted to authenticate with Face ID or Touch ID to complete the payment of <span className="font-bold text-foreground">{currency}{amount}</span>.
          </p>
          <div className="flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[11px] font-semibold text-foreground">Ready to pay</span>
          </div>
        </div>
      )}

      {/* Security badge */}
      {selectedPayment && (
        <div className="flex items-center gap-2 rounded-xl bg-accent/40 px-4 py-2.5">
          <Shield className="h-4 w-4 text-primary" />
          <p className="text-[11px] text-muted-foreground">
            <span className="font-semibold text-foreground">256-bit SSL encrypted</span> — Your payment details are secure and never stored on our servers.
          </p>
        </div>
      )}

      <button
        onClick={onContinue}
        disabled={!canContinue}
        className="mt-2 w-full rounded-2xl bg-primary py-4 text-base font-bold text-primary-foreground transition-all active:scale-[0.98] disabled:opacity-50"
      >
        Review Booking
      </button>
    </div>
  );
};

export default PaymentStep;
