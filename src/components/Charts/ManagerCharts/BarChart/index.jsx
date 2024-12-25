import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Typography } from "antd";
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer } from "recharts";
import { managerBarChart } from "../../../../configs/api/dashboard";
import './BarChart.css'
const ManagerBarChart = () => {
  const { accessToken } = useSelector((state) => state.auth);
  const [barChartData, setBarChartData] = useState([]);

  useEffect(() => {
    const fetchBarChartData = async () => {
      try {
        const response = await managerBarChart(accessToken);
        if (response.isSuccess && response.statusCode === 200) {
          const data = response.data.barChart;

          // Format dữ liệu trả về
          const transformedData = data.map((item) => {
            const formattedMonth = item.month.slice(4) + "/" + item.month.slice(0, 4); // Chuyển định dạng tháng từ "202411" thành "11/2024"
            return {
              month: formattedMonth,
              rejected: item.rejected || 0,
              approved: item.approved || 0,
            };
          });

          setBarChartData(transformedData);
        }
      } catch (error) {
        console.error("Error fetching bar chart data:", error);
      }
    };

    fetchBarChartData();
  }, [accessToken]);

  return (
    <div className="barChartContainer">
     <div className="bar-chart-content">
     <Typography.Title level={2} type="secondary" className="bar-chart-title">
        Báo cáo mỗi tháng
      </Typography.Title>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={barChartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="approved" fill="#2196F3" name="Đã xử lí" />
          <Bar dataKey="rejected" fill="#F44336" name="Từ chối" />
        </BarChart>
      </ResponsiveContainer>
     </div>
    </div>
  );
};

export default ManagerBarChart;
