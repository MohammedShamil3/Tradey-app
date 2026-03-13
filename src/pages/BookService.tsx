import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import HorizontalScroll from "@/components/ui/HorizontalScroll";
import { getServiceById, getTradersByCategory, traders as allTraders, Trader } from "@/data/services";
import { ArrowLeft, Calendar, Clock, MapPin, Star, CheckCircle2, User, BadgeCheck, Shuffle, Search, X, ChevronDown } from "lucide-react";
import { serviceIconMap, iconMap, getServiceColors } from "@/lib/icons";
import Avatar from "boring-avatars";

const avatarPalette = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8"];
import PaymentStep from "@/components/booking/PaymentStep";
import AddressStep from "@/components/booking/AddressStep";
import { format, addDays } from "date-fns";
import { toast } from "sonner";

const timeSlots = [
  "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
];

const TOTAL_STEPS = 5;

const BookService = () => {
  const { serviceId } = useParams();
  const [searchParams] = useSearchParams();
  const preselectedTraderId = searchParams.get("trader");
  const navigate = useNavigate();
  const service = getServiceById(serviceId || "");

  const preselectedTrader = preselectedTraderId
    ? allTraders.find((t) => t.id === preselectedTraderId) || null
    : null;

  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [address, setAddress] = useState({ street: "", city: "", postcode: "" });
  const [notes, setNotes] = useState("");
  const [selectedTrader, setSelectedTrader] = useState<Trader | null>(preselectedTrader);
  const [traderMode, setTraderMode] = useState<"choose" | "auto">(preselectedTrader ? "choose" : "auto");
  const [traderSearch, setTraderSearch] = useState("");
  const [pickExpanded, setPickExpanded] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

  if (!service) {
    return (
      <MobileLayout>
        <div className="flex flex-col items-center justify-center px-4 pt-20">
          <p className="text-foreground font-bold">Service not found</p>
          <button onClick={() => navigate("/services")} className="mt-4 text-sm text-primary font-bold">
            Back to services
          </button>
        </div>
      </MobileLayout>
    );
  }

  const traders = getTradersByCategory(service.categoryId);
  const topTraders = [...traders].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews).slice(0, 5);
  const availableDates = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i + 1));

  const handleConfirm = () => {
    const traderName = traderMode === "auto" ? "Best available" : selectedTrader?.name.split(" ")[0];
    toast.success("Booking confirmed! 🎉", {
      description: `${service.name} on ${format(selectedDate!, "PPP")} at ${selectedTime} with ${traderName}`,
    });
    navigate("/bookings", { replace: true });
  };


  return (
    <MobileLayout>
      <div className="px-4 pt-6">
        {/* Header */}
        <div className="mb-5 flex items-center gap-3">
          <button
            onClick={() => (step > 1 ? setStep(step - 1) : navigate(-1))}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-foreground font-heading">Book Service</h1>
            <p className="text-xs text-muted-foreground">Step {step} of {TOTAL_STEPS}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6 flex gap-2">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((s) => (
            <div key={s} className={`h-1 flex-1 rounded-full transition-all ${s <= step ? "bg-primary" : "bg-muted"}`} />
          ))}
        </div>

        {/* Service summary card */}
        <div className="mb-6 flex items-center gap-4 rounded-2xl bg-card p-4 card-shadow">
          {(() => {
            const iconName = serviceIconMap[service.id] || "wrench";
            const SvcIcon = iconMap[iconName];
            const colors = getServiceColors(service.id);
            return (
              <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${colors.bg} bg-opacity-40`}>
                <SvcIcon size={28} weight="regular" className={colors.color} />
              </div>
            );
          })()}
          <div className="flex-1">
            <h3 className="font-bold text-foreground">{service.name}</h3>
            <p className="text-xs text-muted-foreground">{service.description}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-primary">£{service.price}</p>
            <p className="text-xs text-muted-foreground">{service.duration}</p>
          </div>
        </div>

        {/* Step 1: Date & Time */}
        {step === 1 && (
          <div className="flex flex-col gap-5">
            <div>
              <HorizontalScroll className="gap-2" title={<h3 className="flex items-center gap-2 font-bold text-foreground"><Calendar className="h-5 w-5 text-primary" />Select Date</h3>} subtitle="Choose your preferred date">
                {availableDates.map((date) => {
                  const isSelected = selectedDate && format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
                  return (
                    <button
                      key={date.toISOString()}
                      onClick={() => setSelectedDate(date)}
                      className={`flex shrink-0 flex-col items-center rounded-2xl px-4 py-3 transition-all ${
                        isSelected
                          ? "bg-primary text-primary-foreground chip-active-shadow"
                          : "bg-card text-foreground card-shadow"
                      }`}
                    >
                      <span className="text-[10px] font-semibold uppercase">{format(date, "EEE")}</span>
                      <span className="text-lg font-bold">{format(date, "d")}</span>
                      <span className="text-[10px]">{format(date, "MMM")}</span>
                    </button>
                  );
                })}
              </HorizontalScroll>
            </div>

            <div>
              <h3 className="mb-3 flex items-center gap-2 font-bold text-foreground">
                <Clock className="h-5 w-5 text-primary" />
                Select Time
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`rounded-xl py-3 text-sm font-semibold transition-all ${
                      selectedTime === time
                        ? "bg-primary text-primary-foreground chip-active-shadow"
                        : "bg-card text-foreground card-shadow"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!selectedDate || !selectedTime}
              className="mt-2 w-full rounded-2xl bg-primary py-4 text-base font-bold text-primary-foreground transition-all active:scale-[0.98] disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Choose Trader */}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            <h3 className="flex items-center gap-2 font-bold text-foreground">
              <User className="h-5 w-5 text-primary" />
              Choose Your Trader
            </h3>
            <p className="text-xs text-muted-foreground -mt-2">
              Pick a preferred trader or let us assign the best available one for you
            </p>

            {/* Auto-assign option */}
            <button
              onClick={() => { setTraderMode("auto"); setSelectedTrader(null); }}
              className={`flex items-center gap-3 rounded-2xl p-4 transition-all active:scale-[0.98] ${
                traderMode === "auto"
                  ? "bg-primary/10 border-2 border-primary"
                  : "bg-card card-shadow border-2 border-transparent"
              }`}
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent">
                <Shuffle className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <h4 className="text-sm font-bold text-foreground">Best Available</h4>
                <p className="text-[11px] text-muted-foreground">We'll assign the top-rated available trader for your job</p>
              </div>
              {traderMode === "auto" && (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
              )}
            </button>

            {/* Pick a trader - collapsible card */}
            <div
              className={`rounded-2xl transition-all overflow-hidden ${
                traderMode === "choose" && selectedTrader
                  ? "bg-primary/10 border-2 border-primary"
                  : "bg-card card-shadow border-2 border-transparent"
              }`}
            >
              {/* Collapsed header — same height as Best Available */}
              <button
                onClick={() => {
                  setPickExpanded(!pickExpanded);
                  if (!pickExpanded) setTraderMode("choose");
                }}
                className="flex w-full items-center gap-3 p-4 text-left"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-foreground">
                    {selectedTrader ? selectedTrader.name.split(" ")[0] : "Pick a Trader"}
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    {selectedTrader
                      ? `★ ${selectedTrader.rating} • ${selectedTrader.experience} exp`
                      : "Choose your preferred professional"}
                  </p>
                </div>
                {traderMode === "choose" && selectedTrader && (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                )}
                <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${pickExpanded ? "rotate-180" : ""}`} />
              </button>

              {/* Expanded content */}
              {pickExpanded && (
                <div className="px-4 pb-4 flex flex-col gap-3">
                  {/* Search */}
                  <div className="flex items-center gap-2 rounded-xl bg-accent px-3 py-2.5">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search traders..."
                      value={traderSearch}
                      onChange={(e) => setTraderSearch(e.target.value)}
                      className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                    />
                    {traderSearch && (
                      <button onClick={() => setTraderSearch("")}>
                        <X className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                    )}
                  </div>

                  {/* Traders horizontal scroll */}
                  <HorizontalScroll title={<h4 className="text-sm font-bold text-foreground">Available Traders</h4>} subtitle="Swipe to browse">
                    {topTraders
                      .filter(t => !traderSearch.trim() || t.name.toLowerCase().includes(traderSearch.toLowerCase()))
                      .map((trader) => {
                        const isSelected = traderMode === "choose" && selectedTrader?.id === trader.id;
                        return (
                          <button
                            key={trader.id}
                            onClick={() => { setTraderMode("choose"); setSelectedTrader(trader); }}
                            className={`flex shrink-0 flex-col items-center gap-1.5 rounded-2xl p-3 w-[110px] transition-all active:scale-[0.97] ${
                              isSelected
                                ? "bg-primary/20 border-2 border-primary"
                                : "bg-accent border-2 border-transparent"
                            }`}
                          >
                            <Avatar size={48} name={trader.name} variant="beam" colors={avatarPalette} />
                            <span className="text-xs font-bold text-foreground truncate w-full text-center">{trader.name.split(" ")[0]}</span>
                            <div className="flex items-center gap-0.5 text-[10px]">
                              <Star className="h-2.5 w-2.5 fill-star text-star" />
                              <span className="font-semibold text-foreground">{trader.rating}</span>
                            </div>
                            {isSelected && (
                              <CheckCircle2 className="h-4 w-4 text-primary" />
                            )}
                          </button>
                        );
                      })}
                  </HorizontalScroll>
                </div>
              )}
            </div>

            <button
              onClick={() => setStep(3)}
              disabled={traderMode === "choose" && !selectedTrader}
              className="mt-2 w-full rounded-2xl bg-primary py-4 text-base font-bold text-primary-foreground transition-all active:scale-[0.98] disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 3: Address */}
        {step === 3 && (
          <AddressStep
            address={address}
            setAddress={setAddress}
            notes={notes}
            setNotes={setNotes}
            onContinue={() => setStep(4)}
          />
        )}

        {/* Step 4: Payment Method */}
        {step === 4 && (
          <PaymentStep
            selectedPayment={selectedPayment}
            onPaymentSelect={setSelectedPayment}
            onContinue={() => setStep(5)}
            amount={service.price}
            currency="£"
            label="this service"
          />
        )}

        {/* Step 5: Confirmation */}
        {step === 5 && (
          <div className="flex flex-col gap-4">
            <h3 className="flex items-center gap-2 font-bold text-foreground">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Review & Confirm
            </h3>

            <div className="flex flex-col gap-3 rounded-2xl bg-card p-5 card-shadow">
              <div className="flex justify-between border-b border-border pb-3">
                <span className="text-sm text-muted-foreground">Service</span>
                <span className="text-sm font-bold text-foreground">{service.name}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-3">
                <span className="text-sm text-muted-foreground">Date</span>
                <span className="text-sm font-bold text-foreground">{selectedDate && format(selectedDate, "PPP")}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-3">
                <span className="text-sm text-muted-foreground">Time</span>
                <span className="text-sm font-bold text-foreground">{selectedTime}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-3">
                <span className="text-sm text-muted-foreground">Trader</span>
                <span className="text-sm font-bold text-foreground">
                  {traderMode === "auto" ? "Best Available" : selectedTrader?.name.split(" ")[0]}
                </span>
              </div>
              <div className="flex justify-between border-b border-border pb-3">
                <span className="text-sm text-muted-foreground">Address</span>
                <span className="text-right text-sm font-bold text-foreground">
                  {address.street}<br />{address.postcode} {address.city}
                </span>
              </div>
              <div className="flex justify-between border-b border-border pb-3">
                <span className="text-sm text-muted-foreground">Payment</span>
                <span className="text-sm font-bold text-foreground">
                  {selectedPayment === "ideal" ? "iDEAL" : selectedPayment === "card" ? "Credit / Debit Card" : "Apple Pay"}
                </span>
              </div>
              {notes && (
                <div className="flex justify-between border-b border-border pb-3">
                  <span className="text-sm text-muted-foreground">Notes</span>
                  <span className="max-w-[60%] text-right text-sm text-foreground">{notes}</span>
                </div>
              )}
              {/* Cost breakdown */}
              <div className="pt-2 border-t border-border">
                <p className="text-xs font-semibold text-muted-foreground mb-2">Cost breakdown</p>
                <div className="flex justify-between py-1">
                  <span className="text-xs text-foreground">Service fee (excl. BTW)</span>
                  <span className="text-xs text-muted-foreground">£{(service.price / 1.21).toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-xs text-foreground">BTW (21%)</span>
                  <span className="text-xs text-muted-foreground">£{(service.price - service.price / 1.21).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between pt-2 border-t border-border">
                <div>
                  <span className="text-base font-bold text-foreground">Total</span>
                  <p className="text-[10px] text-muted-foreground">Incl. 21% BTW</p>
                </div>
                <span className="text-xl font-bold text-primary">£{service.price}</span>
              </div>
            </div>

            <div className="rounded-2xl bg-accent/50 p-4">
              <div className="flex items-start gap-3">
                <Star className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-bold text-foreground">Escrow Protection</p>
                  <p className="text-xs text-muted-foreground">
                    Your payment is held securely until the job is completed to your satisfaction.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleConfirm}
              className="mt-2 w-full rounded-2xl bg-primary py-4 text-base font-bold text-primary-foreground transition-all active:scale-[0.98]"
            >
              Confirm & Pay £{service.price}
            </button>
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default BookService;
