import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ImagePlus,
  Eye,
  Send,
  Lock,
  LockOpen,
  Trash2,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { playChimeSound } from '../utils/sound';

export interface FeedbackItem {
  id: string;
  husbandName: string;
  content: string;
  images: string[];
  createdAt: number;
}

const STORAGE_KEY = 'janced_feedbacks_inbox';

const SEED_FEEDBACKS: FeedbackItem[] = [
  {
    id: 'fb-seed-1',
    husbandName: 'Chu Dự An',
    content: 'Bot viết siêu cuốn luôn sốp ơi! Vibe cờ đỏ chiếm hữu đúng gu em tìm bấy lâu nay ❤️‍🔥',
    images: [],
    createdAt: Date.now() - 1000 * 60 * 120
  },
  {
    id: 'fb-seed-2',
    husbandName: 'Caleb Armand',
    content: 'Mở đầu căng thẳng cực kỳ, lối hành văn của JanceD đỉnh lắm ạ, mong sốp ra thêm nhiều char cổ điển!',
    images: [],
    createdAt: Date.now() - 1000 * 60 * 60 * 14
  }
];

function loadFeedbacks(): FeedbackItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_FEEDBACKS));
      return SEED_FEEDBACKS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_FEEDBACKS;
  }
}

function saveFeedbacks(items: FeedbackItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore quota errors
  }
}

