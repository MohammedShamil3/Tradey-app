import { useState, useRef, useEffect } from "react";
import { Mic, Square, Play, Pause, Trash2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface VoiceNoteRecorderProps {
  onRecorded?: (blob: Blob, duration: string) => void;
  label?: string;
}

const VoiceNoteRecorder = ({ onRecorded, label = "Add a voice note" }: VoiceNoteRecorderProps) => {
  const [state, setState] = useState<"idle" | "recording" | "recorded" | "playing">("idle");
  const [duration, setDuration] = useState(0);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioBlobRef = useRef<Blob | null>(null);
  const playTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (playTimerRef.current) clearInterval(playTimerRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      setDuration(0);

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        audioBlobRef.current = blob;
        stream.getTracks().forEach((t) => t.stop());
        setState("recorded");
        onRecorded?.(blob, formatTime(duration));
      };

      mediaRecorder.start();
      setState("recording");

      timerRef.current = window.setInterval(() => {
        setDuration((prev) => {
          if (prev >= 120) {
            // Max 2 minutes
            mediaRecorderRef.current?.stop();
            if (timerRef.current) clearInterval(timerRef.current);
            toast("Maximum 2 minutes reached");
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } catch {
      toast.error("Microphone access denied", {
        description: "Please allow microphone access in your browser settings.",
      });
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const playRecording = () => {
    if (!audioBlobRef.current) return;
    const url = URL.createObjectURL(audioBlobRef.current);
    const audio = new Audio(url);
    audioRef.current = audio;
    setPlaybackProgress(0);
    setState("playing");

    playTimerRef.current = window.setInterval(() => {
      if (audio.duration) {
        setPlaybackProgress((audio.currentTime / audio.duration) * 100);
      }
    }, 100);

    audio.onended = () => {
      setState("recorded");
      setPlaybackProgress(0);
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };

    audio.play();
  };

  const pausePlayback = () => {
    audioRef.current?.pause();
    if (playTimerRef.current) clearInterval(playTimerRef.current);
    setState("recorded");
  };

  const deleteRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (playTimerRef.current) clearInterval(playTimerRef.current);
    audioBlobRef.current = null;
    setDuration(0);
    setPlaybackProgress(0);
    setState("idle");
  };

  // Generate waveform bars
  const bars = Array.from({ length: 24 }, (_, i) => {
    const seed = (i * 7 + 3) % 11;
    return 3 + seed * 0.7;
  });

  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
        <Mic className="mr-1 inline h-3.5 w-3.5" />
        {label}
      </label>

      {state === "idle" && (
        <button
          onClick={startRecording}
          className="flex w-full items-center gap-3 rounded-2xl border-2 border-dashed border-border bg-card p-4 transition-all active:scale-[0.98] active:border-primary"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary">
            <Mic className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold text-foreground">Tap to record</p>
            <p className="text-[11px] text-muted-foreground">
              Describe the job in your own words (max 2 min)
            </p>
          </div>
        </button>
      )}

      {state === "recording" && (
        <div className="flex items-center gap-3 rounded-2xl border-2 border-destructive/30 bg-destructive/5 p-4">
          <button
            onClick={stopRecording}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-destructive transition-transform active:scale-90"
          >
            <Square className="h-4 w-4 text-destructive-foreground fill-destructive-foreground" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-destructive" />
              </span>
              <span className="text-sm font-bold text-destructive">Recording</span>
              <span className="ml-auto text-sm font-mono font-bold text-foreground">{formatTime(duration)}</span>
            </div>
            <div className="flex items-end gap-[2px] h-6">
              {bars.map((h, i) => (
                <div
                  key={i}
                  className="w-[3px] rounded-full bg-destructive/60 animate-pulse"
                  style={{
                    height: `${h * 2.5}px`,
                    animationDelay: `${i * 50}ms`,
                    animationDuration: `${600 + (i % 3) * 200}ms`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {(state === "recorded" || state === "playing") && (
        <div className="flex items-center gap-3 rounded-2xl border-2 border-primary/30 bg-primary/5 p-4">
          <button
            onClick={state === "playing" ? pausePlayback : playRecording}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary transition-transform active:scale-90"
          >
            {state === "playing" ? (
              <Pause className="h-5 w-5 text-primary-foreground fill-primary-foreground" />
            ) : (
              <Play className="h-5 w-5 text-primary-foreground fill-primary-foreground ml-0.5" />
            )}
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold text-foreground">Voice note recorded</span>
              <span className="ml-auto text-xs font-mono text-muted-foreground">{formatTime(duration)}</span>
            </div>
            {/* Progress bar */}
            <div className="h-1.5 w-full rounded-full bg-primary/20 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${state === "playing" ? playbackProgress : 0}%` }}
              />
            </div>
          </div>
          <button
            onClick={deleteRecording}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-destructive/10 transition-transform active:scale-90"
          >
            <Trash2 className="h-3.5 w-3.5 text-destructive" />
          </button>
        </div>
      )}
    </div>
  );
};

export default VoiceNoteRecorder;
