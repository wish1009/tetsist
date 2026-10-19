import React from 'react';
import { RotateCcw, Sparkles, Wand2, Star } from 'lucide-react';

interface CelebrationModalProps {
  isOpen: boolean;
  score: number;
  stars: number;
  lines: number;
  onRestart: () => void;
  onRescueContinue: () => void;
  onOpenStickerBook: () => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  isOpen,
  score,
  stars,
  lines,
  onRestart,
  onRescueContinue,
  onOpenStickerBook,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-amber-950/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 border-4 border-amber-300 shadow-2xl relative overflow-hidden flex flex-col items-center text-center">
        {/* Top Floating Stars */}
        <div className="w-20 h-20 rounded-3xl bg-linear-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-4xl shadow-lg border-2 border-white animate-pop mb-3">
          🎉
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-amber-950">
          정말 잘했어요! 짝짝짝!
        </h2>
        <p className="text-xs sm:text-sm text-amber-800 mt-1">
          블록들을 차곡차곡 멋지게 맞췄어요!
        </p>

        {/* Stats Card */}
        <div className="w-full my-4 p-4 rounded-2xl bg-amber-50/80 border-2 border-amber-200 grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-amber-700">모은 별</span>
            <div className="flex items-center gap-1 mt-0.5">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="text-2xl font-black text-amber-600 tabular-nums">
                {stars}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center border-x border-amber-200">
            <span className="text-xs font-bold text-sky-700">완성한 줄</span>
            <span className="text-2xl font-black text-sky-600 tabular-nums mt-0.5">
              {lines}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-purple-700">최종 점수</span>
            <span className="text-2xl font-black text-purple-600 tabular-nums mt-0.5">
              {score}
            </span>
          </div>
        </div>

        {/* Encouraging Mascot Message */}
        <div className="flex items-center gap-2.5 p-2.5 bg-yellow-100/60 rounded-xl border border-yellow-300/60 mb-5 text-left w-full">
          <span className="text-2xl shrink-0">🧸</span>
          <p className="text-xs text-amber-900 font-bold leading-snug">
            "너무 멋진 솜씨야! 별을 모아서 새로운 스티커도 확인해봐!"
          </p>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5">
          {/* Rescue Angel: Continue this round! */}
          <button
            type="button"
            onClick={onRescueContinue}
            className="kid-btn w-full py-3 px-4 rounded-2xl bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-black text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Wand2 className="w-4 h-4 text-yellow-200 animate-wiggle" />
            <span>요술별 마법으로 계속 이어하기! 🪄</span>
          </button>

          {/* New Game */}
          <button
            type="button"
            onClick={onRestart}
            className="kid-btn w-full py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>새로운 모험 시작하기 🧸</span>
          </button>

          {/* Check Sticker Book */}
          <button
            type="button"
            onClick={onOpenStickerBook}
            className="kid-btn w-full py-2.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>내 스티커북 구경가기</span>
          </button>
        </div>
      </div>
    </div>
  );
};
