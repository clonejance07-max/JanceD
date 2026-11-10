/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BackgroundParticles, HeartCursor } from './components/AmbientEffects';
import { DisclaimerModal } from './components/DisclaimerModal';
import { HomeView } from './components/HomeView';
import { BotProfile } from './components/BotProfile';
import { GachaWidget } from './components/GachaWidget';
import { MusicPlayer } from './components/MusicPlayer';

function getInitialBotId(): string | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  const botParam = params.get('bot');
  if (botParam) return botParam;
  const hash = window.location.hash.replace(/^#\/?/, '');
  if (hash) {
    return hash.startsWith('bot=') ? hash.replace('bot=', '') : hash;
  }
  return null;
}

function getInitialAcceptedDisclaimer(): boolean {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  if (params.get('autostart') === '1' || params.get('bot')) {
    return true;
  }
  try {
    return sessionStorage.getItem('hasAcceptedDisclaimer') === 'true';
  } catch {
    return false;
  }
}

export default function App() {
  const [selectedBotId, setSelectedBotId] = useState<string | null>(getInitialBotId);
  const [hasAcceptedDisclaimer, setHasAcceptedDisclaimer] = useState<boolean>(
    getInitialAcceptedDisclaimer
  );

  const handleAcceptDisclaimer = () => {
    try {
      sessionStorage.setItem('hasAcceptedDisclaimer', 'true');
    } catch {
      // Ignore storage errors
    }
    setHasAcceptedDisclaimer(true);
  };

  useEffect(() => {
    const syncFromUrl = () => {
      setSelectedBotId(getInitialBotId());
    };
    window.addEventListener('popstate', syncFromUrl);
    window.addEventListener('hashchange', syncFromUrl);
    return () => {
      window.removeEventListener('popstate', syncFromUrl);
      window.removeEventListener('hashchange', syncFromUrl);
    };
  }, []);

  const handleSelectBot = (botId: string | null) => {
    setSelectedBotId(botId);
    if (botId) {
      const nextUrl = `${window.location.pathname}?bot=${encodeURIComponent(botId)}`;
      window.history.pushState({ botId }, '', nextUrl);
    } else {
      window.history.pushState({ botId: null }, '', window.location.pathname);
    }
  };

  if (!hasAcceptedDisclaimer) {
    return (
      <div className="h-screen w-full font-sans overflow-hidden flex flex-col relative selection:bg-red-600/30 selection:text-white bg-[#050102]">
        <BackgroundParticles />
        <div className="fixed top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-red-600/10 blur-3xl pointer-events-none" />
        <div className="fixed bottom-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full bg-red-900/15 blur-3xl pointer-events-none" />
        <DisclaimerModal onSuccess={handleAcceptDisclaimer} />
        <HeartCursor />
      </div>
    );
  }

  return (
    <div className="h-screen w-full font-sans overflow-hidden flex flex-col relative selection:bg-red-600/30 selection:text-white">
      <BackgroundParticles />
      <div className="fixed top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-red-600/10 blur-3xl pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full bg-red-900/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {selectedBotId ? (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full w-full"
            >
              <BotProfile
                botId={selectedBotId}
                onBack={() => handleSelectBot(null)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-full overflow-y-auto w-full custom-scrollbar"
            >
              <HomeView onSelectBot={handleSelectBot} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!selectedBotId && <GachaWidget onSelectBot={handleSelectBot} />}
      <MusicPlayer />
      <HeartCursor />
    </div>
  );
}
