import { useEffect, useMemo, useState } from 'react';
import { AchievementModal } from '../components/AchievementModal';
import { BadgeGrid } from '../components/BadgeGrid';
import { DeltaList } from '../components/DeltaList';
import { MotivationMessage } from '../components/MotivationMessage';
import { QRCodeScanner } from '../components/QRCodeScanner';
import { StatsCard } from '../components/StatsCard';
import { DB_EVENT, addRecord, getAllRecords, getGoals } from '../services/db';
import type { BodyRecord, EarnedBadge, Goals } from '../types';
import { collectEarnedBadges } from '../utils/badges';
import { buildMotivationMessage } from '../utils/motivation';
import { parseDf870Qr } from '../utils/qrParser';

const BestRecords = ({ records }: { records: BodyRecord[] }) => {
  if (!records.length) return null;
  const weight = Math.min(...records.map((record) => record.weight));
  const fatRate = Math.min(...records.map((record) => record.bodyFatPercentage));
  const fatMass = Math.min(...records.map((record) => record.bodyFatMass));
  const muscle = Math.max(...records.map((record) => record.skeletalMuscleMass));
  return (
    <section className="card">
      <h2>ベスト記録</h2>
      <div className="metric-grid">
        <div><span>最低体重</span><strong>{weight.toFixed(2)}kg</strong></div>
        <div><span>最低体脂肪率</span><strong>{fatRate.toFixed(1)}%</strong></div>
        <div><span>最低体脂肪量</span><strong>{fatMass.toFixed(2)}kg</strong></div>
        <div><span>最高骨格筋量</span><strong>{muscle.toFixed(2)}kg</strong></div>
      </div>
    </section>
  );
};

export const HomePage = () => {
  const [records, setRecords] = useState<BodyRecord[]>([]);
  const [goals, setGoals] = useState<Goals>({});
  const [scannerOpen, setScannerOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [newBadges, setNewBadges] = useState<EarnedBadge[]>([]);

  const load = async () => {
    setRecords(await getAllRecords());
    setGoals(await getGoals());
  };

  useEffect(() => {
    load();
    window.addEventListener(DB_EVENT, load);
    return () => window.removeEventListener(DB_EVENT, load);
  }, []);

  const earnedBadges = useMemo(() => collectEarnedBadges(records, goals), [records, goals]);

  const handleScan = async (raw: string) => {
    try {
      const before = collectEarnedBadges(records, goals);
      const result = await addRecord(parseDf870Qr(raw));
      if (!result.inserted) {
        setMessage('既に登録済みです');
        setScannerOpen(false);
        return;
      }
      const nextRecords = await getAllRecords();
      setRecords(nextRecords);
      setMessage('測定データを保存しました');
      const after = collectEarnedBadges(nextRecords, goals);
      const beforeIds = new Set(before.map((badge) => badge.id));
      setNewBadges(after.filter((badge) => !beforeIds.has(badge.id)));
      setScannerOpen(false);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'QRコードの読み取りに失敗しました。');
    }
  };

  return (
    <div className="page-stack">
      <section className="hero-card">
        <div>
          <p className="eyebrow">完全オフライン対応 / IndexedDB保存</p>
          <h2>今日の測定をすぐ記録</h2>
          <p>YAMATO BodyPlanner DF870 のQRコードを読み取り、体組成を自動保存します。</p>
        </div>
        <button className="primary-button" onClick={() => setScannerOpen(true)}>測定データを追加</button>
      </section>
      {message && <section className="card"><p>{message}</p></section>}
      <StatsCard record={records[0]} />
      <DeltaList latest={records[0]} previous={records[1]} />
      <MotivationMessage message={buildMotivationMessage(records)} />
      <BestRecords records={records} />
      <BadgeGrid earned={earnedBadges} />
      {scannerOpen && <QRCodeScanner onScan={handleScan} onClose={() => setScannerOpen(false)} />}
      <AchievementModal badges={newBadges} onClose={() => setNewBadges([])} />
    </div>
  );
};