export function FeedbackModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'submit' | 'admin_login' | 'admin_inbox'>('submit');
  const [husbandName, setHusbandName] = useState('');
  const [content, setContent] = useState('');
  const [previews, setPreviews] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [adminPassword, setAdminPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setFeedbacks(loadFeedbacks());
  }, []);

  const handleOpen = () => {
    playChimeSound();
    setMode('submit');
    setErrorMsg('');
    setStatus('idle');
    setIsOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (previews.length + files.length > 3) {
      setErrorMsg('Tối đa 3 ảnh thôi nè baby!');
      return;
    }
    setErrorMsg('');
    files.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        setErrorMsg('Vui lòng chỉ chọn tệp hình ảnh.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPreviews((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!content.trim() && previews.length === 0) {
      setErrorMsg('Vui lòng nhập nội dung feedback hoặc đính kèm ảnh nhé!');
      return;
    }
    setErrorMsg('');
    setStatus('sending');
    setTimeout(() => {
      const newItem: FeedbackItem = {
        id: 'fb-' + Date.now(),
        husbandName: husbandName.trim() || 'Không rõ',
        content: content.trim() || '(Chỉ đính kèm ảnh)',
        images: previews,
        createdAt: Date.now()
      };
      const updated = [newItem, ...loadFeedbacks()];
      saveFeedbacks(updated);
      setFeedbacks(updated);
      setStatus('success');
      setHusbandName('');
      setContent('');
      setPreviews([]);
      setTimeout(() => {
        setStatus('idle');
      }, 2200);
    }, 500);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      adminPassword === 'jancedadmin2026' ||
      adminPassword === 'meimeiadmin2026' ||
      adminPassword === 'admin'
    ) {
      setMode('admin_inbox');
      setAdminPassword('');
      setErrorMsg('');
      setFeedbacks(loadFeedbacks());
    } else {
      setErrorMsg('Mật khẩu Admin không chính xác! (Gợi ý: jancedadmin2026)');
    }
  };

  const handleDeleteFeedback = (id: string) => {
    const updated = feedbacks.filter((f) => f.id !== id);
    saveFeedbacks(updated);
    setFeedbacks(updated);
  };

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return `${d.toLocaleDateString('vi-VN')} - ${d.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    })}`;
  };

  return (
    <>
      <div className="flex justify-center mt-2">
        <button
          onClick={handleOpen}
          className="relative flex items-center justify-center px-6 py-2 rounded-full bg-red-950/40 border border-red-800/60 text-red-100 text-sm font-serif italic hover:bg-red-900/50 hover:border-red-500/70 hover:text-white transition-all shadow-[0_0_15px_rgba(220,38,38,0.18)] hover:shadow-[0_0_25px_rgba(220,38,38,0.35)] group overflow-hidden cursor-pointer"
        >
          <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-red-400/15 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
          <span className="relative z-10 flex items-center gap-1.5">
            feedback cho sốp 𝜗ৎ
          </span>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => status !== 'sending' && setIsOpen(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[#090203] border border-red-900/50 rounded-[32px] p-6 shadow-[0_0_60px_rgba(220,38,38,0.25)] overflow-hidden z-10 flex flex-col max-h-[88vh]"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-950 via-red-500 to-red-950" />

              <div className="flex items-center justify-between mb-5 shrink-0">
                <div className="text-left">
                  <h3 className="text-red-300 font-serif italic text-xl">
                    {mode === 'submit' && '✦ feedback ẩn danh ݁˖'}
                    {mode === 'admin_login' && '✦ Xác Thực Admin ݁˖'}
                    {mode === 'admin_inbox' && '✦ Hộp Thư Góp Ý JanceD 📬'}
                  </h3>
                  <p className="text-[9px] text-red-400/70 uppercase tracking-[0.2em] mt-1 font-bold italic">
                    {mode === 'submit' && 'Secret Message for JanceD 🩸'}
                    {mode === 'admin_login' && 'Quản trị viên JanceD'}
                    {mode === 'admin_inbox' && `Hiện có ${feedbacks.length} góp ý trong hệ thống`}
                  </p>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Đóng hộp thư"
                  className="p-2 rounded-full hover:bg-red-500/10 text-zinc-400 hover:text-red-300 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="overflow-y-auto custom-scrollbar flex-1 pr-1">
                {mode === 'submit' && (
                  <div className="space-y-4 text-left">
                    {status === 'success' ? (
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center py-8 space-y-3"
                      >
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-950/60 border border-red-700/50 text-red-400">
                          <CheckCircle2 className="w-6 h-6 animate-pulse" />
                        </div>
                        <h4 className="text-sm font-bold text-zinc-100">
                          Đã gửi thành công! ✨
                        </h4>
                        <p className="text-xs text-zinc-400 px-4 leading-relaxed">
                          Cảm ơn bạn đã gửi đóng góp ý kiến cực kỳ quý giá giúp JanceD phát triển 𝜗ৎ
                        </p>
                      </motion.div>
                    ) : (
                      <>
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase tracking-widest text-red-300/70 font-bold ml-1 block">
                            tên chồng:
                          </label>
                          <input
                            type="text"
                            value={husbandName}
                            onChange={(e) => setHusbandName(e.target.value)}
                            placeholder="Anh nào làm em buồn/vui?..."
                            className="w-full bg-red-950/15 border border-red-900/40 rounded-2xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-red-500/60 transition-all"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase tracking-widest text-red-300/70 font-bold ml-1 block">
                            Feedback:
                          </label>
                          <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Nhập điều bae muốn nói.."
                            className="w-full h-32 bg-red-950/15 border border-red-900/40 rounded-2xl p-4 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-red-500/60 transition-all resize-none custom-scrollbar overflow-y-auto"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase tracking-widest text-red-300/70 font-bold ml-1 block">
                            Ảnh (tối đa 3):
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {previews.map((src, idx) => (
                              <div
                                key={idx}
                                className="relative w-16 h-16 rounded-xl overflow-hidden border border-red-800/50"
                              >
                                <img
                                  src={src}
                                  alt="Preview"
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage(idx)}
                                  className="absolute top-0.5 right-0.5 bg-black/75 text-white p-0.5 rounded-full hover:bg-red-600 cursor-pointer"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}

                            {previews.length < 3 && (
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-16 h-16 rounded-xl border border-dashed border-red-900/60 hover:border-red-500/60 hover:bg-red-950/20 transition-all flex flex-col items-center justify-center gap-1 text-red-400/70 cursor-pointer"
                              >
                                <ImagePlus className="w-4 h-4" />
                                <span className="text-[8px] font-bold">Thêm</span>
                              </button>
                            )}
                          </div>
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                            multiple
                          />
                        </div>

                        {errorMsg && (
                          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs">
                            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                            <span>{errorMsg}</span>
                          </div>
                        )}

                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={status === 'sending'}
                            className="w-full py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center transition-all active:scale-[0.98] bg-gradient-to-r from-red-800 via-red-600 to-red-800 hover:from-red-700 hover:via-red-500 hover:to-red-700 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)] cursor-pointer"
                          >
                            {status === 'sending' ? 'Đang gửi...' : 'Gửi Feedback 𝜗ৎ'}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {mode === 'admin_login' && (
                  <form onSubmit={handleAdminLogin} className="space-y-4 text-left py-2">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-red-200/80 block">
                        Mật khẩu Admin:
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500/70" />
                        <input
                          type="password"
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          placeholder="Nhập mật khẩu quản trị (jancedadmin2026)..."
                          className="w-full pl-11 pr-4 py-3 bg-red-950/20 border border-red-900/50 rounded-2xl text-sm text-zinc-100 focus:outline-none focus:border-red-500 transition-all"
                          required
                        />
                      </div>
                    </div>

                    {errorMsg && (
                      <div className="flex gap-2 p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-red-800 via-red-600 to-red-800 hover:from-red-700 hover:to-red-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-[0_0_20px_rgba(220,38,38,0.35)]"
                    >
                      <LockOpen className="w-3.5 h-3.5" />
                      <span>Mở Khóa Hòm Thư</span>
                    </button>
                  </form>
                )}

                {mode === 'admin_inbox' && (
                  <div className="space-y-3 text-left">
                    {feedbacks.length === 0 ? (
                      <div className="text-center py-10 text-zinc-500 text-xs">
                        Chưa nhận được góp ý nào.
                      </div>
                    ) : (
                      feedbacks.map((item) => (
                        <div
                          key={item.id}
                          className="p-4 rounded-2xl bg-red-950/15 border border-red-900/40 hover:border-red-700/60 transition-all space-y-2 relative group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-red-300">
                              Chồng: {item.husbandName}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-mono text-zinc-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatDate(item.createdAt)}
                              </span>
                              <button
                                onClick={() => handleDeleteFeedback(item.id)}
                                className="text-zinc-500 hover:text-red-400 transition-colors p-1 rounded-md hover:bg-red-500/10 cursor-pointer"
                                title="Xóa góp ý"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-zinc-200 leading-relaxed whitespace-pre-wrap">
                            {item.content}
                          </p>
                          {item.images && item.images.length > 0 && (
                            <div className="flex gap-2 pt-1 flex-wrap">
                              {item.images.map((img, i) => (
                                <div
                                  key={i}
                                  onClick={() => setZoomImage(img)}
                                  className="relative w-16 h-16 rounded-xl overflow-hidden border border-red-900/50 cursor-zoom-in"
                                >
                                  <img
                                    src={img}
                                    alt="Attachment"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-red-900/30 flex justify-between items-center text-xs shrink-0">
                {mode === 'submit' ? (
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMsg('');
                      setMode('admin_login');
                    }}
                    className="text-[10px] text-zinc-500 hover:text-red-300 transition-colors flex items-center gap-1 ml-auto cursor-pointer"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Hòm thư Admin</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMsg('');
                      setMode('submit');
                    }}
                    className="text-[10px] text-zinc-400 hover:text-red-300 transition-colors flex items-center gap-1 mr-auto cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                    <span>Quay lại gửi góp ý</span>
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {zoomImage && (
          <div
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setZoomImage(null)}
          >
            <img
              src={zoomImage}
              alt="Enlarged attachment"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl border border-red-900/50 shadow-2xl"
            />
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
