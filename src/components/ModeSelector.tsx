import React from 'react';
import { GameMode } from '../types/game';

interface ModeSelectorProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, onSelectMode }) => {
  const modes: {
    id: GameMode;
    title: string;
    badge: string;
    desc: string;
    icon: string;
    color: string;
  }[] = [
    {
      id: 'turtle',
      title: '느릿느릿 거북이',
      badge: '추천! 5~6세',
      desc: '아주 천천히 내려오고, 요술봉이 무제한!',
      icon: '🐢',
      color: 'border-emerald-400 bg-emerald-50/80 text-emerald-900',
    },
    {
      id: 'rabbit',
      title: '깡충깡충 토끼',
      badge: '신나는 6~7세',
      desc: '알록달록 블록 친구들과 신나게 플레이!',
      icon: '🐰',
      color: 'border-amber-400 bg-amber-50/80 text-amber-900',
    },
    {
      id: 'rainbow',
      title: '무지개 안심',
      badge: '여유만점',
      desc: '내릴 때까지 멈춰있어요. 마음껏 생각해요!',
      icon: '🌈',
      color: 'border-purple-400 bg-purple-50/80 text-purple-900',
    },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-2">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full">
        {modes.map((m) => {
          const isSelected = currentMode === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onSelectMode(m.id)}
              className={`kid-btn p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? `${m.color} ring-4 ring-amber-400/30 shadow-md font-bold scale-[1.02]`
                  : 'bg-white/80 border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-2xl">{m.icon}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/80 border border-current shadow-2xs">
                  {m.badge}
                </span>
              </div>
              <div>
                <p className="text-sm sm:text-base font-black leading-tight">{m.title}</p>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{m.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
