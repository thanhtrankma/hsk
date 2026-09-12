"use client";

import { useEffect, useRef, useState } from "react";

// A small on-brand play button wrapping a native <audio> element, instead
// of the browser's default (inconsistent-looking, off-brand) <audio controls>.
export default function AudioButton({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setProgress(audio.duration ? audio.currentTime / audio.duration : 0);
    const onEnd = () => {
      setPlaying(false);
      setProgress(0);
    };
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnd);
    };
  }, []);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.currentTime = 0;
      audio.play();
      setPlaying(true);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={playing ? "Tạm dừng" : "Nghe phát âm"}
      className="group relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-500 text-white transition hover:bg-brand-600 active:scale-95"
    >
      <audio ref={audioRef} src={src} preload="none" />
      <span
        className="absolute inset-0 origin-left bg-white/25"
        style={{ transform: `scaleX(${progress})` }}
      />
      {playing ? (
        <svg viewBox="0 0 24 24" fill="currentColor" className="relative size-4">
          <rect x="6" y="5" width="4" height="14" rx="1" />
          <rect x="14" y="5" width="4" height="14" rx="1" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="currentColor" className="relative size-4 translate-x-[1px]">
          <path d="M8 5v14l11-7z" />
        </svg>
      )}
    </button>
  );
}
