import type { BodyRecord } from '../types';

export const buildMotivationMessage = (records: BodyRecord[]) => {
  const latest = records[0];
  const previous = records[1];
  if (!latest) return 'まずは最初の測定データを追加して、変化の見える化を始めましょう。';
  if (!previous) return '最初の記録おめでとうございます。次回の測定で変化の比較が表示されます。';

  const fatDiff = latest.bodyFatPercentage - previous.bodyFatPercentage;
  const muscleDiff = latest.skeletalMuscleMass - previous.skeletalMuscleMass;

  if (fatDiff <= -0.5) {
    return `素晴らしいです。前回より体脂肪率が${Math.abs(fatDiff).toFixed(1)}%改善しています。理想の身体へ着実に近づいています。`;
  }
  if (muscleDiff >= 0.3) {
    return '筋肉量が増加しています。トレーニングの成果がしっかり現れています。';
  }
  if (records.length === 5 || records.length === 10 || records.length === 30) {
    return `継続は力なり。${records.length}回目の測定達成です。`;
  }
  return '数字は横ばいでも、継続できていること自体が大きな成果です。今日の積み重ねを大切にしましょう。';
};
