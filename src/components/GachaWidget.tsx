import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Sparkles, MessageSquare, X } from 'lucide-react';
import { BOTS_DATA, BotCharacter } from '../data/bots';
import { getAvatarObjectPosition, pickRandomBot } from '../utils/botUtils';
import { playGachaSound } from '../utils/sound';

interface GachaWidgetProps {
  onSelectBot: (botId: string) => void;
}

export function GachaWidget({ onSelectBot }: GachaWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<BotCharacter | null>(null);
  const [currentBot, setCurrentBot] = useState<BotCharacter | null>(null);

  const eligibleBots = BOTS_DATA.filter(
    (b) => b.id !== 'system-osin' && !b.id.startsWith('placeholder-')
  );

  const startSpin = () => {
    if (eligibleBots.length === 0) return;
    playGachaSound();
    setIsOpen(true);
    setIsSpinning(true);
    setWinner(null);

    const totalDuration = 1800;
    let interval = 60;
    let elapsed = 0;

    const step = () => {
      const candidate = pickRandomBot(eligibleBots);
      setCurrentBot(candidate);
      elapsed += interval;
      if (elapsed < totalDuration) {
        interval = 60 + Math.pow(elapsed / totalDuration, 3) * 260;
        setTimeout(step, interval);
      } else {
        const finalBot = pickRandomBot(eligibleBots);
        setWinner(finalBot);
        setCurrentBot(finalBot);
        setIsSpinning(false);
      }
    };

    step();
  };

  useEffect(() => {
    const handler = () => startSpin();
    window.addEventListener('trigger-random-husband', handler);
    return () => window.removeEventListener('trigger-random-husband', handler);
  }, []);

  const handleChat = (id: string) => {
    setIsOpen(false);
    onSelectBot(id);
  };

  return (
    <>
      <motion.button
        type="button"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={startSpin}
        aria-label="Hôm nay póc ai?"
        className="fixed right-6 top-[35%] -translate-y-1/2 hidden md:flex flex-col items-center justify-center p-4 bg-[#0b0204]/90 hover:bg-red-950/60 border border-red-900/60 hover:border-red-500/80 rounded-2xl cursor-pointer hover:scale-105 shadow-[0_0_25px_rgba(220,38,38,0.2)] hover:shadow-[0_0_30px_rgba(220,38,38,0.4)] transition-all w-24 h-28 z-40 text-center backdrop-blur-md gap-1.5 group select-none"
      >
        <div className="relative">
          <Gift className="w-8 h-8 text-red-400 group-hover:text-red-300 group-hover:rotate-12 transition-transform duration-300" />
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
        </div>
        <div className="flex flex-col leading-tight mt-1">
          <span className="text-[10px] font-semibold text-zinc-300 uppercase tracking-wider">
            Hôm nay
          </span>
          <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider">
            póc ai?
          </span>
        </div>
      </motion.button>

      {/* Mobile trigger button */}
      <button
        type="button"
        onClick={startSpin}
        aria-label="Póc chồng ngẫu nhiên"
        className="fixed right-4 bottom-6 md:hidden z-[2000] px-4 py-2.5 rounded-full bg-[#0b0204]/95 border border-red-800/70 text-red-100 shadow-[0_4px_20px_rgba(220,38,38,0.4)] backdrop-blur-md flex items-center gap-2 hover:bg-red-950 active:scale-95 transition-all cursor-pointer text-xs font-semibold"
        title="Hôm nay póc ai?"
      >
        <Sparkles className="w-4 h-4 text-red-400" />
        <span>Hôm nay póc ai? 𝜗ৎ</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
              onClick={() => !isSpinning && setIsOpen(false)}
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-sm bg-[#090203]/95 border border-red-900/60 rounded-[32px] p-6 text-center shadow-[0_0_60px_rgba(220,38,38,0.3)] overflow-hidden z-10 select-none"
            >
              <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-red-600/15 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-red-800/15 blur-3xl pointer-events-none" />

              <button
                onClick={() => setIsOpen(false)}
                disabled={isSpinning}
                aria-label="Đóng vòng quay"
                className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-red-300 hover:bg-red-950/50 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="mb-6 mt-2">
                <span className="inline-flex items-center gap-1 bg-red-950/60 text-red-300 border border-red-800/60 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2">
                  <Sparkles
                    className="w-3 h-3 animate-spin text-red-400"
                    style={{ animationDuration: '4s' }}
                  />
                  Duyên Phận Của Bạn
                </span>
                <h3 className="text-lg font-bold text-zinc-100 serif-title">
                  {isSpinning
                    ? 'Đang xoay nhân duyên...'
                    : 'Chúc mừng! Chồng của bạn là:'}
                </h3>
              </div>

              <div className="relative h-64 w-full bg-red-950/20 border border-red-900/40 rounded-2xl overflow-hidden flex items-center justify-center p-4 mb-6">
                <AnimatePresence mode="popLayout">
                  {currentBot && (
                    <motion.div
                      key={currentBot.id + (isSpinning ? '-spinning' : '-selected')}
                      initial={isSpinning ? { y: 60, opacity: 0 } : { scale: 0.9, opacity: 0 }}
                      animate={isSpinning ? { y: 0, opacity: 1 } : { scale: 1, opacity: 1 }}
                      exit={isSpinning ? { y: -60, opacity: 0 } : { opacity: 0 }}
                      transition={
                        isSpinning
                          ? { type: 'spring', damping: 15, stiffness: 200 }
                          : { type: 'spring', damping: 20, stiffness: 250 }
                      }
                      className="flex flex-col items-center justify-center h-full w-full"
                    >
                      <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-red-600/70 shadow-[0_0_20px_rgba(220,38,38,0.4)] mb-3.5 shrink-0 bg-zinc-900">
                        <img
                          src={currentBot.avatar}
                          alt={currentBot.name}
                          referrerPolicy="no-referrer"
                          style={{
                            objectPosition: getAvatarObjectPosition(
                              currentBot,
                              'circle'
                            )
                          }}
                          className="w-full h-full object-cover"
                        />
                        {isSpinning && (
                          <div className="absolute inset-0 bg-red-500/15 animate-pulse pointer-events-none" />
                        )}
                      </div>

                      <h4 className="text-base font-bold text-zinc-100 tracking-tight line-clamp-1">
                        {currentBot.name}
                      </h4>

                      {currentBot.age && (
                        <span className="text-[10px] text-red-300/80 font-medium">
                          Tuổi: {currentBot.age}
                        </span>
                      )}

                      <p className="text-xs text-zinc-300 italic line-clamp-2 mt-1 px-4 text-center leading-relaxed">
                        {currentBot.description}
                      </p>

                      {!isSpinning && (
                        <div className="flex flex-wrap justify-center gap-1 mt-2.5 max-w-[250px]">
                          {currentBot.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-[9px] bg-red-950/50 border border-red-800/50 text-red-200 px-2 py-0.5 rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex flex-col gap-2">
                {!isSpinning && winner ? (
                  <div className="flex gap-2">
                    <button
                      onClick={startSpin}
                      className="py-2.5 px-4 bg-red-950/50 hover:bg-red-900/60 text-red-200 font-bold text-xs rounded-xl border border-red-800/60 transition-colors cursor-pointer"
                    >
                      Xoay lại
                    </button>
                    <button
                      onClick={() => handleChat(winner.id)}
                      className="flex-1 py-2.5 px-4 bg-gradient-to-r from-red-800 via-red-600 to-red-800 hover:from-red-700 hover:to-red-600 text-white font-bold text-xs rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all flex items-center justify-center gap-1.5 border border-red-500/50 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Trò chuyện ngay
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-10 flex items-center justify-center text-red-300/70 text-xs italic">
                    Đang chọn chồng hoàn hảo...
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
