import { Card, Col, Row } from 'antd'
import { UserOutlined, CheckCircleOutlined, FileTextOutlined, DollarOutlined } from "@ant-design/icons";
import { adminCardOverview } from '../../configs/api/dashboard';
import { useSelector } from "react-redux";
import { useEffect, useState } from "react"
import "./OverViewCard.css";

const cardStyles = {
    newUsers: { backgroundColor: "#E3F2FD", iconColor: "#1E88E5" },
    completedAppointments: { backgroundColor: "#E8F5E9", iconColor: "#43A047" },
    newReports: { backgroundColor: "#FFF3E0", iconColor: "#FB8C00" },
    revenue: { backgroundColor: "#F3E5F5", iconColor: "#8E24AA" }
  };
const OverViewCard = () => {
    const { accessToken } = useSelector((state) => state?.auth)
    const [overViewData, setOverViewData] = useState();
  
    useEffect(() => {
      const fetchCardData = async () => {
        try {
          const response = await adminCardOverview(accessToken);
          setOverViewData(response.data);
        } catch (error) {
          console.error(error);
        }
      };
      fetchCardData();
    }, [])
  return (
<Row gutter={[24, 24]} wrap justify="center" align="middle">
  {overViewData && (
    <>
      <Col xs={24} sm={12} md={8} lg={8}>
        <Card
          className="dashboard-card"
          style={{
            backgroundColor: cardStyles.newUsers.backgroundColor,
          }}
          bordered={false}
          title={
            <div className="card-title" style={{ color: cardStyles.newUsers.iconColor }}>
              Người dùng mới
            </div>
          }
        >
          <div className="card-content" style={{ color: cardStyles.newUsers.iconColor }}>
            <span>{overViewData.newUsers}</span>
            <UserOutlined />
          </div>
        </Card>
      </Col>

      <Col xs={24} sm={12} md={8} lg={8}>
        <Card
          className="dashboard-card"
          style={{
            backgroundColor: cardStyles.completedAppointments.backgroundColor,
          }}
          bordered={false}
          title={
            <div className="card-title" style={{ color: cardStyles.completedAppointments.iconColor }}>
              Giao dịch hoàn tất
            </div>
          }
        >
          <div className="card-content" style={{ color: cardStyles.completedAppointments.iconColor }}>
            <span>{overViewData.newCompletedAppointments}</span>
            <CheckCircleOutlined />
          </div>
        </Card>
      </Col>

      <Col xs={24} sm={12} md={8} lg={8}>
        <Card
          className="dashboard-card"
          style={{
            backgroundColor: cardStyles.newReports.backgroundColor,
          }}
          bordered={false}
          title={
            <div className="card-title" style={{ color: cardStyles.newReports.iconColor }}>
              Báo cáo trong tháng
            </div>
          }
        >
          <div className="card-content" style={{ color: cardStyles.newReports.iconColor }}>
            <span>{overViewData.newReports}</span>
            <FileTextOutlined />
          </div>
        </Card>
      </Col>
    </>
  )}
</Row>
  )
}

export default OverViewCard
             {/* <Col xs={24} sm={12} md={8} lg={6} xl={6}>
              <Card className="dashboard-card"
                style={{ backgroundColor: cardStyles.revenue.backgroundColor }}
                bordered={false}
                title={<div className="card-title" style={{ color: cardStyles.revenue.iconColor }}>
                  Doanh thu
                </div>}
              >
                <div className="card-content" style={{ color: cardStyles.revenue.iconColor }}>
                  <span>{overViewData.revenue.toLocaleString("vn-VN")}</span>
                  <DollarOutlined />
                </div>
              </Card>
            </Col> */}