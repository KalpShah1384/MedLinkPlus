import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

// Example data (replace with real API data later)
const appointmentsData = [
  { name: 'Jan', Appointments: 40 },
  { name: 'Feb', Appointments: 30 },
  { name: 'Mar', Appointments: 60 },
  { name: 'Apr', Appointments: 50 },
  { name: 'May', Appointments: 70 },
  { name: 'Jun', Appointments: 60 },
];

const pieData = [
  { name: 'Doctors', value: 24 },
  { name: 'Patients', value: 76 },
];
const COLORS = ['#1c7856', '#8884d8'];

const DashboardCharts = ({ barData = appointmentsData, pieStats = pieData }) => (
  <div className="w-full flex flex-col md:flex-row gap-8 mt-8">
    {/* Appointments Bar Chart */}
    <div className="bg-white rounded-lg shadow-lg p-6 flex-1">
      <h3 className="text-lg font-bold mb-4">Appointments Trend</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={barData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="Appointments" fill="#1c7856" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
    {/* Doctors vs Patients Pie Chart */}
    <div className="bg-white rounded-lg shadow-lg p-6 flex-1 flex flex-col items-center">
      <h3 className="text-lg font-bold mb-4">User Distribution</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={pieStats} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
            {pieStats.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default DashboardCharts;
