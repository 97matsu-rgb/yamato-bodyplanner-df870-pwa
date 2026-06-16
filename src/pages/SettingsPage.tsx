import { useEffect, useState } from 'react';
import { DataActions } from '../components/DataActions';
import { clearRecords, DB_EVENT, exportBackup, getAllRecords, importBackup } from '../services/db';
import { exportCsv, exportJson, importJsonFile } from '../services/export';
import type { BodyRecord } from '../types';

export const SettingsPage = () => {
  const [records, setRecords] = useState<BodyRecord[]>([]);
  const [message, setMessage] = useState('');
  const load = () => getAllRecords().then(setRecords);

  useEffect(() => {
    load();
    window.addEventListener(DB_EVENT, load);
    return () => window.removeEventListener(DB_EVENT, load);
  }, []);

  return (
    <div className="page-stack">
      {message && <section className="card"><p>{message}</p></section>}
      <DataActions
        onCsv={() => exportCsv(records)}
        onJson={async () => exportJson(await exportBackup())}
        onImport={async (file) => {
          const backup = await importJsonFile(file);
          await importBackup(backup);
          setMessage('バックアップを復元しました');
        }}
        onClear={async () => {
          if (!window.confirm('全ての測定データを削除しますか？')) return;
          await clearRecords();
          setMessage('全データを削除しました');
        }}
      />
      <section className="card">
        <h2>保存ポリシー</h2>
        <ul className="bullet-list">
          <li>ログイン不要</li>
          <li>データは端末内のIndexedDBのみに保存</li>
          <li>クラウド保存なし</li>
          <li>オフライン利用可能</li>
        </ul>
      </section>
    </div>
  );
};
