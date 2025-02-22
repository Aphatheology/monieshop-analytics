import { useEffect, useState } from "react";
import { fetchAnalytics, fetchDatasets } from "../api";
import { Bar, Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { setDatasets } from 'react-chartjs-2/dist/utils';

Chart.register(...registerables);

interface AnalyticsData {
  highestSalesVolumeDay: string;
  highestSalesVolume: number;
  highestSalesValueDay: string;
  highestSalesValue: number;
  mostSoldProduct: string;
  highestSalesStaffByMonth: { _id: { year: number; month: number }; topSalesStaff: number }[];
  highestHourByTransactionVolume: number;
}

const Analytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [selectedDataset, setSelectedDataset] = useState("test-data-1");
  const [datasets, setDatasets] = useState<string[]>([]);

  useEffect(() => {
    fetchDatasets().then(setDatasets).catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedDataset) return;

    fetchAnalytics(selectedDataset).then(setAnalytics).catch(console.error);
  }, [selectedDataset]);

  if (!analytics) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Sales Analytics Dashboard</h1>

      <select
        value={selectedDataset}
        onChange={(e) => setSelectedDataset(e.target.value)}
        className="border p-2 mt-4"
      >
        {datasets.map((dataset) => (
          <option key={dataset} value={dataset}>
            {dataset}
          </option>
        ))}
      </select>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow-md p-4 rounded-lg">
          <h2 className="text-lg font-semibold">📅 Highest Sales Volume Day</h2>
          <p className="text-xl font-bold">{analytics.highestSalesVolumeDay}</p>
          <p className="text-gray-600">Volume: {analytics.highestSalesVolume}</p>
        </div>

        <div className="bg-white shadow-md p-4 rounded-lg">
          <h2 className="text-lg font-semibold">💰 Highest Sales Value Day</h2>
          <p className="text-xl font-bold">{analytics.highestSalesValueDay}</p>
          <p className="text-gray-600">Value: ${analytics.highestSalesValue.toFixed(2)}</p>
        </div>

        <div className="bg-white shadow-md p-4 rounded-lg">
          <h2 className="text-lg font-semibold">🔥 Most Sold Product</h2>
          <p className="text-xl font-bold">Product ID: {analytics.mostSoldProduct}</p>
        </div>
      </div>

      <div className="bg-white shadow-md p-4 rounded-lg mt-6">
        <h2 className="text-lg font-semibold">⏰ Peak Sales Hour</h2>
        <p className="text-xl font-bold">{analytics.highestHourByTransactionVolume}:00</p>
      </div>

      {/* Sales Staff Chart */}
      <div className="bg-white shadow-md p-4 rounded-lg mt-6">
        <h2 className="text-lg font-semibold">🏆 Top Sales Staff by Month</h2>
        <Bar
          data={{
            labels: analytics.highestSalesStaffByMonth.map(({ _id }) => `${_id.year}-${String(_id.month).padStart(2, "0")}`),
            datasets: [
              {
                label: "Top Sales Staff ID",
                data: analytics.highestSalesStaffByMonth.map((item) => item.topSalesStaff),
                backgroundColor: "rgba(54, 162, 235, 0.6)",
              },
            ],
          }}
        />
      </div>
    </div>
  );
};

export default Analytics;
