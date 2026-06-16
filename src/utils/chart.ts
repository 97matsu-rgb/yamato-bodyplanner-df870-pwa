export const getAxisBounds = (values: number[]) => {
  if (!values.length) return { min: 0, max: 100 };
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(max - min, Math.abs(max) * 0.1, 1);
  return {
    min: Number((min - span * 0.1).toFixed(2)),
    max: Number((max + span * 0.1).toFixed(2)),
  };
};
