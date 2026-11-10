import React, { useRef, useState } from 'react';
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Heart,
  Copy,
  Check,
  Sparkles
} from 'lucide-react';
import { BOTS_DATA } from '../data/bots';
import { getAvatarObjectPosition, parseBoldMarkdown } from '../utils/botUtils';
import { playClickSound } from '../utils/sound';

interface AccordionPanelProps {
  title: string;
  content: React.ReactNode;
  defaultOpen?: boolean;
}

function AccordionPanel({ title, content, defaultOpen = false }: AccordionPanelProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="glass-panel rounded-3xl border border-red-900/40 overflow-hidden transition-all duration-300">
      <button
        type="button"
        onClick={() => {
          playClickSound();
          setIsOpen(!isOpen);
        }}
        className="w-full p-6 flex items-center justify-between text-left hover:bg-red-950/25 transition-colors group select-none cursor-pointer"
      >
        <h3 className="text-sm uppercase tracking-widest text-red-200 font-bold group-hover:text-white transition-colors">
          {title}
        </h3>
        <div className="w-8 h-8 rounded-full bg-red-950/40 group-hover:bg-red-900/50 border border-red-800/40 flex items-center justify-center text-red-400 group-hover:text-red-200 transition-all">
          {isOpen ? (
            <ChevronUp className="w-4 h-4 transition-transform duration-300" />
          ) : (
            <ChevronDown className="w-4 h-4 transition-transform duration-300" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="px-6 pb-6 border-t border-red-900/25 pt-4 animate-in fade-in slide-in-from-top-2 duration-200">
          {content}
        </div>
      )}
    </div>
  );
}

interface BotProfileProps {
  botId: string;
  onBack: () => void;
}

