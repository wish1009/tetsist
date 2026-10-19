import React, { useRef } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, ArrowDown, Zap } from 'lucide-react';

interface KidControlsProps {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onRotate: () => void;
  onSoftDrop: () => void;
  onHardDrop: () => void;
  disabled?: boolean;
}

export const KidControls: React.FC<KidControlsProps> = ({
  onMoveLeft,
  onMoveRight,
  onRotate,
  onSoftDrop,
  onHardDrop,
  disabled = false,
}) => {
  // Support continuous movement when holding down left or right
  const repeatTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startRepeat = (action: () => void) => {
    if (disabled) return;
    action();
    if (repeatTimerRef.current) clearInterval(repeatTimerRef.current);
    // Initial delay then repeat
    const timeout = setTimeout(() => {
      repeatTimerRef.current = setInterval(action, 90);
    }, 220);
    repeatTimerRef.current = timeout;
  };

  const stopRepeat = () => {
    if (repeatTimerRef.current) {
      clearInterval(repeatTimerRef.current);
      clearTimeout(repeatTimerRef.current);
      repeatTimerRef.current = null;
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center gap-3 select-none">
      {/* Primary Big Touch Controls */}
      <div className="grid grid-cols-4 gap-2.5 sm:gap-4 w-full">
        {/* Left Button */}
        <button
          type="button"
          disabled={disabled}
          onMouseDown={() => startRepeat(onMoveLeft)}
          onMouseUp={stopRepeat}
          onMouseLeave={stopRepeat}
          onTouchStart={() => startRepeat(onMoveLeft)}
          onTouchEnd={stopRepeat}
          className={`kid-btn h-16 sm:h-20 rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center gap-1 font-black shadow-lg transition-transform active:translate-y-1.5 cursor-pointer ${
            disabled
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              : 'bg-sky-400 hover:bg-sky-500 text-white shadow-sky-500/30 border-b-4 border-sky-600'
          }`}
          aria-label="왼쪽으로 이동"
        >
          <ArrowLeft className="w-7 h-7 sm:w-9 sm:h-9 stroke-[3]" />
          <span className="text-[11px] sm:text-xs">왼쪽</span>
        </button>

        {/* Rotate Button (Hero Action - larger / vibrant) */}
        <button
          type="button"
          disabled={disabled}
          onClick={onRotate}
          className={`kid-btn h-16 sm:h-20 rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center gap-1 font-black shadow-lg transition-transform active:translate-y-1.5 cursor-pointer ${
            disabled
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              : 'bg-amber-400 hover:bg-amber-500 text-amber-950 shadow-amber-500/30 border-b-4 border-amber-600'
          }`}
          aria-label="블록 돌리기"
        >
          <RotateCw className="w-7 h-7 sm:w-9 sm:h-9 stroke-[3] animate-spin-once" />
          <span className="text-[11px] sm:text-xs">돌리기 🔄</span>
        </button>

        {/* Right Button */}
        <button
          type="button"
          disabled={disabled}
          onMouseDown={() => startRepeat(onMoveRight)}
          onMouseUp={stopRepeat}
          onMouseLeave={stopRepeat}
          onTouchStart={() => startRepeat(onMoveRight)}
          onTouchEnd={stopRepeat}
          className={`kid-btn h-16 sm:h-20 rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center gap-1 font-black shadow-lg transition-transform active:translate-y-1.5 cursor-pointer ${
            disabled
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              : 'bg-sky-400 hover:bg-sky-500 text-white shadow-sky-500/30 border-b-4 border-sky-600'
          }`}
          aria-label="오른쪽으로 이동"
        >
          <ArrowRight className="w-7 h-7 sm:w-9 sm:h-9 stroke-[3]" />
          <span className="text-[11px] sm:text-xs">오른쪽</span>
        </button>

        {/* Soft Drop Button */}
        <button
          type="button"
          disabled={disabled}
          onMouseDown={() => startRepeat(onSoftDrop)}
          onMouseUp={stopRepeat}
          onMouseLeave={stopRepeat}
          onTouchStart={() => startRepeat(onSoftDrop)}
          onTouchEnd={stopRepeat}
          className={`kid-btn h-16 sm:h-20 rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center gap-1 font-black shadow-lg transition-transform active:translate-y-1.5 cursor-pointer ${
            disabled
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              : 'bg-emerald-400 hover:bg-emerald-500 text-white shadow-emerald-500/30 border-b-4 border-emerald-600'
          }`}
          aria-label="천천히 내리기"
        >
          <ArrowDown className="w-7 h-7 sm:w-9 sm:h-9 stroke-[3]" />
          <span className="text-[11px] sm:text-xs">내리기</span>
        </button>
      </div>

      {/* Secondary Fast Drop Button */}
      <div className="w-full flex items-center justify-center">
        <button
          type="button"
          disabled={disabled}
          onClick={onHardDrop}
          className={`kid-btn w-full sm:w-4/5 py-3 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-md transition-transform active:translate-y-1 cursor-pointer ${
            disabled
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-linear-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white border-b-3 border-orange-600 shadow-orange-500/20'
          }`}
        >
          <Zap className="w-5 h-5 text-yellow-200 fill-yellow-200" />
          <span>쏙 넣기! (한 번에 쿵!)</span>
        </button>
      </div>

      {/* Keyboard Guidance (For laptop/desktop players) */}
      <div className="hidden sm:flex items-center justify-center gap-3 text-[11px] text-slate-500 font-medium">
        <span>키보드 조작:</span>
        <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-slate-700 font-mono">←</kbd>
        <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-slate-700 font-mono">→</kbd>
        <span>이동</span>
        <span>·</span>
        <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-slate-700 font-mono">↑</kbd>
        <span>회전</span>
        <span>·</span>
        <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-slate-700 font-mono">↓</kbd>
        <span>내리기</span>
        <span>·</span>
        <kbd className="px-2 py-0.5 bg-slate-100 border border-slate-300 rounded text-slate-700 font-mono">Space</kbd>
        <span>쿵!</span>
        <span>·</span>
        <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-slate-700 font-mono">Z</kbd>
        <span>되돌리기</span>
      </div>
    </div>
  );
};
