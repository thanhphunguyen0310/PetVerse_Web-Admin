import { LineChart as RechartLineChart, CartesianGrid, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import './LineChart.css';
import { lineChart } from '../../../../configs/api/dashboard';
import { Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
const LineChart = () => {
  const { accessToken } = useSelector((state) => state.auth)
  const [lineChartData, setLineChartData] = useState([]);
  
  useEffect(() => {
    const fetchLineChartData = async () => {
      try {
        const response = await lineChart(accessToken);
        if (response.statusCode === 200) {
          const data = response.data.lineChart;
            const transformedData = data.map(item => {
            // Format the month (e.g., "202411" -> "11/2024")
            const formattedMonth = item.month.slice(4) + '/' + item.month.slice(0, 4);
            return {
              month: formattedMonth,
              spa: item.services.find(service => service.name === 'Dịch vụ spa')?.total || 0,
              training: item.services.find(service => service.name === 'Huấn luyện')?.total || 0,
              petSitting: item.services.find(service => service.name === 'Trông thú')?.total || 0,
            };
          });
          // Sort data by month in ascending order
          const sortedData = transformedData.sort((a, b) => {
            const [monthA, yearA] = a.month.split('/');
            const [monthB, yearB] = b.month.split('/');
            return new Date(yearA, monthA - 1) - new Date(yearB, monthB - 1);
          });

          setLineChartData(sortedData);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchLineChartData();
  }, [accessToken]);
  return (
    <div className="lineChartContainer">
    <div className="line-chart-content">
        <Typography.Title className="line-chart-title" level={2} type="secondary">
            Xu hướng sử dụng dịch vụ 
        </Typography.Title>
        <ResponsiveContainer width="100%" height={300}>
            <RechartLineChart
                data={lineChartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
                <CartesianGrid strokeDasharray="6 6" stroke="#ccc" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                {/* Line for Dịch vụ spa */}
                <Line type="monotone" dataKey="spa" stroke="#FF5733" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Dịch vụ spa" />
                {/* Line for Huấn luyện */}
                <Line type="monotone" dataKey="training" stroke="#FFC300" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Huấn luyện" />
                {/* Line for Trông thú */}
                <Line type="monotone" dataKey="petSitting" stroke="#1E8449" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Trông thú" />
            </RechartLineChart>
        </ResponsiveContainer>
    </div>
</div>
  );
};

export default LineChart;