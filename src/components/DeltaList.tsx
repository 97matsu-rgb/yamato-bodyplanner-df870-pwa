import type { BodyRecord } from '../types';

const row = (label: string, value: number, unit: string, positiveGood: boolean) => {
  const positive = value > 0;
  const good = positiveGood ? positive : !positive;
  return (
    <div className={`delta-row ${good ? 'good' : 'bad'}`} key={label}>
      <span>{label}</span>
      <strong>{value > 0 ? '+' : ''}{value.toFixed(1)}{unit}</strong>
    </div>
  );
};

export const DeltaList = ({ latest, previous }: { latest?: BodyRecord; previous?: BodyRecord }) => {
  if (!latest || !previous) return null;
  return (
    <section className="card">
      <h2>前回比</h2>
      <div className="delta-list">
        {row('体重', latest.weight - previous.weight, 'kg', false)}
        {row('体脂肪率', latest.bodyFatPercentage - previous.bodyFatPercentage, '%', false)}
        {row('体脂肪量', latest.bodyFatMass - previous.bodyFatMass, 'kg', false)}
        {row('骨格筋量', latest.skeletalMuscleMass - previous.skeletalMuscleMass, 'kg', true)}
      </div>
    </section>
  );
};
