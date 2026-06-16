import confetti from 'canvas-confetti';
import { useEffect } from 'react';
import type { EarnedBadge } from '../types';

export const AchievementModal = ({ badges, onClose }: { badges: EarnedBadge[]; onClose: () => void }) => {
  useEffect(() => {
    confetti({ particleCount: 140, spread: 90, origin: { y: 0.6 } });
    if ('vibrate' in navigator) navigator.vibrate?.([120, 60, 120]);
  }, []);

  if (!badges.length) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card achievement" onClick={(e) => e.stopPropagation()}>
        <h2>新しいバッジを獲得しました</h2>
        <div className="achievement-list">
          {badges.map((badge) => (
            <div key={badge.id} className="badge-item earned pop">
              <div className="badge-icon">{badge.icon}</div>
              <strong>{badge.title}</strong>
              <span>{badge.description}</span>
            </div>
          ))}
        </div>
        <button className="primary-button" onClick={onClose}>OK</button>
      </div>
    </div>
  );
};
