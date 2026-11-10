import React, { useState } from 'react';
import { BotCharacter } from '../data/bots';
import { getAvatarObjectPosition } from '../utils/botUtils';
import { playClickSound } from '../utils/sound';

interface BotCardProps {
  bot: BotCharacter;
  onClick: () => void;
}

export function BotCard({ bot, onClick }: BotCardProps) {
  const [imgError, setImgError] = useState(false);
  const [imgDims, setImgDims] = useState<{ w: number; h: number } | null>(null);

  const objectPosition = getAvatarObjectPosition(
    bot,
    'card',
    imgDims?.w,
    imgDims?.h
  );

  return (
    <button
      type="button"
      onClick={() => {
        playClickSound();
        onClick();
      }}
      aria-label={bot.name}
      className="w-full h-[260px] text-left transition-all duration-300 hover:-translate-y-1.5 relative rounded-[20px] overflow-hidden cursor-pointer shadow-[0_8px_24px_rgba(0,0,0,0.65)] hover:shadow-[0_12px_32px_rgba(220,38,38,0.28)] group border border-red-900/35 hover:border-red-500/60 isolate bg-[#0c0204]"
      style={{ transform: 'translateZ(0)', willChange: 'transform' }}
    >
      {!imgError ? (
        <img
          src={bot.avatar}
          alt={bot.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          onLoad={(e) => {
            const el = e.currentTarget;
            if (el.naturalWidth && el.naturalHeight) {
              setImgDims({ w: el.naturalWidth, h: el.naturalHeight });
            }
          }}
          onError={() => setImgError(true)}
          style={{ objectPosition }}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-red-950 via-black to-red-900 flex items-center justify-center p-4">
          <span className="text-red-300/60 font-serif italic text-lg text-center">
            {bot.name}
          </span>
        </div>
      )}

      {bot.isNew && (
        <div className="absolute top-2.5 left-2.5 z-20 px-2 py-0.5 rounded-full bg-red-600/30 border border-red-500/60 backdrop-blur-md animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.45)]">
          <span className="text-[8px] font-bold text-red-100 uppercase tracking-wider flex items-center gap-1">
            new try <span className="text-[10px]">𝜗ৎ</span>
          </span>
        </div>
      )}

      <div
        className="absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-black/95 via-black/55 to-transparent pointer-events-none"
        style={{ transform: 'translateZ(0)' }}
      />

      <div
        className="absolute inset-x-0 bottom-0 z-10 p-4 pointer-events-none w-full"
        style={{ transform: 'translateZ(0)' }}
      >
        <h3 className="text-sm font-bold leading-tight drop-shadow-md text-white group-hover:text-red-200 transition-colors line-clamp-1">
          {bot.name}
        </h3>
        <p className="text-[10px] italic text-red-200/85 drop-shadow-md mt-1 line-clamp-1">
          {bot.description}
        </p>
        <p className="text-[9px] font-medium drop-shadow-md text-zinc-400 mt-1.5 line-clamp-1">
          {bot.tags.map((t) => `#${t}`).join(' ')}
        </p>
      </div>
    </button>
  );
}
