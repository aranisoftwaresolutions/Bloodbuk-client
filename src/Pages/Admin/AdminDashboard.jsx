import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HiTrendingUp, HiTrendingDown } from 'react-icons/hi';
import { motion } from 'framer-motion';
import { BarChart } from '../../components/Admin/Chart';
import DashboardTable from '../../components/Admin/DashboardTable';
import AdminSidebar from '../../Components/Admin/AdminSidebar';

import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

import {
    fetchDashboardStats,
    fetchPieCharts,
    fetchBarCharts,
    fetchLineCharts,
} from '../../redux/slices/AdminChartSlices';

const gradientMap = {
    revenue: 'from-blue-500 to-indigo-600',
    users: 'from-green-400 to-teal-500',
    orders: 'from-yellow-400 to-orange-500',
    products: 'from-purple-400 to-pink-500',
};


const AdminDashboard = () => {
    const dispatch = useDispatch();
    const { stats, pieCharts, barCharts, error } = useSelector(s => s.dashboard);

    useEffect(() => {
        dispatch(fetchDashboardStats());
        dispatch(fetchPieCharts());
        dispatch(fetchBarCharts());
        dispatch(fetchLineCharts());
    }, [dispatch]);

    // --- Dark/Light Theme Toggle ---
    const [dark, setDark] = useState(() =>
        localStorage.theme === 'dark' ||
        (!('theme' in localStorage) &&
            window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
    useEffect(() => {
        if (dark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.theme = dark ? 'dark' : 'light';
    }, [dark]);

    // Sidebar collapse state
    const [collapsed, setCollapsed] = useState(() => {
        const saved = localStorage.getItem('sidebarCollapsed');
        return saved === null ? window.innerWidth < 1024 : JSON.parse(saved);
    });
    useEffect(() => {
        const onToggle = (e) => setCollapsed(e.detail);
        window.addEventListener('sidebar-collapsed', onToggle);
        return () => window.removeEventListener('sidebar-collapsed', onToggle);
    }, []);

    if (error) return <p className="text-red-600 p-4">{error}</p>;

    const count = stats?.count ?? {};
    const change = stats?.changePercent ?? {};

    const cards = [
        {
            key: 'revenue',
            label: 'Revenue',
            value: count.revenue ?? 0,
            prefix: '₹',
            icon: <MonetizationOnIcon fontSize="large" />,
        },
        {
            key: 'users',
            label: 'Users',
            value: count.user ?? 0,
            icon: <PersonOutlineIcon fontSize="large" />,
        },
        {
            key: 'orders',
            label: 'Transactions',
            value: count.order ?? 0,
            icon: <ReceiptLongIcon fontSize="large" />,
        },
        {
            key: 'products',
            label: 'Products',
            value: count.product ?? 0,
            icon: <Inventory2Icon fontSize="large" />,
        },
    ];

    // --- MOCK DATA, replace with your real data if needed ---
    const activities = [
        { user: "Amit", action: "purchased", item: "iPhone 15", date: "2 mins ago" },
        { user: "Sara", action: "added", item: "T-shirt", date: "10 mins ago" },
        { user: "John", action: "reviewed", item: "Laptop", date: "1 hour ago" },
    ];
    const users = [
        { name: "Amit Sharma", role: "Customer" },
        { name: "Sara Lee", role: "Seller" },
        { name: "John Doe", role: "Admin" },
    ];

    return (
        <div className="flex bg-gray-100 dark:bg-gray-900 min-h-screen transition-colors">
            <AdminSidebar />
            <main
                className={
                    "relative flex-1 flex flex-col p-4 lg:p-8 overflow-auto " +
                    (collapsed ? 'lg:pl-[100px]' : 'lg:pl-[260px]')
                }
            >
                {/* Top Bar */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight">
                        Dashboard
                    </h1>
                    <button
                        onClick={() => setDark(d => !d)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-200 dark:bg-gray-700
                            text-gray-600 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 shadow transition"
                        title={dark ? 'Switch to Light' : 'Switch to Dark'}
                    >
                        {dark
                            ? <LightModeIcon sx={{ fontSize: 22 }} />
                            : <DarkModeIcon sx={{ fontSize: 22 }} />
                        }
                        <span className="font-semibold text-base">{dark ? 'Light' : 'Dark'} Mode</span>
                    </button>
                </div>

                {/* Analytics Section */}
                <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                    {cards.map(({ key, label, value, prefix, icon }) => (
                        <StatsCard
                            key={key}
                            label={label}
                            value={value}
                            prefix={prefix}
                            percent={change[key] ?? 0}
                            gradient={gradientMap[key]}
                            icon={icon}
                        />
                    ))}
                </section>

                {/* Charts and Category Breakdown */}
                <div className="mt-8 grid gap-8 lg:grid-cols-3">
                    <ChartPanel title="Revenue vs Orders" cols={2}>
                        <BarChart
                            data_1={barCharts?.revenue || []}
                            data_2={barCharts?.orders || []}
                            labels={barCharts?.months || []}
                            title_1="Revenue"
                            title_2="Orders"
                            bgColor_1="rgba(139,92,246,0.8)"
                            bgColor_2="rgba(16,185,129,0.8)"
                        />
                    </ChartPanel>
                    <ChartPanel title="Inventory Breakdown">
                        <div className="space-y-3">
                            {Object.entries(pieCharts?.categoryCount ?? {}).map(([cat, val]) => (
                                <CategoryBar key={cat} label={cat} value={val} />
                            ))}
                        </div>
                    </ChartPanel>
                </div>

                {/* Activity Feed, Recent Users, Recent Transactions */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                    {/* Activity Feed */}
                    <ChartPanel title="Activity Feed">
                        <ul className="space-y-4">
                            {activities.map((act, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <span className="text-indigo-500 font-bold">{act.user}</span>
                                    <span className="text-gray-700 dark:text-gray-200">{act.action}</span>
                                    <span className="italic text-purple-600 dark:text-purple-400">{act.item}</span>
                                    <span className="text-xs text-gray-400 ml-auto">{act.date}</span>
                                </li>
                            ))}
                        </ul>
                    </ChartPanel>

                    {/* Recent Users */}
                    <ChartPanel title="Recent Users">
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                            {users.map((u, i) => (
                                <li key={i} className="py-3 flex items-center gap-3">
                                    <PersonOutlineIcon className="text-blue-500" />
                                    <div>
                                        <div className="font-semibold text-gray-800 dark:text-gray-200">{u.name}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">{u.role}</div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </ChartPanel>


                </section>

                {/* Recent Transactions */}
                <section className="mt-8">
                    <ChartPanel title="Recent Transactions">
                        <DashboardTable />
                    </ChartPanel>
                </section>
            </main>
        </div>
    );
};

const StatsCard = ({ label, value, prefix = '', percent, gradient, icon }) => {
    const capped = Math.sign(percent) * Math.min(Math.abs(percent), 100);
    const up = capped >= 0;
    return (
        <motion.div
            whileHover={{ scale: 1.03 }}
            className={`relative bg-gradient-to-br ${gradient} text-white rounded-2xl shadow-xl p-6 flex items-center gap-4`}
        >
            <div className="bg-white/30 rounded-full p-3">{icon}</div>
            <div>
                <div className="flex items-center gap-2">
                    <h4 className="text-lg font-semibold">{label}</h4>
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full
                        ${up ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                        {up ? <HiTrendingUp /> : <HiTrendingDown />} {Math.abs(capped)}%
                    </span>
                </div>
                <div className="text-2xl font-bold mt-2">{prefix}{value}</div>
            </div>
        </motion.div>
    );
};

const ChartPanel = ({ title, children, cols = 1 }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 lg:col-span-${cols}`}
    >
        <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">{title}</h4>
        {children}
    </motion.div>
);

const CategoryBar = ({ label, value }) => (
    <div className="flex items-center space-x-3">
        <span className="w-24 text-gray-700 dark:text-gray-200">{label}</span>
        <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500" style={{ width: `${value}%` }} />
        </div>
        <span className="w-12 text-right font-medium text-gray-700 dark:text-gray-200">
            {value}%
        </span>
    </div>
);

export default AdminDashboard;
