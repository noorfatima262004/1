import React, { useEffect, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend, ArcElement);

const UserStats = ({ userList = [] }) => {
  const chartRefs = {
    bar: useRef(null),
    pie: useRef(null),
    line: useRef(null),
  };

  useEffect(() => {
    return () => {
      Object.values(chartRefs).forEach((chartRef) => {
        if (chartRef.current?.chartInstance) {
          chartRef.current.chartInstance.destroy();
        }
      });
    };
  }, [userList]);

  if (!Array.isArray(userList) || userList.length === 0) {
    return <p className="text-center text-gray-500">No data available for charts.</p>;
  }

  const verifiedUsers = userList.filter((user) => user.isVerified).length;
  const unverifiedUsers = userList.length - verifiedUsers;
  const numberOfOrdersData = userList.map((user) => user.numberOfOrders || 0);
  const cumulativeOrders = numberOfOrdersData.reduce((acc, curr, index) => [...acc, curr + (acc[index - 1] || 0)], []);

  const barData = {
    labels: userList.map((user, index) => user.name || `User ${index + 1}`),
    datasets: [
      {
        label: 'Number of Orders',
        data: numberOfOrdersData,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
      },
    ],
  };

  const pieData = {
    labels: ['Verified Users', 'Unverified Users'],
    datasets: [
      {
        data: [verifiedUsers, unverifiedUsers],
        backgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  const lineData = {
    labels: userList.map((user, index) => user.name || `User ${index + 1}`),
    datasets: [
      {
        label: 'Cumulative Orders',
        data: cumulativeOrders,
        borderColor: 'rgba(153,102,255,1)',
        backgroundColor: 'rgba(153,102,255,0.4)',
        tension: 0.2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'User Statistics' },
    },
  };

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold">User Statistics</h3>
      {['bar', 'pie', 'line'].map((chartType) => (
        <div className="my-4" key={chartType}>
          <h4 className="text-lg font-semibold">
            {chartType === 'bar' && 'Order Distribution (Bar Chart)'}
            {chartType === 'pie' && 'User Verification (Pie Chart)'}
            {chartType === 'line' && 'Cumulative Orders (Line Chart)'}
          </h4>
          <div style={{ height: '400px' }}>
            {chartType === 'bar' && <Bar ref={chartRefs.bar} data={barData} options={chartOptions} />}
            {chartType === 'pie' && <Pie ref={chartRefs.pie} data={pieData} options={chartOptions} />}
            {chartType === 'line' && <Line ref={chartRefs.line} data={lineData} options={chartOptions} />}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserStats;
