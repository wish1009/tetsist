import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { GameBoard } from './components/GameBoard';
import { SidePanel } from './components/SidePanel';
import { KidControls } from './components/KidControls';
import { ModeSelector } from './components/ModeSelector';
import { StickerModal } from './components/StickerModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { CelebrationModal } from './components/CelebrationModal';
import { BlockCell, GameMode, Piece, Sticker } from './types/game';
import {
  BOARD_WIDTH,
  createEmptyBoard,
  getRandomPiece,
  checkCollision,
  rotateMatrix,
  clearFullLines,
  applyMagicWand,
  applyRescueStar,
} from './utils/tetrisLogic';
import { soundManager } from './utils/sound';
import { getSavedStickers, unlockSticker } from './utils/stickers';

interface GameSnapshot {
  board: (BlockCell | null)[][];
  currentPiece: Piece | null;
  score: number;
  stars: number;
  lines: number;
}

const MASCOT_CHEERS = [
  '천천히 생각해도 괜찮아! 🧸',
  '알록달록 블록 친구들을 맞춰봐!',
  '노란 회전 버튼으로 쏙 돌려보자 🔄',
  '어려우면 보라색 요술봉을 눌러봐! 🪄',
  '우와! 손가락이 정말 빠르네!',
  '차곡차곡 멋진 집을 짓는 것 같아 🏰',
];

