import type { BodyRecord, PredictionResult } from '../types';
import { addDays, daysBetween } from './date';

type MetricKey = 'weight' | 'bodyFatPercentage' | 'bodyFatMass';

type SeriesPoint = { date: string; day: number; value: number };

const average = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / values.length;
const stdDev = (values: number[]) => {
  if (values.length < 2) return 0;
  const mean = average(values);
  return Math.sqrt(average(values.map((value) => (value - mean) ** 2)));
};

const movingAverage7 = (series: SeriesPoint[]) =>
  series.map((point, index) => {
    const window = series.slice(Math.max(0, index - 6), index + 1);
    return { ...point, value: average(window.map((item) => item.value)) };
  });

const regression = (points: SeriesPoint[]) => {
  const xMean = average(points.map((point) => point.day));
  const yMean = average(points.map((point) => point.value));
  const numerator = points.reduce((sum, point) => sum + (point.day - xMean) * (point.value - yMean), 0);
  const denominator = points.reduce((sum, point) => sum + (point.day - xMean) ** 2, 0) || 1;
  const slope = numerator / denominator;
  const intercept = yMean - slope * xMean;
  return { slope, intercept };
};

const buildSeries = (records: BodyRecord[], key: MetricKey): SeriesPoint[] => {
  const asc = [...records].sort((a, b) => a.measuredOn.localeCompare(b.measuredOn));
  const base = asc[0]?.measuredOn;
  if (!base) return [];
  return asc.map((record) => ({
    date: record.measuredOn,
    day: daysBetween(base, record.measuredOn),
    value: record[key],
  }));
};

export const calculatePrediction = (
  records: BodyRecord[],
  key: MetricKey,
  targetValue?: number,
): PredictionResult | null => {
  if (!targetValue || records.length < 3) return null;
  const series = movingAverage7(buildSeries(records, key));
  const latestDate = series.at(-1)?.date;
  const latestValue = series.at(-1)?.value;
  if (!latestDate || latestValue == null) return null;

  const last30Cutoff = addDays(latestDate, -30);
  const recent = series.filter((point) => point.date >= last30Cutoff);
  const points = recent.length >= 3 ? recent : series;
  const { slope, intercept } = regression(points);
  const wantsDown = targetValue < latestValue;
  const progressing = wantsDown ? slope < 0 : slope > 0;
  const baseDate = series[0].date;
  const latestDay = daysBetween(baseDate, latestDate);
  const nextDay = latestDay + Math.max(7, Math.round(latestDay / Math.max(series.length - 1, 1)) || 7);
  const nextValue = intercept + slope * nextDay;
  const residuals = points.map((point) => point.value - (intercept + slope * point.day));
  const variability = stdDev(residuals);
  const range = Math.max(...points.map((point) => point.value)) - Math.min(...points.map((point) => point.value)) || 1;
  const confidenceRatio = Math.max(0, Math.min(1, 1 - variability / range));
  const confidenceStars = Math.max(1, Math.min(5, Math.round(confidenceRatio * 5)));
  const trendPer30Days = slope * 30;
  const probability = Math.max(0, Math.min(100, Math.round((progressing ? 55 : 20) + confidenceRatio * 45)));

  if (!progressing || Math.abs(slope) < 0.0001) {
    return {
      targetValue,
      predictedDate: null,
      daysRemaining: null,
      confidenceStars,
      probability,
      nextValue: Number(nextValue.toFixed(2)),
      trendPer30Days: Number(trendPer30Days.toFixed(2)),
      note: '現在の傾向では目標到達日を安定計算できません。',
    };
  }

  const targetDay = (targetValue - intercept) / slope;
  const predictedDate = addDays(baseDate, Math.ceil(targetDay));
  return {
    targetValue,
    predictedDate,
    daysRemaining: Math.max(0, daysBetween(latestDate, predictedDate)),
    confidenceStars,
    probability,
    nextValue: Number(nextValue.toFixed(2)),
    trendPer30Days: Number(trendPer30Days.toFixed(2)),
    note: '7日移動平均と直近30日トレンドを用いた予測です。',
  };
};

export const starString = (count: number) => '★★★★★'.slice(0, count) + '☆☆☆☆☆'.slice(0, 5 - count);
