import React from 'react';
import { X, CheckCircle2, Wand2, Undo2, RotateCw, Heart } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-amber-950/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 border-4 border-amber-300 shadow-2xl relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-200">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📖</span>
            <div>
              <h2 className="text-xl font-black text-amber-950">토이 블록팡 놀이 방법</h2>
              <p className="text-xs text-amber-800">5~7세 친구들도 3분이면 쉽게 배워요!</p>
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

        {/* Steps */}
        <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1 text-slate-700 text-xs sm:text-sm">
          {/* Step 1 */}
          <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 flex gap-3 items-start">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-black text-base shrink-0">
              1
            </div>
            <div>
              <p className="font-bold text-amber-950 text-sm">한 줄을 꽉 채우면 팡팡! 🌟</p>
              <p className="text-slate-600 mt-0.5 leading-relaxed">
                블록들을 빈틈없이 한 줄로 채우면 알록달록 별이 팡 터지면서 점수와 황금 별을 얻어요!
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-3 rounded-2xl bg-sky-50/70 border border-sky-200 flex gap-3 items-start">
            <div className="w-9 h-9 rounded-xl bg-sky-400 text-white flex items-center justify-center shrink-0">
              <RotateCw className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <p className="font-bold text-sky-950 text-sm">노란 돌리기 버튼으로 쏙 맞추기 🔄</p>
              <p className="text-slate-600 mt-0.5 leading-relaxed">
                블록이 구멍에 딱 안 맞을 땐 가운데 노란 회전 버튼을 콕 눌러 돌려보세요!
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-200 flex gap-3 items-start">
            <div className="w-9 h-9 rounded-xl bg-purple-400 text-white flex items-center justify-center shrink-0">
              <Wand2 className="w-5 h-5 text-yellow-200" />
            </div>
            <div>
              <p className="font-bold text-purple-950 text-sm">블록이 쌓여도 요술봉이 도와줘요! 🪄</p>
              <p className="text-slate-600 mt-0.5 leading-relaxed">
                블록이 너무 높이 올라가면 보라색 요술봉을 눌러보세요. 곤란한 블록 줄을 뿅 날려줘요!
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex gap-3 items-start">
            <div className="w-9 h-9 rounded-xl bg-emerald-400 text-white flex items-center justify-center shrink-0">
              <Undo2 className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <p className="font-bold text-emerald-950 text-sm">실수해도 괜찮아! 되돌리기 ↩️</p>
              <p className="text-slate-600 mt-0.5 leading-relaxed">
                엉뚱한 자리에 떨어뜨렸어도 '되돌리기' 버튼을 누르면 이전 상태로 돌아가요.
              </p>
            </div>
          </div>

          {/* Tip */}
          <div className="p-3 rounded-2xl bg-pink-50 border border-pink-200 flex items-center gap-2.5">
            <Heart className="w-5 h-5 text-pink-500 fill-pink-500 shrink-0" />
            <p className="text-pink-900 text-xs font-semibold">
              <span className="font-bold">부모님 팁:</span> 처음 하는 5세 아이는 '거북이 모드'나 '무지개 모드(누를 때만 내려옴)'로 편안하게 즐기게 해주세요!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-amber-100 flex justify-center">
          <button
            type="button"
            onClick={onClose}
            className="kid-btn px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm shadow-md cursor-pointer flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>신나게 시작하기!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
