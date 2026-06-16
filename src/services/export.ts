import type { AppBackup, BodyRecord } from '../types';

const downloadBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
};

export const exportCsv = (records: BodyRecord[]) => {
  const header = ['日付', '体重', 'BMI', '体脂肪率', '体脂肪量', '骨格筋量'];
  const lines = records.map((record) => [
    record.measuredOn,
    record.weight,
    record.bmi,
    record.bodyFatPercentage,
    record.bodyFatMass,
    record.skeletalMuscleMass,
  ]);
  const csv = [header, ...lines].map((line) => line.join(',')).join('\n');
  downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8' }), 'bodyplanner-history.csv');
};

export const exportJson = (backup: AppBackup) => {
  downloadBlob(new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' }), 'bodyplanner-backup.json');
};

export const importJsonFile = (file: File) =>
  new Promise<AppBackup>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        resolve(JSON.parse(String(reader.result)) as AppBackup);
      } catch {
        reject(new Error('JSONの解析に失敗しました。'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file, 'utf-8');
  });
