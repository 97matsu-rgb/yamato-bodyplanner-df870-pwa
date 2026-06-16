import type { AppBackup, BodyRecord, Goals } from '../types';

const DB_NAME = 'yamato-bodyplanner-db';
const DB_VERSION = 1;
const RECORD_STORE = 'records';
const GOAL_STORE = 'goals';
export const DB_EVENT = 'bodyplanner-db-updated';

const emitChange = () => window.dispatchEvent(new Event(DB_EVENT));

const openDb = () =>
  new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(RECORD_STORE)) {
        db.createObjectStore(RECORD_STORE, { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(GOAL_STORE)) {
        db.createObjectStore(GOAL_STORE, { keyPath: 'key' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const txDone = (tx: IDBTransaction) =>
  new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });

export const getAllRecords = async (): Promise<BodyRecord[]> => {
  const db = await openDb();
  const tx = db.transaction(RECORD_STORE, 'readonly');
  const store = tx.objectStore(RECORD_STORE);
  const records = await new Promise<BodyRecord[]>((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve((request.result as BodyRecord[]) ?? []);
    request.onerror = () => reject(request.error);
  });
  db.close();
  return records.sort((a, b) => b.measuredOn.localeCompare(a.measuredOn) || (b.id ?? 0) - (a.id ?? 0));
};

export const addRecord = async (record: Omit<BodyRecord, 'id' | 'createdAt'>) => {
  const current = await getAllRecords();
  const duplicated = current.some(
    (item) =>
      item.measuredOn === record.measuredOn &&
      item.weight === record.weight &&
      item.bodyFatPercentage === record.bodyFatPercentage &&
      item.skeletalMuscleMass === record.skeletalMuscleMass,
  );
  if (duplicated) return { inserted: false } as const;

  const db = await openDb();
  const tx = db.transaction(RECORD_STORE, 'readwrite');
  tx.objectStore(RECORD_STORE).add({ ...record, createdAt: new Date().toISOString() });
  await txDone(tx);
  db.close();
  emitChange();
  return { inserted: true } as const;
};

export const deleteRecord = async (id: number) => {
  const db = await openDb();
  const tx = db.transaction(RECORD_STORE, 'readwrite');
  tx.objectStore(RECORD_STORE).delete(id);
  await txDone(tx);
  db.close();
  emitChange();
};

export const clearRecords = async () => {
  const db = await openDb();
  const tx = db.transaction(RECORD_STORE, 'readwrite');
  tx.objectStore(RECORD_STORE).clear();
  await txDone(tx);
  db.close();
  emitChange();
};

export const getGoals = async (): Promise<Goals> => {
  const db = await openDb();
  const tx = db.transaction(GOAL_STORE, 'readonly');
  const result = await new Promise<{ key: string; value: Goals } | undefined>((resolve, reject) => {
    const request = tx.objectStore(GOAL_STORE).get('main');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  db.close();
  return result?.value ?? {};
};

export const saveGoals = async (goals: Goals) => {
  const db = await openDb();
  const tx = db.transaction(GOAL_STORE, 'readwrite');
  tx.objectStore(GOAL_STORE).put({ key: 'main', value: goals });
  await txDone(tx);
  db.close();
  emitChange();
};

export const exportBackup = async (): Promise<AppBackup> => ({
  version: 1,
  exportedAt: new Date().toISOString(),
  records: await getAllRecords(),
  goals: await getGoals(),
});

export const importBackup = async (backup: AppBackup) => {
  const db = await openDb();
  const tx = db.transaction([RECORD_STORE, GOAL_STORE], 'readwrite');
  tx.objectStore(RECORD_STORE).clear();
  backup.records.forEach((record) => tx.objectStore(RECORD_STORE).add(record));
  tx.objectStore(GOAL_STORE).put({ key: 'main', value: backup.goals ?? {} });
  await txDone(tx);
  db.close();
  emitChange();
};
