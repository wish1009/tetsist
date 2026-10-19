import React from 'react';
import { BlockCell, Piece } from '../types/game';
import { BOARD_HEIGHT, BOARD_WIDTH, getGhostPieceY } from '../utils/tetrisLogic';

interface GameBoardProps {
  board: (BlockCell | null)[][];
  currentPiece: Piece | null;
  clearingRows: number[];
  isPaused: boolean;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  currentPiece,
  clearingRows,
  isPaused,
}) => {
  // Compute ghost piece position
  const ghostY = currentPiece ? getGhostPieceY(currentPiece, board) : 0;

  // Render combined grid
  const renderCell = (r: number, c: number) => {
    const isClearing = clearingRows.includes(r);
    const existing = board[r][c];

    // Check if active piece is occupying this cell
    let isCurrent = false;
    let currentCellColor = '';
    let currentCellFace = '';

    if (currentPiece && !isPaused) {
      const pr = r - currentPiece.y;
      const pc = c - currentPiece.x;
      if (
        pr >= 0 &&
        pr < currentPiece.shape.length &&
        pc >= 0 &&
        pc < currentPiece.shape[0].length &&
        currentPiece.shape[pr][pc] !== 0
      ) {
        isCurrent = true;
        currentCellColor = currentPiece.color;
        currentCellFace = currentPiece.face;
      }
    }

    // Check if ghost piece occupies this cell
    let isGhost = false;
    if (currentPiece && !isCurrent && !isPaused) {
      const gr = r - ghostY;
      const gc = c - currentPiece.x;
      if (
        gr >= 0 &&
        gr < currentPiece.shape.length &&
        gc >= 0 &&
        gc < currentPiece.shape[0].length &&
        currentPiece.shape[gr][gc] !== 0
      ) {
        isGhost = true;
      }
    }

    if (isClearing) {
      return (
        <div
          key={`${r}-${c}`}
          className="relative rounded-lg bg-amber-300 border-2 border-yellow-200 animate-pulse flex items-center justify-center shadow-lg shadow-yellow-400/50"
        >
          <span className="text-sm font-bold text-amber-900 animate-wiggle">⭐</span>
        </div>
      );
    }

    if (isCurrent) {
      return (
        <div
          key={`${r}-${c}`}
          style={{ backgroundColor: currentCellColor }}
          className="relative rounded-lg shadow-md border-2 border-white/60 flex items-center justify-center transition-transform"
        >
          {/* Top highlight shine */}
          <div className="absolute inset-x-1 top-0.5 h-1.5 bg-white/40 rounded-t-md pointer-events-none" />
          <span className="text-white text-[11px] sm:text-[13px] font-black drop-shadow-xs select-none">
            {currentCellFace}
          </span>
        </div>
      );
    }

    if (isGhost) {
      return (
        <div
          key={`${r}-${c}`}
          style={{ borderColor: currentPiece?.color }}
          className="relative rounded-lg border-2 border-dashed bg-white/30 flex items-center justify-center opacity-60"
        >
          <span className="text-slate-400 text-[10px] select-none">·</span>
        </div>
      );
    }

    if (existing && existing.filled) {
      return (
        <div
          key={`${r}-${c}`}
          style={{ backgroundColor: existing.color }}
          className="relative rounded-lg shadow-xs border-2 border-white/40 flex items-center justify-center transition-all"
        >
          <div className="absolute inset-x-1 top-0.5 h-1 bg-white/30 rounded-t-md pointer-events-none" />
          <span className="text-white text-[10px] sm:text-[12px] font-bold drop-shadow-xs select-none">
            {existing.face || 'ᵔᵕᵔ'}
          </span>
        </div>
      );
    }

    // Empty cell with subtle cheerful grid dot
    return (
      <div
        key={`${r}-${c}`}
        className="rounded-lg bg-amber-50/50 border border-amber-200/40 flex items-center justify-center"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-amber-200/50" />
      </div>
    );
  };

  return (
    <div className="relative p-2.5 sm:p-3.5 bg-linear-to-b from-amber-100/90 to-orange-100/80 rounded-3xl border-4 border-amber-300 shadow-xl shadow-amber-900/10">
      {/* Wooden / Toy Board Frame Details */}
      <div className="absolute top-2 left-3 flex gap-1">
        <span className="w-2 h-2 rounded-full bg-amber-400/80" />
        <span className="w-2 h-2 rounded-full bg-amber-400/80" />
      </div>
      <div className="absolute top-2 right-3 flex gap-1">
        <span className="w-2 h-2 rounded-full bg-amber-400/80" />
        <span className="w-2 h-2 rounded-full bg-amber-400/80" />
      </div>

      <div
        className="grid gap-1 sm:gap-1.5 w-[270px] sm:w-[320px] md:w-[340px] aspect-[10/14] bg-white/70 p-2 rounded-2xl shadow-inner border border-amber-200"
        style={{
          gridTemplateColumns: `repeat(${BOARD_WIDTH}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${BOARD_HEIGHT}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: BOARD_HEIGHT }).map((_, r) =>
          Array.from({ length: BOARD_WIDTH }).map((_, c) => renderCell(r, c))
        )}
      </div>

      {/* Paused Overlay */}
      {isPaused && (
        <div className="absolute inset-0 bg-amber-950/40 backdrop-blur-xs rounded-3xl flex flex-col items-center justify-center text-white z-20">
          <span className="text-4xl animate-bounce mb-2">⏸️</span>
          <p className="text-2xl font-bold">잠깐 쉬는 중!</p>
          <p className="text-sm text-amber-200 mt-1">계속하려면 '계속하기'를 눌러주세요</p>
        </div>
      )}
    </div>
  );
};
