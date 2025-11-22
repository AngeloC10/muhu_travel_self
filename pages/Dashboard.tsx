import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Icons } from '../components/Icons';
import { db } from '../services/backend-db';

const StatsCard: React.FC<{ title: string; value: string | number; icon: any; color: string }> = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center transition-transform hover:-translate-y-1">
    <div className={`p-4 rounded-full ${color} bg-opacity-10 mr-4`}>
      <Icon className={color.replace('bg-', 'text-')} size={24} />
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    reservations: 0,
    revenue: 0,
    clients: 0,
    packages: 0
  });

  const [chartData, setChartData] = useState<any[]>([]);
  const [topPackagesData, setTopPackagesData] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [res, cli, pkgs] = await Promise.all([
          db.getReservations(),
          db.getClients(),
          db.getPackages()
        ]);

        const totalRevenue = res.reduce((acc, r) => acc + Number(r.totalAmount), 0);

        setStats({
          reservations: res.length,
          revenue: totalRevenue,
          clients: cli.length,
          packages: pkgs.length
        });

        // --- 1. Calculate Revenue Trend (Last 6 Months) ---
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const currentDate = new Date();
        const trendData = [];

        for (let i = 5; i >= 0; i--) {
          const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
          const monthIndex = d.getMonth();
          const year = d.getFullYear();
          const monthName = months[monthIndex];

          // Filter reservations for this month/year based on dateCreated
          const monthlySales = res.filter(r => {
            const rDate = new Date(r.dateCreated);
            return rDate.getMonth() === monthIndex && rDate.getFullYear() === year;
          }).reduce((sum, r) => sum + Number(r.totalAmount), 0);

          trendData.push({ name: monthName, ventas: monthlySales });
        }
        setChartData(trendData);

        // --- 2. Calculate Top Selling Packages ---
        const packageSales: Record<string, number> = {};
        res.forEach(r => {
          const pkgName = r.package?.name || r.packageName || 'Desconocido';
          packageSales[pkgName] = (packageSales[pkgName] || 0) + 1; // Counting reservations
        });

        const topPackages = Object.entries(packageSales)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5); // Top 5

        setTopPackagesData(topPackages);

      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    };
    loadData();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-serif font-bold text-slate-800">Dashboard</h1>
        <p className="text-gray-500">Resumen de actividad de Muhu Travel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Reservas Totales" value={stats.reservations} icon={Icons.Reservation} color="text-indigo-600 bg-indigo-600" />
        <StatsCard title="Ingresos Totales" value={`S/ ${stats.revenue.toLocaleString()}`} icon={Icons.Money} color="text-emerald-600 bg-emerald-600" />
        <StatsCard title="Clientes Activos" value={stats.clients} icon={Icons.Users} color="text-blue-600 bg-blue-600" />
        <StatsCard title="Paquetes Disponibles" value={stats.packages} icon={Icons.Package} color="text-amber-600 bg-amber-600" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Tendencia de Ingresos</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="ventas" stroke="#4f46e5" fillOpacity={1} fill="url(#colorVentas)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Packages (Mock Pie) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Paquetes Más Vendidos</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topPackagesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {topPackagesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-4 text-sm text-gray-500 flex-wrap">
            {topPackagesData.map((entry, index) => (
              <div key={index} className="flex items-center mr-2 mb-2">
                <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                {entry.name} ({entry.value})
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

import { AreaChart, Area } from 'recharts';
