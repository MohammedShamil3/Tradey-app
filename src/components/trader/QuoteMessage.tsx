import { useState, useRef, useCallback } from "react";
import { Mic, Square, Play, Pause, Trash2, MessageSquare } from "lucide-react";

export interface QuoteMessageData {
  text: string;
  voiceNoteBlob?: Blob;
  voiceNoteDuration?: string;
}

interface QuoteMessageProps {
  value: QuoteMessageData;
  onChange: (data: QuoteMessageData) => void;
}

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const QuoteMessage = ({ value, onChange }: QuoteMessageProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];
      setRecordingTime(0);

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        stream.getTracks().forEach((t) => t.stop());
        if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = URL.createObjectURL(blob);
        onChange({
          ...value,
          voiceNoteBlob: blob,
          voiceNoteDuration: formatTime(recordingTime),
        });
      };

      recorder.start();
      setIsRecording(true);
      timerRef.current = setInterval(() => setRecordingTime((t) => t + 1), 1000);
    } catch {
      // Mic permission denied — silently ignore
    }
  }, [value, onChange, recordingTime]);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const removeVoiceNote = useCallback(() => {
    if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
    audioUrlRef.current = null;
    audioRef.current = null;
    setIsPlaying(false);
    onChange({ ...value, voiceNoteBlob: undefined, voiceNoteDuration: undefined });
  }, [value, onChange]);

  const togglePlay = useCallback(() => {
    if (!audioUrlRef.current) return;
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrlRef.current);
      audioRef.current.onended = () => setIsPlaying(false);
    }
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [isPlaying]);

  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-1.5">
        <MessageSquare className="h-3.5 w-3.5 text-primary" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Message to Customer
        </span>
        <span className="text-[9px] text-muted-foreground">(optional)</span>
      </div>

      {/* Text message */}
      <textarea
        value={value.text}
        onChange={(e) => onChange({ ...value, text: e.target.value })}
        placeholder="Add a note about the quote, timeline, or any important details..."
        rows={2}
        className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary resize-none"
      />

      {/* Voice note */}
      {value.voiceNoteBlob ? (
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5">
          <button
            onClick={togglePlay}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary"
          >
            {isPlaying ? (
              <Pause className="h-3 w-3 text-primary-foreground" />
            ) : (
              <Play className="h-3 w-3 text-primary-foreground ml-0.5" />
            )}
          </button>
          <div className="flex-1">
            <p className="text-[11px] font-semibold text-foreground">Voice Note</p>
            <p className="text-[10px] text-muted-foreground">{value.voiceNoteDuration}</p>
          </div>
          <div className="flex items-center gap-0.5 mr-2">
            {[3, 5, 8, 4, 7, 6, 3, 5, 7, 4].map((h, i) => (
              <div key={i} className="w-[2px] rounded-full bg-primary/40" style={{ height: `${h * 1.5}px` }} />
            ))}
          </div>
          <button onClick={removeVoiceNote} className="text-muted-foreground hover:text-destructive">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-semibold transition-colors ${
            isRecording
              ? "border-destructive bg-destructive/5 text-destructive"
              : "border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary"
          }`}
        >
          {isRecording ? (
            <>
              <Square className="h-3 w-3 fill-current" />
              Stop Recording · {formatTime(recordingTime)}
            </>
          ) : (
            <>
              <Mic className="h-3.5 w-3.5" />
              Record Voice Note
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default QuoteMessage;
