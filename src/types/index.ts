export type BodyRecord = {
  id?: number;
  measuredOn: string;
  createdAt: string;
  weight: number;
  bmi: number;
  bodyFatPercentage: number;
  bodyFatMass: number;
  skeletalMuscleMass: number;
  basalMetabolism: number;
  boneMass: number;
  bodyWater: number;
  appendicularMuscleMass: number;
  smi: number;
  visceralFatIndex: number;
  raw: string;
};

export type Goals = {
  targetWeight?: number;
  targetBodyFatPercentage?: number;
  targetBodyFatMass?: number;
};

export type BadgeDefinition = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

export type EarnedBadge = BadgeDefinition & {
  earnedAt: string;
};

export type PredictionResult = {
  targetValue: number;
  predictedDate: string | null;
  daysRemaining: number | null;
  confidenceStars: number;
  probability: number;
  nextValue: number | null;
  trendPer30Days: number;
  note: string;
};

export type AppBackup = {
  version: number;
  exportedAt: string;
  records: BodyRecord[];
  goals: Goals;
};
