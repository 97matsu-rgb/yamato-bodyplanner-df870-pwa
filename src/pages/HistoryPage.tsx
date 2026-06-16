import { useEffect, useState } from 'react';
import { HistoryTable } from '../components/HistoryTable';
import { DB_EVENT, deleteRecord, getAllRecords } from '../services/db';
import type { BodyRecord } from '../types';

export const HistoryPage = () => {
  const [records, setRecords] = useState<BodyRecord[]>([]);
  const load = () => getAllRecords().then(setRecords);

  useEffect(() => {
    load();
    window.addEventListener(DB_EVENT, load);
    return () => window.removeEventListener(DB_EVENT, load);
  }, []);

  const onDelete = async (id: number) => {
    if (!window.confirm('この測定データを削除しますか？')) return;
    await deleteRecord(id);
  };

  return <HistoryTable records={records} onDelete={onDelete} />;
};
