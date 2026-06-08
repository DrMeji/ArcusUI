import { useEffect, useRef, useState } from "react";

const SPEAK_THRESHOLD = 0.14;
const NOISE_FLOOR = 0.05;
const LEVEL_GAIN = 1.35;
const IDLE_LEVEL_MIX = 0.06;
const SILENCE_MS = 500;
const RESPONSE_MS = 2800;
const VOICE_BIN_START = 3;
const VOICE_BIN_END = 40;
const LEVEL_SMOOTHING = 0.08;

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
    let smoothedLevel = 0;

    const tick = () => {
      if (cancelled || !analyser) return;

      analyser.getByteFrequencyData(data);
      let sum = 0;
      let count = 0;
      for (let i = VOICE_BIN_START; i <= VOICE_BIN_END; i += 1) {
        sum += data[i];
        count += 1;
      }
      const raw = sum / (count * 255);
      const gated = Math.max(0, raw - NOISE_FLOOR);
      const normalized = Math.min(1, gated * LEVEL_GAIN);
      smoothedLevel += (normalized - smoothedLevel) * LEVEL_SMOOTHING;
      const now = performance.now();

      let userSpeaking = smoothedLevel > SPEAK_THRESHOLD;
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
        smoothedLevel * (userSpeaking ? 0.85 : IDLE_LEVEL_MIX) + assistantLevel,
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
        analyser.smoothingTimeConstant = 0.9;

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
