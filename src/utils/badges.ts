import { BADGES } from '../constants/badges';
import type { BodyRecord, EarnedBadge, Goals } from '../types';

export const collectEarnedBadges = (records: BodyRecord[], goals: Goals): EarnedBadge[] => {
  if (!records.length) return [];
  const asc = [...records].sort((a, b) => a.measuredOn.localeCompare(b.measuredOn));
  const first = asc[0];
  const latest = asc.at(-1)!;
  const earned = new Set<string>();

  if (asc.length >= 1) earned.add('first');
  if (asc.length >= 5) earned.add('five');
  if (asc.length >= 10) earned.add('ten');
  if (asc.length >= 30) earned.add('thirty');
  if (first.weight - latest.weight >= 1) earned.add('weight-1');
  if (first.weight - latest.weight >= 3) earned.add('weight-3');
  if (first.weight - latest.weight >= 5) earned.add('weight-5');
  if (first.bodyFatPercentage - latest.bodyFatPercentage >= 1) earned.add('fat-1');
  if (first.bodyFatPercentage - latest.bodyFatPercentage >= 3) earned.add('fat-3');
  if (first.bodyFatPercentage - latest.bodyFatPercentage >= 5) earned.add('fat-5');
  if (goals.targetWeight && latest.weight <= goals.targetWeight) earned.add('goal-weight');
  if (goals.targetBodyFatPercentage && latest.bodyFatPercentage <= goals.targetBodyFatPercentage) earned.add('goal-fat');
  if (goals.targetBodyFatMass && latest.bodyFatMass <= goals.targetBodyFatMass) earned.add('goal-fat-mass');

  return BADGES.filter((badge) => earned.has(badge.id)).map((badge) => ({ ...badge, earnedAt: latest.measuredOn }));
};
