import { useEffect, useRef, useState } from "react";

const SPEAK_THRESHOLD = 0.06;
const SILENCE_MS = 400;
const RESPONSE_MS = 2800;

export interface AudioReactiveState {
  level: number;
  isUserSpeaking: boolean;
  isAssistantSpeaking: boolean;
  micReady: boolean;
  micError: string | null;
}

export function useAudioReactive(): AudioReactiveState {
  const [level, setLevel] = useState(0);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);
  const [micReady, setMicReady] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);

  const rafRef = useRef(0);
  const speakingRef = useRef(false);
  const silenceStartRef = useRef<number | null>(null);
  const responseUntilRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    let audioContext: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let stream: MediaStream | null = null;
    const data = new Uint8Array(256);

    const tick = () => {
      if (cancelled || !analyser) return;

      analyser.getByteFrequencyData(data);
      let sum = 0;
      for (let i = 0; i < data.length; i += 1) sum += data[i];
      const raw = sum / (data.length * 255);
      const smoothed = Math.min(1, raw * 2.8);
      const now = performance.now();

      let userSpeaking = smoothed > SPEAK_THRESHOLD;
      if (userSpeaking) {
        speakingRef.current = true;
        silenceStartRef.current = null;
        responseUntilRef.current = 0;
      } else if (speakingRef.current) {
        if (silenceStartRef.current === null) {
          silenceStartRef.current = now;
        } else if (now - silenceStartRef.current > SILENCE_MS) {
          speakingRef.current = false;
          silenceStartRef.current = null;
          responseUntilRef.current = now + RESPONSE_MS;
        }
      }

      const assistantSpeaking = now < responseUntilRef.current;
      const assistantLevel = assistantSpeaking
        ? 0.35 + Math.sin(now * 0.012) * 0.2 + Math.sin(now * 0.023) * 0.15
        : 0;

      const combined = Math.min(
        1,
        smoothed * (userSpeaking ? 1 : 0.35) + assistantLevel,
      );

      setLevel(combined);
      setIsUserSpeaking(userSpeaking);
      setIsAssistantSpeaking(assistantSpeaking);
      rafRef.current = requestAnimationFrame(tick);
    };

    const start = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (cancelled) return;

        audioContext = new AudioContext();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 512;
        analyser.smoothingTimeConstant = 0.82;

        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        setMicReady(true);
        rafRef.current = requestAnimationFrame(tick);
      } catch {
        if (!cancelled) {
          setMicError("Microphone unavailable — orb will idle animate only.");
        }
      }
    };

    start();

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
      stream?.getTracks().forEach((track) => track.stop());
      void audioContext?.close();
    };
  }, []);

  return { level, isUserSpeaking, isAssistantSpeaking, micReady, micError };
}
