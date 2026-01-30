// src/pages/Admin/PieCharts.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminSidebar from "../../../Components/Admin/AdminSidebar";
import { fetchPieCharts } from "../../../redux/slices/AdminChartSlices";
import { DoughnutChart, PieChart } from "../../../Components/Admin/Chart";

const PieCharts = () => {
  const dispatch = useDispatch();
  const { pieCharts, loading, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchPieCharts());
  }, [dispatch]);


  // track sidebar collapse
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved === null ? window.innerWidth < 1024 : JSON.parse(saved);
  });

  useEffect(() => {
    // update on toggle
    const onToggle = e => setCollapsed(e.detail);
    window.addEventListener('sidebar-collapsed', onToggle);
    return () => window.removeEventListener('sidebar-collapsed', onToggle);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      <main
        className={
          `relative flex-1 p-6 lg:p-8 overflow-auto pl-[64px] ` +
          (collapsed ? 'lg:pl-[100px]' : 'lg:pl-[260px]')
        }
      >
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Analytics Dashboard</h1>
          <nav className="text-sm text-gray-500 mt-1">
            Home / Analytics / Pie & Doughnut Charts
          </nav>
        </header>

        {loading ? (
          <p className="text-gray-600">Loading charts...</p>
        ) : error ? (
          <p className="text-red-600">Error: {error}</p>
        ) : pieCharts ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pie Chart: Order Fulfillment */}
            <div className="bg-white rounded-xl shadow p-6 flex flex-col">
              <h2 className="text-lg font-medium text-gray-700 mb-4">Order Fulfillment Ratio</h2>
              <div className="flex-1 h-64">
                <PieChart
                  labels={["Processing", "Shipped", "Delivered"]}
                  data={[
                    pieCharts.statusCount?.processing || 0,
                    pieCharts.statusCount?.shipped || 0,
                    pieCharts.statusCount?.delivered || 0,
                  ]}
                  backgroundColor={[
                    "hsl(110, 80%, 80%)",
                    "hsl(110, 80%, 50%)",
                    "hsl(110, 40%, 50%)",
                  ]}
                  offset={[0, 0, 50]}
                />
              </div>
            </div>

            {/* Doughnut Chart: Product Categories */}
            <div className="bg-white rounded-xl shadow p-6 flex flex-col">
              <h2 className="text-lg font-medium text-gray-700 mb-4">Product Categories Ratio</h2>
              <div className="flex-1 h-64">
                <DoughnutChart
                  labels={
                    pieCharts.categoryCount && typeof pieCharts.categoryCount === 'object'
                      ? Object.keys(pieCharts.categoryCount)
                      : ["No Data"]
                  }
                  data={
                    pieCharts.categoryCount && typeof pieCharts.categoryCount === 'object'
                      ? Object.values(pieCharts.categoryCount)
                      : [1]
                  }
                  backgroundColor={
                    pieCharts.categoryCount && typeof pieCharts.categoryCount === 'object'
                      ? Object.keys(pieCharts.categoryCount).map((_, i) => `hsl(${i * 40}, 80%, 50%)`)
                      : ["#ccc"]
                  }
                  legends={true}
                  offset={[0, 0, 0, 80]}
                  cutout="70%"
                />
              </div>
            </div>

            {/* Doughnut Chart: Stock Availability */}
            <div className="bg-white rounded-xl shadow p-6 flex flex-col">
              <h2 className="text-lg font-medium text-gray-700 mb-4">Stock Availability</h2>
              <div className="flex-1 h-64">
                <DoughnutChart
                  labels={["In Stock", "Out Of Stock"]}
                  data={[
                    pieCharts.stockCount?.inStock || 0,
                    pieCharts.stockCount?.outOfStock || 0,
                  ]}
                  backgroundColor={["hsl(269, 80%, 40%)", "rgb(53, 162, 255)"]}
                  legends={false}
                  offset={[0, 0]}
                  cutout="70%"
                />
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">No chart data available.</p>
        )}
      </main>
    </div>
  );
};

export default PieCharts;
