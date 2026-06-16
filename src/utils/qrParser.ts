import type { BodyRecord } from '../types';

const requiredPrefix = 'DF870';

const readNumber = (params: URLSearchParams, key: string) => Number(params.get(key) ?? 0);

export const parseDf870Qr = (raw: string): Omit<BodyRecord, 'id' | 'createdAt'> => {
  if (!raw.startsWith(requiredPrefix)) {
    throw new Error('YAMATO BodyPlanner DF870のQRコードではありません。');
  }

  const query = raw.replace(/^DF870&/, '');
  const params = new URLSearchParams(query);
  const year = params.get('SY');
  const month = params.get('SM')?.padStart(2, '0');
  const day = params.get('SD')?.padStart(2, '0');

  if (!year || !month || !day) {
    throw new Error('測定日の解析に失敗しました。');
  }

  return {
    measuredOn: `${year}-${month}-${day}`,
    weight: readNumber(params, 'WT'),
    bmi: readNumber(params, 'BI'),
    bodyFatPercentage: readNumber(params, 'BP'),
    bodyFatMass: readNumber(params, 'FB'),
    skeletalMuscleMass: readNumber(params, 'WX'),
    basalMetabolism: readNumber(params, 'BL'),
    boneMass: readNumber(params, 'BV'),
    bodyWater: readNumber(params, 'WV'),
    appendicularMuscleMass: readNumber(params, 'SS'),
    smi: readNumber(params, 'SI'),
    visceralFatIndex: readNumber(params, 'VF'),
    raw,
  };
};
