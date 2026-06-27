import { useState, useRef, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Shuffle,
  Volume2,
  VolumeX,
  Repeat,
  Music,
  ListMusic,
} from "lucide-react";

interface Track {
  title: string;
  artist: string;
  src: string;
}

const PLAYLIST: Track[] = [
  {
    title: "Ambient Dreams",
    artist: "SoundHelix",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    title: "Neon Pulse",
    artist: "SoundHelix",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    title: "Deep Space",
    artist: "SoundHelix",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
  {
    title: "Crystal Rain",
    artist: "SoundHelix",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  },
  {
    title: "Midnight Vibes",
    artist: "SoundHelix",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
  },
];

export const MusicPlayer = () => {
  const [playing, setPlaying] = useState(false);
  const [shuffleOn, setShuffleOn] = useState(false);
  const [repeatOn, setRepeatOn] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showVolume, setShowVolume] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [trackIdx, setTrackIdx] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const track = PLAYLIST[trackIdx];

  // Initialize audio
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "auto";
    audio.volume = volume;
    audioRef.current = audio;

    const onLoaded = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      if (repeatOn) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        handleNext();
      }
    };
    const onTime = () => setCurrentTime(audio.currentTime);
    const onDur = () => setDuration(audio.duration || 0);

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("durationchange", onDur);

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("durationchange", onDur);
      audioRef.current = null;
    };
  }, []);

  // Load track
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = track.src;
    audio.load();
    setCurrentTime(0);
    setDuration(0);
    if (playing) {
      audio.play().catch(() => setPlaying(false));
    }
  }, [trackIdx]);

  // Sync volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
    }
  }, [volume, muted]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  }, [playing]);

  const handlePrev = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    if (shuffleOn) {
      const next = Math.floor(Math.random() * PLAYLIST.length);
      setTrackIdx(next);
    } else {
      setTrackIdx((prev) => (prev === 0 ? PLAYLIST.length - 1 : prev - 1));
    }
  }, [shuffleOn]);

  const handleNext = useCallback(() => {
    if (shuffleOn) {
      let next = Math.floor(Math.random() * PLAYLIST.length);
      if (next === trackIdx && PLAYLIST.length > 1) {
        next = (next + 1) % PLAYLIST.length;
      }
      setTrackIdx(next);
    } else {
      setTrackIdx((prev) => (prev + 1) % PLAYLIST.length);
    }
  }, [shuffleOn, trackIdx]);

  const formatTime = (s: number) => {
    if (!s || !isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 ? currentTime / duration : 0;

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const audio = audioRef.current;
    if (audio && duration > 0) {
      audio.currentTime = ratio * duration;
    }
  };

  return (
    <div className="fixed left-[calc(50%-230px)] top-6 -translate-x-1/2 z-40 animate-slide-up">
      <div className="glass-strong noise rounded-2xl px-5 py-2.5 flex items-center gap-5 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.7)]">
        {/* Album art */}
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neon-purple via-neon-pink to-neon-cyan grid place-items-center shrink-0 shadow-[0_0_20px_-5px_hsl(var(--neon-purple)/0.5)]">
          <div className={playing ? "animate-spin-slow" : ""}>
            <Music size={15} className="text-white/90" />
          </div>
        </div>

        {/* Track info + progress */}
        <div className="min-w-0 w-40 flex flex-col justify-center">
          <p className="text-[11px] font-semibold truncate leading-tight">{track.title}</p>
          <p className="text-[9px] text-white/35 truncate leading-tight">{track.artist}</p>
          <div
            className="mt-1 h-[3px] rounded-full bg-white/8 overflow-hidden cursor-pointer group/progress hover:h-[4px] transition-all"
            onClick={seek}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-neon-purple to-neon-cyan transition-[width] duration-300 ease-linear shadow-[0_0_6px_hsl(var(--neon-purple)/0.5)]"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-0.5">
            <span className="text-[8px] text-white/25 tabular-nums">{formatTime(currentTime)}</span>
            <span className="text-[8px] text-white/25 tabular-nums">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShuffleOn(!shuffleOn)}
            className={`w-8 h-8 rounded-xl grid place-items-center transition-all duration-200 ${
              shuffleOn
                ? "text-neon-cyan bg-neon-cyan/10 shadow-[0_0_12px_-3px_hsl(var(--neon-cyan)/0.4)]"
                : "text-white/25 hover:text-white/60 hover:bg-white/5"
            }`}
          >
            <Shuffle size={14} />
          </button>

          <button
            onClick={handlePrev}
            className="w-8 h-8 rounded-xl grid place-items-center text-white/25 hover:text-white/60 hover:bg-white/5 transition-all duration-200"
          >
            <SkipBack size={14} />
          </button>

          <button
            onClick={togglePlay}
            className="w-9 h-9 rounded-full bg-gradient-to-br from-neon-purple via-neon-cyan to-neon-blue grid place-items-center shadow-[0_0_25px_-5px_hsl(var(--neon-purple)/0.6)] hover:shadow-[0_0_35px_-5px_hsl(var(--neon-purple)/0.8)] hover:scale-105 active:scale-95 transition-all duration-200 ring-1 ring-white/10"
          >
            {playing ? <Pause size={14} fill="white" /> : <Play size={14} fill="white" className="ml-0.5" />}
          </button>

          <button
            onClick={handleNext}
            className="w-8 h-8 rounded-xl grid place-items-center text-white/25 hover:text-white/60 hover:bg-white/5 transition-all duration-200"
          >
            <SkipForward size={14} />
          </button>

          <button
            onClick={() => setRepeatOn(!repeatOn)}
            className={`w-8 h-8 rounded-xl grid place-items-center transition-all duration-200 ${
              repeatOn
                ? "text-neon-purple bg-neon-purple/10 shadow-[0_0_12px_-3px_hsl(var(--neon-purple)/0.4)]"
                : "text-white/25 hover:text-white/60 hover:bg-white/5"
            }`}
          >
            <Repeat size={14} />
          </button>
        </div>

        {/* Volume */}
        <div
          className="relative flex items-center"
          onMouseEnter={() => setShowVolume(true)}
          onMouseLeave={() => setShowVolume(false)}
        >
          <button
            onClick={() => setMuted(!muted)}
            className="w-8 h-8 rounded-xl grid place-items-center text-white/25 hover:text-white/60 hover:bg-white/5 transition-all duration-200"
          >
            {muted || volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ${
              showVolume ? "w-24 ml-2 opacity-100" : "w-0 opacity-0"
            }`}
          >
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={muted ? 0 : volume}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                setVolume(v);
                if (v > 0) setMuted(false);
              }}
              className="w-full h-1 rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-3
                [&::-webkit-slider-thumb]:h-3
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-white
                [&::-webkit-slider-thumb]:shadow-[0_0_10px_hsl(var(--neon-purple)/0.6)]
                [&::-webkit-slider-thumb]:cursor-pointer
                [&::-webkit-slider-runnable-track]:rounded-full"
              style={{
                background: `linear-gradient(to right, hsl(270, 95%, 65%) ${(muted ? 0 : volume) * 100}%, rgba(255,255,255,0.08) ${(muted ? 0 : volume) * 100}%)`,
              }}
            />
          </div>
        </div>

        {/* Playlist — between Repeat and Volume */}
        <div className="relative">
          <button
            onClick={() => setShowPlaylist(!showPlaylist)}
            className={`w-8 h-8 rounded-xl grid place-items-center transition-all duration-200 ${
              showPlaylist
                ? "text-neon-purple bg-neon-purple/10 shadow-[0_0_12px_-3px_hsl(var(--neon-purple)/0.3)]"
                : "text-white/25 hover:text-white/60 hover:bg-white/5"
            }`}
          >
            <ListMusic size={14} />
          </button>

          {showPlaylist && (
            <div
              className="absolute top-full right-0 mt-2 w-64 rounded-2xl overflow-hidden z-50"
              style={{
                background: "rgba(16,14,24,0.97)",
                backdropFilter: "blur(48px) saturate(180%)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 24px 64px -12px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.04)",
                animation: "dropdown-in 0.25s ease-out forwards",
              }}
            >
              <div className="px-4 pt-3 pb-2 border-b border-white/[0.04]">
                <p className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.15em]">Playlist</p>
                <p className="text-[11px] text-white/50 mt-0.5">{PLAYLIST.length} tracks · {track.title}</p>
              </div>
              <div className="p-2 max-h-[260px] overflow-y-auto scrollbar-none">
                {PLAYLIST.map((t, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setTrackIdx(i);
                      if (!playing) {
                        setTimeout(() => {
                          audioRef.current?.play().then(() => setPlaying(true)).catch(() => {});
                        }, 0);
                      }
                      setShowPlaylist(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 transition-all duration-200 ${
                      i === trackIdx
                        ? "bg-gradient-to-r from-neon-purple/12 to-transparent border border-neon-purple/15"
                        : "hover:bg-white/[0.04] border border-transparent"
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-xl grid place-items-center shrink-0 text-[10px] font-bold transition-all duration-200 ${
                      i === trackIdx
                        ? "bg-gradient-to-br from-neon-purple to-neon-cyan text-white shadow-[0_0_12px_-2px_hsl(var(--neon-purple)/0.4)]"
                        : "bg-white/[0.04] text-white/20"
                    }`}>
                      {i === trackIdx && playing ? (
                        <span className="flex gap-[2px] items-center">
                          <span className="w-0.5 h-2.5 bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms", animationDuration: "0.6s" }} />
                          <span className="w-0.5 h-2.5 bg-white rounded-full animate-bounce" style={{ animationDelay: "150ms", animationDuration: "0.6s" }} />
                          <span className="w-0.5 h-2.5 bg-white rounded-full animate-bounce" style={{ animationDelay: "300ms", animationDuration: "0.6s" }} />
                        </span>
                      ) : (
                        String(i + 1).padStart(2, "0")
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[12px] font-medium truncate leading-tight ${
                        i === trackIdx ? "text-white" : "text-white/60"
                      }`}>
                        {t.title}
                      </p>
                      <p className="text-[9px] text-white/20 truncate mt-0.5">{t.artist}</p>
                    </div>
                    {i === trackIdx && (
                      <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan shadow-[0_0_8px_hsl(var(--neon-cyan)/0.6)] shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
