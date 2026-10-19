import React from 'react';
import { Sparkles, Wand2, Undo2, Play, Pause, ArrowDownUp } from 'lucide-react';
import { Piece } from '../types/game';

interface SidePanelProps {
  nextPiece: Piece | null;
  holdPiece: Piece | null;
  canHold: boolean;
  onHold: () => void;
  stars: number;
  score: number;
  lines: number;
  magicWandsRemaining: number;
  onUseMagicWand: () => void;
  canUndo: boolean;
  onUndo: () => void;
  isPaused: boolean;
  onTogglePause: () => void;
  mascotMessage: string;
  isTurtleMode: boolean;
}

export const SidePanel: React.FC<SidePanelProps> = ({
  nextPiece,
  holdPiece,
  canHold,
  onHold,
  stars,
  score,
  lines,
  magicWandsRemaining,
  onUseMagicWand,
  canUndo,
  onUndo,
  isPaused,
  onTogglePause,
  mascotMessage,
  isTurtleMode,
}) => {
  // Render mini piece preview
  const renderMiniPiece = (piece: Piece | null, emptyLabel: string) => {
    if (!piece) {
      return (
        <div className="h-16 flex items-center justify-center text-xs text-amber-700/60 font-medium">
          {emptyLabel}
        </div>
      );
    }

    return (
      <div className="h-16 flex flex-col items-center justify-center gap-1">
        <div
          className="grid gap-1 p-1 bg-amber-50/60 rounded-xl border border-amber-200"
          style={{
            gridTemplateColumns: `repeat(${piece.shape[0].length}, minmax(0, 1fr))`,
          }}
        >
          {piece.shape.map((row, r) =>
            row.map((cell, c) => (
              <div
                key={`${r}-${c}`}
                className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] text-white font-bold shadow-2xs border border-white/50"
                style={{
                  backgroundColor: cell ? piece.color : 'transparent',
                  visibility: cell ? 'visible' : 'hidden',
                }}
              >
                {cell ? piece.face : ''}
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full lg:w-80 flex flex-col gap-3.5">
      {/* Mascot Cheer Box */}
      <div className="bg-white/90 border-2 border-amber-300 rounded-3xl p-3.5 shadow-md flex items-center gap-3 relative overflow-hidden">
        <div className="relative shrink-0">
          <img
            src="/src/assets/images/game_mascot_bear_1792386630380.jpg"
            alt="친절한 곰돌이 마스코트"
            referrerPolicy="no-referrer"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-300 shadow-sm"
          />
          <div className="absolute -bottom-1 -right-1 bg-amber-400 text-amber-950 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white">
            곰돌이
          </div>
        </div>

        <div className="flex-1">
          <div className="bg-amber-50 border border-amber-200/90 rounded-2xl p-2.5 shadow-2xs relative">
            {/* Bubble arrow */}
            <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-amber-50 border-l border-b border-amber-200/90 rotate-45" />
            <p className="text-xs sm:text-sm font-bold text-amber-950 leading-snug">
              {mascotMessage}
            </p>
          </div>
        </div>
      </div>

      {/* Main Stats Strip: Stars & Score */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white/95 border-2 border-amber-300/80 rounded-2xl p-2.5 flex flex-col items-center justify-center text-center shadow-xs">
          <div className="flex items-center gap-1 text-amber-600 text-xs font-semibold">
            <span className="text-amber-500">★</span>
            <span>황금 별</span>
          </div>
          <span className="text-2xl font-black text-amber-600 tabular-nums mt-0.5 animate-shine-pulse">
            {stars}
          </span>
        </div>

        <div className="bg-white/95 border-2 border-sky-300/80 rounded-2xl p-2.5 flex flex-col items-center justify-center text-center shadow-xs">
          <span className="text-sky-700 text-xs font-semibold">맞춘 줄</span>
          <span className="text-2xl font-black text-sky-600 tabular-nums mt-0.5">
            {lines}
          </span>
        </div>

        <div className="bg-white/95 border-2 border-purple-300/80 rounded-2xl p-2.5 flex flex-col items-center justify-center text-center shadow-xs">
          <span className="text-purple-700 text-xs font-semibold">점수</span>
          <span className="text-xl sm:text-2xl font-black text-purple-600 tabular-nums mt-0.5">
            {score}
          </span>
        </div>
      </div>

      {/* Next Piece & Hold Piece Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Next Piece */}
        <div className="bg-white/90 border-2 border-amber-200 rounded-2xl p-2.5 flex flex-col items-center justify-between shadow-xs">
          <span className="text-xs font-bold text-slate-700">다음 블록 친구</span>
          {renderMiniPiece(nextPiece, '기다리는 중')}
          <span className="text-[11px] text-amber-700 font-semibold truncate max-w-full">
            {nextPiece ? '곧 내려와요!' : '-'}
          </span>
        </div>

        {/* Hold Piece */}
        <div className="bg-white/90 border-2 border-amber-200 rounded-2xl p-2.5 flex flex-col items-center justify-between shadow-xs">
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-bold text-slate-700">블록 보관함</span>
            <button
              type="button"
              onClick={onHold}
              disabled={!canHold}
              className={`p-1 rounded-lg text-xs transition-colors cursor-pointer ${
                canHold
                  ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
              title="블록 보관하기 / 바꾸기"
            >
              <ArrowDownUp className="w-3.5 h-3.5" />
            </button>
          </div>
          {renderMiniPiece(holdPiece, '비어있음')}
          <span className="text-[10px] text-slate-500">
            {canHold ? '바꿀 수 있어요' : '다음 턴에 가능'}
          </span>
        </div>
      </div>

      {/* Special Kid Helpers: Magic Wand & Undo */}
      <div className="flex flex-col gap-2 pt-1">
        <div className="flex items-center justify-between gap-2">
          {/* Magic Wand Button */}
          <button
            type="button"
            onClick={onUseMagicWand}
            disabled={magicWandsRemaining <= 0 && !isTurtleMode}
            className={`kid-btn flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-2xl font-bold shadow-md transition-all cursor-pointer ${
              magicWandsRemaining > 0 || isTurtleMode
                ? 'bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-purple-500/20 active:translate-y-1'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Wand2 className="w-4 h-4 text-yellow-300 animate-wiggle" />
            <div className="flex flex-col items-start leading-tight">
              <span className="text-xs sm:text-sm">요술봉 뿅!</span>
              <span className="text-[10px] text-purple-100">
                {isTurtleMode ? '무제한 🪄' : `남은 개수: ${magicWandsRemaining}개`}
              </span>
            </div>
          </button>

          {/* Undo Button */}
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            className={`kid-btn flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-2xl font-bold shadow-md transition-all cursor-pointer ${
              canUndo
                ? 'bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-emerald-500/20 active:translate-y-1'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
            title="실수해도 괜찮아! 한 번 되돌리기"
          >
            <Undo2 className="w-4 h-4 text-emerald-100" />
            <div className="flex flex-col items-start leading-tight">
              <span className="text-xs sm:text-sm">되돌리기</span>
              <span className="text-[10px] text-emerald-100">실수해도 안심!</span>
            </div>
          </button>
        </div>

        {/* Pause / Resume Button */}
        <button
          type="button"
          onClick={onTogglePause}
          className="kid-btn w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          {isPaused ? (
            <>
              <Play className="w-4 h-4 text-emerald-600 fill-emerald-600" />
              <span>다시 시작하기</span>
            </>
          ) : (
            <>
              <Pause className="w-4 h-4 text-slate-600" />
              <span>잠깐 쉬어가기 (일시정지)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
