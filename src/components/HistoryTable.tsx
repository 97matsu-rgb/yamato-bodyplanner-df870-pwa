import type { BodyRecord } from '../types';

export const HistoryTable = ({ records, onDelete }: { records: BodyRecord[]; onDelete: (id: number) => void }) => (
  <section className="card">
    <h2>測定履歴</h2>
    <div className="history-list">
      {records.map((record) => (
        <article className="history-item" key={record.id}>
          <div className="history-row history-header-row">
            <strong>{record.measuredOn}</strong>
            <button className="ghost-button danger" onClick={() => record.id && onDelete(record.id)}>削除</button>
          </div>
          <div className="history-grid">
            <span>体重 {record.weight.toFixed(2)}kg</span>
            <span>BMI {record.bmi.toFixed(1)}</span>
            <span>体脂肪率 {record.bodyFatPercentage.toFixed(1)}%</span>
            <span>体脂肪量 {record.bodyFatMass.toFixed(2)}kg</span>
            <span>骨格筋量 {record.skeletalMuscleMass.toFixed(2)}kg</span>
          </div>
        </article>
      ))}
    </div>
  </section>
);
