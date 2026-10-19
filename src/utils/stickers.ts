import { Sticker } from '../types/game';

export const INITIAL_STICKERS: Sticker[] = [
  {
    id: 'first_play',
    name: '새싹 탐험가 🧸',
    desc: '첫 번째 블록 게임을 시작했어요!',
    emoji: '🌱',
    unlocked: true,
    requirement: '게임 시작하기',
  },
  {
    id: 'first_line',
    name: '첫 줄 완성! 🌟',
    desc: '알록달록 블록 한 줄을 꽉 채웠어요.',
    emoji: '⭐',
    unlocked: false,
    requirement: '블록 1줄 맞추기',
  },
  {
    id: 'double_clear',
    name: '더블 팡팡! 🚀',
    desc: '한 번에 2줄 이상 시원하게 팡 터뜨렸어요!',
    emoji: '🎉',
    unlocked: false,
    requirement: '한 번에 2줄 맞추기',
  },
  {
    id: 'stars_10',
    name: '별빛 모으기 🌟',
    desc: '반짝이는 황금 별을 10개 이상 모았어요.',
    emoji: '✨',
    unlocked: false,
    requirement: '별 10개 획득하기',
  },
  {
    id: 'stars_30',
    name: '별나라 여행자 👑',
    desc: '멋져요! 황금 별을 30개 넘게 모았어요!',
    emoji: '🌠',
    unlocked: false,
    requirement: '별 30개 획득하기',
  },
  {
    id: 'magic_wand',
    name: '요술봉 꼬마요정 🪄',
    desc: '요술봉으로 꽉 찬 블록을 뿅! 날렸어요.',
    emoji: '🪄',
    unlocked: false,
    requirement: '요술봉 사용하기',
  },
  {
    id: 'undo_used',
    name: '되돌리기 박사 ↩️',
    desc: '실수해도 괜찮아! 시간을 되돌렸어요.',
    emoji: '⏳',
    unlocked: false,
    requirement: '되돌리기 사용하기',
  },
  {
    id: 'turtle_master',
    name: '느릿느릿 거북이 🐢',
    desc: '천천히 거북이 모드로 차근차근 맞췄어요.',
    emoji: '🐢',
    unlocked: false,
    requirement: '거북이 모드 플레이',
  },
  {
    id: 'rabbit_master',
    name: '깡충깡충 아기토끼 🐰',
    desc: '신나는 토끼 모드로 신나게 달렸어요!',
    emoji: '🐰',
    unlocked: false,
    requirement: '토끼 모드 플레이',
  },
  {
    id: 'rainbow_master',
    name: '무지개 구름 🌈',
    desc: '안 떨어지는 무지개 모드로 여유롭게 즐겼어요.',
    emoji: '🌈',
    unlocked: false,
    requirement: '무지개 모드 플레이',
  },
  {
    id: 'combo_hit',
    name: '연속 콤보 마스터 🔥',
    desc: '연속으로 블록을 팡팡 맞췄어요!',
    emoji: '💥',
    unlocked: false,
    requirement: '2연속 줄 맞추기',
  },
  {
    id: 'score_1000',
    name: '블록 왕관 챔피언 🏆',
    desc: '점수 1,000점 이상 달성! 오늘의 슈퍼스타!',
    emoji: '🏆',
    unlocked: false,
    requirement: '점수 1,000점 달성',
  },
];

const STORAGE_KEY = 'kid_tetris_stickers';

export function getSavedStickers(): Sticker[] {
  if (typeof window === 'undefined') return INITIAL_STICKERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_STICKERS;
    const unlockedIds: string[] = JSON.parse(raw);
    return INITIAL_STICKERS.map((stk) => ({
      ...stk,
      unlocked: stk.unlocked || unlockedIds.includes(stk.id),
    }));
  } catch {
    return INITIAL_STICKERS;
  }
}

export function unlockSticker(id: string): { newlyUnlocked: boolean; sticker?: Sticker } {
  const stickers = getSavedStickers();
  const target = stickers.find((s) => s.id === id);
  if (!target) return { newlyUnlocked: false };
  if (target.unlocked) return { newlyUnlocked: false, sticker: target };

  const updated = stickers.map((s) => (s.id === id ? { ...s, unlocked: true } : s));
  const unlockedIds = updated.filter((s) => s.unlocked).map((s) => s.id);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(unlockedIds));
  } catch {
    // Ignore storage errors
  }

  return { newlyUnlocked: true, sticker: { ...target, unlocked: true } };
}
