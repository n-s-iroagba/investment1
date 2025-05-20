import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/DetailCard';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export type ManagedInvestmentPortfolio = {
  amount: number;
  earnings?: number;
  amountDeposited?: number;
  lastDepositDate?: Date | null;
  firstDepositDate: Date | null;
};

// Utility to generate 30 days of steady 10% daily growth
const generateData = (initial: number, days: number) => {
  const data: { date: string; amount: number; earnings: number }[] = [];
  let current = initial;
  let cumulativeEarnings = 0;
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i - 1));
    const prev = current;
    current = parseFloat((current * 1.1).toFixed(2));
    const earnings = parseFloat((current - prev).toFixed(2));
    cumulativeEarnings = parseFloat((cumulativeEarnings + earnings).toFixed(2));
    data.push({ date: date.toLocaleDateString(), amount: current, earnings: cumulativeEarnings });
  }
  return data;
};

const ManagedInvestmentDashboard: React.FC<{ initialAmount?: number }> = ({ initialAmount = 1000 }) => {
  const data = useMemo(() => generateData(initialAmount, 30), [initialAmount]);
  const latest = data[data.length - 1];

  return (
    <div className="p-8 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Investment Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-blue-50">
          <CardContent>
            <h2 className="text-lg font-semibold text-blue-700">Current Amount</h2>
            <p className="text-2xl mt-2 font-bold text-blue-900">${latest.amount.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50">
          <CardContent>
            <h2 className="text-lg font-semibold text-green-700">Total Earnings</h2>
            <p className="text-2xl mt-2 font-bold text-green-900">${latest.earnings.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-50">
          <CardContent>
            <h2 className="text-lg font-semibold text-gray-700">Days Tracked</h2>
            <p className="text-2xl mt-2 font-bold text-gray-900">{data.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-xl font-semibold text-blue-600 mb-4">Growth Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fill: '#1E3A8A' }} />
            <YAxis tickFormatter={(value) => `$${value}`} tick={{ fill: '#1E3A8A' }} />
            <Tooltip formatter={(value: number) => `$${value}`} />
            <Line type="monotone" dataKey="amount" stroke="#2563EB" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ManagedInvestmentDashboard;
