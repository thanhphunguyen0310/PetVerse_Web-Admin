import { useSelector } from 'react-redux';
import './LineChart.css'
import { useEffect, useState } from 'react';
import { managerLineChart } from '../../../../configs/api/dashboard';
import { Typography } from 'antd';
import { LineChart as RechartLineChart, CartesianGrid, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const ManagerLineChart = () => {
    const { accessToken } = useSelector((state) => state.auth)
    const [lineChartData, setLineChartData] = useState([]);
    useEffect(() => {
        const fetchLineChartData = async () => {
            try {
                const response = await managerLineChart(accessToken);
                if (response.statusCode === 200) {
                    const data = response.data.lineChart;
                    // Chuyển đổi dữ liệu theo đúng format
                    const transformedData = data.reduce((acc, item) => {
                        const formattedMonth = item.month.slice(4) + '/' + item.month.slice(0, 4);
                        // Kiểm tra và thêm dữ liệu vào mảng
                        const existingData = acc.find((d) => d.month === formattedMonth);
                        if (existingData) {
                            // Cộng dồn giá trị nếu cùng tháng
                            existingData.pet += item.pet || 0;
                            existingData.petCenter += item.petCenter || 0;
                        } else {
                            acc.push({
                                month: formattedMonth,
                                pet: item.pet || 0,
                                petCenter: item.petCenter || 0,
                            });
                        }

                        return acc;
                    }, []);

                    // Sắp xếp dữ liệu theo thời gian tăng dần
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
                    Xu hướng tăng trưởng
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
                        {/* Line for Pet */}
                        <Line
                            type="monotone"
                            dataKey="pet"
                            stroke="#FF5733"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                            name="Số lượng thú cưng"
                        />
                        {/* Line for Pet Center */}
                        <Line
                            type="monotone"
                            dataKey="petCenter"
                            stroke="#1E8449"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                            name="Trung tâm thú cưng"
                        />
                    </RechartLineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default ManagerLineChart