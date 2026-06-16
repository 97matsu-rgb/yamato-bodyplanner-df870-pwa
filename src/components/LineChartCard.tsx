import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { BodyRecord } from '../types';
import { getAxisBounds } from '../utils/chart';
import { formatShortDate } from '../utils/date';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Legend, Tooltip);

type Series = { label: string; color: string; values: number[] };

export const LineChartCard = ({ title, records, series }: { title: string; records: BodyRecord[]; series: Series[] }) => {
  const asc = [...records].sort((a, b) => a.measuredOn.localeCompare(b.measuredOn));
  const labels = asc.map((record) => formatShortDate(record.measuredOn));
  const allValues = series.flatMap((item) => item.values);
  const bounds = getAxisBounds(allValues);

  return (
    <section className="card">
      <h2>{title}</h2>
      <div className="chart-wrap">
        <Line
          data={{
            labels,
            datasets: series.map((item) => ({
              label: item.label,
              data: item.values,
              borderColor: item.color,
              backgroundColor: item.color,
              tension: 0.35,
            })),
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'top' } },
            scales: {
              y: { min: bounds.min, max: bounds.max },
              x: { ticks: { maxRotation: 0 } },
            },
          }}
        />
      </div>
    </section>
  );
};