export default function App() {
  const [mode, setMode] = useState<GameMode>('turtle');
  const [board, setBoard] = useState<(BlockCell | null)[][]>(() => createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(() => getRandomPiece('turtle'));
  const [nextPiece, setNextPiece] = useState<Piece | null>(() => getRandomPiece('turtle'));
  const [holdPiece, setHoldPiece] = useState<Piece | null>(null);
  const [canHold, setCanHold] = useState<boolean>(true);

  const [score, setScore] = useState<number>(0);
  const [stars, setStars] = useState<number>(0);
  const [lines, setLines] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [magicWands, setMagicWands] = useState<number>(3);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isCelebrationOpen, setIsCelebrationOpen] = useState<boolean>(false);

  // Modals
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState<boolean>(false);
  const [isStickerBookOpen, setIsStickerBookOpen] = useState<boolean>(false);
  const [stickers, setStickers] = useState<Sticker[]>(() => getSavedStickers());

  // Visual effects
  const [clearingRows, setClearingRows] = useState<number[]>([]);
  const [mascotMessage, setMascotMessage] = useState<string>('안녕! 오늘 나랑 블록놀이 할래? 🧸');

  // Sound toggles
  const [isSfxOn, setIsSfxOn] = useState<boolean>(soundManager.isSfxEnabled());
  const [isVoiceOn, setIsVoiceOn] = useState<boolean>(soundManager.isVoiceEnabled());

  // Undo history (snapshots of board & state)
  const [history, setHistory] = useState<GameSnapshot[]>([]);

  // Timer reference
  const dropIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fall speed based on mode
  const getDropInterval = useCallback(() => {
    if (mode === 'rainbow') return null; // No auto drop in rainbow mode
    if (mode === 'turtle') return 1600; // Super calm
    // Rabbit mode starts at 1000ms, slightly perks up with score but never exceeds kid ability
    return Math.max(750, 1000 - Math.floor(score / 500) * 50);
  }, [mode, score]);

  // Set friendly mascot message with optional voice
  const cheerMascot = useCallback((msg: string, voiceMsg?: string) => {
    setMascotMessage(msg);
    if (voiceMsg) {
      soundManager.speakCheer(voiceMsg);
    }
  }, []);

  // Check sticker unlocks
  const checkStickers = useCallback((type: string) => {
    const res = unlockSticker(type);
    if (res.newlyUnlocked && res.sticker) {
      setStickers(getSavedStickers());
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
      cheerMascot(
        `새로운 스티커 '${res.sticker.name}' 획득! ✨`,
        '새로운 스티커를 모았어요!'
      );
    }
  }, [cheerMascot]);

  // Save state before placement for Undo
  const saveSnapshot = useCallback(() => {
    setHistory((prev) => [
      ...prev.slice(-4), // keep last 4 snapshots
      {
        board: board.map((row) => [...row]),
        currentPiece: currentPiece ? { ...currentPiece, shape: currentPiece.shape.map((r) => [...r]) } : null,
        score,
        stars,
        lines,
      },
    ]);
  }, [board, currentPiece, score, stars, lines]);

  // Undo action
  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setBoard(last.board);
    setCurrentPiece(last.currentPiece);
    setScore(last.score);
    setStars(last.stars);
    setLines(last.lines);
    setHistory((prev) => prev.slice(0, -1));
    soundManager.playUndo();
    cheerMascot('괜찮아! 한 번 되돌렸어요! ↩️', '되돌리기!');
    checkStickers('undo_used');
  }, [history, cheerMascot, checkStickers]);

  // Magic wand action
  const handleUseMagicWand = useCallback(() => {
    if (mode !== 'turtle' && magicWands <= 0) return;

    const { newBoard, clearedRowIndex } = applyMagicWand(board);
    if (clearedRowIndex === null) {
      cheerMascot('바닥에 지울 블록이 없어요! 🪄');
      return;
    }

    soundManager.playMagicWand();
    confetti({ particleCount: 35, spread: 70, origin: { y: 0.6 } });
    setBoard(newBoard);
    if (mode !== 'turtle') {
      setMagicWands((prev) => Math.max(0, prev - 1));
    }
    setStars((s) => s + 1);
    cheerMascot('요술봉 뿅! 블록 줄이 사라졌어요! 🪄', '요술봉 뿅!');
    checkStickers('magic_wand');
  }, [mode, magicWands, board, cheerMascot, checkStickers]);

  // Lock piece into board and generate next piece
  const lockPiece = useCallback(
    (pieceToLock: Piece) => {
      saveSnapshot();
      soundManager.playDrop();

      const newBoard = board.map((row) => [...row]);

      for (let r = 0; r < pieceToLock.shape.length; r++) {
        for (let c = 0; c < pieceToLock.shape[r].length; c++) {
          if (pieceToLock.shape[r][c] !== 0) {
            const by = pieceToLock.y + r;
            const bx = pieceToLock.x + c;
            if (by >= 0 && by < newBoard.length && bx >= 0 && bx < BOARD_WIDTH) {
              newBoard[by][bx] = {
                filled: true,
                color: pieceToLock.color,
                type: pieceToLock.type,
                face: pieceToLock.face,
              };
            }
          }
        }
      }

      // Check full lines
      const { newBoard: afterClearBoard, clearedLines, clearedRowIndices } = clearFullLines(newBoard);

      if (clearedLines > 0) {
        setClearingRows(clearedRowIndices);
        soundManager.playLineClear(clearedLines);

        // Confetti burst
        confetti({
          particleCount: clearedLines >= 2 ? 65 : 35,
          spread: clearedLines >= 2 ? 90 : 60,
          origin: { y: 0.6 },
        });

        const starGain = clearedLines * 2;
        const scoreGain = clearedLines * 100 * (combo + 1);

        setStars((s) => s + starGain);
        setScore((sc) => sc + scoreGain);
        setLines((l) => l + clearedLines);
        setCombo((c) => c + 1);

        // Check line stickers
        checkStickers('first_line');
        if (clearedLines >= 2) checkStickers('double_clear');
        if (combo >= 1) checkStickers('combo_hit');
        if (stars + starGain >= 10) checkStickers('stars_10');
        if (stars + starGain >= 30) checkStickers('stars_30');
        if (score + scoreGain >= 1000) checkStickers('score_1000');

        if (clearedLines >= 2) {
          cheerMascot('대단해! 한 번에 2줄 팡팡! 🚀', '와! 더블 팡팡!');
        } else {
          cheerMascot('한 줄 완성! 참 잘했어요! ⭐', '한 줄 완성! 최고야!');
        }

        setTimeout(() => {
          setBoard(afterClearBoard);
          setClearingRows([]);
        }, 300);
      } else {
        setBoard(newBoard);
        setCombo(0);
      }

      // Check top danger
      const isTopCrowded = newBoard.slice(0, 2).some((row) => row.some((c) => c && c.filled));
      if (isTopCrowded) {
        // In Turtle mode, rescue angel swoops in!
        if (mode === 'turtle') {
          soundManager.playMagicWand();
          const rescued = applyRescueStar(newBoard);
          setBoard(rescued);
          cheerMascot('수호천사 곰돌이가 블록을 정리해줬어요! 🧸✨', '걱정 마! 내가 도와줄게!');
          confetti({ particleCount: 25, spread: 50, origin: { y: 0.3 } });
        } else {
          cheerMascot('블록이 가득 찼어요! 요술봉이나 되돌리기를 써봐요! 🪄');
        }
      }

      // Next piece spawn
      const spawned = nextPiece || getRandomPiece(mode);
      const upcoming = getRandomPiece(mode);

      // Check game end condition
      if (checkCollision(spawned, afterClearBoard)) {
        soundManager.playCelebration();
        setIsCelebrationOpen(true);
        cheerMascot('와! 신나는 블록 모험 완료! 🌟', '참 잘했어요! 짝짝짝!');
        confetti({ particleCount: 80, spread: 100, origin: { y: 0.5 } });
        return;
      }

      setCurrentPiece(spawned);
      setNextPiece(upcoming);
      setCanHold(true);
    },
    [
      board,
      nextPiece,
      mode,
      combo,
      stars,
      score,
      saveSnapshot,
      cheerMascot,
      checkStickers,
    ]
  );

  // Soft drop 1 step
  const moveDown = useCallback(() => {
    if (!currentPiece || isPaused || isCelebrationOpen) return false;
    if (!checkCollision(currentPiece, board, { x: 0, y: 1 })) {
      setCurrentPiece((prev) => (prev ? { ...prev, y: prev.y + 1 } : null));
      soundManager.playMove();
      return true;
    } else {
      lockPiece(currentPiece);
      return false;
    }
  }, [currentPiece, board, isPaused, isCelebrationOpen, lockPiece]);

  // Hard drop instantly
  const hardDrop = useCallback(() => {
    if (!currentPiece || isPaused || isCelebrationOpen) return;
    let newY = currentPiece.y;
    while (!checkCollision(currentPiece, board, { x: 0, y: newY - currentPiece.y + 1 })) {
      newY++;
    }
    const droppedPiece = { ...currentPiece, y: newY };
    lockPiece(droppedPiece);
  }, [currentPiece, board, isPaused, isCelebrationOpen, lockPiece]);

  // Move horizontally
  const moveLeft = useCallback(() => {
    if (!currentPiece || isPaused || isCelebrationOpen) return;
    if (!checkCollision(currentPiece, board, { x: -1, y: 0 })) {
      setCurrentPiece((prev) => (prev ? { ...prev, x: prev.x - 1 } : null));
      soundManager.playMove();
    }
  }, [currentPiece, board, isPaused, isCelebrationOpen]);

  const moveRight = useCallback(() => {
    if (!currentPiece || isPaused || isCelebrationOpen) return;
    if (!checkCollision(currentPiece, board, { x: 1, y: 0 })) {
      setCurrentPiece((prev) => (prev ? { ...prev, x: prev.x + 1 } : null));
      soundManager.playMove();
    }
  }, [currentPiece, board, isPaused, isCelebrationOpen]);

  // Rotate piece clockwise
  const handleRotate = useCallback(() => {
    if (!currentPiece || isPaused || isCelebrationOpen) return;
    const rotated = rotateMatrix(currentPiece.shape);
    const candidate: Piece = { ...currentPiece, shape: rotated };

    // Standard check
    if (!checkCollision(candidate, board)) {
      setCurrentPiece(candidate);
      soundManager.playRotate();
      cheerMascot('빙글빙글 쏙! 🔄');
      return;
    }

    // Gentle wall kicks: try left 1 or right 1
    if (!checkCollision(candidate, board, { x: 1, y: 0 })) {
      setCurrentPiece({ ...candidate, x: candidate.x + 1 });
      soundManager.playRotate();
      return;
    }
    if (!checkCollision(candidate, board, { x: -1, y: 0 })) {
      setCurrentPiece({ ...candidate, x: candidate.x - 1 });
      soundManager.playRotate();
      return;
    }
  }, [currentPiece, board, isPaused, isCelebrationOpen, cheerMascot]);

  // Hold piece
  const handleHold = useCallback(() => {
    if (!currentPiece || !canHold || isPaused || isCelebrationOpen) return;
    soundManager.playRotate();
    if (!holdPiece) {
      setHoldPiece(currentPiece);
      setCurrentPiece(nextPiece || getRandomPiece(mode));
      setNextPiece(getRandomPiece(mode));
    } else {
      const temp = holdPiece;
      setHoldPiece(currentPiece);
      setCurrentPiece({
        ...temp,
        x: Math.floor((BOARD_WIDTH - temp.shape[0].length) / 2),
        y: 0,
      });
    }
    setCanHold(false);
    cheerMascot('블록을 보관함에 쏙 넣었어요! 🎒');
  }, [currentPiece, canHold, isPaused, isCelebrationOpen, holdPiece, nextPiece, mode, cheerMascot]);

  // Reset or Start New Game
  const resetGame = useCallback(
    (newMode: GameMode = mode) => {
      setBoard(createEmptyBoard());
      setCurrentPiece(getRandomPiece(newMode));
      setNextPiece(getRandomPiece(newMode));
      setHoldPiece(null);
      setCanHold(true);
      setScore(0);
      setStars(0);
      setLines(0);
      setCombo(0);
      setHistory([]);
      setMagicWands(3);
      setIsPaused(false);
      setIsCelebrationOpen(false);
      setClearingRows([]);

      if (newMode === 'turtle') {
        cheerMascot('느릿느릿 거북이 모드 시작! 천천히 해봐요 🐢', '거북이 모드 시작!');
        checkStickers('turtle_master');
      } else if (newMode === 'rabbit') {
        cheerMascot('신나는 아기토끼 모드 시작! 깡충깡충 🐰', '토끼 모드 시작!');
        checkStickers('rabbit_master');
      } else {
        cheerMascot('무지개 안심 모드! 누를 때만 내려와요 🌈', '무지개 모드 시작!');
        checkStickers('rainbow_master');
      }
    },
    [mode, cheerMascot, checkStickers]
  );

  // Mode change
  const handleSelectMode = (newMode: GameMode) => {
    setMode(newMode);
    resetGame(newMode);
  };

  // Rescue Continue from celebration modal
  const handleRescueContinue = () => {
    setIsCelebrationOpen(false);
    const rescued = applyRescueStar(board);
    setBoard(rescued);
    setCurrentPiece(getRandomPiece(mode));
    soundManager.playMagicWand();
    cheerMascot('요술별로 계속 이어하기 성공! 🌟', '신나게 계속해요!');
    confetti({ particleCount: 40, spread: 70, origin: { y: 0.6 } });
  };

  // Auto drop timer
  useEffect(() => {
    const intervalTime = getDropInterval();
    if (!intervalTime || isPaused || isCelebrationOpen) {
      if (dropIntervalRef.current) clearInterval(dropIntervalRef.current);
      return;
    }

    dropIntervalRef.current = setInterval(() => {
      moveDown();
    }, intervalTime);

    return () => {
      if (dropIntervalRef.current) clearInterval(dropIntervalRef.current);
    };
  }, [getDropInterval, isPaused, isCelebrationOpen, moveDown]);

  // Periodic random companion cheer
  useEffect(() => {
    const cheerTimer = setInterval(() => {
      if (!isPaused && !isCelebrationOpen) {
        const randomMsg = MASCOT_CHEERS[Math.floor(Math.random() * MASCOT_CHEERS.length)];
        setMascotMessage(randomMsg);
      }
    }, 18000);
    return () => clearInterval(cheerTimer);
  }, [isPaused, isCelebrationOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCelebrationOpen || isHowToPlayOpen || isStickerBookOpen) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        moveLeft();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        moveRight();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handleRotate();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        moveDown();
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        hardDrop();
      } else if (e.key === 'z' || e.key === 'Z' || e.key === 'ㅋ') {
        e.preventDefault();
        handleUndo();
      } else if (e.key === 'x' || e.key === 'X' || e.key === 'ㅌ') {
        e.preventDefault();
        handleUseMagicWand();
      } else if (e.key === 'c' || e.key === 'C' || e.key === 'ㅊ') {
        e.preventDefault();
        handleHold();
      } else if (e.key === 'p' || e.key === 'P' || e.key === 'ㅔ') {
        e.preventDefault();
        setIsPaused((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    moveLeft,
    moveRight,
    handleRotate,
    moveDown,
    hardDrop,
    handleUndo,
    handleUseMagicWand,
    handleHold,
    isCelebrationOpen,
    isHowToPlayOpen,
    isStickerBookOpen,
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-b from-amber-50/60 via-orange-50/40 to-yellow-50/70">
      {/* Top Bar Contract Header */}
      <Header
        onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
        onOpenStickerBook={() => setIsStickerBookOpen(true)}
        onRestartGame={() => resetGame()}
        isSfxOn={isSfxOn}
        onToggleSfx={() => setIsSfxOn(soundManager.toggleSfx())}
        isVoiceOn={isVoiceOn}
        onToggleVoice={() => setIsVoiceOn(soundManager.toggleVoice())}
        starsCount={stars}
      />

      {/* Main Content Arena */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-3 sm:p-6 flex flex-col items-center justify-between gap-4">
        {/* Kid Game Mode Selector Strip */}
        <ModeSelector currentMode={mode} onSelectMode={handleSelectMode} />

        {/* Center Play Area: Board + Side Panel */}
        <div className="w-full flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6 sm:gap-8 my-1">
          {/* Tetris Board */}
          <div className="flex flex-col items-center">
            <GameBoard
              board={board}
              currentPiece={currentPiece}
              clearingRows={clearingRows}
              isPaused={isPaused}
            />
          </div>

          {/* Side Companion & Power-ups */}
          <SidePanel
            nextPiece={nextPiece}
            holdPiece={holdPiece}
            canHold={canHold}
            onHold={handleHold}
            stars={stars}
            score={score}
            lines={lines}
            magicWandsRemaining={magicWands}
            onUseMagicWand={handleUseMagicWand}
            canUndo={history.length > 0}
            onUndo={handleUndo}
            isPaused={isPaused}
            onTogglePause={() => setIsPaused((p) => !p)}
            mascotMessage={mascotMessage}
            isTurtleMode={mode === 'turtle'}
          />
        </div>

        {/* Big On-Screen Kid Touch Controls */}
        <div className="w-full mt-2">
          <KidControls
            onMoveLeft={moveLeft}
            onMoveRight={moveRight}
            onRotate={handleRotate}
            onSoftDrop={moveDown}
            onHardDrop={hardDrop}
            disabled={isPaused || isCelebrationOpen}
          />
        </div>
      </main>

      {/* Modals */}
      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
      />

      <StickerModal
        isOpen={isStickerBookOpen}
        onClose={() => setIsStickerBookOpen(false)}
        stickers={stickers}
        totalStars={stars}
      />

      <CelebrationModal
        isOpen={isCelebrationOpen}
        score={score}
        stars={stars}
        lines={lines}
        onRestart={() => resetGame()}
        onRescueContinue={handleRescueContinue}
        onOpenStickerBook={() => {
          setIsCelebrationOpen(false);
          setIsStickerBookOpen(true);
        }}
      />
    </div>
  );
}
