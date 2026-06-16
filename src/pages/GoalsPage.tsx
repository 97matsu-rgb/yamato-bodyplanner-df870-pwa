import { useEffect, useState } from 'react';
import { GoalForm } from '../components/GoalForm';
import { DB_EVENT, getAllRecords, getGoals, saveGoals } from '../services/db';
import type { BodyRecord, Goals } from '../types';
import { formatJapaneseDate } from '../utils/date';
import { calculatePrediction, starString } from '../utils/prediction';

const PredictionCard = ({ title, prediction, unit }: { title: string; prediction: ReturnType<typeof calculatePrediction>; unit: string }) => {
  if (!prediction) return null;
  return (
    <section className="card">
      <h2>{title}</h2>
      <div className="prediction-grid">
        <div><span>目標値</span><strong>{prediction.targetValue}{unit}</strong></div>
        <div><span>予測達成日</span><strong>{formatJapaneseDate(prediction.predictedDate)}</strong></div>
        <div><span>あと日数</span><strong>{prediction.daysRemaining ?? '---'}日</strong></div>
        <div><span>予測信頼度</span><strong>{starString(prediction.confidenceStars)}</strong></div>
        <div><span>次回予測</span><strong>{prediction.nextValue ?? '---'}{unit}</strong></div>
        <div><span>目標達成確率</span><strong>{prediction.probability}%</strong></div>
      </div>
      <p className="muted">{prediction.note} / 直近30日トレンド: {prediction.trendPer30Days}{unit}</p>
    </section>
  );
};

export const GoalsPage = () => {
  const [goals, setGoals] = useState<Goals>({});
  const [records, setRecords] = useState<BodyRecord[]>([]);
  const load = async () => {
    setGoals(await getGoals());
    setRecords(await getAllRecords());
  };

  useEffect(() => {
    load();
    window.addEventListener(DB_EVENT, load);
    return () => window.removeEventListener(DB_EVENT, load);
  }, []);

  return (
    <div className="page-stack">
      <GoalForm goals={goals} onSave={async (nextGoals) => { await saveGoals(nextGoals); setGoals(nextGoals); }} />
      <PredictionCard title="体重目標" prediction={calculatePrediction(records, 'weight', goals.targetWeight)} unit="kg" />
      <PredictionCard title="体脂肪率目標" prediction={calculatePrediction(records, 'bodyFatPercentage', goals.targetBodyFatPercentage)} unit="%" />
      <PredictionCard title="体脂肪量目標" prediction={calculatePrediction(records, 'bodyFatMass', goals.targetBodyFatMass)} unit="kg" />
    </div>
  );
};
