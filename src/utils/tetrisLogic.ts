import { BlockCell, GameMode, Piece, TetrominoType } from '../types/game';

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 14;

export const TETROMINO_DEFINITIONS: Record<
  TetrominoType,
  { shape: number[][]; color: string; face: string; name: string }
> = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    color: '#38BDF8', // Sky Cyan
    face: 'ᵔᵕᵔ',
    name: '하늘 막대기',
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: '#FBBF24', // Sunny Yellow
    face: '•‿•',
    name: '노랑 네모',
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: '#C084FC', // Berry Purple
    face: '♡‿♡',
    name: '보라 모자',
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    color: '#4ADE80', // Grass Green
    face: 'ᵔ◡ᵔ',
    name: '초록 지렁이',
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    color: '#FB923C', // Coral Orange
    face: '•o•',
    name: '주황 번개',
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: '#60A5FA', // Ocean Blue
    face: '★‿★',
    name: '파랑 부츠',
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: '#F472B6', // Blossom Pink
    face: '♥‿♥',
    name: '분홍 의자',
  },
  MINI_DOT: {
    shape: [[1]],
    color: '#FACC15', // Gold
    face: '★_★',
    name: '반짝 요술별',
  },
  MINI_LINE: {
    shape: [[1, 1]],
    color: '#2DD4BF', // Mint Teal
    face: '•‿•',
    name: '꼬마 도미노',
  },
  MINI_CORNER: {
    shape: [
      [1, 0],
      [1, 1],
    ],
    color: '#A78BFA', // Soft Violet
    face: '◕‿◕',
    name: '귀여운 기역',
  },
};

const STANDARD_TYPES: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
const TURTLE_TYPES: TetrominoType[] = ['I', 'O', 'T', 'J', 'L', 'MINI_DOT', 'MINI_LINE', 'MINI_CORNER'];

export function createEmptyBoard(): (BlockCell | null)[][] {
  return Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(null));
}

export function getRandomPiece(mode: GameMode): Piece {
  const pool = mode === 'turtle' ? TURTLE_TYPES : STANDARD_TYPES;
  const type = pool[Math.floor(Math.random() * pool.length)];
  const def = TETROMINO_DEFINITIONS[type];

  // Center horizontally
  const x = Math.floor((BOARD_WIDTH - def.shape[0].length) / 2);
  const y = 0;

  return {
    type,
    shape: def.shape.map((row) => [...row]),
    color: def.color,
    face: def.face,
    x,
    y,
  };
}

export function checkCollision(
  piece: Piece,
  board: (BlockCell | null)[][],
  offset = { x: 0, y: 0 }
): boolean {
  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      if (piece.shape[r][c] !== 0) {
        const nextX = piece.x + c + offset.x;
        const nextY = piece.y + r + offset.y;

        // Boundaries
        if (nextX < 0 || nextX >= BOARD_WIDTH || nextY >= BOARD_HEIGHT) {
          return true;
        }

        // Top buffer check
        if (nextY >= 0 && board[nextY][nextX]?.filled) {
          return true;
        }
      }
    }
  }
  return false;
}

export function rotateMatrix(matrix: number[][]): number[][] {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const rotated: number[][] = Array.from({ length: cols }, () => Array(rows).fill(0));

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      rotated[c][rows - 1 - r] = matrix[r][c];
    }
  }
  return rotated;
}

export function getGhostPieceY(piece: Piece, board: (BlockCell | null)[][]): number {
  let ghostY = piece.y;
  while (!checkCollision(piece, board, { x: 0, y: ghostY - piece.y + 1 })) {
    ghostY++;
  }
  return ghostY;
}

export function clearFullLines(board: (BlockCell | null)[][]): {
  newBoard: (BlockCell | null)[][];
  clearedLines: number;
  clearedRowIndices: number[];
} {
  const clearedRowIndices: number[] = [];

  for (let r = 0; r < BOARD_HEIGHT; r++) {
    const isFull = board[r].every((cell) => cell && cell.filled);
    if (isFull) {
      clearedRowIndices.push(r);
    }
  }

  if (clearedRowIndices.length === 0) {
    return { newBoard: board, clearedLines: 0, clearedRowIndices: [] };
  }

  // Filter out completed rows and add empty rows on top
  const remainingRows = board.filter((_, idx) => !clearedRowIndices.includes(idx));
  const emptyRows = Array.from({ length: clearedRowIndices.length }, () =>
    Array(BOARD_WIDTH).fill(null)
  );

  const newBoard = [...emptyRows, ...remainingRows];

  return {
    newBoard,
    clearedLines: clearedRowIndices.length,
    clearedRowIndices,
  };
}

// Magic Wand clears the most crowded or bottom row to rescue the child
export function applyMagicWand(board: (BlockCell | null)[][]): {
  newBoard: (BlockCell | null)[][];
  clearedRowIndex: number | null;
} {
  // Find highest row with blocks or lowest row with blocks
  let targetRow = -1;
  for (let r = BOARD_HEIGHT - 1; r >= 0; r--) {
    if (board[r].some((c) => c && c.filled)) {
      targetRow = r;
      break;
    }
  }

  if (targetRow === -1) {
    return { newBoard: board, clearedRowIndex: null };
  }

  const newBoard = board.filter((_, idx) => idx !== targetRow);
  newBoard.unshift(Array(BOARD_WIDTH).fill(null));

  return { newBoard, clearedRowIndex: targetRow };
}

// Rescue Star: When blocks reach top, clears top 3 rows with filled blocks so game continues smoothly
export function applyRescueStar(board: (BlockCell | null)[][]): (BlockCell | null)[][] {
  const newBoard = board.map((row) => [...row]);
  let rowsCleared = 0;
  for (let r = 0; r < BOARD_HEIGHT && rowsCleared < 3; r++) {
    if (newBoard[r].some((c) => c && c.filled)) {
      newBoard[r] = Array(BOARD_WIDTH).fill(null);
      rowsCleared++;
    }
  }
  return newBoard;
}
