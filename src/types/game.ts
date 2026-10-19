export type GameMode = 'turtle' | 'rabbit' | 'rainbow';

export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L' | 'MINI_DOT' | 'MINI_LINE' | 'MINI_CORNER';

export interface BlockCell {
  filled: boolean;
  color: string;
  type?: TetrominoType;
  face?: string;
  isGhost?: boolean;
  clearing?: boolean;
}

export interface Piece {
  type: TetrominoType;
  shape: number[][];
  color: string;
  face: string;
  x: number;
  y: number;
}

export interface Sticker {
  id: string;
  name: string;
  desc: string;
  emoji: string;
  unlocked: boolean;
  requirement: string;
}

export interface GameState {
  board: (BlockCell | null)[][];
  currentPiece: Piece | null;
  nextPiece: Piece | null;
  holdPiece: Piece | null;
  canHold: boolean;
  score: number;
  stars: number;
  lines: number;
  level: number;
  mode: GameMode;
  isPaused: boolean;
  isGameOver: boolean;
  magicWandsRemaining: number;
  mascotMessage: string;
  comboCount: number;
}
