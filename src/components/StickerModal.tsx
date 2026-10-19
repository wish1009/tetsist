import React from 'react';
import { X, Sparkles, Trophy, Lock } from 'lucide-react';
import { Sticker } from '../types/game';

interface StickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  stickers: Sticker[];
  totalStars: number;
}

export const StickerModal: React.FC<StickerModalProps> = ({
  isOpen,
  onClose,
  stickers,
  totalStars,
}) => {
  if (!isOpen) return null;

  const unlockedCount = stickers.filter((s) => s.unlocked).length;

  return (
    <div className="fixed inset-0 z-50 bg-amber-950/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-7 border-4 border-amber-300 shadow-2xl relative overflow-hidden max-h-[90vh] flex flex-col">
        {/* Top Decorative Header */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-200">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 flex items-center justify-center text-2xl shadow-xs">
              ✨
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-amber-950">내 반짝이 스티커북</h2>
              <p className="text-xs text-amber-800">
                열심히 모은 황금 별과 멋진 칭찬 스티커예요!
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Star Progress Bar */}
        <div className="my-3.5 p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span className="text-xs sm:text-sm font-bold text-amber-950">
              수집 완료: {unlockedCount} / {stickers.length}개
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-400/30 rounded-full font-black text-xs text-amber-900">
            <span>★</span>
            <span className="tabular-nums">총 {totalStars}개 획득!</span>
          </div>
        </div>

        {/* Sticker Grid */}
        <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 py-1">
          {stickers.map((stk) => {
            return (
              <div
                key={stk.id}
                className={`p-3 rounded-2xl border-2 flex flex-col items-center text-center transition-all ${
                  stk.unlocked
                    ? 'bg-amber-50/70 border-amber-300 shadow-sm'
                    : 'bg-slate-50 border-dashed border-slate-300 opacity-60'
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-1.5 relative ${
                    stk.unlocked
                      ? 'bg-white shadow-xs border border-amber-200 animate-pop'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {stk.unlocked ? (
                    stk.emoji
                  ) : (
                    <Lock className="w-6 h-6 text-slate-400" />
                  )}
                  {stk.unlocked && (
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 absolute -top-1 -right-1" />
                  )}
                </div>

                <p className="text-xs sm:text-sm font-black text-slate-800 line-clamp-1">
                  {stk.name}
                </p>
                <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                  {stk.unlocked ? stk.desc : `미션: ${stk.requirement}`}
                </p>
              </div>
            );
          })}
        </div>

        {/* Footer Close Button */}
        <div className="pt-3 border-t border-amber-100 flex justify-center">
          <button
            type="button"
            onClick={onClose}
            className="kid-btn px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm shadow-md cursor-pointer"
          >
            놀이로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};
