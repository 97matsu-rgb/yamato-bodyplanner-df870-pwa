import type { BodyRecord } from '../types';

export const StatsCard = ({ record }: { record?: BodyRecord }) => {
  if (!record) {
    return (
      <section className="card">
        <h2>最新測定結果</h2>
        <p className="muted">まだデータがありません。「測定データを追加」からQRコードを読み込んでください。</p>
      </section>
    );
  }

  return (
    <section className="card">
      <div className="card-title-row">
        <h2>最新測定結果</h2>
        <span className="pill">{record.measuredOn}</span>
      </div>
      <div className="metric-grid">
        <div><span>体重</span><strong>{record.weight.toFixed(2)}kg</strong></div>
        <div><span>BMI</span><strong>{record.bmi.toFixed(1)}</strong></div>
        <div><span>体脂肪率</span><strong>{record.bodyFatPercentage.toFixed(1)}%</strong></div>
        <div><span>体脂肪量</span><strong>{record.bodyFatMass.toFixed(2)}kg</strong></div>
        <div><span>骨格筋量</span><strong>{record.skeletalMuscleMass.toFixed(2)}kg</strong></div>
      </div>
    </section>
  );
};
