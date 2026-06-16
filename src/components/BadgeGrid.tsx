import { BADGES } from '../constants/badges';
import type { EarnedBadge } from '../types';

export const BadgeGrid = ({ earned }: { earned: EarnedBadge[] }) => {
  const earnedIds = new Set(earned.map((badge) => badge.id));
  return (
    <section className="card">
      <div className="card-title-row">
        <h2>バッジ</h2>
        <span className="pill">{earned.length}/{BADGES.length}</span>
      </div>
      <div className="badge-grid">
        {BADGES.map((badge) => (
          <div key={badge.id} className={`badge-item ${earnedIds.has(badge.id) ? 'earned' : ''}`}>
            <div className="badge-icon">{badge.icon}</div>
            <strong>{badge.title}</strong>
            <span>{badge.description}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
