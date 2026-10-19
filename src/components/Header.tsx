import React from 'react';
import { Volume2, VolumeX, Sparkles, BookOpen, RotateCcw, Mic, MicOff } from 'lucide-react';

interface HeaderProps {
  onOpenHowToPlay: () => void;
  onOpenStickerBook: () => void;
  onRestartGame: () => void;
  isSfxOn: boolean;
  onToggleSfx: () => void;
  isVoiceOn: boolean;
  onToggleVoice: () => void;
  starsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenHowToPlay,
  onOpenStickerBook,
  onRestartGame,
  isSfxOn,
  onToggleSfx,
  isVoiceOn,
  onToggleVoice,
  starsCount,
}) => {
  return (
    <header className="w-full bg-white/90 backdrop-blur-md border-b border-amber-200/70 px-4 sm:px-8 py-3 shrink-0 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand title, one line */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center text-xl shadow-xs text-amber-950 font-black">
            🧸
          </div>
          <span className="text-xl sm:text-2xl font-bold tracking-tight text-amber-950 whitespace-nowrap">
            토이 블록팡
          </span>
          <div className="hidden lg:flex items-center gap-1.5 ml-2 px-3 py-1 bg-amber-100/70 border border-amber-300/60 rounded-full text-xs font-semibold text-amber-900">
            <span className="text-amber-500">★</span>
            <span className="tabular-nums">5~7세 안심 놀이터</span>
          </div>
        </div>

        {/* Zone 2: Single-line nav links/buttons */}
        <nav className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm font-semibold text-slate-700">
          <button
            type="button"
            onClick={onOpenHowToPlay}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors whitespace-nowrap cursor-pointer"
            title="게임 방법 보기"
          >
            <BookOpen className="w-4 h-4 text-amber-600" />
            <span className="hidden sm:inline">놀이방법</span>
          </button>

          <button
            type="button"
            onClick={onOpenStickerBook}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-100/80 hover:bg-amber-200/80 text-amber-900 border border-amber-300/50 transition-colors whitespace-nowrap cursor-pointer shadow-xs"
            title="스티커북 열기"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>스티커북</span>
            <span className="ml-1 bg-amber-500 text-white text-[11px] px-1.5 py-0.2 rounded-full tabular-nums">
              ★ {starsCount}
            </span>
          </button>

          <button
            type="button"
            onClick={onToggleSfx}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl transition-colors whitespace-nowrap cursor-pointer ${
              isSfxOn ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-400'
            }`}
            title={isSfxOn ? '효과음 끄기' : '효과음 켜기'}
            aria-label="효과음 토글"
          >
            {isSfxOn ? <Volume2 className="w-4 h-4 text-sky-600" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden md:inline">{isSfxOn ? '소리 켜짐' : '소리 끔'}</span>
          </button>

          <button
            type="button"
            onClick={onToggleVoice}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl transition-colors whitespace-nowrap cursor-pointer ${
              isVoiceOn ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'
            }`}
            title={isVoiceOn ? '칭찬 목소리 끄기' : '칭찬 목소리 켜기'}
            aria-label="응원 음성 토글"
          >
            {isVoiceOn ? <Mic className="w-4 h-4 text-emerald-600" /> : <MicOff className="w-4 h-4" />}
            <span className="hidden md:inline">{isVoiceOn ? '칭찬 음성' : '음성 끔'}</span>
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onRestartGame}
            className="kid-btn flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 active:bg-amber-700 rounded-xl shadow-md shadow-amber-500/25 transition-colors whitespace-nowrap cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>새 게임</span>
          </button>
        </div>
      </div>
    </header>
  );
};