export function BotProfile({ botId, onBack }: BotProfileProps) {
  const bot = BOTS_DATA.find((b) => b.id === botId);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [liked, setLiked] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('janced_liked_bots') || '[]');
      return Array.isArray(saved) && saved.includes(botId);
    } catch {
      return false;
    }
  });
  const [copiedGreeting, setCopiedGreeting] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [imgDims, setImgDims] = useState<{ w: number; h: number } | null>(null);

  if (!bot) return null;

  const avatarObjectPosition = getAvatarObjectPosition(
    bot,
    'circle',
    imgDims?.w,
    imgDims?.h
  );

  const toggleLike = () => {
    playClickSound();
    const next = !liked;
    setLiked(next);
    try {
      const saved: string[] = JSON.parse(localStorage.getItem('janced_liked_bots') || '[]');
      const updated = next
        ? [...saved.filter((id) => id !== botId), botId]
        : saved.filter((id) => id !== botId);
      localStorage.setItem('janced_liked_bots', JSON.stringify(updated));
    } catch {
      // Ignore storage errors
    }
  };

  const handleCopyGreeting = () => {
    if (!bot.greeting) return;
    navigator.clipboard?.writeText(bot.greeting).catch(() => {});
    setCopiedGreeting(true);
    setTimeout(() => setCopiedGreeting(false), 2000);
  };

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  const renderFormattedText = (text?: string) => {
    const tokens = parseBoldMarkdown(text);
    return tokens.map((token, idx) =>
      token.type === 'bold' ? (
        <strong key={idx} className="font-bold text-red-200">
          {token.text}
        </strong>
      ) : (
        <React.Fragment key={idx}>{token.text}</React.Fragment>
      )
    );
  };

  return (
    <div className="flex flex-col h-full w-full bg-transparent">
      <header className="sticky top-0 z-50 p-4 flex items-center justify-center bg-[#060102]/80 backdrop-blur-md border-b border-red-900/40 shadow-sm relative">
        <button
          type="button"
          onClick={() => {
            playClickSound();
            onBack();
          }}
          aria-label="Quay lại trang chủ"
          className="absolute left-4 w-10 h-10 rounded-full flex items-center justify-center text-red-200 hover:bg-red-950/50 border border-red-900/40 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center truncate max-w-[70%]">
          <h1 className="text-lg font-bold text-zinc-100 serif-title">
            {bot.name}
          </h1>
          <p className="text-[10px] text-red-300/80 truncate">
            {bot.description}
          </p>
        </div>

        <button
          type="button"
          onClick={toggleLike}
          aria-label={liked ? 'Bỏ yêu thích' : 'Yêu thích nhân vật'}
          className={`absolute right-4 w-10 h-10 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
            liked
              ? 'bg-red-600/25 border-red-500 text-red-400 shadow-[0_0_15px_rgba(220,38,38,0.4)]'
              : 'bg-red-950/30 border-red-900/40 text-zinc-400 hover:text-red-300'
          }`}
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
        </button>
      </header>

      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar relative"
      >
        <div className="max-w-2xl mx-auto p-4 md:p-8 space-y-8 pb-20">
          <div className="flex flex-col items-center">
            <div className="w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-red-700/70 shadow-[0_0_40px_rgba(220,38,38,0.35)] mb-6 relative bg-zinc-900">
              <img
                src={bot.avatar}
                alt={bot.name}
                referrerPolicy="no-referrer"
                onLoad={(e) => {
                  const el = e.currentTarget;
                  if (el.naturalWidth && el.naturalHeight) {
                    setImgDims({ w: el.naturalWidth, h: el.naturalHeight });
                  }
                }}
                style={{
                  objectPosition: avatarObjectPosition,
                  transformOrigin: '55% 28%',
                  transform:
                    bot.avatarScale && bot.avatarScale > 1
                      ? `scale(${bot.avatarScale})`
                      : undefined
                }}
                className="w-full h-full object-cover"
              />
            </div>

            <h1 className="text-3xl font-bold text-zinc-100 text-center mb-1.5 serif-title">
              {bot.name}
            </h1>

            {bot.age && (
              <span className="text-xs text-red-400 font-semibold tracking-wider uppercase mb-2">
                Tuổi: {bot.age}
              </span>
            )}

            <p className="text-sm text-red-200/80 italic text-center mb-5">
              {bot.description}
            </p>

            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {bot.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-red-950/35 text-red-200 rounded-full text-[10px] font-semibold border border-red-800/50 shadow-sm backdrop-blur-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href={bot.link || '#'}
                target={bot.link ? '_blank' : '_self'}
                rel="noreferrer"
                onClick={(e) => {
                  if (!bot.link) {
                    e.preventDefault();
                    setToastMsg(`Sắp ra mắt! Link tới model trò chuyện của ${bot.name} đang được cập nhật.`);
                    setTimeout(() => setToastMsg(null), 3500);
                  }
                }}
                className="group flex items-center gap-2 bg-gradient-to-r from-red-800 via-red-600 to-red-800 hover:from-red-700 hover:via-red-500 hover:to-red-700 text-white border border-red-400/50 px-7 py-3 rounded-full font-bold shadow-[0_0_25px_rgba(220,38,38,0.45)] transition-all hover:-translate-y-0.5 text-sm"
              >
                <Sparkles className="w-4 h-4 text-red-200" />
                <span>Chơi với {bot.name}</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              <button
                type="button"
                onClick={handleCopyGreeting}
                className="flex items-center gap-1.5 px-5 py-3 rounded-full bg-red-950/40 hover:bg-red-900/50 border border-red-800/60 text-red-200 text-xs font-semibold transition-all cursor-pointer"
              >
                {copiedGreeting ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-red-400" />
                    <span>Đã sao chép mở đầu</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Mở Đầu</span>
                  </>
                )}
              </button>
            </div>

            {toastMsg && (
              <div className="mt-4 px-4 py-2 rounded-xl bg-red-950/80 border border-red-600/50 text-red-200 text-xs text-center">
                {toastMsg}
              </div>
            )}
          </div>

          <div className="grid gap-6">
            {bot.backstory && (
              <div className="glass-panel p-6 rounded-3xl border border-red-900/40">
                <h3 className="text-sm uppercase tracking-widest text-red-300 font-bold mb-3">
                  Backstory
                </h3>
                <p className="text-zinc-200 whitespace-pre-wrap text-sm leading-relaxed">
                  {renderFormattedText(bot.backstory)}
                </p>
              </div>
            )}

            <div className="glass-panel p-6 rounded-3xl border border-red-900/40">
              <h3 className="text-sm uppercase tracking-widest text-red-300 font-bold mb-3">
                Mở đầu
              </h3>
              <p className="text-zinc-200 whitespace-pre-wrap text-sm leading-relaxed italic">
                {renderFormattedText(bot.greeting)}
              </p>
            </div>

            {bot.charProfile && (
              <AccordionPanel
                title="Hồ sơ nhân vật"
                defaultOpen={true}
                content={
                  <p className="text-zinc-200 whitespace-pre-wrap text-sm leading-relaxed">
                    {renderFormattedText(bot.charProfile)}
                  </p>
                }
              />
            )}

            {bot.lore && (
              <AccordionPanel
                title="HIDDEN LORE (spoil ⚠️)"
                content={
                  <p className="text-zinc-200 whitespace-pre-wrap text-sm leading-relaxed">
                    {renderFormattedText(bot.lore)}
                  </p>
                }
              />
            )}

            {bot.worldBuilding && (
              <AccordionPanel
                title="World-Building"
                content={
                  <p className="text-zinc-200 whitespace-pre-wrap text-sm leading-relaxed">
                    {renderFormattedText(bot.worldBuilding)}
                  </p>
                }
              />
            )}

            {bot.NPCsProfile && (
              <AccordionPanel
                title="Các nhân vật phụ"
                content={
                  <p className="text-zinc-200 whitespace-pre-wrap text-sm leading-relaxed">
                    {renderFormattedText(bot.NPCsProfile)}
                  </p>
                }
              />
            )}

            {bot.command && (
              <AccordionPanel
                title="Các lệnh"
                content={
                  <p className="text-zinc-200 whitespace-pre-wrap text-sm leading-relaxed">
                    {renderFormattedText(bot.command)}
                  </p>
                }
              />
            )}

            {bot.charPrompt && bot.charPrompt.length > 0 && (
              <AccordionPanel
                title="Tính cách / Tương tác"
                content={
                  <p className="text-zinc-200 whitespace-pre-wrap text-sm leading-relaxed opacity-90">
                    {renderFormattedText(bot.charPrompt)}
                  </p>
                }
              />
            )}
          </div>
        </div>

        <div className="fixed bottom-6 right-4 z-40 flex flex-col gap-2">
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Cuộn lên đầu trang"
            title="Cuộn lên đầu trang"
            className="w-10 h-10 rounded-full bg-[#090203]/90 backdrop-blur-md border border-red-800/60 text-red-400 hover:text-white hover:bg-red-900/70 flex items-center justify-center shadow-2xl transition-all active:scale-90 cursor-pointer group"
          >
            <ChevronUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
          </button>

          <button
            type="button"
            onClick={scrollToBottom}
            aria-label="Cuộn xuống cuối trang"
            title="Cuộn xuống cuối trang"
            className="w-10 h-10 rounded-full bg-[#090203]/90 backdrop-blur-md border border-red-800/60 text-red-400 hover:text-white hover:bg-red-900/70 flex items-center justify-center shadow-2xl transition-all active:scale-90 cursor-pointer group"
          >
            <ChevronDown className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
