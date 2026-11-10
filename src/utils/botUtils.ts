import { BotCharacter } from '../data/bots';
import { Hexagram, HEXAGRAMS } from '../data/hexagrams';

/**
 * Filter and sort bots in the same order as the reference gallery:
 * - Exclude system-osin
 * - Reverse initial array and put `isNew` bots first
 * - Filter by search query (matches name or any tag case-insensitively)
 * - Filter by selectedTag (exact case-insensitive tag match)
 */
export function filterAndSortBots(
  bots: BotCharacter[],
  searchQuery: string,
  selectedTag: string | null
): BotCharacter[] {
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const normalizedTag = selectedTag ? selectedTag.trim().toLowerCase() : null;

  return [...bots]
    .reverse()
    .sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
    .filter((bot) => {
      if (bot.id === 'system-osin') return false;

      const matchesQuery =
        !normalizedQuery ||
        bot.name.toLowerCase().includes(normalizedQuery) ||
        bot.description.toLowerCase().includes(normalizedQuery) ||
        bot.tags.some((t) => t.toLowerCase().includes(normalizedQuery));

      const matchesTag =
        !normalizedTag ||
        bot.tags.some((t) => t.toLowerCase() === normalizedTag || t === selectedTag);

      return matchesQuery && matchesTag;
    });
}

/**
 * Get the recommended husbandos list (up to 5 characters).
 */
export function getRecommendedBots(bots: BotCharacter[]): BotCharacter[] {
  const recommended = bots.filter((b) => b.id !== 'system-osin' && b.isRecommended);
  if (recommended.length > 0) {
    return recommended.slice(0, 5);
  }
  return bots.filter((b) => b.id !== 'system-osin').slice(0, 5);
}

/**
 * Extract 11-char YouTube Video ID from a YouTube URL.
 */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

/**
 * Pick a random hexagram deterministically or via provided random value [0, 1).
 */
export function pickHexagram(randomVal = Math.random()): Hexagram {
  const index = Math.min(
    HEXAGRAMS.length - 1,
    Math.max(0, Math.floor(randomVal * HEXAGRAMS.length))
  );
  return HEXAGRAMS[index];
}

/**
 * Pick a random eligible husbando bot for the "Hôm nay póc ai?" gacha spinner.
 */
export function pickRandomBot(
  bots: BotCharacter[],
  randomVal = Math.random()
): BotCharacter | null {
  const eligible = bots.filter(
    (b) => b.id !== 'system-osin' && !b.id.startsWith('placeholder-')
  );
  if (eligible.length === 0) return null;
  const index = Math.min(
    eligible.length - 1,
    Math.max(0, Math.floor(randomVal * eligible.length))
  );
  return eligible[index];
}

/**
 * Parse markdown-like bold segments (**bold**) into structured tokens for rendering.
 */
export interface FormattedToken {
  type: 'text' | 'bold';
  text: string;
}

export function parseBoldMarkdown(input?: string): FormattedToken[] {
  if (!input) return [];
  const parts = input.split(/(\*\*[^*]+\*\*)/g);
  const tokens: FormattedToken[] = [];
  for (const part of parts) {
    if (!part) continue;
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      tokens.push({ type: 'bold', text: part.slice(2, -2) });
    } else {
      tokens.push({ type: 'text', text: part });
    }
  }
  return tokens;
}

/**
 * Compute optimal CSS object-position so character faces remain visible
 * in both 3:4 cards and 1:1 circular avatars across square and tall vertical portraits.
 */
export function getAvatarObjectPosition(
  bot?: { avatarPosition?: string; cardAvatarPosition?: string } | null,
  variant: 'card' | 'circle' = 'card',
  naturalWidth?: number,
  naturalHeight?: number
): string {
  if (variant === 'card' && bot?.cardAvatarPosition) {
    return bot.cardAvatarPosition;
  }
  if (bot?.avatarPosition) {
    return bot.avatarPosition;
  }
  if (naturalWidth && naturalHeight && naturalWidth > 0) {
    const ratio = naturalHeight / naturalWidth;
    if (ratio >= 1.75) {
      return variant === 'circle' ? '50% 8%' : '50% 4%';
    }
    if (ratio >= 1.25) {
      return variant === 'circle' ? '50% 20%' : '50% 14%';
    }
  }
  return variant === 'circle' ? '50% 22%' : '50% 18%';
}

