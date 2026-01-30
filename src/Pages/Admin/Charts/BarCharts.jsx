// src/pages/Admin/BarCharts.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminSidebar from "../../../Components/Admin/AdminSidebar";
import { fetchBarCharts } from "../../../redux/slices/AdminChartSlices";
import { BarChart } from "../../../Components/Admin/Chart";

const BarCharts = () => {
    const dispatch = useDispatch();
    const { barCharts, loading } = useSelector((state) => state.dashboard);

    useEffect(() => {
        dispatch(fetchBarCharts());
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
                {/* Header / Breadcrumbs */}
                <header className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">Analytics Dashboard</h1>
                    <nav className="text-sm text-gray-500 mt-1">Home / Analytics / Bar Charts</nav>
                </header>

                {loading ? (
                    <p className="text-gray-600">Loading bar charts...</p>
                ) : barCharts ? (
                    <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                        <div className="bg-white rounded-xl shadow p-6">
                            <h2 className="text-lg font-medium text-gray-700 mb-4">
                                Revenue & Transactions (Last 6 Months)
                            </h2>
                            <BarChart
                                horizontal={false}
                                data_1={barCharts.revenue || []}
                                data_2={barCharts.orders || []}
                                title_1="Revenue"
                                title_2="Transactions"
                                bgColor_1="rgb(0, 115, 255)"
                                bgColor_2="rgba(53, 162, 235, 0.8)"
                                labels={barCharts.months || []}
                            />
                        </div>

                        <div className="bg-white rounded-xl shadow p-6">
                            <h2 className="text-lg font-medium text-gray-700 mb-4">
                                Orders Over The Last 6 Months
                            </h2>
                            <BarChart
                                horizontal={true}
                                data_1={barCharts.orders || []}
                                title_1="Orders"
                                bgColor_1="hsl(180, 40%, 50%)"
                                labels={barCharts.months || []}
                            />
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-600">No bar chart data available.</p>
                )}
            </main>
        </div>
    );
};

export default BarCharts;