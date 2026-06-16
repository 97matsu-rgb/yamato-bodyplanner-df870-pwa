import { useEffect, useState } from 'react';
import type { Goals } from '../types';

export const GoalForm = ({ goals, onSave }: { goals: Goals; onSave: (goals: Goals) => Promise<void> }) => {
  const [form, setForm] = useState<Goals>(goals);
  useEffect(() => setForm(goals), [goals]);

  return (
    <section className="card">
      <h2>目標設定</h2>
      <div className="form-grid">
        <label>
          目標体重(kg)
          <input type="number" step="0.1" value={form.targetWeight ?? ''} onChange={(e) => setForm({ ...form, targetWeight: Number(e.target.value) || undefined })} />
        </label>
        <label>
          目標体脂肪率(%)
          <input type="number" step="0.1" value={form.targetBodyFatPercentage ?? ''} onChange={(e) => setForm({ ...form, targetBodyFatPercentage: Number(e.target.value) || undefined })} />
        </label>
        <label>
          目標体脂肪量(kg)
          <input type="number" step="0.1" value={form.targetBodyFatMass ?? ''} onChange={(e) => setForm({ ...form, targetBodyFatMass: Number(e.target.value) || undefined })} />
        </label>
      </div>
      <button className="primary-button" onClick={() => onSave(form)}>保存する</button>
    </section>
  );
};
