// src/pages/Admin/LineCharts.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminSidebar from "../../../Components/Admin/AdminSidebar";
import { fetchLineCharts } from "../../../redux/slices/AdminChartSlices";
import { LineChart } from "../../../Components/Admin/Chart";

const LineCharts = () => {
  const dispatch = useDispatch();
  const { lineCharts, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchLineCharts());
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
          <nav className="text-sm text-gray-500 mt-1">Home / Analytics / Line Charts</nav>
        </header>

        {loading ? (
          <p className="text-gray-600">Loading line charts...</p>
        ) : lineCharts ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-medium text-gray-700 mb-4">Active Users</h2>
              <LineChart
                data={lineCharts.users || []}
                label="Users"
                borderColor="rgb(53, 162, 255)"
                backgroundColor="rgba(53, 162, 255, 0.5)"
                labels={lineCharts.months || []}
              />
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-medium text-gray-700 mb-4">Total Products (₹)</h2>
              <LineChart
                data={lineCharts.products || []}
                label="Products"
                borderColor="hsl(269,80%,40%)"
                backgroundColor="hsla(269,80%,40%,0.4)"
                labels={lineCharts.months || []}
              />
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-medium text-gray-700 mb-4">Total Revenue</h2>
              <LineChart
                data={lineCharts.revenue || []}
                label="Revenue"
                borderColor="hsl(129,80%,40%)"
                backgroundColor="hsla(129,80%,40%,0.4)"
                labels={lineCharts.months || []}
              />
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-medium text-gray-700 mb-4">Discount Allotted</h2>
              <LineChart
                data={lineCharts.discount || []}
                label="Discount"
                borderColor="hsl(29,80%,40%)"
                backgroundColor="hsla(29,80%,40%,0.4)"
                labels={lineCharts.months || []}
              />
            </div>
          </div>
        ) : (
          <p className="text-gray-600">No line chart data available.</p>
        )}
      </main>
    </div>
  );
};

export default LineCharts;