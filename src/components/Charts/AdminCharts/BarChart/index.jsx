import { BarChart as RechartBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import { barChart } from "../../../../configs/api/dashboard";
import { useSelector } from "react-redux";
import "./BarChart.css";
import { Typography } from "antd";

const BarChart = () => {
  const { accessToken } = useSelector((state) => state.auth)
  const [data, setData] = useState([]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await barChart(accessToken);
  //       // Chuyển đổi dữ liệu API thành dạng mảng cho bar chart
  //       const formattedData = [
  //         { name: "Pending", value: response.data.pending },
  //         { name: "Completed", value: response.data.completed },
  //       ];
  //       setData(formattedData);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };
  //   fetchData();
  // }, []);
  const dataSample = [
    {
      "month": "1",
      "uv": 4000,
      "pv": 2400,
      "ss": 1000,
      "ca": 1200,
    },
    {
      "month": "2",
      "uv": 3000,
      "pv": 1398,
      "ss": 1200,
      "ca": 1100
    },
    {
      "month": "3",
      "uv": 2000,
      "pv": 9800,
      "ss": 1100,
      "ca": 1300
    },
    {
      "month": "4",
      "uv": 2780,
      "pv": 3908,
      "ss": 1100,
      "ca": 1200
    },
    {
      "month": "5",
      "uv": 1890,
      "pv": 4800,
      "ss": 1100,
      "ca": 1100
    },
    {
      "month": "6",
      "uv": 2390,
      "pv": 3800,
      "ss": 1100,
      "ca": 1000
    },
    {
      "month": "7",
      "uv": 3490,
      "pv": 4300,
      "ss": 1100,
      "ca": 1000
    }
  ]
  return (
    <div className="bar-chart-container">
      <div className="bar-chart-content">
        <ResponsiveContainer width="100%" height={300}>
          <div>
            <Typography.Title className='bar-chart-title' level={2} type="secondary">Thống kê giao dịch</Typography.Title>
          </div>
          <RechartBarChart data={dataSample}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            {/* <Bar dataKey="value" fill="#82ca9d" /> */}
            <Bar dataKey="pv" fill="#8884d8" />
            <Bar dataKey="uv" fill="#82ca9d" />
            <Bar dataKey="ss" fill="red" />
            <Bar dataKey="ca" fill="blue" />
          </RechartBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChart;
