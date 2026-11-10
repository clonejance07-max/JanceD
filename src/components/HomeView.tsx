import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Filter,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  X,
  ArrowUp,
  ArrowDown,
  Facebook
} from 'lucide-react';
import { BOTS_DATA, UPCOMING_BOTS, ALL_TAGS, UpcomingBot } from '../data/bots';
import {
  filterAndSortBots,
  getAvatarObjectPosition,
  getRecommendedBots
} from '../utils/botUtils';
import { playClickSound } from '../utils/sound';
import { DailyHexagramModal } from './DailyHexagramModal';
import { FeedbackModal } from './FeedbackModal';
import { GuideModal } from './GuideModal';
import { BotCard } from './BotCard';

interface HomeViewProps {
  onSelectBot: (botId: string) => void;
}

export function HomeView({ onSelectBot }: HomeViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [selectedUpcoming, setSelectedUpcoming] = useState<UpcomingBot | null>(null);

  const [recIndex, setRecIndex] = useState(0);
  const [slideDir, setSlideDir] = useState(1);

  const searchBarRef = useRef<HTMLDivElement | null>(null);
  const rootContainerRef = useRef<HTMLDivElement | null>(null);

  const filteredBots = useMemo(
    () => filterAndSortBots(BOTS_DATA, searchQuery, selectedTag),
    [searchQuery, selectedTag]
  );

  const recommendedBots = useMemo(() => getRecommendedBots(BOTS_DATA), []);

  const nextRecommended = useCallback(() => {
    setSlideDir(1);
    setRecIndex((prev) => (prev + 1) % recommendedBots.length);
  }, [recommendedBots.length]);

  const prevRecommended = useCallback(() => {
    setSlideDir(-1);
    setRecIndex((prev) => (prev - 1 + recommendedBots.length) % recommendedBots.length);
  }, [recommendedBots.length]);

  useEffect(() => {
    if (recommendedBots.length <= 1 || searchQuery || selectedTag) return;
    const timer = setInterval(nextRecommended, 5000);
    return () => clearInterval(timer);
  }, [recommendedBots.length, searchQuery, selectedTag, nextRecommended]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(e.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.scrollTo({ top: 0, behavior: 'smooth' });
    rootContainerRef.current?.parentElement?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    const parent = rootContainerRef.current?.parentElement;
    const maxScroll = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight,
      parent ? parent.scrollHeight : 0
    );
    window.scrollTo({ top: maxScroll, behavior: 'smooth' });
    document.documentElement.scrollTo({ top: maxScroll, behavior: 'smooth' });
    document.body.scrollTo({ top: maxScroll, behavior: 'smooth' });
    parent?.scrollTo({ top: maxScroll, behavior: 'smooth' });
  };

  return (
    <div
      ref={rootContainerRef}
      className="flex flex-col min-h-full max-w-5xl mx-auto relative"
    >
      {/* Header */}
      <header className="p-6 text-center relative">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-100 serif-title mb-1 neon-title">
          <span className="relative inline-block">
            JanceD
            <motion.span
              animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8], rotate: [0, 45, 90] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="absolute -top-3 -right-6 text-red-500"
            >
              ✦
            </motion.span>
            <motion.span
              animate={{ opacity: [0.2, 1, 0.2], scale: [0.5, 1, 0.5], rotate: [90, 45, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear', delay: 1 }}
              className="absolute -bottom-1 -left-4 text-red-400 text-sm"
            >
              ✦
            </motion.span>
          </span>
        </h1>

        <p className="text-xs text-red-200/80 mb-4 drop-shadow-md">
          .✦ pick your husbandos and try 𝜗ৎ ݁˖
        </p>

        <DailyHexagramModal />
        <FeedbackModal />

        <div className="flex justify-center items-center mt-6">
          <div className="relative w-full max-w-md flex items-center" ref={searchBarRef}>
            <span className="absolute left-4 top-1/2 -translate-y-1/2 z-10 select-none text-red-400">
              🔎
            </span>
            <input
              type="text"
              aria-label="Tìm kiếm nhân vật"
              placeholder="Tìm kiếm..."
              className="w-full pl-10 pr-12 py-3 rounded-full glass-input focus:outline-none focus:border-red-500/60 shadow-[0_0_20px_rgba(220,38,38,0.12)] text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="button"
              onClick={() => {
                playClickSound();
                setIsFilterOpen(!isFilterOpen);
              }}
              aria-label="Bộ lọc thẻ nhân vật"
              className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors z-10 cursor-pointer ${
                selectedTag || isFilterOpen
                  ? 'text-red-400'
                  : 'text-zinc-400 hover:text-red-300'
              }`}
            >
              <Filter className="w-4 h-4" />
            </button>

            {isFilterOpen && (
              <div className="absolute top-14 right-0 bg-[#090203]/95 backdrop-blur-xl border border-red-900/60 shadow-[0_15px_40px_rgba(0,0,0,0.85)] rounded-2xl p-4 w-72 z-50">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-red-300/80">
                    Lọc theo Tag
                  </span>
                  {selectedTag && (
                    <button
                      type="button"
                      onClick={() => setSelectedTag(null)}
                      className="text-[10px] text-red-400 hover:underline cursor-pointer"
                    >
                      Xóa lọc
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 text-[10px] font-semibold max-h-60 overflow-y-auto custom-scrollbar">
                  {ALL_TAGS.map((tag) => {
                    const active = selectedTag === tag;
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          playClickSound();
                          setSelectedTag(active ? null : tag);
                        }}
                        className={`px-3 py-1 border rounded-full transition-colors cursor-pointer ${
                          active
                            ? 'bg-red-700 text-white border-red-400 shadow-[0_0_12px_rgba(220,38,38,0.4)]'
                            : 'bg-black/60 border-red-900/40 text-zinc-300 hover:border-red-500/60 hover:text-red-200'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {selectedTag && (
          <div className="mt-3 flex items-center justify-center gap-2">
            <span className="text-xs text-red-300">
              Đang lọc theo: <strong>#{selectedTag}</strong>
            </span>
            <button
              type="button"
              onClick={() => setSelectedTag(null)}
              className="text-xs text-zinc-400 hover:text-white underline cursor-pointer"
            >
              Bỏ lọc
            </button>
          </div>
        )}
      </header>

      {/* Coming Soon Husbandos */}
      {!searchQuery && !selectedTag && UPCOMING_BOTS.length > 0 && (
        <div className="w-full max-w-[800px] mx-auto px-8 mb-10">
          <div className="flex items-center justify-center mb-5 select-none gap-2">
            <span className="h-[1px] w-8 bg-gradient-to-r from-transparent to-red-500/60" />
            <h2 className="text-sm sm:text-base font-bold tracking-[0.22em] uppercase font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-red-200 via-red-400 to-red-200 drop-shadow-[0_0_12px_rgba(220,38,38,0.45)]">
              ⋆˙chồng iu sắp đến♡
            </h2>
            <span className="h-[1px] w-8 bg-gradient-to-l from-transparent to-red-500/60" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {UPCOMING_BOTS.map((bot) => (
              <button
                key={bot.id}
                type="button"
                onClick={() => {
                  playClickSound();
                  setSelectedUpcoming(bot);
                }}
                className="relative group p-4 rounded-3xl bg-[#090203]/80 border border-red-900/40 backdrop-blur-md shadow-2xl overflow-hidden cursor-pointer select-none transition-all duration-300 hover:border-red-500/60 hover:bg-red-950/30 active:scale-[0.99] text-left"
              >
                <div className="absolute top-3.5 right-3.5 z-20 flex items-center gap-1.5 text-red-400 group-hover:text-red-200 transition-colors">
                  <span className="text-xs" title={bot.releaseDate || 'Sắp ra mắt'}>
                    🔒
                  </span>
                  <ChevronRight className="w-4 h-4 text-red-500 group-hover:text-red-300 group-hover:translate-x-0.5 transition-all" />
                </div>

                <div className="flex gap-3.5 items-center">
                  <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-2xl overflow-hidden shrink-0 border border-red-800/40 group-hover:scale-105 transition-transform duration-500 shadow-lg bg-zinc-900">
                    <img
                      src={bot.avatar}
                      alt={bot.name}
                      referrerPolicy="no-referrer"
                      style={{
                        objectPosition: getAvatarObjectPosition(bot, 'circle')
                      }}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 pr-6">
                    <h3 className="text-base font-bold text-zinc-100 tracking-tight font-serif truncate group-hover:text-red-200 transition-colors">
                      {bot.name}
                    </h3>
                    <p className="text-[11px] font-medium text-red-400/90 mb-1.5 truncate">
                      {bot.role}
                    </p>
                    <p className="text-[10px] text-zinc-400 line-clamp-2 italic leading-relaxed">
                      &quot;{bot.teaser}&quot;
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Coming Soon Modal */}
      <AnimatePresence>
        {selectedUpcoming && (
          <div
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            onClick={() => setSelectedUpcoming(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-sm bg-[#090203] border border-red-900/60 rounded-3xl p-6 shadow-[0_20px_60px_rgba(220,38,38,0.3)] overflow-hidden select-none"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelectedUpcoming(null)}
                aria-label="Đóng thông tin"
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-red-950/50 hover:bg-red-900/70 text-zinc-300 hover:text-white flex items-center justify-center transition-all z-10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="relative w-28 h-28 rounded-2xl overflow-hidden border border-red-700/50 shadow-[0_0_25px_rgba(220,38,38,0.3)] mb-4 bg-zinc-900">
                  <img
                    src={selectedUpcoming.avatar}
                    alt={selectedUpcoming.name}
                    referrerPolicy="no-referrer"
                    style={{
                      objectPosition: getAvatarObjectPosition(
                        selectedUpcoming,
                        'circle'
                      )
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/60 border border-red-800/50 text-xs text-red-200 font-medium mb-2.5">
                  <span>🔒</span>
                  <span>{selectedUpcoming.releaseDate || 'Sắp ra mắt 𝜗ৎ'}</span>
                </div>

                <h3 className="text-xl font-bold text-zinc-100 font-serif mb-1">
                  {selectedUpcoming.name}
                </h3>

                <p className="text-xs font-semibold text-red-400 mb-3 px-2">
                  {selectedUpcoming.role}
                </p>

                {selectedUpcoming.tags && selectedUpcoming.tags.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-1.5 mb-4">
                    {selectedUpcoming.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-red-950/40 border border-red-900/50 text-[10px] text-red-200/80"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="w-full p-4 rounded-2xl bg-red-950/20 border border-red-900/40 text-left mb-5">
                  <p className="text-xs text-zinc-200 italic leading-relaxed whitespace-pre-line">
                    &quot;{selectedUpcoming.teaser}&quot;
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedUpcoming(null)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-900/80 via-red-700/80 to-red-900/80 hover:from-red-800 hover:to-red-800 text-white font-semibold text-xs transition-all border border-red-500/40 active:scale-95 cursor-pointer"
                >
                  Đóng thông tin
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Recommended Husbandos Carousel */}
      {recommendedBots.length > 0 && !searchQuery && !selectedTag && (
        <div className="w-full max-w-[800px] mx-auto px-8 mb-8">
          <div className="flex items-center justify-center mb-6 select-none gap-2">
            <span className="h-[1px] w-8 bg-gradient-to-r from-transparent to-red-500/60" />
            <h2 className="text-sm sm:text-base font-bold tracking-[0.22em] uppercase font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-red-200 via-red-400 to-red-200 drop-shadow-[0_0_12px_rgba(220,38,38,0.45)]">
              ⋆˙ đề cử chồng iu ⟡♡
            </h2>
            <span className="h-[1px] w-8 bg-gradient-to-l from-transparent to-red-500/60" />
          </div>

          <div className="relative p-[1px] rounded-[40px] bg-gradient-to-b from-red-500/35 via-red-900/10 to-red-500/20 shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
            <div className="relative group px-12 py-10 bg-[#080102]/70 backdrop-blur-md rounded-[39px]">
              <AnimatePresence mode="wait" custom={slideDir}>
                <motion.div
                  key={recommendedBots[recIndex]?.id}
                  custom={slideDir}
                  initial={{ opacity: 0, x: slideDir * 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: slideDir * -40 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="flex justify-center"
                >
                  <div className="w-full max-w-[220px] shadow-[0_20px_50px_rgba(220,38,38,0.25)] rounded-[20px]">
                    <BotCard
                      bot={recommendedBots[recIndex]}
                      onClick={() => onSelectBot(recommendedBots[recIndex].id)}
                    />
                  </div>
                </motion.div>
              </AnimatePresence>

              {recommendedBots.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevRecommended}
                    aria-label="Đề cử trước"
                    className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-red-950/60 border border-red-800/50 text-red-300 hover:text-white hover:bg-red-800/70 transition-all z-10 cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={nextRecommended}
                    aria-label="Đề cử tiếp theo"
                    className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-red-950/60 border border-red-800/50 text-red-300 hover:text-white hover:bg-red-800/70 transition-all z-10 cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Newcomer Guide Banner */}
      {!searchQuery && !selectedTag && (
        <div className="w-full max-w-[800px] mx-auto px-8 mb-8">
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setIsGuideOpen(true);
            }}
            className="w-full group relative p-4 sm:p-4.5 rounded-2xl bg-[#090203]/85 border border-red-900/50 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.7)] hover:border-red-500/70 transition-all duration-300 cursor-pointer overflow-hidden flex items-center justify-between gap-3 select-none active:scale-[0.99] text-left"
          >
            <div className="absolute -inset-1 bg-red-600/10 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="flex items-center gap-3.5 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-red-950/70 border border-red-700/50 flex items-center justify-center shrink-0 text-red-400 shadow-inner group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-zinc-100 font-serif tracking-wide group-hover:text-red-200 transition-colors">
                  Nàng là người mới? 𝜗ৎ
                </h3>
                <p className="text-[11px] text-zinc-400 font-medium line-clamp-1 mt-0.5">
                  Bấm vào đây để xem hướng dẫn chọn Model AI &amp; video thao tác nhé!
                </p>
              </div>
            </div>

            <div className="relative z-10 shrink-0 px-3 py-1.5 rounded-xl bg-red-900/50 border border-red-600/40 text-[11px] font-semibold text-red-100 group-hover:bg-red-700 group-hover:text-white transition-all flex items-center gap-1 shadow-md">
              <span>Xem ngay</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        </div>
      )}

      <GuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />

      {/* Main Character Grid */}
      <main className="px-8 pb-8 flex flex-col items-center">
        {filteredBots.length === 0 ? (
          <div className="w-full max-w-[800px] py-16 text-center rounded-3xl bg-[#090203]/70 border border-red-900/30 mb-12">
            <p className="text-sm text-red-200 font-serif italic mb-2">
              Không tìm thấy chồng iu nào phù hợp với từ khóa của nàng...
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedTag(null);
              }}
              className="mt-2 px-4 py-1.5 rounded-full bg-red-900/50 hover:bg-red-800/70 border border-red-600/40 text-xs text-white cursor-pointer"
            >
              Xem tất cả nhân vật
            </button>
          </div>
        ) : (
          <div className="w-full max-w-[800px] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 auto-rows-[260px] gap-4 mb-12">
            {filteredBots.map((bot) => (
              <div key={bot.id}>
                <BotCard bot={bot} onClick={() => onSelectBot(bot.id)} />
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <footer className="w-full max-w-[800px] py-6 text-center text-[11px] text-zinc-400 border-t border-red-900/30 flex flex-col items-center gap-2 select-none shrink-0 mt-auto">
          <p>© 2026 JanceD. All rights reserved.</p>
          <div className="flex gap-4 items-center">
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook JanceD"
              className="text-red-400 hover:text-red-200 transition-colors cursor-pointer font-semibold flex items-center gap-1.5"
            >
              <Facebook className="w-3.5 h-3.5" />
            </a>
            <span className="w-px h-3 bg-red-900/40" />
            <a
              href="https://yodayo.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-6 h-6 rounded-full bg-red-950/40 border border-red-800/40 flex items-center justify-center text-red-300 hover:text-white hover:border-red-500 transition-all shadow-sm"
              title="Yodayo"
            >
              <span className="text-[6px] font-black tracking-tighter">YDY</span>
            </a>
            <a
              href="https://character.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-6 h-6 rounded-full bg-red-950/40 border border-red-800/40 flex items-center justify-center text-red-300 hover:text-white hover:border-red-500 transition-all shadow-sm"
              title="Character.AI"
            >
              <span className="text-[6px] font-black tracking-tighter">C.AI</span>
            </a>
            <a
              href="https://xoul.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-6 h-6 rounded-full bg-red-950/40 border border-red-800/40 flex items-center justify-center text-red-300 hover:text-white hover:border-red-500 transition-all shadow-sm"
              title="Xoul"
            >
              <span className="text-[6px] font-black tracking-tighter">XOL</span>
            </a>
          </div>
        </footer>
      </main>

      {/* Scroll Up/Down Floating Buttons */}
      <div className="fixed right-4 bottom-[74px] md:hidden z-[2000] flex flex-col gap-2 transition-all duration-300">
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Cuộn lên đầu trang (di động)"
          title="Lên đầu trang"
          className="w-10 h-10 rounded-full bg-[#090203]/90 border border-red-800/70 text-red-300 shadow-[0_4px_20px_rgba(0,0,0,0.6)] backdrop-blur-md flex items-center justify-center hover:bg-red-950 active:scale-90 transition-all cursor-pointer"
        >
          <ArrowUp className="w-4 h-4 stroke-[2.5]" />
        </button>
        <button
          type="button"
          onClick={scrollToBottom}
          aria-label="Cuộn xuống cuối trang (di động)"
          title="Xuống cuối trang"
          className="w-10 h-10 rounded-full bg-[#090203]/90 border border-red-800/70 text-red-300 shadow-[0_4px_20px_rgba(0,0,0,0.6)] backdrop-blur-md flex items-center justify-center hover:bg-red-950 active:scale-90 transition-all cursor-pointer"
        >
          <ArrowDown className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

      <div className="fixed right-6 top-[35%] -translate-y-[calc(50%+76px)] hidden md:flex items-center gap-2 z-[2000] transition-all duration-300">
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Lên đầu trang"
          title="Lên đầu trang"
          className="w-11 h-10 rounded-xl bg-[#090203]/90 border border-red-800/70 text-red-300 shadow-[0_4px_20px_rgba(0,0,0,0.6)] backdrop-blur-md flex items-center justify-center hover:bg-red-950 hover:text-white hover:border-red-500 active:scale-95 transition-all cursor-pointer group"
        >
          <ArrowUp className="w-4 h-4 stroke-[2.5] group-hover:-translate-y-0.5 transition-transform" />
        </button>
        <button
          type="button"
          onClick={scrollToBottom}
          aria-label="Xuống cuối trang"
          title="Xuống cuối trang"
          className="w-11 h-10 rounded-xl bg-[#090203]/90 border border-red-800/70 text-red-300 shadow-[0_4px_20px_rgba(0,0,0,0.6)] backdrop-blur-md flex items-center justify-center hover:bg-red-950 hover:text-white hover:border-red-500 active:scale-95 transition-all cursor-pointer group"
        >
          <ArrowDown className="w-4 h-4 stroke-[2.5] group-hover:translate-y-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}
