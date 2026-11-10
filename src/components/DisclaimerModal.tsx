import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, HeartCrack, ChevronRight } from 'lucide-react';
import { playChimeSound } from '../utils/sound';

interface DisclaimerModalProps {
  onSuccess: () => void;
}

export function DisclaimerModal({ onSuccess }: DisclaimerModalProps) {
  const [entering, setEntering] = useState(false);

  const handleEnter = () => {
    setEntering(true);
    playChimeSound();
    window.dispatchEvent(new Event('app-user-entered'));
    setTimeout(() => {
      onSuccess();
    }, 180);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl max-h-[90vh] flex flex-col bg-[#080203]/95 backdrop-blur-2xl border border-red-900/50 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(220,38,38,0.2)] relative">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-950 via-red-500 to-red-950 z-10" />

        <div className="pt-8 px-6 sm:px-10 pb-4 text-center shrink-0">
          <h1
            className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-100 serif-title neon-title"
          >
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
        </div>

        <div className="px-6 sm:px-10 pb-6 overflow-y-auto custom-scrollbar flex-1">
          <div className="w-full bg-red-950/15 border border-red-900/40 p-5 sm:p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <HeartCrack className="w-24 h-24 text-red-500" />
            </div>

            <div className="flex items-center gap-3 mb-4 text-red-200">
              <ShieldAlert className="w-6 h-6 text-red-500" />
              <h3 className="text-base sm:text-lg font-bold tracking-widest uppercase">
                Disclaimer / Cảnh báo
              </h3>
            </div>

            <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-zinc-300 relative z-10">
              <p>
                Chào mừng bạn đến với góc nhỏ của <strong className="text-red-300">JanceD</strong>. Trước khi bước vào, vui lòng lưu ý:
              </p>

              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">✦</span>
                  <span>
                    <strong className="text-red-200">Nội dung 18+:</strong> Các bot ở đây đa phần theo khuynh hướng{' '}
                    <strong className="text-red-400">Dark Romance, Ngược luyến, NSFW 🔞</strong> và có thể chứa yếu tố bạo lực tâm lý/thể xác.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">✦</span>
                  <span>
                    <strong className="text-red-200">Giả tưởng hoàn toàn:</strong> Mọi tình huống, tính cách nhân vật đều là hư cấu. JanceD{' '}
                    <strong className="text-red-400">tuyệt đối không</strong> cổ xúy hay khuyến khích các hành vi độc hại, bạo lực áp dụng vào thực tế. Hãy phân định rạch ròi giữa thế giới ảo và đời thực.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">✦</span>
                  <span>
                    <strong className="text-red-200">Thử nghiệm:</strong> Các bot hiện vẫn đang trong quá trình test và hoàn thiện. Do sốp không sử dụng Discord nên mọi thứ sẽ được pub trực tiếp tại đây. Nếu có bất kỳ lỗi nào &amp; muốn góp ý, có thể fb ẩn danh hoặc liên hệ qua FB của JanceD.
                  </span>
                </li>
              </ul>

              <p className="pt-2 text-red-200/90 font-medium italic text-center">
                Nếu bé iu đã đủ 18 tuổi và có một tinh thần thép để đón nhận những chiếc cờ đỏ rực rỡ này...
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-10 pt-2 shrink-0">
          <div className="flex justify-center items-center gap-8 mb-6">
            <a
              href="https://yodayo.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-1.5 transition-all"
            >
              <div className="w-9 h-9 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-300/70 group-hover:bg-red-600/30 group-hover:border-red-500/60 group-hover:text-red-100 transition-all shadow-sm">
                <span className="text-[9px] font-black tracking-tighter">YDY</span>
              </div>
              <span className="text-[7px] uppercase tracking-[0.2em] text-zinc-500 font-bold group-hover:text-red-400 transition-colors">
                Yodayo
              </span>
            </a>

            <a
              href="https://character.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-1.5 transition-all"
            >
              <div className="w-9 h-9 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-300/70 group-hover:bg-red-600/30 group-hover:border-red-500/60 group-hover:text-red-100 transition-all shadow-sm">
                <span className="text-[9px] font-black tracking-tighter">C.AI</span>
              </div>
              <span className="text-[7px] uppercase tracking-[0.2em] text-zinc-500 font-bold group-hover:text-red-400 transition-colors">
                C.AI
              </span>
            </a>

            <a
              href="https://xoul.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-1.5 transition-all"
            >
              <div className="w-9 h-9 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-300/70 group-hover:bg-red-600/30 group-hover:border-red-500/60 group-hover:text-red-100 transition-all shadow-sm">
                <span className="text-[9px] font-black tracking-tighter">XOL</span>
              </div>
              <span className="text-[7px] uppercase tracking-[0.2em] text-zinc-500 font-bold group-hover:text-red-400 transition-colors">
                Xoul
              </span>
            </a>
          </div>

          <button
            onClick={handleEnter}
            disabled={entering}
            className="relative w-full py-4 bg-gradient-to-r from-red-950 via-red-800 to-red-950 hover:from-red-900 hover:via-red-700 hover:to-red-900 border border-red-500/50 rounded-xl text-white font-semibold tracking-wide transition-all flex items-center justify-center gap-2 group disabled:opacity-50 shadow-[0_0_25px_rgba(220,38,38,0.3)] overflow-hidden cursor-pointer"
          >
            <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            {entering ? (
              <div className="w-5 h-5 border-2 border-red-300 border-t-white rounded-full animate-spin relative z-10" />
            ) : (
              <span className="relative z-10 flex items-center gap-2">
                mời zào đây cùng sốp{' '}
                <span className="group-hover:animate-bounce">𝜗ৎ</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
