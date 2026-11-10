import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, RefreshCw } from 'lucide-react';
import { Hexagram } from '../data/hexagrams';
import { pickHexagram } from '../utils/botUtils';
import { playChimeSound } from '../utils/sound';

export function DailyHexagramModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [hexagram, setHexagram] = useState<Hexagram | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('janced_daily_hexagram');
      if (saved) {
        const parsed = JSON.parse(saved);
        const today = new Date().toDateString();
        if (parsed.date === today && parsed.hexagram) {
          setHexagram(parsed.hexagram);
        } else {
          localStorage.removeItem('janced_daily_hexagram');
        }
      }
    } catch {
      localStorage.removeItem('janced_daily_hexagram');
    }
  }, []);

  const drawHexagram = (forceNew = false) => {
    playChimeSound();
    if (hexagram && !forceNew) {
      setIsOpen(true);
      return;
    }
    setIsOpen(true);
    setIsDrawing(true);
    setTimeout(() => {
      const chosen = pickHexagram();
      setHexagram(chosen);
      setIsDrawing(false);
      try {
        localStorage.setItem(
          'janced_daily_hexagram',
          JSON.stringify({ date: new Date().toDateString(), hexagram: chosen })
        );
      } catch {
        // Ignore storage quota errors
      }
    }, 900);
  };

  return (
    <>
      <div className="flex justify-center mt-2">
        <button
          onClick={() => drawHexagram(false)}
          className="relative flex items-center justify-center px-6 py-2 rounded-full bg-red-950/40 border border-red-800/60 text-red-100 text-sm font-serif italic hover:bg-red-900/50 hover:border-red-500/70 hover:text-white transition-all shadow-[0_0_15px_rgba(220,38,38,0.18)] hover:shadow-[0_0_25px_rgba(220,38,38,0.35)] group overflow-hidden cursor-pointer"
        >
          <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-red-400/15 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
          <span className="relative z-10 flex items-center gap-1.5">
            Thông điệp hôm nay ✦
          </span>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-zinc-950/95 backdrop-blur-2xl rounded-2xl p-[1.5px] shadow-[0_0_55px_rgba(220,38,38,0.3)] relative text-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-950 via-red-500 to-red-950 animate-[spin_4s_linear_infinite]" />
              <div className="relative w-full h-full bg-[#090203] rounded-2xl p-8 z-10 border border-red-500/20 flex flex-col items-center">
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Đóng thông điệp"
                  className="absolute top-4 right-4 text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <h3 className="text-2xl font-bold text-red-100 mb-6 serif-title tracking-wide italic">
                  Lá Bài Định Mệnh
                </h3>

                {isDrawing ? (
                  <div className="py-8 flex flex-col items-center gap-6">
                    <div className="w-12 h-16 bg-red-950/60 border border-red-600/60 rounded-lg animate-bounce shadow-[0_0_20px_rgba(220,38,38,0.4)] flex items-center justify-center">
                      <span className="text-2xl text-red-400">䷏</span>
                    </div>
                    <p className="text-sm text-red-300 animate-pulse font-serif italic">
                      Đang bốc quẻ Kinh Dịch...
                    </p>
                  </div>
                ) : (
                  hexagram && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center"
                    >
                      <div className="text-5xl text-red-500 my-4 drop-shadow-[0_0_16px_rgba(239,68,68,0.65)] animate-pulse">
                        {hexagram.symbol}
                      </div>
                      <h4 className="text-base font-bold text-zinc-100 tracking-wider font-serif italic mb-2">
                        {hexagram.name}
                      </h4>
                      <p className="text-[11px] text-red-300/80 leading-relaxed mb-6 px-2 italic">
                        Tượng quẻ: {hexagram.meaning}
                      </p>
                      <div className="w-full h-[1px] bg-red-900/40 mb-6" />
                      <p className="text-xs sm:text-sm leading-relaxed text-zinc-200 font-serif italic mb-6">
                        {hexagram.advice}
                      </p>
                      <button
                        onClick={() => drawHexagram(true)}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-red-950/50 hover:bg-red-900/60 border border-red-800/50 text-[11px] text-red-200 transition-colors cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Rút quẻ khác</span>
                      </button>
                    </motion.div>
                  )
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
