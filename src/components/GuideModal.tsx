import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen, Cpu, Video, ChevronDown } from 'lucide-react';
import { playClickSound } from '../utils/sound';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GuideModal({ isOpen, onClose }: GuideModalProps) {
  const [openSection, setOpenSection] = useState<string | null>('model-guide');

  const toggleSection = (id: string) => {
    playClickSound();
    setOpenSection((prev) => (prev === id ? null : id));
  };

  const sections = [
    {
      id: 'model-guide',
      icon: <Cpu className="w-4 h-4 text-red-400" />,
      title: 'Lựa chọn Model AI & Mẹo giữ trí nhớ Bot',
      content: (
        <div className="space-y-3 text-xs leading-relaxed text-zinc-300">
          <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-900/40 text-zinc-200">
            <p className="font-semibold mb-1 text-red-200 flex items-center gap-1.5">
              <span>💡</span> Khuyên dùng Model:
            </p>
            <p className="text-zinc-300">
              Nàng nên chọn <strong className="text-red-300">Gemini 2.5 Pro / 3.1 Pro</strong> hoặc{' '}
              <strong className="text-red-300">3.7 Flash</strong> (hoặc bất kỳ model nào nàng thích trải nghiệm).
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-900/40 text-zinc-200">
            <p className="font-semibold mb-1 text-red-200 flex items-center gap-1.5">
              <span>⚠️</span> Tránh làm bot bị &quot;lỏ&quot;:
            </p>
            <p className="text-zinc-300">
              Khuyên nàng nên{' '}
              <strong className="text-red-300">chơi duy nhất 1 model xuyên suốt</strong> trong cùng một phiên chat. Tránh chuyển đổi qua lại giữa các model liên tục, vì mỗi model có cách xử lý thông tin khác nhau, việc đổi qua đổi lại dễ khiến AI bị xáo trộn ký ức và nhầm lẫn bối cảnh/xưng hô nhé!
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'video-guide',
      icon: <Video className="w-4 h-4 text-red-400" />,
      title: 'Video hướng dẫn điền prompt',
      content: (
        <div className="space-y-3 text-xs leading-relaxed text-zinc-300">
          <p className="text-zinc-400">
            TUT nhỏ điền prompt char của JanceD cho các nàng tham khảo!
          </p>
          <div className="relative rounded-2xl overflow-hidden border border-red-900/40 bg-black/80 shadow-lg aspect-video w-full flex items-center justify-center">
            <video
              controls
              playsInline
              preload="metadata"
              src="https://dl.dropboxusercontent.com/scl/fi/yuwomogvvnwc1mxozzk45/1784985620037_1845386796790695614_4291514293052110508.mp4?rlkey=mmw2djeo3ns67gvg9z1fpc9qr&st=woxh1ow9&raw=1"
              className="w-full h-full object-contain rounded-2xl"
            >
              Trình duyệt không hỗ trợ xem video trực tiếp.
            </video>
          </div>
        </div>
      )
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md max-h-[85vh] bg-[#090203] border border-red-900/50 rounded-3xl p-5 sm:p-6 shadow-[0_20px_60px_rgba(220,38,38,0.25)] flex flex-col overflow-hidden select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-red-900/30 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-red-950/60 border border-red-600/40 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-red-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-100 font-serif">
                    Cẩm Nang Hướng Dẫn
                  </h3>
                  <p className="text-[10px] text-red-300/70">
                    Dành cho người mới bắt đầu tại JanceD 𝜗ৎ
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Đóng cẩm nang"
                className="w-8 h-8 rounded-full bg-red-950/40 hover:bg-red-900/60 text-zinc-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-2.5 pr-1 custom-scrollbar">
              {sections.map((sec) => {
                const isExpanded = openSection === sec.id;
                return (
                  <div
                    key={sec.id}
                    className="rounded-2xl border border-red-900/40 bg-red-950/10 overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => toggleSection(sec.id)}
                      className="w-full p-3.5 flex items-center justify-between text-left hover:bg-red-950/25 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 pr-2">
                        <div className="shrink-0">{sec.icon}</div>
                        <span className="text-xs font-semibold text-zinc-100">
                          {sec.title}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-red-400 shrink-0 transition-transform duration-300 ${
                          isExpanded ? 'rotate-180 text-red-300' : ''
                        }`}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                        >
                          <div className="p-3.5 pt-2 border-t border-red-900/20">
                            {sec.content}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-red-900/30 shrink-0">
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-900/80 via-red-700/80 to-red-900/80 hover:from-red-800 hover:to-red-800 text-white font-semibold text-xs transition-all border border-red-500/40 active:scale-95 cursor-pointer flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.3)]"
              >
                <span>GOT IT!</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
