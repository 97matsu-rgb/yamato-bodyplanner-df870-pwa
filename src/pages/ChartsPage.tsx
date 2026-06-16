import { useEffect, useState } from 'react';
import { LineChartCard } from '../components/LineChartCard';
import { DB_EVENT, getAllRecords } from '../services/db';
import type { BodyRecord } from '../types';

export const ChartsPage = () => {
  const [records, setRecords] = useState<BodyRecord[]>([]);
  const load = () => getAllRecords().then(setRecords);

  useEffect(() => {
    load();
    window.addEventListener(DB_EVENT, load);
    return () => window.removeEventListener(DB_EVENT, load);
  }, []);

  return (
    <div className="page-stack">
      <LineChartCard
        title="総合グラフ"
        records={records}
        series={[
          { label: '体重', color: '#2563EB', values: [...records].reverse().map((record) => record.weight) },
          { label: '体脂肪率', color: '#EF4444', values: [...records].reverse().map((record) => record.bodyFatPercentage) },
          { label: '骨格筋量', color: '#10B981', values: [...records].reverse().map((record) => record.skeletalMuscleMass) },
        ]}
      />
      <LineChartCard title="体重" records={records} series={[{ label: '体重', color: '#2563EB', values: [...records].reverse().map((record) => record.weight) }]} />
      <LineChartCard title="BMI" records={records} series={[{ label: 'BMI', color: '#7C3AED', values: [...records].reverse().map((record) => record.bmi) }]} />
      <LineChartCard title="体脂肪率" records={records} series={[{ label: '体脂肪率', color: '#EF4444', values: [...records].reverse().map((record) => record.bodyFatPercentage) }]} />
      <LineChartCard title="体脂肪量" records={records} series={[{ label: '体脂肪量', color: '#F59E0B', values: [...records].reverse().map((record) => record.bodyFatMass) }]} />
      <LineChartCard title="骨格筋量" records={records} series={[{ label: '骨格筋量', color: '#10B981', values: [...records].reverse().map((record) => record.skeletalMuscleMass) }]} />
    </div>
  );
};
