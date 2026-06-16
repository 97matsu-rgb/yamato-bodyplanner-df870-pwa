import type { BadgeDefinition } from '../types';

export const BADGES: BadgeDefinition[] = [
  { id: 'first', title: 'はじめの一歩', description: '初回測定を記録', icon: '🌱' },
  { id: 'five', title: '継続中', description: '5回の測定を達成', icon: '🔥' },
  { id: 'ten', title: '習慣化達成', description: '10回の測定を達成', icon: '🏅' },
  { id: 'thirty', title: 'レジェンド', description: '30回の測定を達成', icon: '👑' },
  { id: 'weight-1', title: '-1kg達成', description: '開始時から体重-1kg', icon: '⚖️' },
  { id: 'weight-3', title: '-3kg達成', description: '開始時から体重-3kg', icon: '🏃' },
  { id: 'weight-5', title: '-5kg達成', description: '開始時から体重-5kg', icon: '🚀' },
  { id: 'fat-1', title: '体脂肪率-1%', description: '開始時から体脂肪率-1%', icon: '✨' },
  { id: 'fat-3', title: '体脂肪率-3%', description: '開始時から体脂肪率-3%', icon: '💎' },
  { id: 'fat-5', title: '体脂肪率-5%', description: '開始時から体脂肪率-5%', icon: '🌟' },
  { id: 'goal-weight', title: '目標体重達成', description: '目標体重に到達', icon: '🎯' },
  { id: 'goal-fat', title: '目標体脂肪率達成', description: '目標体脂肪率に到達', icon: '🧩' },
  { id: 'goal-fat-mass', title: '目標体脂肪量達成', description: '目標体脂肪量に到達', icon: '🥇' },
];
