import { Cell, Legend, Pie, PieChart as RechartPieChart, ResponsiveContainer, Sector } from 'recharts';
import './PieChart.css';
import { pieChart } from '../../../../configs/api/dashboard';
import { useEffect, useState } from 'react';
import { Tooltip, Typography } from 'antd';
import { useSelector } from 'react-redux';

const COLORS = ["#4A90E2", "#7ED321", "#D0021B"];
const PieChart = () => {
    const { accessToken } = useSelector((state) => state.auth)
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(-1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await pieChart(accessToken);
                if (response?.isSuccess) {
                    const { processing, approved, rejected } = response.data;
                    const formattedData = [
                        { name: "Đang xử lí", value: processing },
                        { name: "Chấp nhận", value: approved },
                        { name: "Từ chối", value: rejected },
                    ];
                    setData(formattedData);
                } else {
                    console.error("API returned an error:", response?.message);
                }
            } catch (error) {
                console.error("Error fetching pie chart data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [accessToken]);
    const onPieEnter = (_, index) => {
        setActiveIndex(index);
    };

    const onPieLeave = () => {
        setActiveIndex(-1); // Reset trạng thái khi chuột rời khỏi
    };
    if (isLoading) {
        return <Typography.Text>Đang tải biểu đồ...</Typography.Text>;
    }
    return (
        <div className="pieChartContainer">
            <div className="pie-chart-content">
                <Typography.Title className='pie-chart-title' level={2} type="secondary">Xử lí báo cáo</Typography.Title>
                <ResponsiveContainer width="100%" height={300}>
                    <RechartPieChart>
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            innerRadius={60}
                            fill="#8884d8"
                            activeIndex={activeIndex}
                            activeShape={(props) => {
                                const RADIAN = Math.PI / 180;
                                const {
                                    cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value,
                                } = props;
                                const sin = Math.sin(-RADIAN * midAngle);
                                const cos = Math.cos(-RADIAN * midAngle);
                                const sx = cx + (outerRadius + 10) * cos;
                                const sy = cy + (outerRadius + 10) * sin;
                                const mx = cx + (outerRadius + 30) * cos;
                                const my = cy + (outerRadius + 30) * sin;
                                const ex = mx + (cos >= 0 ? 1 : -1) * 22;
                                const ey = my;
                                const textAnchor = cos >= 0 ? "start" : "end";

                                return (
                                    <g>
                                        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} fontSize={16} fontWeight="bold">
                                            {payload.name}
                                        </text>
                                        <Sector
                                            cx={cx}
                                            cy={cy}
                                            innerRadius={innerRadius}
                                            outerRadius={outerRadius + 7}
                                            startAngle={startAngle}
                                            endAngle={endAngle}
                                            fill={fill}
                                        />
                                        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
                                        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
                                        <text
                                            x={ex + (cos >= 0 ? 1 : -1) * 12}
                                            y={ey}
                                            textAnchor={textAnchor}
                                            fill={fill} // Màu chữ trùng với màu của vùng
                                            fontSize={14}
                                            fontWeight="bold"
                                        >
                                            {`${((value / data.reduce((acc, d) => acc + d.value, 0)) * 100).toFixed(1)}%`}
                                        </text>
                                    </g>
                                );
                            }}
                            onMouseEnter={onPieEnter}
                            onMouseLeave={onPieLeave}
                            labelLine={false}
                            animationDuration={1000}
                            animationEasing="ease-in-out"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index]} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value, name) => [`${value} (${((value / data.reduce((acc, d) => acc + d.value, 0)) * 100).toFixed(1)}%)`, name]}
                        />
                        <Legend verticalAlign="bottom" align="center" />
                    </RechartPieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PieChart;
