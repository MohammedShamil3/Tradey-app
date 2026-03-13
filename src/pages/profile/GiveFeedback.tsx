import MobileLayout from "@/components/layout/MobileLayout";
import { ArrowLeft, Star, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

const GiveFeedback = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!user || rating === 0 || !message.trim()) return;
    setSubmitting(true);
    const { error } = await supabase.from("feedback").insert({
      user_id: user.id,
      rating,
      message: message.trim(),
    });
    setSubmitting(false);
    if (!error) {
      setSubmitted(true);
      toast({ title: "Thank you!", description: "Your feedback has been submitted." });
    } else {
      toast({ title: "Error", description: "Could not submit feedback.", variant: "destructive" });
    }
  };

  return (
    <MobileLayout>
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground font-heading">Give Feedback</h1>
      </div>

      <div className="px-4 py-6">
        {submitted ? (
          <div className="flex flex-col items-center text-center py-12 gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <span className="text-3xl">🎉</span>
            </div>
            <h2 className="text-lg font-bold text-foreground">Thanks for your feedback!</h2>
            <p className="text-sm text-muted-foreground max-w-xs">
              Your input helps us improve truFindo for everyone.
            </p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-transform active:scale-95"
            >
              Go Back
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Rating */}
            <div>
              <label className="mb-3 block text-sm font-bold text-foreground">
                How would you rate your experience?
              </label>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="transition-transform active:scale-90"
                  >
                    <Star
                      className={`h-10 w-10 ${
                        star <= (hoverRating || rating)
                          ? "fill-star text-star"
                          : "text-muted-foreground/30"
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  {["", "Poor", "Fair", "Good", "Great", "Excellent"][rating]}
                </p>
              )}
            </div>

            {/* Message */}
            <div>
              <label className="mb-2 block text-sm font-bold text-foreground">
                Tell us more
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What went well? What could be improved?"
                rows={5}
                maxLength={1000}
                className="w-full rounded-xl bg-muted px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none border border-border focus:border-primary transition-colors resize-none"
              />
              <p className="mt-1 text-right text-[10px] text-muted-foreground">{message.length}/1000</p>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={rating === 0 || !message.trim() || submitting}
              className="flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground transition-transform active:scale-95 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {submitting ? "Submitting..." : "Submit Feedback"}
            </button>
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default GiveFeedback;
