import MobileLayout from "@/components/layout/MobileLayout";
import HorizontalScroll from "@/components/ui/HorizontalScroll";
import { useNavigate, useParams } from "react-router-dom";
import { bundles } from "@/components/home/ServiceBundles";
import { ArrowLeft, Calendar, Clock, MapPin, CheckCircle2, Star, ShoppingCart } from "lucide-react";
import PaymentStep from "@/components/booking/PaymentStep";
import AddressStep from "@/components/booking/AddressStep";
import { useState } from "react";
import { format, addDays } from "date-fns";
import { toast } from "sonner";

const timeSlots = [
  "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
];

const TOTAL_STEPS = 4;

const BundleDetail = () => {
  const { bundleId } = useParams();
  const navigate = useNavigate();
  const bundle = bundles.find((b) => b.id === bundleId);

  const [step, setStep] = useState(0); // 0 = detail view, 1-4 = booking steps
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [address, setAddress] = useState({ street: "", city: "", postcode: "" });
  const [notes, setNotes] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

  if (!bundle) {
    return (
      <MobileLayout>
        <div className="flex flex-col items-center justify-center px-4 pt-20 text-center">
          <p className="text-lg font-bold text-foreground">Bundle not found</p>
          <button onClick={() => navigate(-1)} className="mt-4 text-sm font-semibold text-primary">Go back</button>
        </div>
      </MobileLayout>
    );
  }

  const originalPrice = bundle.services.reduce((a, s) => a + s.price, 0);
  const availableDates = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i + 1));

  const handleConfirm = () => {
    toast.success("Bundle Booked! 🎉", {
      description: `${bundle.services.length} services booked for ${format(selectedDate!, "PPP")} at ${selectedTime}. You'll be matched with the best traders.`,
    });
    navigate("/bookings", { replace: true });
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
    else navigate(-1);
  };

  // Step 0: Bundle detail view
  if (step === 0) {
    return (
      <MobileLayout>
        <div className="pb-6">
          {/* Header */}
          <div className="bg-gradient-to-br from-primary/10 to-accent/30 relative pb-6 pt-6 px-4">
            <button
              onClick={() => navigate(-1)}
              className="absolute left-4 top-6 flex h-9 w-9 items-center justify-center rounded-full bg-card/80 backdrop-blur-sm"
            >
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </button>

            <div className="flex flex-col items-center pt-8 text-center">
              <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-white">
                <bundle.icon size={36} weight="duotone" className={bundle.iconColor.color} />
              </div>
              <h1 className="text-xl font-extrabold text-foreground font-heading">{bundle.name}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{bundle.tagline}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-2xl font-extrabold text-primary">€{bundle.totalPrice}</span>
                <span className="text-sm text-muted-foreground line-through">€{originalPrice}</span>
                <span className="rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                  {bundle.savings}
                </span>
              </div>
            </div>
          </div>

          {/* What's included */}
          <div className="px-4 mt-5">
            <h3 className="mb-3 text-base font-bold text-foreground font-heading">What's Included</h3>
            <div className="flex flex-col gap-2">
              {bundle.services.map((svc, i) => {
                const SvcIcon = svc.icon;
                return (
                  <div key={i} className="flex items-center gap-3 rounded-2xl bg-card p-4 card-shadow">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent">
                      <SvcIcon size={22} weight="duotone" className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-foreground font-sans">{svc.name}</h4>
                      <p className="text-[11px] text-muted-foreground">Performed by a verified specialist</p>
                    </div>
                    <span className="text-sm font-bold text-primary">€{svc.price}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* How it works */}
          <div className="px-4 mt-6">
            <h3 className="mb-3 text-base font-bold text-foreground font-heading">How It Works</h3>
            <div className="flex flex-col gap-3">
              {[
                { step: "1", title: "Book the Bundle", desc: "All services are booked at once with one payment." },
                { step: "2", title: "Get Matched", desc: "We assign the best verified trader for each service." },
                { step: "3", title: "Flexible Scheduling", desc: "Each service is scheduled separately at your convenience." },
                { step: "4", title: "Quality Guaranteed", desc: "All work is covered by our satisfaction guarantee." },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground font-sans">{item.title}</h4>
                    <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="px-4 mt-6">
            <button
              onClick={() => setStep(1)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground transition-transform active:scale-95"
            >
              <ShoppingCart className="h-4 w-4" />
              Book Bundle — €{bundle.totalPrice}
            </button>
          </div>
        </div>
      </MobileLayout>
    );
  }

  // Booking flow (steps 1-4)
  return (
    <MobileLayout>
      <div className="px-4 pt-6">
        {/* Header */}
        <div className="mb-5 flex items-center gap-3">
          <button
            onClick={handleBack}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-foreground font-heading">Book Bundle</h1>
            <p className="text-xs text-muted-foreground">Step {step} of {TOTAL_STEPS}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6 flex gap-2">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((s) => (
            <div key={s} className={`h-1 flex-1 rounded-full transition-all ${s <= step ? "bg-primary" : "bg-muted"}`} />
          ))}
        </div>

        {/* Bundle summary */}
        <div className="mb-6 flex items-center gap-3 rounded-2xl bg-card p-4 card-shadow">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <bundle.icon size={26} weight="duotone" className="text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-foreground font-sans">{bundle.name}</h3>
            <p className="text-[11px] text-muted-foreground">{bundle.services.length} services included</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-primary">€{bundle.totalPrice}</p>
            <p className="text-[10px] text-muted-foreground line-through">€{originalPrice}</p>
          </div>
        </div>

        {/* Step 1: Date & Time */}
        {step === 1 && (
          <div className="flex flex-col gap-5">
            <div>
              <HorizontalScroll
                className="gap-2"
                title={
                  <h3 className="flex items-center gap-2 font-bold text-foreground">
                    <Calendar className="h-5 w-5 text-primary" />
                    Select Date
                  </h3>
                }
                subtitle="Choose when the first service starts"
              >
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

        {/* Step 2: Address */}
        {step === 2 && (
          <AddressStep
            address={address}
            setAddress={setAddress}
            notes={notes}
            setNotes={setNotes}
            onContinue={() => setStep(3)}
            subtitle="All services in this bundle will be performed at this address"
          />
        )}

        {/* Step 3: Payment Method */}
        {step === 3 && (
          <PaymentStep
            selectedPayment={selectedPayment}
            onPaymentSelect={setSelectedPayment}
            onContinue={() => setStep(4)}
            amount={bundle.totalPrice}
            currency="€"
            label="this bundle"
          />
        )}

        {/* Step 4: Review & Confirm */}
        {step === 4 && (
          <div className="flex flex-col gap-4">
            <h3 className="flex items-center gap-2 font-bold text-foreground">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Review & Confirm
            </h3>

            <div className="flex flex-col gap-3 rounded-2xl bg-card p-5 card-shadow">
              <div className="flex justify-between border-b border-border pb-3">
                <span className="text-sm text-muted-foreground">Bundle</span>
                <span className="text-sm font-bold text-foreground">{bundle.name}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-3">
                <span className="text-sm text-muted-foreground">Services</span>
                <span className="text-sm font-bold text-foreground">{bundle.services.length} included</span>
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

              {/* Services breakdown */}
              <div className="pt-2">
                <p className="text-xs font-semibold text-muted-foreground mb-2">Services breakdown</p>
                {bundle.services.map((svc, i) => {
                  const SvcIcon = svc.icon;
                  return (
                    <div key={i} className="flex justify-between py-1">
                      <span className="text-xs text-foreground flex items-center gap-1.5">
                        <SvcIcon size={14} weight="duotone" className="text-muted-foreground" /> {svc.name}
                      </span>
                      <span className="text-xs text-muted-foreground">€{svc.price}</span>
                    </div>
                  );
                })}
                <div className="flex justify-between border-t border-border mt-2 pt-2">
                  <span className="text-xs text-muted-foreground">Subtotal</span>
                  <span className="text-xs text-muted-foreground line-through">€{originalPrice}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-xs font-semibold text-primary">{bundle.savings}</span>
                  <span className="text-xs font-semibold text-primary">−€{originalPrice - bundle.totalPrice}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-xs text-foreground">Discounted price (excl. BTW)</span>
                  <span className="text-xs text-muted-foreground">€{(bundle.totalPrice / 1.21).toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-xs text-foreground">BTW (21%)</span>
                  <span className="text-xs text-muted-foreground">€{(bundle.totalPrice - bundle.totalPrice / 1.21).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between pt-2 border-t border-border">
                <div>
                  <span className="text-base font-bold text-foreground">Total</span>
                  <p className="text-[10px] text-muted-foreground">Incl. 21% BTW</p>
                </div>
                <span className="text-xl font-bold text-primary">€{bundle.totalPrice}</span>
              </div>
            </div>

            <div className="rounded-2xl bg-accent/50 p-4">
              <div className="flex items-start gap-3">
                <Star className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-bold text-foreground font-sans">Escrow Protection</p>
                  <p className="text-xs text-muted-foreground">
                    Your payment is held securely until each service is completed to your satisfaction.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleConfirm}
              className="mt-2 w-full rounded-2xl bg-primary py-4 text-base font-bold text-primary-foreground transition-all active:scale-[0.98]"
            >
              Confirm & Pay €{bundle.totalPrice}
            </button>
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default BundleDetail;
