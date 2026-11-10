import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Music,
  Play,
  Pause,
  SkipForward,
  Repeat,
  Volume2,
  VolumeX,
  ListMusic,
  X
} from 'lucide-react';
import { PLAYLIST_SONGS } from '../data/songs';

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoop, setIsLoop] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isPlayingRef = useRef(isPlaying);
  const currentIndexRef = useRef(currentIndex);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  const currentTrack = PLAYLIST_SONGS[currentIndex] || PLAYLIST_SONGS[0];

  // Set initial audio source once on mount
  useEffect(() => {
    const audio = audioRef.current;
    if (audio && !audio.getAttribute('src')) {
      audio.src = PLAYLIST_SONGS[0].audioSrc;
    }
  }, []);

  const playCurrentAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.getAttribute('src')) {
      audio.src = PLAYLIST_SONGS[currentIndexRef.current].audioSrc;
    }
    audio.play().then(
      () => {
        setIsPlaying(true);
      },
      () => {
        // Browser may require direct click on controls if autoplay wasn't unlocked yet
      }
    );
  }, []);

  const switchTrackAndPlay = useCallback((idx: number) => {
    setShowWelcome(false);
    setCurrentIndex(idx);
    currentIndexRef.current = idx;
    setIsPlaying(true);
    const audio = audioRef.current;
    if (audio) {
      audio.src = PLAYLIST_SONGS[idx].audioSrc;
      audio.load();
      audio.play().then(
        () => setIsPlaying(true),
        () => setIsPlaying(false)
      );
    }
  }, []);

  const handleNext = useCallback(() => {
    const nextIdx = (currentIndexRef.current + 1) % PLAYLIST_SONGS.length;
    switchTrackAndPlay(nextIdx);
  }, [switchTrackAndPlay]);

  const handlePrev = useCallback(() => {
    const prevIdx =
      (currentIndexRef.current - 1 + PLAYLIST_SONGS.length) % PLAYLIST_SONGS.length;
    switchTrackAndPlay(prevIdx);
  }, [switchTrackAndPlay]);

  const handleSelectSong = (idx: number) => {
    switchTrackAndPlay(idx);
  };

  // Sync mute and loop attributes on the persistent <audio> element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = isMuted;
    audio.volume = isMuted ? 0 : 0.75;
    audio.loop = isLoop;
  }, [isMuted, isLoop]);

  // Unlock and start playback when user enters the site or clicks the music bubble
  useEffect(() => {
    const onEnter = () => {
      setShowWelcome(false);
      playCurrentAudio();
    };
    window.addEventListener('app-user-entered', onEnter);
    return () => {
      window.removeEventListener('app-user-entered', onEnter);
    };
  }, [playCurrentAudio]);

  const togglePlay = () => {
    setShowWelcome(false);
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.getAttribute('src')) {
      audio.src = PLAYLIST_SONGS[currentIndexRef.current].audioSrc;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(
        () => setIsPlaying(true),
        (err) => console.warn('Audio play error:', err)
      );
    }
  };

  const toggleMute = () => {
    setShowWelcome(false);
    setIsMuted((prev) => !prev);
  };

  return (
    <>
      <audio
        id="janced-audio-player"
        ref={audioRef}
        preload="auto"
        playsInline
        onPlay={() => setIsPlaying(true)}
        onEnded={() => {
          if (!isLoop) {
            handleNext();
          }
        }}
      />

      <div className="fixed bottom-6 left-6 z-[999] flex flex-col items-start gap-2">
        <AnimatePresence>
          {showWelcome && !isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.9 }}
              className="px-3 py-1.5 rounded-xl bg-[#0b0204]/95 text-red-200 border border-red-800/60 text-[10px] font-medium shadow-[0_0_20px_rgba(220,38,38,0.25)] backdrop-blur-md whitespace-nowrap pointer-events-none select-none relative mb-1"
            >
              welcome my babies 🩸
              <div className="absolute -bottom-1 left-5 w-2 h-2 bg-[#0b0204] border-r border-b border-red-800/60 rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          id="floating-music-bubble"
          type="button"
          onClick={() => {
            const nextExpanded = !isExpanded;
            setIsExpanded(nextExpanded);
            setShowWelcome(false);
            if (!isPlaying && nextExpanded && audioRef.current) {
              audioRef.current.play().then(
                () => setIsPlaying(true),
                () => {}
              );
            }
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Trình phát nhạc thư giãn"
          title="Trình phát nhạc thư giãn"
          className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all cursor-pointer shadow-lg select-none ${
            isPlaying
              ? 'bg-red-600 text-white border-red-400 shadow-[0_0_25px_rgba(220,38,38,0.6)]'
              : 'bg-[#090203]/90 hover:bg-red-950/60 text-red-400 border-red-800/60 backdrop-blur-md shadow-[0_0_15px_rgba(220,38,38,0.2)]'
          }`}
        >
          {isPlaying ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Music className="w-5 h-5 stroke-[2.5]" />
              </motion.div>
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-300 rounded-full border border-red-900 animate-ping" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-200 rounded-full border border-red-900" />
            </div>
          ) : (
            <Music className="w-5 h-5" />
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <>
            <div
              className="fixed inset-0 z-[1000]"
              onClick={() => setIsExpanded(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="fixed bottom-20 left-6 z-[1001] w-[290px] sm:w-[310px] bg-[#090203]/95 border border-red-900/60 rounded-3xl p-5 shadow-[0_0_50px_rgba(220,38,38,0.3)] backdrop-blur-lg flex flex-col gap-4 select-none text-zinc-200"
            >
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent" />

              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-red-300 tracking-wider uppercase flex items-center gap-1.5 font-mono">
                  <Music className="w-3.5 h-3.5 text-red-400" />
                  MÚC NHẠC JANCED 𝜗ৎ
                </span>
                <button
                  onClick={() => setIsExpanded(false)}
                  aria-label="Đóng trình phát nhạc"
                  className="w-6 h-6 rounded-full flex items-center justify-center text-zinc-400 hover:text-red-300 hover:bg-red-500/10 transition-all cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-3 rounded-2xl bg-red-950/20 border border-red-900/40 flex gap-3 items-center relative overflow-hidden">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isPlaying
                      ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]'
                      : 'bg-red-950/60 text-red-400 border border-red-800/40'
                  }`}
                >
                  <Music className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-zinc-100 truncate">
                    {currentTrack.title}
                  </p>
                  <p className="text-[9px] text-red-300/80 truncate mt-0.5">
                    {currentTrack.artist || 'Unknown'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between px-1">
                <button
                  onClick={() => setIsLoop((prev) => !prev)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-95 ${
                    isLoop
                      ? 'text-red-300 bg-red-500/20 border border-red-500/40'
                      : 'text-zinc-400 hover:text-red-300 hover:bg-red-950/40'
                  }`}
                  title={isLoop ? 'Đang bật lặp lại bài' : 'Đang tắt lặp lại bài'}
                >
                  <Repeat className="w-4 h-4" />
                </button>

                <button
                  onClick={handlePrev}
                  className="w-8 h-8 rounded-full hover:bg-red-950/40 flex items-center justify-center text-zinc-300 hover:text-red-300 transition-all cursor-pointer active:scale-95"
                  title="Bài trước"
                >
                  <SkipForward className="w-4 h-4 rotate-180" />
                </button>

                <button
                  onClick={togglePlay}
                  className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-[0_0_20px_rgba(220,38,38,0.5)]"
                  title={isPlaying ? 'Tạm dừng' : 'Phát nhạc'}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-current text-white" />
                  ) : (
                    <Play className="w-4 h-4 fill-current text-white ml-0.5" />
                  )}
                </button>

                <button
                  onClick={handleNext}
                  className="w-8 h-8 rounded-full hover:bg-red-950/40 flex items-center justify-center text-zinc-300 hover:text-red-300 transition-all cursor-pointer active:scale-95"
                  title="Bài tiếp theo"
                >
                  <SkipForward className="w-4 h-4" />
                </button>

                <button
                  onClick={toggleMute}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    isMuted
                      ? 'text-red-400 bg-red-500/20 hover:bg-red-500/30'
                      : 'text-zinc-300 hover:text-red-300 hover:bg-red-950/40'
                  }`}
                  title={isMuted ? 'Bật âm thanh' : 'Tắt tiếng'}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="border-t border-red-900/30 pt-3">
                <p className="text-[10px] font-bold text-red-300/80 tracking-wide uppercase mb-2 flex items-center gap-1 font-mono">
                  <ListMusic className="w-3.5 h-3.5 text-red-400" />
                  DANH SÁCH BÀI HÁT
                </p>

                <div className="space-y-1 max-h-[160px] overflow-y-auto custom-scrollbar pr-1">
                  {PLAYLIST_SONGS.map((track, idx) => {
                    const isActive = currentIndex === idx;
                    return (
                      <button
                        key={track.url}
                        onClick={() => handleSelectSong(idx)}
                        className={`w-full p-2 rounded-xl text-left transition-all flex items-center justify-between text-[11px] cursor-pointer ${
                          isActive
                            ? 'bg-red-700 text-white font-bold shadow-[0_0_15px_rgba(220,38,38,0.3)]'
                            : 'hover:bg-red-950/30 text-zinc-300'
                        }`}
                      >
                        <div className="truncate pr-2">
                          <p className="truncate flex items-center gap-1.5">
                            <Music
                              className={`w-3 h-3 shrink-0 ${
                                isActive ? 'text-white' : 'text-red-500/70'
                              }`}
                            />
                            {track.title}
                          </p>
                        </div>

                        {isActive && isPlaying ? (
                          <div className="flex gap-0.5 items-end h-3 shrink-0">
                            <span
                              className="w-0.5 animate-bounce bg-white"
                              style={{ height: '60%', animationDelay: '0.1s' }}
                            />
                            <span
                              className="w-0.5 animate-bounce bg-white"
                              style={{ height: '100%', animationDelay: '0.3s' }}
                            />
                            <span
                              className="w-0.5 animate-bounce bg-white"
                              style={{ height: '40%', animationDelay: '0.5s' }}
                            />
                          </div>
                        ) : (
                          isActive && (
                            <span className="text-[9px] opacity-85">Active</span>
                          )
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
