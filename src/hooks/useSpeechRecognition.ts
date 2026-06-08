import { useEffect, useRef } from "react";

interface UseSpeechRecognitionOptions {
  enabled: boolean;
  onFinalTranscript: (text: string) => void;
}

function getSpeechRecognitionCtor():
  | (new () => SpeechRecognition)
  | undefined {
  if (typeof window === "undefined") return undefined;
  return window.SpeechRecognition ?? window.webkitSpeechRecognition;
}

export function useSpeechRecognition({
  enabled,
  onFinalTranscript,
}: UseSpeechRecognitionOptions) {
  const onFinalRef = useRef(onFinalTranscript);
  onFinalRef.current = onFinalTranscript;

  useEffect(() => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor || !enabled) return;

    const recognition = new Ctor();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = navigator.language || "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        if (!result.isFinal) continue;
        const text = result[0]?.transcript.trim();
        if (text) onFinalRef.current(text);
      }
    };

    recognition.onerror = () => {
      // Browser may stop after errors; restart while mic mode stays open.
    };

    let active = true;

    recognition.onend = () => {
      if (!active) return;
      try {
        recognition.start();
      } catch {
        // Already started or mic unavailable.
      }
    };

    try {
      recognition.start();
    } catch {
      return;
    }

    return () => {
      active = false;
      recognition.onresult = null;
      recognition.onend = null;
      recognition.onerror = null;
      recognition.stop();
    };
  }, [enabled]);
}
