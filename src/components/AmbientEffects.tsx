import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  isCrimson: boolean;
}

export function BackgroundParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mobile =
      typeof window !== 'undefined' &&
      (window.innerWidth < 768 || 'ontouchstart' in window);
    setIsMobile(mobile);
    const count = mobile ? 18 : 55;
    const list: Particle[] = [];
    for (let i = 0; i < count; i++) {
      list.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100 - 100,
        size: Math.random() * (mobile ? 2.2 : 3.2) + 1.2,
        duration: Math.random() * 8 + 7,
        delay: Math.random() * -15,
        isCrimson: i % 3 !== 0
      });
    }
    setParticles(list);
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ transform: 'translateZ(0)' }}
    >
      {particles.map((p) => (
        <div
          key={p.id}
          className={`absolute rounded-full ${
            p.isCrimson
              ? isMobile
                ? 'bg-red-500/40'
                : 'bg-red-500/60 shadow-[0_0_8px_rgba(239,68,68,0.75)]'
              : isMobile
              ? 'bg-rose-200/30'
              : 'bg-rose-100/45 shadow-[0_0_6px_rgba(255,228,230,0.5)]'
          }`}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animation: `particleFall ${p.duration}s linear infinite`,
            animationDelay: `${p.delay}s`,
            willChange: 'transform, opacity'
          }}
        />
      ))}
    </div>
  );
}

interface TrailHeart {
  id: number;
  x: number;
  y: number;
  size: number;
}

export function HeartCursor() {
  const [trail, setTrail] = useState<TrailHeart[]>([]);
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      const item: TrailHeart = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 11 + 8
      };
      setTrail((prev) => [...prev.slice(-10), item]);
      setTimeout(() => {
        setTrail((prev) => prev.filter((t) => t.id !== item.id));
      }, 900);
    };
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[999999] overflow-hidden hidden md:block">
      <div
        className="absolute pointer-events-none transition-transform duration-75"
        style={{
          left: pos.x,
          top: pos.y,
          transform: `translate(-50%, -50%) scale(${pressed ? 0.8 : 1})`
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="#ef4444"
          className="drop-shadow-[0_0_10px_rgba(239,68,68,0.95)]"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>
      <AnimatePresence>
        {trail.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0, rotate: 0 }}
            animate={{
              opacity: [0, 0.9, 0.6, 0],
              scale: [0.5, 1.15, 0.95, 0.4],
              rotate: [0, 18, -18, 0],
              y: item.y - 45
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="absolute"
            style={{
              left: item.x - item.size / 2,
              top: item.y - item.size / 2
            }}
          >
            <svg
              width={item.size}
              height={item.size}
              viewBox="0 0 24 24"
              fill="#dc2626"
              className="drop-shadow-[0_0_8px_rgba(220,38,38,0.85)]"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
