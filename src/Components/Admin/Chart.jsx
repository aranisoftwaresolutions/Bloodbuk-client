import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import { Bar, Doughnut, Line, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);


const defaultMonths = ["January", "February", "March", "April", "May", "June", "July"];

///////////////////////////////////////////////////////////////////////////////////////////////
// BarChart Component
// BarChart Component
export const BarChart = ({
  data_1 = [],
  data_2 = [],
  title_1,
  title_2,
  bgColor_1,
  bgColor_2,
  horizontal = false,
  labels = defaultMonths,
}) => {
  const options = {
    responsive: true,
    indexAxis: horizontal ? "y" : "x",
    plugins: {
      legend: { display: true, position: 'bottom' },
      title: { display: false }
    },
    scales: {
      y: { beginAtZero: true, grid: { display: false } },
      x: { beginAtZero: true, grid: { display: false } }
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: title_1,
        data: data_1,
        backgroundColor: bgColor_1,
        barThickness: "flex",
        barPercentage: 1,
        categoryPercentage: 0.4,
      },
      ...(data_2.length > 0
        ? [{
          label: title_2,
          data: data_2,
          backgroundColor: bgColor_2,
          barThickness: "flex",
          barPercentage: 1,
          categoryPercentage: 0.4,
        }]
        : []),
    ],
  };

  return (
    <div className="w-full overflow-x-auto">
      <Bar className="w-full" options={options} data={data} />
    </div>
  );
};

// Other chart components remain unchanged
export const DoughnutChart = ({ labels, data, backgroundColor, cutout, legends = true, offset }) => {
  const doughnutData = { labels, datasets: [{ data, backgroundColor, borderWidth: 0, offset }] };
  const doughnutOptions = { responsive: true, plugins: { legend: { display: legends, position: "bottom", labels: { padding: 20 } } }, cutout };
  return <Doughnut data={doughnutData} options={doughnutOptions} />;
};

export const PieChart = ({ labels, data, backgroundColor, offset }) => {
  const pieData = { labels, datasets: [{ data, backgroundColor, borderWidth: 0, offset }] };
  const pieOptions = { responsive: true, plugins: { legend: { display: false } } };
  return <Pie data={pieData} options={pieOptions} />;
};

export const LineChart = ({ data, label, backgroundColor, borderColor, labels = defaultMonths }) => {
  const options = { responsive: true, plugins: { legend: { display: true }, title: { display: false } }, scales: { y: { beginAtZero: true, grid: { display: false } }, x: { beginAtZero: true, grid: { display: false } } } };
  const lineData = { labels, datasets: [{ fill: true, label, data, backgroundColor, borderColor }] };
  return <Line options={options} data={lineData} />;
};

